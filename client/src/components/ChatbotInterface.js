// import React, { useState, useEffect, useRef } from "react";
// import { FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";
// import { BsRobot } from "react-icons/bs";
// import { FaUser } from "react-icons/fa";
// import axios from "axios";
// import { formatVietnameseToString } from "../ultils/Common/formatVietnameseToString";

// const ChatbotInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null); // Reference for the end of the messages container

//   useEffect(() => {
//     const initialMessage = {
//       text: "Chào mừng Bạn đến với Smart Rental Real Estate! Tôi là trợ lý ảo AI. Tôi có thể giúp bạn tìm được bất động sản cho thuê hoàn hảo nhất với yêu cầu bạn đề ra.",
//       sender: "bot",
//       timestamp: new Date().toISOString(),
//     };
//     setMessages([initialMessage]);
//   }, []);

//   useEffect(() => {
//     scrollToBottom(); // Scroll to the bottom whenever messages change
//   }, [messages]);

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const getBotResponse = async (userMessage) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/v1/user/chatbot/anlysisquestion",
//         { message: userMessage }
//       );
//       if (response.data.resultFind) {
//         const topThreeAmenities = response.data.resultFind.slice(0, 3);
//         const propertyLink = `/chi-tiet/${formatVietnameseToString(
//           response.data.title
//         )}/${response.data.id}`;

//         const amenitiesSection =
//           response.data.resultFind.length > 0
//             ? `
//                 Tiện ích gần bất động sản này:<br/>
//                 ${topThreeAmenities
//               .map((amenitie, index) => `${index + 1}. ${amenitie.name}`)
//               .join("<br/>")}
//                 <br/>
//               `
//             : "";

//         return `
//           Tôi tìm ra bài viết phù hợp với yêu cầu của Bạn: <br/>
//           " <span style="color: red; text-transform: uppercase;">${response.data.title}</span> "<br/>
//           ${amenitiesSection}
//           Bạn có thể xem chi tiết bài viết tại đây: <br/>
//           <a href="${propertyLink}" 
//             style="color: #1e90ff; text-decoration: underline; cursor: pointer; transition: color 0.3s ease;"
//             onmouseover="this.style.color='#0000ff'" 
//             onmouseout="this.style.color='#1e90ff'">
//             ${propertyLink}
//         </a>
//         `;
//       }
//       return response.data.message || response.data.response;
//     } catch (error) {
//       console.error("Error getting bot response:", error);
//       return "Tôi xin lỗi nhưng hiện tại tôi đang gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     const userMessage = {
//       text: inputMessage,
//       sender: "user",
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputMessage("");

//     const loadingMessage = {
//       text: "loading", // Placeholder text for animation
//       sender: "bot",
//       timestamp: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, loadingMessage]);
//     setIsLoading(true);

