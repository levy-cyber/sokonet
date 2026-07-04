const express = require('express');
const router = express.Router();

// AI Support Knowledge Base
const knowledgeBase = {
  marketplace: {
    title: 'Netsoko Marketplace',
    answer: 'Netsoko marketplace is the central hub for buyers and sellers. Here you can explore a wide variety of categories, compare prices, and make secure purchases with escrow protection.',
    details: [
      'Use the search bar or category filters to find products quickly.',
      'View seller ratings, product details, and customer reviews before you buy.',
      'Pay securely through the Netsoko wallet or supported mobile payment methods.',
      'Track every order from confirmation to delivery and leave feedback after receiving your item.'
    ],
    tip: 'Tip: Save products to your wishlist and check for seller offers before finalizing your purchase.'
  },
  buy: {
    title: 'Buying on Netsoko',
    answer: 'To buy on Netsoko, start by browsing the marketplace or searching for items you need. Add the best products to your cart, complete checkout, and monitor your order until delivery.',
    details: [
      'Filter results by category, price range, seller rating, and location.',
      'Use escrow protection so your payment is held safely until the order arrives.',
      'Communicate with sellers using in-app chat for questions about product condition or delivery.',
      'Review your order summary carefully before finalizing payment.'
    ],
    tip: 'Tip: Check delivery estimates and seller response times to choose the best offer.'
  },
  sell: {
    title: 'Selling on Netsoko',
    answer: 'To sell on Netsoko, create a listing with clear product details, pricing, and quality images. Keep your inventory updated and respond quickly to buyer inquiries to build trust and earn more sales.',
    details: [
      'Write descriptive product titles and details that highlight benefits for buyers.',
      'Set competitive prices and maintain stock levels so your listing remains visible.',
      'Use seller analytics to understand which products perform best.',
      'Handle buyer questions promptly through the Netsoko messaging system.'
    ],
    tip: 'Tip: Offer discounts for bundle purchases or fast delivery to encourage repeat customers.'
  },
  payment: {
    title: 'Payments and Wallets',
    answer: 'Netsoko supports secure payments using the built-in wallet and local payment services. Your wallet can hold funds, pay for purchases, and receive transfers from other users.',
    details: [
      'Deposit funds via M-Pesa or other supported local methods.',
      'Use wallet balance to complete purchases without entering payment details each time.',
      'Track your payment history and transaction receipts in your account.',
      'Manage withdrawals safely when you want to move money back to your bank or mobile wallet.'
    ],
    tip: 'Tip: Keep a small wallet balance ready for faster checkout.'
  },
  delivery: {
    title: 'Delivery and Riders',
    answer: 'Netsoko has a delivery network that connects orders with riders. Once you place an order, the system assigns a rider who picks up the item and delivers it to your location.',
    details: [
      'Track delivery progress from pickup to drop-off in real time.',
      'Choose delivery options that match your urgency and budget.',
      'Contact your assigned rider if you need to change delivery instructions.',
      'Confirm receipt when the item arrives so payment can be released securely.'
    ],
    tip: 'Tip: Provide clear delivery instructions to avoid delays.'
  },
  service: {
    title: 'Netsoko Services',
    answer: 'Netsoko Services connects you with trusted local professionals for tasks like home repairs, tech support, and personal assistance. Browse service providers, compare ratings, and book the one that fits your needs.',
    details: [
      'Search services by category, availability, and provider ratings.',
      'Read detailed service descriptions before booking.',
      'Confirm the service request in the app and keep conversation history for reference.',
      'Review completed services to help future customers choose great providers.'
    ],
    tip: 'Tip: Use provider reviews and past job history to pick the best available expert.'
  },
  job: {
    title: 'Jobs and Freelancing',
    answer: 'Netsoko Jobs is a marketplace for freelancers and clients. Browse job postings, submit proposals, and manage work through the platform to build your reputation and earn consistently.',
    details: [
      'Create a detailed freelancer profile with your skills and experience.',
      'Search for job postings that match your expertise and bid competitively.',
      'Keep communication in-app and deliver work on time to earn positive reviews.',
      'Track payments and milestones within your job dashboard.'
    ],
    tip: 'Tip: Respond quickly to job invitations and use clear proposals to win contracts.'
  },
  account: {
    title: 'Account Management',
    answer: 'Your Netsoko account stores your profile, contact information, security settings, and notification preferences. Keep everything updated so you can use the platform safely and smoothly.',
    details: [
      'Update your profile and contact details whenever they change.',
      'Set strong security settings like a reliable password and verified email or phone number.',
      'Manage notification preferences to receive important updates without clutter.',
      'Review your activity history, orders, and messages from the dashboard.'
    ],
    tip: 'Tip: Verify your email and phone number to access more features and better support.'
  }
};

const findBestMatch = (message) => {
  const lowerMessage = message.toLowerCase();
  return Object.keys(knowledgeBase).find((keyword) => lowerMessage.includes(keyword));
};

const composeRichAnswer = (topic, message) => {
  const entry = knowledgeBase[topic];
  if (!entry) return null;

  const base = [
    `${entry.title}: ${entry.answer}`,
    'Here are the key points to know:',
    ...entry.details.map((detail) => `- ${detail}`),
    entry.tip ? `
${entry.tip}` : ''
  ];

  return base.join(' ');
};

const generateAIResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  const greetingKeywords = ['hello', 'hi', 'hey'];
  const farewellKeywords = ['goodbye', 'bye', 'see you'];

  if (greetingKeywords.some((term) => lowerMessage.includes(term))) {
    return "Hello! I'm Netsoko AI, ready to answer any question about the platform with clear and useful details. What would you like to know today?";
  }

  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return "You're welcome! If you have more questions about Netsoko, ask anytime and I'll give you a helpful, detailed answer.";
  }

  if (farewellKeywords.some((term) => lowerMessage.includes(term))) {
    return "Goodbye! Feel free to come back anytime for help with Netsoko features, payments, delivery, services, or account questions.";
  }

  const match = findBestMatch(message);
  if (match) {
    return composeRichAnswer(match, message);
  }

  return `I can answer any Netsoko question clearly and with extra details. Here are some of the topics I know best: marketplace, payments, delivery, services, jobs, account management, escrow, and support. Try asking a specific question like "How do I buy a product?", "How do I track my delivery?", or "How do I sell on Netsoko?"`;
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