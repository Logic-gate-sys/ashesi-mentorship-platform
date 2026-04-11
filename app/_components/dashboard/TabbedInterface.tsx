'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
}

interface TabbedInterfaceProps {
  tabs: Tab[];
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
}

export default function TabbedInterface({ tabs, onTabChange, children }: TabbedInterfaceProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'tab-1');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border overflow-x-auto">
        <div className="flex gap-1 md:gap-8 min-w-full md:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 md:px-0 py-3 md:py-4 font-semibold text-sm md:text-base whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.icon && <span className="text-lg">{tab.icon}</span>}
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="inline-block min-w-5 h-5 rounded-full bg-accent text-white text-xs font-bold text-center leading-5">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - managed by parent */}
      {children}

      {/* Export this to let parent control display based on activeTab */}
    </div>
  );
}

export function useTabState(defaultTab: string = 'tab-1') {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return { activeTab, setActiveTab };
}
