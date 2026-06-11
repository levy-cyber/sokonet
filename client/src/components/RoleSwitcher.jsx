import React, { useState } from 'react';
import { FiBriefcase, FiShoppingBag, FiTool, FiTruck, FiUser, FiSettings, FiChevronDown } from 'react-icons/fi';

const RoleSwitcher = ({ currentRole, availableRoles, onRoleSwitch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const roleConfig = {
    buyer: { name: 'Buyer', icon: FiShoppingBag, color: 'bg-blue-500', description: 'Shop for products' },
    seller: { name: 'Seller', icon: FiBriefcase, color: 'bg-purple-500', description: 'Manage your shop' },
    service_provider: { name: 'Service Provider', icon: FiTool, color: 'bg-orange-500', description: 'Offer services' },
    rider: { name: 'Rider', icon: FiTruck, color: 'bg-green-500', description: 'Delivery partner' },
    freelancer: { name: 'Freelancer', icon: FiUser, color: 'bg-pink-500', description: 'Find freelance work' },
    admin: { name: 'Admin', icon: FiSettings, color: 'bg-red-500', description: 'System admin' },
  };

  if (availableRoles.length <= 1) {
    return null; // Don't show switcher if user only has one role
  }

  const currentRoleConfig = roleConfig[currentRole];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all"
      >
        <div className={`w-8 h-8 rounded-full ${currentRoleConfig.color} flex items-center justify-center`}>
          <currentRoleConfig.icon className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <p className="text-white text-sm font-medium">{currentRoleConfig.name}</p>
          <p className="text-gray-400 text-xs">{currentRoleConfig.description}</p>
        </div>
        <FiChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-3 px-2">Switch to:</p>
              {availableRoles.map((role) => {
                const config = roleConfig[role];
                const isActive = role === currentRole;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleSwitch(role);
                      setIsOpen(false);
                    }}
                    disabled={isActive}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-brand/20 border border-brand text-brand'
                        : 'hover:bg-gray-800 text-white'
                    } disabled:opacity-50`}
                  >
                    <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center`}>
                      <config.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{config.name}</p>
                      <p className="text-xs text-gray-400">{config.description}</p>
                    </div>
                    {isActive && <span className="ml-auto text-brand text-xs">Active</span>}
                  </button>
                );
              })}
            </div>
            <div className="px-3 py-2 border-t border-gray-700">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleSwitcher;