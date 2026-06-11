const express = require('express');
const router = express.Router();

// AI Support Knowledge Base
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
  'contact': "Contact SokoNet support: Email: support@sokonet.ke, Phone: +254 700 000 000, or use the live chat in the app."
};

// Generate AI response based on user message
const generateAIResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Find the best matching response
  let response = "I'm not sure about that specific topic, but I can help you with questions about marketplace, payments, delivery, services, jobs, or account management. Try asking me about one of these!";
  
  // Check for keyword matches
  for (const [keyword, answer] of Object.entries(knowledgeBase)) {
    if (lowerMessage.includes(keyword)) {
      response = answer;
      break;
    }
  }

  // Add some contextual responses
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    response = "You're welcome! Is there anything else I can help you with regarding SokoNet?";
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    response = "Hello! I'm happy to help you with SokoNet. What would you like to know about the platform?";
  } else if (lowerMessage.includes('goodbye') || lowerMessage.includes('bye')) {
    response = "Goodbye! Feel free to come back anytime if you have more questions about SokoNet. Have a great day!";
  }

  return response;
};

// POST /api/ai/chat - Get AI response
router.post('/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    const aiResponse = generateAIResponse(message);

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating AI response',
      error: error.message
    });
  }
});

// GET /api/ai/topics - Get available topics
router.get('/topics', (req, res) => {
  try {
    const topics = Object.keys(knowledgeBase).map(key => ({
      topic: key,
      description: knowledgeBase[key].substring(0, 50) + '...'
    }));

    res.json({
      success: true,
      topics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching topics',
      error: error.message
    });
  }
});

module.exports = router;