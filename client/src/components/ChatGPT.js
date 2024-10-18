import React, { useState, useRef, useEffect } from 'react';

const ChatGPT = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }

    // Add event listener for the Escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);

    // Clean up the event listener
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;
  
    const newMessages = [...messages, { role: 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const botResponse = data.choices[0].message.content;
        setMessages([...newMessages, { role: 'assistant', content: botResponse }]);
      } else {
        throw new Error('Unexpected response structure from API');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { role: 'assistant', content: `Sorry, an error occurred: ${error.message}. Please try again later.` }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        <div className="w-80 bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-lg">
            <h1 className="text-xl font-bold">Chat with GPT</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              ✕
            </button>
          </div>
          <div ref={chatboxRef} className="h-80 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <p key={index} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {msg.content}
                </span>
              </p>
            ))}
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatGPT;