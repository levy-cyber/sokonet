import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiSend, FiX, FiCpu, FiHelpCircle } from 'react-icons/fi';

const AISupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi! I'm SokoNet AI Assistant. I can help you with questions about the platform. Try asking me about marketplace, payments, delivery, or any other feature!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Comprehensive knowledge base for SokoNet
    const knowledgeBase = {
      // Marketplace questions
      'marketplace': "SokoNet marketplace is where you can buy and sell products. Browse through categories, search for specific items, and make secure purchases with escrow protection.",
      'buy': "To buy products on SokoNet: 1) Browse the marketplace, 2) Select items you want, 3) Add to cart, 4) Complete checkout with secure payment, 5) Track your order status.",
      'sell': "To sell products: 1) Go to My Shop, 2) Add product details, 3) Set price and stock, 4) Add product images, 5) Manage orders from your dashboard.",
      'product': "Products on SokoNet include detailed descriptions, pricing, seller ratings, and customer reviews. You can filter by category and search by keywords.",
      
      // Payment and wallet
      'payment': "SokoNet supports M-Pesa payments and wallet transactions. Your wallet balance can be used for purchases, withdrawals, and transfers.",
      'wallet': "Your SokoNet wallet allows you to: deposit money via M-Pesa, pay for purchases, withdraw to your bank account, and transfer to other users.",
      'mpesa': "M-Pesa integration allows you to deposit funds directly to your SokoNet wallet. Simply select your amount and confirm with your phone.",
      'escrow': "Escrow protects both buyers and sellers. When you pay, funds are held securely until you confirm the product was received and is as described.",
      
      // Delivery
      'delivery': "SokoNet has a delivery network of riders who handle deliveries. Once you place an order, a rider will be assigned to deliver your items safely.",
      'rider': "Delivery partners can earn money by handling deliveries. They track routes, manage earnings, and receive customer ratings.",
      'shipping': "Shipping costs vary based on distance and product type. Delivery time ranges from same-day to standard shipping depending on your location.",
      
      // Services
      'service': "SokoNet Services allows you to book professional services like plumbing, electrical work, tech support, and more from verified providers.",
      'book': "To book a service: 1) Browse available services, 2) Check provider ratings, 3) Select a convenient time, 4) Confirm booking, 5) Pay securely.",
      'provider': "Service providers can list their skills, manage bookings, set prices, and build their reputation through customer reviews.",
      
      // Jobs
      'job': "SokoNet Jobs connects freelancers with clients. You can find projects, submit proposals, and get paid for your work.",
      'freelance': "Freelancing on SokoNet: Browse available jobs, submit proposals with your pricing, manage projects, track earnings, and build your reputation.",
      'proposal': "To submit a proposal: 1) Find a job you're interested in, 2) Review requirements, 3) Set your proposed amount, 4) Write a cover letter, 5) Submit and wait for client response.",
      
      // User roles
      'role': "SokoNet has 5 main user roles: Buyers (shop for products), Sellers (manage business), Service Providers (offer services), Riders (handle deliveries), and Freelancers (find jobs).",
      'seller': "Sellers can list products, manage inventory, track sales, view analytics, and handle customer orders with business tools.",
      'buyer': "Buyers can shop in the marketplace, track orders, manage payments, book services, and find jobs.",
      
      // Account and support
      'account': "Manage your account settings including profile information, payment methods, notifications, and security settings from your dashboard.",
      'login': "To login: 1) Go to login page, 2) Enter your email and password, 3) Click sign in, 4) Access your personalized dashboard based on your role.",
      'register': "To register: 1) Click sign up, 2) Choose your role (Buyer, Seller, Service Provider, Rider, or Freelancer), 3) Enter your details, 4) Create account and start using SokoNet.",
      'help': "I'm here to help! You can ask me about any SokoNet feature including marketplace, payments, delivery, services, jobs, or account management.",
      
      // Technical issues
      'problem': "If you're experiencing technical issues, try: 1) Refreshing the page, 2) Clearing browser cache, 3) Check your internet connection, 4) Contact support for persistent issues.",
      'error': "Common solutions for errors: Refresh the page, check your internet connection, ensure you're logged in, or contact SokoNet support if the issue persists.",
      
      // General
      'sokonet': "SokoNet is Kenya's all-in-one digital ecosystem where you can shop, work, pay, deliver, and grow businesses from a single platform. Our vision is: 'One Network. Endless Possibilities.'",
      'features': "SokoNet features include: Online marketplace, Escrow payments, Digital wallet, Delivery network, Service booking, Job marketplace, Real-time chat, Business analytics, and Multi-role support.",
      'support': "For additional support, you can contact our customer service team through the app, email support@sokonet.ke, or visit our help center.",
      'contact': "Contact SokoNet support: Email: support@sokonet.ke, Phone: +254 700 000 000, or use the live chat in the app.",
    };

    // Find the best matching response
    let response = "I'm not sure about that specific topic, but I can help you with questions about marketplace, payments, delivery, services, jobs, or account management. Try asking me about one of these!";
    
    // Check for keyword matches
    for (const [keyword, answer] of Object.entries(knowledgeBase)) {
      if (message.includes(keyword)) {
        response = answer;
        break;
      }
    }

    // Add some contextual responses
    if (message.includes('thank') || message.includes('thanks')) {
      response = "You're welcome! Is there anything else I can help you with regarding SokoNet?";
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      response = "Hello! I'm happy to help you with SokoNet. What would you like to know about the platform?";
    } else if (message.includes('goodbye') || message.includes('bye')) {
      response = "Goodbye! Feel free to come back anytime if you have more questions about SokoNet. Have a great day!";
    }

    return response;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const newAIMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAIMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand text-black rounded-full shadow-lg shadow-brand/25 flex items-center justify-center hover:bg-brand/90 transition-all z-40 lg:z-50 group"
        title="AI Support"
      >
        <FiCpu className="text-xl group-hover:scale-110 transition-transform" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-40 lg:z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand to-green-600 p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FiCpu className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-white font-semibold">SokoNet AI</h3>
              <p className="text-white/80 text-xs">Online • Ready to help</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <FiX className="text-sm" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-brand text-black'
                  : 'bg-gray-800 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-[10px] opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white p-3 rounded-2xl">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about SokoNet..."
            className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 bg-brand text-black rounded-xl flex items-center justify-center hover:bg-brand/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="text-sm" />
          </button>
        </form>
        <div className="mt-2 flex flex-wrap gap-1">
          {['Marketplace', 'Payments', 'Delivery', 'Services', 'Jobs'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputValue(`Tell me about ${suggestion}`)}
              className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full hover:bg-gray-700 hover:text-white transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISupport;