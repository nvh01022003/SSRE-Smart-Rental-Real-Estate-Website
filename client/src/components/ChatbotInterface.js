import React, { useState, useEffect } from "react";
import { FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { formatVietnameseToString } from "../ultils/Common/formatVietnameseToString";
import { Link } from "react-router-dom";

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading

  useEffect(() => {
    const initialMessage = {
      text: "Chào mừng Bạn đến với Smart Rental Real Estate! Tôi là trợ lý ảo AI. Tôi có thể giúp bạn tìm được bất động sản cho thuê hoàn hảo nhất với yêu cầu bạn đề ra.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMessage]);
  }, []);

  const getBotResponse = async (userMessage) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/chatbot/anlysisquestion",
        {
          message: userMessage,
        }
      );

      if (response.data.resultFind) {
        const topThreeSchools = response.data.resultFind.slice(0, 3);
        const propertyLink = `/chi-tiet/${formatVietnameseToString(
          response.data.title
        )}/${response.data.id}`;

        return `Tôi tìm ra bài viết phù hợp với yêu cầu của Bạn: "${response.data.title}"

Tiện ích gần bất động sản này:
${topThreeSchools
            .map((school, index) => `${index + 1}. ${school.name}`)
            .join("\n")}

Bạn có thể xem chi tiết bài viết tại đây: ${propertyLink}`;
      }

      return response.data.message || response.data.response;
    } catch (error) {
      console.error("Error getting bot response:", error);
      return "Tôi xin lỗi nhưng hiện tại tôi đang gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    setIsLoading(true); // Bắt đầu hiển thị loading

    try {
      const botResponseText = await getBotResponse(inputMessage);
      const botResponse = {
        text: botResponseText,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error in handling message:", error);
      const errorResponse = {
        text: "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu. Vui lòng thử lại.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false); // Kết thúc hiển thị loading
    }
  };

  const MessageBubble = ({ message }) => {
    const renderMessageText = (text) => {
      const parts = text.split("\n");
      return parts.map((part, index) => {
        if (part.includes("/chi-tiet/")) {
          const [title, id] = part.split("/").slice(-2);
          return (
            <div key={index}>
              <Link
                to={`/chi-tiet/${formatVietnameseToString(title)}/${id}`}
                className="text-blue-500 underline hover:text-blue-700 transition duration-300"
              >
                Truy cập xem chi tiết bài đăng
              </Link>
            </div>
          );
        }
        return <div key={index}>{part}</div>;
      });
    };

    return (
      <div
        className={`flex items-start gap-2 mb-4 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"
          }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === "user" ? "bg-blue-500" : "bg-gray-200"
            }`}
        >
          {message.sender === "user" ? (
            <FaUser className="text-white text-sm" />
          ) : (
            <BsRobot className="text-gray-600 text-sm" />
          )}
        </div>
        <div
          className={`px-4 py-2 rounded-lg max-w-[70%] ${message.sender === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-800"
            }`}
        >
          {renderMessageText(message.text)}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`bg-white rounded-lg shadow-xl w-[380px] ${isMinimized ? "h-[60px]" : "h-[600px]"
          } transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BsRobot className="text-white text-xl" />
            <h2 className="text-white font-semibold">
              Chatbot AI hệ thống SRRE
            </h2>
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
            <div className="p-4 h-[480px] overflow-y-auto flex flex-col">
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
                    <BsRobot className="text-gray-600 text-sm" />
                  </div>
                  <div className="px-4 py-2 rounded-lg max-w-[70%] bg-gray-100 text-gray-800">
                    <div className="flex space-x-1">
                      <div
                        className="bg-gray-500 w-2 h-2 rounded-full"
                        style={{
                          animation: "bounce 1s infinite",
                          animationTimingFunction: "ease-in-out",
                        }}
                      ></div>
                      <div
                        className="bg-gray-500 w-2 h-2 rounded-full"
                        style={{
                          animation: "bounce200 1s infinite",
                          animationTimingFunction: "ease-in-out",
                        }}
                      ></div>
                      <div
                        className="bg-gray-500 w-2 h-2 rounded-full"
                        style={{
                          animation: "bounce400 1s infinite",
                          animationTimingFunction: "ease-in-out",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200"
            >
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
                  disabled={isLoading} // Vô hiệu hóa nút gửi khi đang tải
                >
                  <FiSend className="text-xl" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Inline Styles */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes bounce200 {
          0%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-5px);
          }
        }

        @keyframes bounce400 {
          0%, 100% {
            transform: translateY(0);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatbotInterface;