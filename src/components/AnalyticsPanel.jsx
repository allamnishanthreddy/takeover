import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Award, Activity, DollarSign } from 'lucide-react';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 45000, expenses: 15000 },
  { name: 'Feb', revenue: 52000, expenses: 16000 },
  { name: 'Mar', revenue: 61000, expenses: 18000 },
  { name: 'Apr', revenue: 58000, expenses: 19000 },
  { name: 'May', revenue: 73000, expenses: 22000 },
  { name: 'Jun', revenue: 85000, expenses: 25000 },
  { name: 'Jul', revenue: 99000, expenses: 28000 }
];

const SALES_DATA = [
  { name: 'Mon', target: 5, actual: 4 },
  { name: 'Tue', target: 5, actual: 6 },
  { name: 'Wed', target: 5, actual: 8 },
  { name: 'Thu', target: 5, actual: 5 },
  { name: 'Fri', target: 5, actual: 9 }
];

const PRODUCTIVITY_DATA = [
  { hour: '09:00', tasksComplete: 2, utility: 75 },
  { hour: '11:00', tasksComplete: 6, utility: 88 },
  { hour: '13:00', tasksComplete: 4, utility: 82 },
  { hour: '15:00', tasksComplete: 9, utility: 96 },
  { hour: '17:00', tasksComplete: 12, utility: 94 }
];

export default function AnalyticsPanel({ stats = {} }) {
  const [activeTab, setActiveTab] = useState('revenue');

  // Let's dynamically inject updated values from stats props to the last items
  const dynamicRevenueData = [...REVENUE_DATA];
  if (stats.revenueVal) {
    // If stats has updated revenue (e.g. $642,800), we can map/adjust the July revenue index
    dynamicRevenueData[REVENUE_DATA.length - 1] = {
      ...dynamicRevenueData[REVENUE_DATA.length - 1],
      revenue: stats.revenueVal
    };
  }

  const renderActiveChart = () => {
    switch (activeTab) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={dynamicRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Area type="monotone" name="Gross Revenue ($)" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" name="Corporate Expenses ($)" dataKey="expenses" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'sales':
        return (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar name="Sales Target Deals" dataKey="target" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} radius={[4, 4, 0, 0]} />
              <Bar name="Actual Contracts Closed" dataKey="actual" fill="url(#salesGrad)" radius={[4, 4, 0, 0]}>
                {/* SVG gradient definition */}
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'productivity':
        return (
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={PRODUCTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Line type="monotone" name="Agent Workspace Utility %" dataKey="utility" stroke="#a855f7" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="monotone" name="System Tasks Complete" dataKey="tasksComplete" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { id: 'revenue', label: 'Revenue Growth', icon: DollarSign, change: '+14.2%' },
    { id: 'sales', label: 'Sales Deals', icon: TrendingUp, change: '18 Deals' },
    { id: 'productivity', label: 'Agent Productivity', icon: Activity, change: '96.2%' }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 h-full flex flex-col justify-between">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-cyan" />
            Performance Analytics
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time system telemetry and agent logs.</p>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border border-white/10 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of micro cards and graph */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        {/* Metric widgets */}
        <div className="space-y-3 lg:col-span-1">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900/80 border-brand-cyan/20 shadow-sm shadow-brand-cyan/5'
                    : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-cyan/15 text-brand-cyan' : 'bg-slate-900 text-zinc-500'}`}>
                    <TabIcon size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono font-medium">{tab.label}</span>
                    <strong className="text-xs text-white font-mono">{tab.change}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Chart Area */}
        <div className="lg:col-span-3 bg-slate-950/40 border border-white/5 rounded-xl p-3 h-[250px] flex items-center justify-center">
          {renderActiveChart()}
        </div>
      </div>
    </div>
  );
}
