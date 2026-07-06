import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  MapPin,
  Clock3,
  Star,
  BadgeCheck,
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  BadgePercent,
  Truck,
  Store,
  Heart,
  MoonStar,
  SunMedium,
  Coffee,
  Soup,
  Sandwich,
  IceCreamCone,
  Milk,
  Beef,
  Apple,
  Droplets,
  Wine,
  Salad,
  CupSoda,
  ChevronRight,
} from 'lucide-react';

const categoryMeta = [
  { id: 'All', label: 'All', icon: Sparkles },
  { id: 'Restaurants', label: 'Restaurants', icon: Store },
  { id: 'Fast Food', label: 'Fast Food', icon: Sandwich },
  { id: 'Cafés', label: 'Cafés', icon: Coffee },
  { id: 'Bakeries', label: 'Bakeries', icon: BreadIcon },
  { id: 'Groceries', label: 'Groceries', icon: ShoppingBag },
  { id: 'Fruits & Vegetables', label: 'Fruits & Vegetables', icon: Apple },
  { id: 'Meat & Seafood', label: 'Meat & Seafood', icon: Beef },
  { id: 'Dairy', label: 'Dairy', icon: Milk },
  { id: 'Snacks', label: 'Snacks', icon: IceCreamCone },
  { id: 'Soft Drinks', label: 'Soft Drinks', icon: CupSoda },
  { id: 'Juices', label: 'Juices', icon: Droplets },
  { id: 'Coffee & Tea', label: 'Coffee & Tea', icon: Coffee },
  { id: 'Alcoholic Drinks', label: 'Alcoholic Drinks', icon: Wine },
  { id: 'Water', label: 'Water', icon: Droplets },
  { id: 'Local Foods', label: 'Local Foods', icon: Soup },
  { id: 'International Cuisine', label: 'International Cuisine', icon: Salad },
];

const filters = ['Nearby', 'Highest Rated', 'Fast Delivery', 'Free Delivery', 'Open Now'];

const restaurantsSeed = [
  {
    id: 'kibandaski',
    name: 'Kibandaski Kitchen',
    tagline: 'Quick bites, local favorites and fresh juices.',
    cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    distance: '1.2 km',
    deliveryTime: '20-30 min',
    deliveryFee: 'KES 120',
    isOpen: true,
    verified: true,
    cuisine: 'Local Foods',
    categories: ['Local Foods', 'Fast Food', 'Juices'],
    reviewCount: 284,
    items: [
      { id: 'githeri', name: 'Githeri Bowl', price: 420, badge: 'Chef special', description: 'Classic Kenyan mix with greens and avocado.', options: ['Extra ugali', 'Spicy', 'No onions'] },
      { id: 'samosa', name: 'Crispy Samosa Pack', price: 280, badge: 'Best seller', description: 'Five golden samosas with spicy chutney.', options: ['Hot sauce', 'Ketchup'] },
      { id: 'juice', name: 'Fresh Mango Juice', price: 220, badge: 'Cold', description: 'Naturally blended with lime.', options: ['Less ice', 'Extra fruit'] },
    ],
  },
  {
    id: 'sunset',
    name: 'Sunset Café',
    tagline: 'Coffee, pastries and gourmet brunch plates.',
    cover: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    distance: '2.8 km',
    deliveryTime: '15-25 min',
    deliveryFee: 'KES 90',
    isOpen: true,
    verified: true,
    cuisine: 'Cafés',
    categories: ['Coffee & Tea', 'Bakeries', 'Snacks'],
    reviewCount: 196,
    items: [
      { id: 'latte', name: 'Signature Latte', price: 350, badge: 'Popular', description: 'Velvety beans with oat milk.', options: ['Extra shot', 'Sugar free'] },
      { id: 'croissant', name: 'Butter Croissant', price: 220, badge: 'Freshly baked', description: 'Flaky pastry baked every morning.', options: ['Jam', 'Chocolate'] },
      { id: 'toast', name: 'Avocado Toast', price: 480, badge: 'Brunch', description: 'Sourdough, avocado and micro herbs.', options: ['Egg', 'Extra chili'] },
    ],
  },
  {
    id: 'freshmart',
    name: 'FreshMart Grocers',
    tagline: 'Groceries, produce and household essentials.',
    cover: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    distance: '3.4 km',
    deliveryTime: '25-35 min',
    deliveryFee: 'KES 150',
    isOpen: false,
    verified: true,
    cuisine: 'Groceries',
    categories: ['Groceries', 'Fruits & Vegetables', 'Dairy'],
    reviewCount: 142,
    items: [
      { id: 'vegbox', name: 'Fresh Veg Box', price: 760, badge: 'Weekly deal', description: 'Assorted greens, onions and carrots.', options: ['Add eggs', 'Halal'] },
      { id: 'yogurt', name: 'Greek Yogurt', price: 260, badge: 'Protein', description: 'Creamy yogurt with fruit topping.', options: ['Honey', 'No sugar'] },
      { id: 'water', name: 'Mineral Water 24-pack', price: 620, badge: 'Bulk', description: 'Refreshing chilled water.', options: ['Sparkling', 'Still'] },
    ],
  },
];

function BreadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7.5c0-1.8 1.4-3.3 3.1-3.3h9.8c1.7 0 3.1 1.5 3.1 3.3v1.8c0 2.4-1.2 4.5-3.1 5.7L12 16l-4.9-1c-1.9-1.2-3.1-3.3-3.1-5.7V7.5Z" />
      <path d="M7.5 10.8h9" />
    </svg>
  );
}

const FoodMarketplaceSection = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('Nearby');
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurantsSeed[0]);
  const [cartItems, setCartItems] = useState([]);
  const [deliveryMode, setDeliveryMode] = useState('delivery');
  const [promoCode, setPromoCode] = useState('');
  const [address, setAddress] = useState('Westlands, Nairobi');
  const [favorites, setFavorites] = useState(['kibandaski']);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const filteredRestaurants = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return restaurantsSeed.filter((restaurant) => {
      const matchesCategory = selectedCategory === 'All' || restaurant.categories.includes(selectedCategory) || restaurant.cuisine === selectedCategory;
      const matchesSearch = !term || [restaurant.name, restaurant.tagline, restaurant.cuisine, restaurant.categories.join(' ')].join(' ').toLowerCase().includes(term);
      const matchesFilter =
        activeFilter === 'Nearby' ||
        (activeFilter === 'Highest Rated' && restaurant.rating >= 4.7) ||
        (activeFilter === 'Fast Delivery' && parseInt(restaurant.deliveryTime, 10) <= 25) ||
        (activeFilter === 'Free Delivery' && restaurant.deliveryFee.toLowerCase().includes('0')) ||
        (activeFilter === 'Open Now' && restaurant.isOpen);
      return matchesCategory && matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedCategory, activeFilter]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) => prev.flatMap((entry) => entry.id === id ? (entry.quantity + delta > 0 ? [{ ...entry, quantity: entry.quantity + delta }] : []) : [entry]));
  };

  const removeItem = (id) => setCartItems((prev) => prev.filter((entry) => entry.id !== id));

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMode === 'delivery' ? 150 : 0;
  const serviceFee = Math.round(subtotal * 0.08);
  const tax = Math.round(subtotal * 0.016);
  const total = subtotal + deliveryFee + serviceFee + tax;

  const toggleFavorite = (restaurantId) => {
    setFavorites((prev) => prev.includes(restaurantId) ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId]);
  };

  const handleCheckout = () => {
    setCheckoutMessage('Order placed successfully. Your rider is on the way.');
    navigate('/checkout');
  };

  return (
    <section className={`rounded-3xl border p-4 md:p-6 lg:p-8 shadow-2xl ${theme === 'dark' ? 'border-gray-800 bg-gray-950/90 text-white' : 'border-gray-200 bg-white/95 text-gray-900'}`}>
      <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-emerald-500/20 via-gray-900/80 to-orange-500/20 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Premium Food & Beverage Experience
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Order from the best restaurants, cafés and grocers in one elegant marketplace.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-gray-300 sm:text-base">
              Discover meals, drinks, groceries and daily specials with smart recommendations, fast delivery and trusted vendors.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-gray-200">
                <Truck className="h-4 w-4 text-emerald-400" />
                Fast delivery
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-gray-200">
                <BadgeCheck className="h-4 w-4 text-orange-400" />
                Verified vendors
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-gray-200">
                <Heart className="h-4 w-4 text-pink-400" />
                Favorite meals & restaurants
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200 backdrop-blur">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search restaurants, dishes, drinks or groceries"
              className="w-full bg-transparent outline-none placeholder:text-gray-500"
              aria-label="Search food and beverage items"
            />
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110">
            <Sparkles className="h-4 w-4" />
            AI Recommendations
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Restaurants', value: '240+' },
            { label: 'Popular dishes', value: '1.2k' },
            { label: 'Verified vendors', value: '96%' },
            { label: 'Live tracking', value: '24/7' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-sm text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          {categoryMeta.map((category) => {
            const Icon = category.icon;
            const active = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${active ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300' : 'border-gray-700 bg-gray-900/70 text-gray-300 hover:border-emerald-500/40'}`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-3 py-2 text-sm transition ${activeFilter === filter ? 'border-orange-500 bg-orange-500/15 text-orange-300' : 'border-gray-700 bg-gray-900/70 text-gray-400 hover:border-orange-500/40'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredRestaurants.map((restaurant) => {
              const isSelected = selectedRestaurant.id === restaurant.id;
              return (
                <motion.button
                  key={restaurant.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  type="button"
                  onClick={() => setSelectedRestaurant(restaurant)}
                  className={`overflow-hidden rounded-3xl border text-left ${isSelected ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-gray-800 bg-gray-900/70'}`}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={restaurant.cover} alt={restaurant.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(restaurant.id);
                      }}
                      className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white"
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(restaurant.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                    </button>
                    <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Verified
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{restaurant.name}</h3>
                          {restaurant.isOpen ? <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">Open</span> : <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-300">Closed</span>}
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{restaurant.tagline}</p>
                      </div>
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-2.5 py-2 text-right">
                        <div className="flex items-center gap-1 text-sm font-semibold text-amber-300">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {restaurant.rating}
                        </div>
                        <p className="text-[11px] text-gray-400">{restaurant.reviewCount} reviews</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-400">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-gray-500" />{restaurant.distance}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4 text-gray-500" />{restaurant.deliveryTime}</span>
                      <span className="inline-flex items-center gap-1"><Truck className="h-4 w-4 text-gray-500" />{restaurant.deliveryFee}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {restaurant.categories.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-gray-300">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3">
                <img src={selectedRestaurant.logo} alt={selectedRestaurant.name} className="h-14 w-14 rounded-2xl object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">{selectedRestaurant.name}</h3>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-300">{selectedRestaurant.cuisine}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{selectedRestaurant.tagline}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-amber-400" />{selectedRestaurant.rating}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{selectedRestaurant.distance}</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />{selectedRestaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-300">
                <ShoppingBag className="h-4 w-4" />
                Live order tracking
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {selectedRestaurant.categories.map((cat) => (
                <span key={cat} className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-gray-300">{cat}</span>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {selectedRestaurant.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-800 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-300">{item.badge}</div>
                      <h4 className="mt-2 text-lg font-semibold text-white">{item.name}</h4>
                      <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">KES {item.price}</p>
                      <p className="text-xs text-gray-500">customizable</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                    {item.options.map((option) => (
                      <span key={option} className="rounded-full bg-gray-800 px-2.5 py-1">{option}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-2 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add to cart
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-gray-800 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-semibold text-white">Reviews & customer love</h4>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-sm font-semibold text-amber-300">4.8 / 5</span>
              </div>
              <p className="mt-3 text-sm text-gray-400">“Fast delivery, fresh ingredients and great customer support.”</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Excellent packaging', 'Fresh meals', 'Great value', 'Friendly support'].map((review) => (
                  <span key={review} className="rounded-full bg-white/10 px-2.5 py-1 text-sm text-gray-300">{review}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Your cart</p>
                <h3 className="text-xl font-semibold text-white">{cartItems.length} items selected</h3>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">{cartItems.length ? 'Ready' : 'Empty'}</div>
            </div>

            <div className="mt-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-700 bg-black/20 p-4 text-sm text-gray-400">Add meals or drinks to begin your order.</div>
              ) : cartItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-800 bg-black/20 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-gray-400">KES {item.price}</p>
                    </div>
                    <button type="button" onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-gray-700 bg-gray-900/80 p-1">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)} className="rounded-full p-1.5 text-gray-300 hover:bg-gray-800">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-semibold text-white">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)} className="rounded-full p-1.5 text-gray-300 hover:bg-gray-800">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-white">KES {item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <button type="button" onClick={() => setDeliveryMode('delivery')} className={`flex-1 rounded-full border px-3 py-2 text-sm ${deliveryMode === 'delivery' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-gray-700 bg-gray-900/70 text-gray-400'}`}>
                  Delivery
                </button>
                <button type="button" onClick={() => setDeliveryMode('pickup')} className={`flex-1 rounded-full border px-3 py-2 text-sm ${deliveryMode === 'pickup' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-gray-700 bg-gray-900/70 text-gray-400'}`}>
                  Pickup
                </button>
              </div>
              <label className="flex items-center gap-2 rounded-2xl border border-gray-700 bg-black/20 px-3 py-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-gray-500" />
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-transparent outline-none" aria-label="Delivery address" />
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-gray-700 bg-black/20 px-3 py-2 text-sm text-gray-300">
                <BadgePercent className="h-4 w-4 text-gray-500" />
                <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code" className="w-full bg-transparent outline-none placeholder:text-gray-500" aria-label="Promo code" />
              </label>
            </div>

            <div className="mt-5 space-y-2 rounded-2xl bg-black/20 p-4 text-sm text-gray-300">
              <div className="flex items-center justify-between"><span>Subtotal</span><span>KES {subtotal}</span></div>
              <div className="flex items-center justify-between"><span>Delivery fee</span><span>KES {deliveryFee}</span></div>
              <div className="flex items-center justify-between"><span>Tax</span><span>KES {tax}</span></div>
              <div className="flex items-center justify-between"><span>Service fee</span><span>KES {serviceFee}</span></div>
              <div className="mt-2 flex items-center justify-between border-t border-gray-800 pt-2 text-base font-semibold text-white"><span>Total</span><span>KES {total}</span></div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <ShoppingBag className="h-4 w-4" />
              Proceed to checkout
            </button>
            {checkoutMessage && <p className="mt-2 text-sm text-emerald-300">{checkoutMessage}</p>}
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gradient-to-br from-orange-500/10 to-emerald-500/10 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">For vendors</p>
                <h3 className="text-lg font-semibold text-white">Launch your own food & beverage storefront</h3>
              </div>
              <Store className="h-5 w-5 text-orange-400" />
            </div>
            <p className="mt-2 text-sm text-gray-400">Register, upload menu images, set prices, manage inventory and accept or reject orders from one modern dashboard.</p>
            <button type="button" onClick={() => navigate('/shop/mine')} className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300">
              Open vendor dashboard
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodMarketplaceSection;