//     try {
//       const botResponseText = await getBotResponse(inputMessage);
//       setMessages((prev) =>
//         prev.map((msg, index) =>
//           index === prev.length - 1 ? { ...msg, text: botResponseText } : msg
//         )
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const MessageBubble = ({ message, showTimestamp }) => {
//     const formatTime = (timestamp) => {
//       return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(
//         new Date(timestamp)
//       );
//     };

//     const formatDateHeader = (timestamp) => {
//       return new Intl.DateTimeFormat("vi-VN", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       }).format(new Date(timestamp));
//     };

//     return (
//       <>
//         {showTimestamp && (
//           <div className="text-center text-gray-500 text-sm my-2 font-semibold">
//             {formatDateHeader(message.timestamp)}
//           </div>
//         )}

//         <div
//           className={`flex items-start gap-2 mb-4 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"
//             }`}
//         >
//           <div
//             className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === "user" ? "bg-blue-500" : "bg-gray-200"
//               }`}
//           >
//             {message.sender === "user" ? <FaUser className="text-white text-sm" /> : <BsRobot className="text-gray-600 text-sm" />}
//           </div>
//           <div
//             className={`px-4 py-2 rounded-lg max-w-[70%] ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
//               }`}
//           >
//             {message.text === "loading" ? (
//               <div className="loading-dots">
//                 <span>.</span>
//                 <span>.</span>
//                 <span>.</span>
//               </div>
//             ) : (
//               <p dangerouslySetInnerHTML={{ __html: message.text }}></p>
//             )}
//             <div className="text-xs text-gray-500 mt-2 text-right">{formatTime(message.timestamp)}</div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <div
//         className={`bg-white rounded-lg shadow-xl w-[380px] ${isMinimized ? "h-[60px]" : "h-[600px]"
//           } transition-all duration-300 ease-in-out`}
//       >
//         <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <BsRobot className="text-white text-xl" />
//             <h2 className="text-white font-semibold">Chatbot AI hệ thống SRRE</h2>
//           </div>
//           <button
//             onClick={() => setIsMinimized(!isMinimized)}
//             className="text-white hover:text-gray-200 transition-colors"
//             aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
//           >
//             {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
//           </button>
//         </div>

//         {!isMinimized && (
//           <>
//             <div className="p-4 h-[480px] overflow-y-auto flex flex-col">
//               {messages.map((message, index) => {
//                 const showTimestamp =
//                   index === 0 ||
//                   new Date(message.timestamp) -
//                   new Date(messages[index - 1]?.timestamp) >
//                   10 * 60 * 1000;
//                 return <MessageBubble key={index} message={message} showTimestamp={showTimestamp} />;
//               })}
//               <div ref={messagesEndRef} />
//             </div>

//             <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   placeholder="Nhập vào yêu cầu bạn cần tìm kiếm..."
//                   className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                 />
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
//                   disabled={isLoading}
//                 >
//                   <FiSend className="text-xl" />
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>

//       <style>
//         {`
//           .loading-dots span {
//             animation: blink 1.5s infinite;
//             font-size: 16px;
//             font-weight: bold;
//             display: inline-block;
//           }
//           .loading-dots span:nth-child(2) {
//             animation-delay: 0.2s;
//           }
//           .loading-dots span:nth-child(3) {
//             animation-delay: 0.4s;
//           }
//           @keyframes blink {
//             0%, 100% {
//               opacity: 0;
//             }
//             50% {
//               opacity: 1;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default ChatbotInterface;
// //       if (response.data.resultFind) {
// //         const topThreeAmenities = response.data.resultFind.slice(0, 3);
// //         const propertyLink = `/chi-tiet/${formatVietnameseToString(
// //           response.data.title
// //         )}/${response.data.id}`;

// //         return `Tôi tìm ra bài viết phù hợp với yêu cầu của Bạn: "${response.data.title}"

// //         Tiện ích gần bất động sản này:
// //         ${topThreeAmenities
// //             .map((amenitie, index) => `${index + 1}. ${amenitie.name}`)
// //             .join("\n")}

// //         Bạn có thể xem chi tiết bài viết tại đây: ${propertyLink}`;
// //       }

// //       return response.data.message || response.data.response;
// //     } catch (error) {
// //       console.error("Error getting bot response:", error);
// //       return "Tôi xin lỗi nhưng hiện tại tôi đang gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
// //     }
// //   };

// //   const handleSendMessage = async (e) => {
// //     e.preventDefault();
// //     if (!inputMessage.trim()) return;

// //     const userMessage = {
// //       text: inputMessage,
// //       sender: "user",
// //       timestamp: new Date().toISOString(),
// //     };

// //     setMessages((prev) => [...prev, userMessage]);
// //     setInputMessage("");

// //     const loadingMessage = {
// //       text: "loading", // Placeholder text for animation
// //       sender: "bot",
// //       timestamp: new Date().toISOString(),
// //     };
// //     setMessages((prev) => [...prev, loadingMessage]);
// //     setIsLoading(true);

// //     try {
// //       const botResponseText = await getBotResponse(inputMessage);
// //       setMessages((prev) =>
// //         prev.map((msg, index) =>
// //           index === prev.length - 1 ? { ...msg, text: botResponseText } : msg
// //         )
// //       );
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const MessageBubble = ({ message, showTimestamp }) => {
// //     const formatTime = (timestamp) => {
// //       return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(
// //         new Date(timestamp)
// //       );
// //     };

// //     const formatDateHeader = (timestamp) => {
// //       return new Intl.DateTimeFormat("vi-VN", {
// //         weekday: "long",
// //         year: "numeric",
// //         month: "long",
// //         day: "numeric",
// //       }).format(new Date(timestamp));
// //     };

// //     return (
// //       <>
// //         {showTimestamp && (
// //           <div className="text-center text-gray-500 text-sm my-2 font-semibold">
// //             {formatDateHeader(message.timestamp)}
// //           </div>
// //         )}

// //         <div
// //           className={`flex items-start gap-2 mb-4 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"
// //             }`}
// //         >
// //           <div
// //             className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === "user" ? "bg-blue-500" : "bg-gray-200"
// //               }`}
// //           >
// //             {message.sender === "user" ? <FaUser className="text-white text-sm" /> : <BsRobot className="text-gray-600 text-sm" />}
// //           </div>
// //           <div
// //             className={`px-4 py-2 rounded-lg max-w-[70%] ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
// //               }`}
// //           >
// //             {message.text === "loading" ? (
// //               <div className="loading-dots">
// //                 <span>.</span>
// //                 <span>.</span>
// //                 <span>.</span>
// //               </div>
// //             ) : (
// //               <p>{message.text}</p>
// //             )}
// //             <div className="text-xs text-gray-500 mt-2 text-right">{formatTime(message.timestamp)}</div>
// //           </div>
// //         </div>
// //       </>
// //     );
// //   };

// //   return (
// //     <div className="fixed bottom-4 right-4 z-50">
// //       <div
// //         className={`bg-white rounded-lg shadow-xl w-[380px] ${isMinimized ? "h-[60px]" : "h-[600px]"
// //           } transition-all duration-300 ease-in-out`}
// //       >
// //         <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
// //           <div className="flex items-center gap-2">
// //             <BsRobot className="text-white text-xl" />
// //             <h2 className="text-white font-semibold">Chatbot AI hệ thống SRRE</h2>
// //           </div>
// //           <button
// //             onClick={() => setIsMinimized(!isMinimized)}
// //             className="text-white hover:text-gray-200 transition-colors"
// //             aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
// //           >
// //             {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
// //           </button>
// //         </div>

// //         {!isMinimized && (
// //           <>
// //             <div className="p-4 h-[480px] overflow-y-auto flex flex-col">
// //               {messages.map((message, index) => {
// //                 const showTimestamp =
// //                   index === 0 ||
// //                   new Date(message.timestamp) -
// //                   new Date(messages[index - 1]?.timestamp) >
// //                   10 * 60 * 1000;
// //                 return <MessageBubble key={index} message={message} showTimestamp={showTimestamp} />;
// //               })}
// //               <div ref={messagesEndRef} />
// //             </div>

// //             <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
// //               <div className="flex items-center gap-2">
// //                 <input
// //                   type="text"
// //                   value={inputMessage}
// //                   onChange={(e) => setInputMessage(e.target.value)}
// //                   placeholder="Nhập vào yêu cầu bạn cần tìm kiếm..."
// //                   className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
// //                 />
// //                 <button
// //                   type="submit"
// //                   className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
// //                   disabled={isLoading}
// //                 >
// //                   <FiSend className="text-xl" />
// //                 </button>
// //               </div>
// //             </form>
// //           </>
// //         )}
// //       </div>

// //       <style>
// //         {`
// //           .loading-dots span {
// //             animation: blink 1.5s infinite;
// //             font-size: 16px;
// //             font-weight: bold;
// //             display: inline-block;
// //           }
// //           .loading-dots span:nth-child(2) {
// //             animation-delay: 0.2s;
// //           }
// //           .loading-dots span:nth-child(3) {
// //             animation-delay: 0.4s;
// //           }
// //           @keyframes blink {
// //             0%, 100% {
// //               opacity: 0.2;
// //             }
// //             50% {
// //               opacity: 1;
// //             }
// //           }
// //         `}
// //       </style>
// //     </div>
// //   );
// // };

// // export default ChatbotInterface;

import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { formatVietnameseToString } from "../ultils/Common/formatVietnameseToString";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // Reference for the end of the messages container
  const { token } = useSelector((state) => state.auth); // Get token from Redux
  const navigate = useNavigate();

  useEffect(() => {
    const initialMessage = {
      text: "Chào mừng Bạn đến với Smart Rental Real Estate! Tôi là trợ lý ảo AI. Tôi có thể giúp bạn tìm được bất động sản cho thuê hoàn hảo nhất với yêu cầu bạn đề ra.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom whenever messages change
  }, [messages]);

  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target;
      if (target.tagName === "A" && target.classList.contains("property-link")) {
        e.preventDefault();
        if (token) {
          navigate(target.getAttribute("href"));
        } else {
          Swal.fire({
            icon: "warning",
            title: "Bạn cần đăng nhập",
            text: "Vui lòng đăng nhập để xem chi tiết bài viết này.",
            confirmButtonText: "Đăng nhập ngay",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login");
            }
          });
        }
      }
    };

    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      messagesContainer.addEventListener("click", handleLinkClick);
    }

    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener("click", handleLinkClick);
      }
    };
  }, [token, navigate]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getBotResponse = async (userMessage) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/chatbot/anlysisquestion",
        { message: userMessage },
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      if (response.data.resultFind) {
        const topThreeAmenities = response.data.resultFind.slice(0, 3);
        const formattedTitle = formatVietnameseToString(response.data.title);
        const encodedTitle = encodeURIComponent(formattedTitle);
        const propertyLink = `/chi-tiet/${encodedTitle}/${response.data.id}`;

        const amenitiesSection =
          response.data.resultFind.length > 0
            ? `
                <strong>Tiện ích gần bất động sản này:</strong><br/>
                ${topThreeAmenities
              .map(
                (amenitie, index) =>
                  `<span>${index + 1}. ${amenitie.name}</span>`
              )
              .join("<br/>")}
                <br/>
              `
            : "";

        return `
          Tôi tìm ra bài viết phù hợp với yêu cầu của Bạn: <br/>
          " <span style="color: red; text-transform: uppercase;">${response.data.title}</span> "<br/>
          ${amenitiesSection}
          Bạn có thể xem chi tiết bài viết tại đây: <br/>
          <a href="${propertyLink}" 
            class="property-link"
            style="color: #1e90ff; text-decoration: underline; cursor: pointer; transition: color 0.3s ease;"
            onmouseover="this.style.color='#0000ff'" 
            onmouseout="this.style.color='#1e90ff'">
            ${propertyLink}
          </a>
        `;
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

    const loadingMessage = {
      text: "loading", // Placeholder text for animation
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      const botResponseText = await getBotResponse(inputMessage);
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, text: botResponseText } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message, showTimestamp }) => {
    const formatTime = (timestamp) => {
      return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(timestamp));
    };

    const formatDateHeader = (timestamp) => {
      return new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(timestamp));
    };

    return (
      <>
        {showTimestamp && (
          <div className="text-center text-gray-500 text-sm my-2 font-semibold">
            {formatDateHeader(message.timestamp)}
          </div>
        )}

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
            {message.text === "loading" ? (
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            ) : (
              <p dangerouslySetInnerHTML={{ __html: message.text }}></p>
            )}
            <div className="text-xs text-gray-500 mt-2 text-right">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`bg-white rounded-lg shadow-xl w-[380px] ${isMinimized ? "h-[60px]" : "h-[600px]"
          } transition-all duration-300 ease-in-out`}
      >
        <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BsRobot className="text-white text-xl" />
            <h2 className="text-white font-semibold">Chatbot AI hệ thống SRRE</h2>
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
            <div className="p-4 h-[480px] overflow-y-auto flex flex-col">
              {messages.map((message, index) => {
                const showTimestamp =
                  index === 0 ||
                  new Date(message.timestamp) -
                  new Date(messages[index - 1]?.timestamp) >
                  10 * 60 * 1000;
                return (
                  <MessageBubble
                    key={index}
                    message={message}
                    showTimestamp={showTimestamp}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập vào yêu cầu bạn cần tìm kiếm..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  <FiSend className="text-xl" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <style>
        {`
          .loading-dots span {
            animation: blink 1.5s infinite;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
          }
          .loading-dots span:nth-child(2) {
            animation-delay: 0.2s;
          }
          .loading-dots span:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes blink {
            0%, 100% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatbotInterface;