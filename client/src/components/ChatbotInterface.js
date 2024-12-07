import React, { useState, useEffect } from "react";
import { FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import axios from "axios";

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const initialMessage = {
      text: "Chào mừng Bạn đến với Smart Rental Real Estate ! Tôi là trợ lý ảo AI. Tôi có thể giúp bạn tìm được bất động sản cho thuê hoàn hảo nhất với yêu cầu bạn đề ra.",
      sender: "bot",
      timestamp: new Date().toISOString()
    };
    setMessages([initialMessage]);
  }, []);

  const getBotResponse = async (userMessage) => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/user/chatbot/anlysisquestion", {
        message: userMessage
      });
      return response.data.message || response.data.response;
    } catch (error) {
      console.error("Error getting bot response:", error);
      return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    try {
      const botResponseText = await getBotResponse(inputMessage);
      const botResponse = {
        text: botResponseText,
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error in handling message:", error);
      const errorResponse = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const MessageBubble = ({ message }) => (
    <div
      className={`flex items-start gap-2 mb-4 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === "user" ? "bg-blue-500" : "bg-gray-200"}`}>
        {message.sender === "user" ? (
          <FaUser className="text-white text-sm" />
        ) : (
          <BsRobot className="text-gray-600 text-sm" />
        )}
      </div>
      <div
        className={`px-4 py-2 rounded-lg max-w-[70%] ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
      >
        {message.text}
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl w-[380px] ${isMinimized ? "h-[60px]" : "h-[600px]"} transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BsRobot className="text-white text-xl" />
            <h2 className="text-white font-semibold">Trợ lý ảo AI hệ thống SRRE</h2>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
          </button>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Container */}
            <div className="p-4 h-[480px] overflow-y-auto">
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập vào yêu cầu bạn cần tìm kiếm..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Send message"
                >
                  <FiSend className="text-xl" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatbotInterface;