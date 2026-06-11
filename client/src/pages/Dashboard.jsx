import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import RoleSwitcher from '../components/RoleSwitcher';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiShoppingBag, FiDollarSign, FiPackage, FiUsers, FiTrendingUp, FiClock, FiTruck, FiCalendar, FiTool, FiBriefcase } from 'react-icons/fi';

const Dashboard = () => {
  const { user, switchRole } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Role-specific stats
    const fetchStats = async () => {
      const roleStats = {
        buyer: {
          totalOrders: 15,
          walletBalance: 45000,
          activeProducts: 0,
          totalSpent: 125000,
          pendingOrders: 2,
        },
        seller: {
          totalOrders: 145,
          totalRevenue: 875000,
          walletBalance: 320000,
          activeProducts: 23,
          pendingOrders: 8,
          dailySales: 45000,
          weeklyRevenue: 320000,
          topProduct: 'iPhone 15 Pro Max',
        },
        service_provider: {
          totalBookings: 45,
          totalRevenue: 285000,
          walletBalance: 180000,
          activeServices: 8,
          pendingBookings: 3,
          completedServices: 42,
          averageRating: 4.8,
        },
        rider: {
          totalDeliveries: 89,
          totalEarnings: 145000,
          walletBalance: 85000,
          activeDeliveries: 3,
          completedDeliveries: 86,
          averageRating: 4.9,
          totalDistance: 1245,
        },
        freelancer: {
          totalProjects: 12,
          totalEarnings: 285000,
          walletBalance: 165000,
          activeProjects: 3,
          completedProjects: 9,
          pendingProposals: 5,
          averageRating: 4.7,
        },
      };
      setStats(roleStats[user?.activeRole || 'buyer'] || roleStats.buyer);
    };
    fetchStats();
  }, [user, user?.activeRole]);

  const revenueData = [
    { name: 'Jan', revenue: user?.activeRole === 'seller' ? 45000 : 15000 },
    { name: 'Feb', revenue: user?.activeRole === 'seller' ? 52000 : 18000 },
    { name: 'Mar', revenue: user?.activeRole === 'seller' ? 48000 : 22000 },
    { name: 'Apr', revenue: user?.activeRole === 'seller' ? 61000 : 25000 },
    { name: 'May', revenue: user?.activeRole === 'seller' ? 55000 : 28000 },
    { name: 'Jun', revenue: user?.activeRole === 'seller' ? 67000 : 32000 },
  ];

  const activityData = [
    { name: 'Completed', value: 450, color: '#00C853' },
    { name: 'Pending', value: 120, color: '#FFA726' },
    { name: 'Cancelled', value: 30, color: '#EF5350' },
  ];

  const getRoleDashboard = () => {
    const currentRole = user?.activeRole || user?.role || 'buyer';
    switch (currentRole) {
      case 'seller':
        return <SellerDashboard stats={stats} revenueData={revenueData} />;
      case 'service_provider':
        return <ServiceProviderDashboard stats={stats} revenueData={revenueData} />;
      case 'rider':
        return <RiderDashboard stats={stats} />;
      case 'freelancer':
        return <FreelancerDashboard stats={stats} />;
      case 'buyer':
      default:
        return <BuyerDashboard stats={stats} revenueData={revenueData} activityData={activityData} />;
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:gap-4 mb-4 lg:mb-6"
      >
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
            {user?.activeRole === 'seller' && 'Here\'s your business performance overview.'}
            {user?.activeRole === 'service_provider' && 'Here\'s your service booking overview.'}
            {user?.activeRole === 'rider' && 'Here\'s your delivery performance overview.'}
            {user?.activeRole === 'freelancer' && 'Here\'s your freelance projects overview.'}
            {user?.activeRole === 'buyer' && 'Here\'s what\'s happening with your SokoNet account today.'}
          </p>
        </div>
        {user?.roles && user.roles.length > 1 && (
          <RoleSwitcher
            currentRole={user.activeRole}
            availableRoles={user.roles}
            onRoleSwitch={switchRole}
          />
        )}
      </motion.div>

      {getRoleDashboard()}
    </div>
  );
};

const BuyerDashboard = ({ stats, revenueData, activityData }) => (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
      <StatCard title="Total Orders" value={stats.totalOrders} icon={FiShoppingBag} trend="+12.5%" trendUp={true} />
      <StatCard title="Wallet Balance" value={`KES ${stats.walletBalance?.toLocaleString()}`} icon={FiDollarSign} trend="+8.2%" trendUp={true} />
      <StatCard title="Total Spent" value={`KES ${stats.totalSpent?.toLocaleString()}`} icon={FiTrendingUp} trend="+15.3%" trendUp={true} />
      <StatCard title="Pending Orders" value={stats.pendingOrders} icon={FiClock} trend="-3.2%" trendUp={false} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      <motion.div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">Spending Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
            <YAxis stroke="#9CA3AF" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="revenue" stroke="#00C853" strokeWidth={2} dot={{ fill: '#00C853' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">Order Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={activityData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
              {activityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-6 mt-2 lg:mt-4">
          {activityData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">{entry.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </>
);

const SellerDashboard = ({ stats, revenueData }) => (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
      <StatCard title="Total Revenue" value={`KES ${stats.totalRevenue?.toLocaleString()}`} icon={FiDollarSign} trend="+22.5%" trendUp={true} />
      <StatCard title="Wallet Balance" value={`KES ${stats.walletBalance?.toLocaleString()}`} icon={FiDollarSign} trend="+15.3%" trendUp={true} />
      <StatCard title="Total Orders" value={stats.totalOrders} icon={FiPackage} trend="+18.2%" trendUp={true} />
      <StatCard title="Active Products" value={stats.activeProducts} icon={FiShoppingBag} trend="+5.7%" trendUp={true} />
      <StatCard title="Pending Orders" value={stats.pendingOrders} icon={FiClock} trend="-8.2%" trendUp={false} />
      <StatCard title="Daily Sales" value={`KES ${stats.dailySales?.toLocaleString()}`} icon={FiTrendingUp} trend="+12.3%" trendUp={true} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      <motion.div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
            <YAxis stroke="#9CA3AF" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="revenue" stroke="#00C853" strokeWidth={2} dot={{ fill: '#00C853' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">Business Insights</h3>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Top Product</p>
              <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">{stats.topProduct || 'iPhone 15 Pro Max'}</p>
            </div>
            <span className="text-brand font-bold text-xs sm:text-sm lg:text-base">KES 185,000</span>
          </div>
          <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Weekly Revenue</p>
              <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">This week's performance</p>
            </div>
            <span className="text-brand font-bold text-xs sm:text-sm lg:text-base">KES {stats.weeklyRevenue?.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Conversion Rate</p>
              <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Orders to sales</p>
            </div>
            <span className="text-green-400 font-bold text-xs sm:text-sm lg:text-base">+15.3%</span>
          </div>
        </div>
      </motion.div>
    </div>
  </>
);

const ServiceProviderDashboard = ({ stats, revenueData }) => (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
      <StatCard title="Total Bookings" value={stats.totalBookings} icon={FiCalendar} trend="+25.5%" trendUp={true} />
      <StatCard title="Total Revenue" value={`KES ${stats.totalRevenue?.toLocaleString()}`} icon={FiDollarSign} trend="+18.2%" trendUp={true} />
      <StatCard title="Wallet Balance" value={`KES ${stats.walletBalance?.toLocaleString()}`} icon={FiDollarSign} trend="+12.3%" trendUp={true} />
      <StatCard title="Active Services" value={stats.activeServices} icon={FiTool} trend="+8.7%" trendUp={true} />
      <StatCard title="Pending Bookings" value={stats.pendingBookings} icon={FiClock} trend="-5.2%" trendUp={false} />
      <StatCard title="Completed Services" value={stats.completedServices} icon={FiUsers} trend="+22.1%" trendUp={true} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      <motion.div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">Service Revenue</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
            <YAxis stroke="#9CA3AF" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="revenue" stroke="#00C853" strokeWidth={2} dot={{ fill: '#00C853' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">Service Performance</h3>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Average Rating</p>
              <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Customer satisfaction</p>
            </div>
            <span className="text-brand font-bold text-xs sm:text-sm lg:text-base">{stats.averageRating}/5.0</span>
          </div>
          <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Completion Rate</p>
              <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Bookings completed</p>
            </div>
            <span className="text-green-400 font-bold text-xs sm:text-sm lg:text-base">93.3%</span>
          </div>
          <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Average Booking Value</p>
              <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Per service</p>
            </div>
            <span className="text-brand font-bold text-xs sm:text-sm lg:text-base">KES 6,333</span>
          </div>
        </div>
      </motion.div>
    </div>
  </>
);

const RiderDashboard = ({ stats }) => (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
      <StatCard title="Total Deliveries" value={stats.totalDeliveries} icon={FiTruck} trend="+35.5%" trendUp={true} />
      <StatCard title="Total Earnings" value={`KES ${stats.totalEarnings?.toLocaleString()}`} icon={FiDollarSign} trend="+28.2%" trendUp={true} />
      <StatCard title="Wallet Balance" value={`KES ${stats.walletBalance?.toLocaleString()}`} icon={FiDollarSign} trend="+18.3%" trendUp={true} />
      <StatCard title="Active Deliveries" value={stats.activeDeliveries} icon={FiClock} trend="+12.7%" trendUp={true} />
      <StatCard title="Completed" value={stats.completedDeliveries} icon={FiUsers} trend="+32.1%" trendUp={true} />
      <StatCard title="Total Distance" value={`${stats.totalDistance} km`} icon={FiTrendingUp} trend="+45.2%" trendUp={true} />
    </div>

    <motion.div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3 sm:p-4 lg:p-6">
      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">Rider Performance</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
          <div>
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Average Rating</p>
            <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Customer satisfaction</p>
          </div>
          <span className="text-brand font-bold text-xs sm:text-sm lg:text-base">{stats.averageRating}/5.0</span>
        </div>
        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
          <div>
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Completion Rate</p>
            <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Deliveries completed</p>
          </div>
          <span className="text-green-400 font-bold text-xs sm:text-sm lg:text-base">96.6%</span>
        </div>
        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
          <div>
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Average Earnings</p>
            <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Per delivery</p>
          </div>
          <span className="text-brand font-bold text-xs sm:text-sm lg:text-base">KES 1,628</span>
        </div>
        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
          <div>
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Active Status</p>
            <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Current availability</p>
          </div>
          <span className="text-green-400 font-bold text-xs sm:text-sm lg:text-base">Online</span>
        </div>
      </div>
    </motion.div>
  </>
);

const FreelancerDashboard = ({ stats }) => (
  <>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
      <StatCard title="Total Projects" value={stats.totalProjects} icon={FiBriefcase} trend="+45.5%" trendUp={true} />
      <StatCard title="Total Earnings" value={`KES ${stats.totalEarnings?.toLocaleString()}`} icon={FiDollarSign} trend="+32.2%" trendUp={true} />
      <StatCard title="Wallet Balance" value={`KES ${stats.walletBalance?.toLocaleString()}`} icon={FiDollarSign} trend="+25.3%" trendUp={true} />
      <StatCard title="Active Projects" value={stats.activeProjects} icon={FiClock} trend="+15.7%" trendUp={true} />
      <StatCard title="Completed" value={stats.completedProjects} icon={FiUsers} trend="+42.1%" trendUp={true} />
      <StatCard title="Pending Proposals" value={stats.pendingProposals} icon={FiTrendingUp} trend="+8.3%" trendUp={true} />
    </div>

    <motion.div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3 sm:p-4 lg:p-6">
      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">Freelancer Performance</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
          <div>
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Average Rating</p>
            <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Client satisfaction</p>
          </div>
          <span className="text-brand font-bold text-xs sm:text-sm lg:text-base">{stats.averageRating}/5.0</span>
        </div>
        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
          <div>
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Completion Rate</p>
            <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Projects completed</p>
          </div>
          <span className="text-green-400 font-bold text-xs sm:text-sm lg:text-base">75.0%</span>
        </div>
        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
          <div>
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Average Project Value</p>
            <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Per project</p>
          </div>
          <span className="text-brand font-bold text-xs sm:text-sm lg:text-base">KES 23,750</span>
        </div>
        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-800/30 rounded-lg">
          <div>
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Active Proposals</p>
            <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm">Pending applications</p>
          </div>
          <span className="text-brand font-bold text-xs sm:text-sm lg:text-base">{stats.pendingProposals}</span>
        </div>
      </div>
    </motion.div>
  </>
);

export default Dashboard;