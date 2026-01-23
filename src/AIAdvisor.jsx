import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, X, AlertCircle, Leaf, Bug, Droplet } from 'lucide-react';
import { useGemini } from './GeminiContext';

// (ลบระบบ AI Advisor ออก)

// const AIAdvisor = ({ isOpen, onClose }) => {
//   const { askAIAdvisor } = useGemini();
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: 'bot',
//       text: 'สวัสดีครับ! ผมคือ AI Advisor สำหรับการดูแลรักษาโรคพืชและการทำทุเรียนนอกฤดูในพื้นที่ต.กรุงชิง 🌳\n\nผมสามารถช่วยเรื่อง:\n• โรคพืชและการแก้ไข\n• การป้องกันโรคและศัตรูพืช\n• การทำทุเรียนนอกฤดู\n• การดูแลรักษาต้นทุเรียน\n\nลองถามคำถามของคุณได้เลยครับ! 😊'
//     }
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       text: inputValue
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       const response = await askAIAdvisor(inputValue);
//       const botMessage = {
//         id: Date.now() + 1,
//         type: 'bot',
//         text: response
//       };
//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       const errorMessage = {
//         id: Date.now() + 1,
//         type: 'error',
//         text: `⚠️ เกิดข้อผิดพลาด: ${error.message}`
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const quickQuestions = [
//     { icon: Bug, text: 'โรคราน้ำหนึ่งที่ทำให้ผลเน่า' },
//     { icon: Droplet, text: 'วิธีป้องกันโรคเนื่องจากอากาศชื้น' },
//     { icon: Leaf, text: 'การทำทุเรียนนอกฤดูในต.กรุงชิง' }
//   ];

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center p-0 md:p-4 z-50">
//       <div className="w-full md:w-96 h-[600px] md:h-[700px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
//           <div>
//             <h2 className="font-bold text-lg">🌾 AI Advisor</h2>
//             <p className="text-xs text-green-100">การดูแลทุเรียน & โรคพืช</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-green-700 rounded-full transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Messages Container */}
//         <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
//           {messages.length <= 1 && messages[0].type === 'bot' ? (
//             <div className="h-full flex flex-col justify-between">
//               <div>
//                 <div className="bg-white p-3 rounded-lg text-sm text-gray-700 whitespace-pre-line">
//                   {messages[0].text}
//                 </div>
//               </div>
//               
//               {/* Quick Questions */}
//               <div className="space-y-2">
//                 <p className="text-xs text-gray-500 font-semibold px-2">คำถามที่พบบ่อย:</p>
//                 {quickQuestions.map((q, idx) => {
//                   const Icon = q.icon;
//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => setInputValue(q.text)}
//                       className="w-full flex items-center gap-2 p-2 bg-white hover:bg-green-50 border border-gray-200 rounded-lg text-left text-xs text-gray-700 transition hover:border-green-400"
//                     >
//                       <Icon size={16} className="text-green-600 flex-shrink-0" />
//                       <span>{q.text}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           ) : (
//             messages.map((msg) => (
//               <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 <div
//                   className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
//                     msg.type === 'user'
//                       ? 'bg-green-600 text-white rounded-br-none'
//                       : msg.type === 'error'
//                       ? 'bg-red-100 text-red-700 rounded-bl-none flex items-start gap-2'
//                       : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
//                   }`}
//                 >
//                   {msg.type === 'error' && <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> }
//                   {msg.text}
//                 </div>
//               </div>
//             ))
//           )}
//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2 flex items-center gap-2">
//                 <Loader size={16} className="text-green-600 animate-spin" />
//                 <span className="text-xs text-gray-600">กำลังคิด...</span>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div className="border-t border-gray-200 bg-white p-4">
//           <div className="flex gap-2">
//             <textarea
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="ถามคำถามเกี่ยวกับการดูแลทุเรียน..."
//               className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 resize-none"
//               rows="2"
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={isLoading || !inputValue.trim()}
//               className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition flex items-center gap-1"
//             >
//               {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
//             </button>
//           </div>
//           <p className="text-xs text-gray-400 mt-2 text-center">
//             ⚠️ ตรวจสอบคำแนะนำกับผู้เชี่ยวชาญก่อนนำไปใช้
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIAdvisor;
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, X, AlertCircle, Leaf, Bug, Droplet } from 'lucide-react';
import { useGemini } from './GeminiContext';

const AIAdvisor = ({ isOpen, onClose }) => {
  const { askAIAdvisor } = useGemini();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'สวัสดีครับ! ผมคือ AI Advisor สำหรับการดูแลรักษาโรคพืชและการทำทุเรียนนอกฤดูในพื้นที่ต.กรุงชิง 🌳\n\nผมสามารถช่วยเรื่อง:\n• โรคพืชและการแก้ไข\n• การป้องกันโรคและศัตรูพืช\n• การทำทุเรียนนอกฤดู\n• การดูแลรักษาต้นทุเรียน\n\nลองถามคำถามของคุณได้เลยครับ! 😊'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askAIAdvisor(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        text: `⚠️ เกิดข้อผิดพลาด: ${error.message}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    { icon: Bug, text: 'โรคราน้ำหนึ่งที่ทำให้ผลเน่า' },
    { icon: Droplet, text: 'วิธีป้องกันโรคเนื่องจากอากาศชื้น' },
    { icon: Leaf, text: 'การทำทุเรียนนอกฤดูในต.กรุงชิง' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center p-0 md:p-4 z-50">
      <div className="w-full md:w-96 h-[600px] md:h-[700px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">🌾 AI Advisor</h2>
            <p className="text-xs text-green-100">การดูแลทุเรียน & โรคพืช</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-700 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
          {messages.length <= 1 && messages[0].type === 'bot' ? (
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="bg-white p-3 rounded-lg text-sm text-gray-700 whitespace-pre-line">
                  {messages[0].text}
                </div>
              </div>
              
              {/* Quick Questions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-semibold px-2">คำถามที่พบบ่อย:</p>
                {quickQuestions.map((q, idx) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setInputValue(q.text)}
                      className="w-full flex items-center gap-2 p-2 bg-white hover:bg-green-50 border border-gray-200 rounded-lg text-left text-xs text-gray-700 transition hover:border-green-400"
                    >
                      <Icon size={16} className="text-green-600 flex-shrink-0" />
                      <span>{q.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.type === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : msg.type === 'error'
                      ? 'bg-red-100 text-red-700 rounded-bl-none flex items-start gap-2'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                  }`}
                >
                  {msg.type === 'error' && <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2 flex items-center gap-2">
                <Loader size={16} className="text-green-600 animate-spin" />
                <span className="text-xs text-gray-600">กำลังคิด...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ถามคำถามเกี่ยวกับการดูแลทุเรียน..."
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 resize-none"
              rows="2"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition flex items-center gap-1"
            >
              {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            ⚠️ ตรวจสอบคำแนะนำกับผู้เชี่ยวชาญก่อนนำไปใช้
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
