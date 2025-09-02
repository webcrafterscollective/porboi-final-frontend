// // components/common/Layout.js
// import React, { useState } from 'react';
// import Head from 'next/head';
// import Header from './Header';
// import Footer from './Footer';
// import { Toaster } from 'react-hot-toast';
// import { Send, X } from 'lucide-react';

// const Layout = ({ children, title = 'Porboi', description = 'The all-time classics bookstore' }) => {
//   const [isChatOpen, setIsChatOpen]
// = useState(false);
//   const [message, setMessage] = useState('');

//   const handleSend = () => {
//     if (message.trim() === '') return;
//     const whatsappUrl = `https://wa.me/7044726990?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
//     setMessage('');
//     setIsChatOpen(false);
//   };

//   return (
//     <>
//       <Head>
//         <title>{title}</title>
//         <meta name="description" content={description} />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/logo.svg" type="image/svg+xml" />
//       </Head>
      
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-grow">
//           {children}
//         </main>
//         <Footer />
//       </div>
      
//       {/* WhatsApp Chatbox */}
//       {isChatOpen && (
//         <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl z-50 animate-fade-in">
//           <div className="bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
//             <h3 className="font-semibold text-lg">Chat with us</h3>
//             <button onClick={() => setIsChatOpen(false)} className="hover:opacity-75">
//               <X size={20} />
//             </button>
//           </div>
//           <div className="p-4 bg-gray-50">
//             <p className="text-sm text-gray-700">Hi! How can we help you today?</p>
//           </div>
//           <div className="p-4 flex items-center border-t">
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 border-none focus:ring-0 text-sm"
//               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//             />
//             <button onClick={handleSend} className="ml-2 text-green-500 hover:text-green-600">
//               <Send size={20} />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* WhatsApp Floating Icon */}
//       <button
//         onClick={() => setIsChatOpen(!isChatOpen)}
//         className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50"
//         aria-label="Chat on WhatsApp"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 448 512"
//           className="w-6 h-6"
//           fill="currentColor"
//         >
//           <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
//         </svg>
//       </button>

//       {/* Toast notifications */}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: '#363636',
//             color: '#fff',
//           },
//           success: {
//             style: {
//               background: '#10b981',
//             },
//           },
//           error: {
//             style: {
//               background: '#ef4444',
//             },
//           },
//         }}
//       />
//     </>
//   );
// };

// export default Layout;

// components/common/Layout.js
import React, { useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import { Send, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() === '') return;
    const whatsappUrl = `https://wa.me/7044726990?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setMessage('');
    setIsChatOpen(false);
  };

  return (
    <>
      <Head>
        {/* Global metadata and links that apply to all pages */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo_white.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo_white.svg" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      
      {/* WhatsApp Chatbox */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl z-50 animate-fade-in">
          <div className="bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-lg">Chat with us</h3>
            <button onClick={() => setIsChatOpen(false)} className="hover:opacity-75">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 bg-gray-50">
            <p className="text-sm text-gray-700">Hi! How can we help you today?</p>
          </div>
          <div className="p-4 flex items-center border-t">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border-none focus:ring-0 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="ml-2 text-green-500 hover:text-green-600">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Icon */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50"
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-6 h-6"
          fill="currentColor"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </button>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
};

export default Layout;