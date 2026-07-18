import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Activity, DollarSign, Sparkles } from 'lucide-react';

const BASE_REVENUE_DATA = [
  { name: 'Jan', revenue: 45000, expenses: 15000 },
  { name: 'Feb', revenue: 52000, expenses: 16000 },
  { name: 'Mar', revenue: 61000, expenses: 18000 },
  { name: 'Apr', revenue: 58000, expenses: 19000 },
  { name: 'May', revenue: 73000, expenses: 22000 },
  { name: 'Jun', revenue: 85000, expenses: 25000 },
  { name: 'Jul', revenue: 99000, expenses: 28000 }
];

const PRODUCTIVITY_DATA = [
  { hour: '09:00', tasksComplete: 2, utility: 75 },
  { hour: '11:00', tasksComplete: 6, utility: 88 },
  { hour: '13:00', tasksComplete: 4, utility: 82 },
  { hour: '15:00', tasksComplete: 9, utility: 96 },
  { hour: '17:00', tasksComplete: 12, utility: 94 }
];

const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '11px'
};

export default function AnalyticsPanel({ stats = {} }) {
  const [activeTab, setActiveTab] = useState('revenue');
  const [showExplanation, setShowExplanation] = useState(false);

  // Dynamically inject live revenue into the most recent bar
  const dynamicRevenueData = BASE_REVENUE_DATA.map((d, idx) => {
    if (idx === BASE_REVENUE_DATA.length - 1 && stats.revenue) {
      return { ...d, revenue: Math.min(stats.revenue / 10, 150000) };
    }
    return d;
  });

  // Sales data that reflects actual deals closed
  const salesDeals = stats.salesCount || 38;
  const SALES_DATA = [
    { name: 'Mon', target: 8, actual: Math.max(3, Math.floor(salesDeals * 0.18)) },
    { name: 'Tue', target: 8, actual: Math.max(4, Math.floor(salesDeals * 0.22)) },
    { name: 'Wed', target: 8, actual: Math.max(6, Math.floor(salesDeals * 0.28)) },
    { name: 'Thu', target: 8, actual: Math.max(5, Math.floor(salesDeals * 0.16)) },
    { name: 'Fri', target: 8, actual: Math.max(7, Math.floor(salesDeals * 0.16)) }
  ];

  const revenueFormatted = stats.revenue
    ? `$${(stats.revenue / 1000).toFixed(0)}K`
    : '$1,850K';

  const tabs = [
    { id: 'revenue', label: 'Revenue Growth', icon: DollarSign, change: revenueFormatted },
    { id: 'sales', label: 'Sales Deals', icon: TrendingUp, change: `${salesDeals} Closed` },
    { id: 'productivity', label: 'Agent Utility', icon: Activity, change: `${stats.successRate || 98.4}%` }
  ];

  const insightText = {
    revenue: `Revenue at ${revenueFormatted} — up 18.4% this month. ${stats.workflowsCount || 6} agent workflows completed today. CEO Agent recommends targeted developer upsells to maximize SLA expansions.`,
    sales: `Sales team closed ${salesDeals} deals this period, beating target by ${Math.max(0, Math.round((salesDeals / 30 - 1) * 100))}%. Repeat clients contributed 45% of total contract value.`,
    productivity: `Agent utility at ${stats.successRate || 98.4}%. CEO Agent routed ${(stats.workflowsCount || 6) * 25}+ tasks. Finance Agent automated ${stats.documentsCount || 18} document operations with zero errors.`
  };

  const renderActiveChart = () => {
    switch (activeTab) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={dynamicRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d9a054" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#d9a054" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7a7f87" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7a7f87" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Area type="monotone" name="Gross Revenue ($)" dataKey="revenue" stroke="#d9a054" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" name="Corporate Expenses ($)" dataKey="expenses" stroke="#7a7f87" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'sales':
        return (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d9a054" />
                  <stop offset="100%" stopColor="#a97c3f" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar name="Weekly Target" dataKey="target" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} radius={[4, 4, 0, 0]} />
              <Bar name="Actual Contracts Closed" dataKey="actual" fill="url(#salesGrad)" radius={[4, 4, 0, 0]} />
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
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Line type="monotone" name="Agent Workspace Utility %" dataKey="utility" stroke="#7a7f87" strokeWidth={2} activeDot={{ r: 6 }} dot={false} />
              <Line type="monotone" name="System Tasks Complete" dataKey="tasksComplete" stroke="#d9a054" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 h-full flex flex-col justify-between">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-cyan" />
            Performance Analytics
            <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase ml-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full live-pulse-green flex-shrink-0" />
              Live Data
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time system telemetry and agent performance logs.</p>
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

      {/* Today's Autonomous Insight Banner */}
      <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl p-3 mb-4 flex items-start gap-2.5">
        <div className="p-1.5 bg-brand-cyan/15 text-brand-cyan rounded-lg flex-shrink-0 mt-0.5">
          <Sparkles size={12} />
        </div>
        <div>
          <span className="text-[9px] uppercase font-mono tracking-wider text-brand-cyan block font-bold">Today's Autonomous Insight</span>
          <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
            {insightText[activeTab]}
          </p>
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
                {isSelected && (
                  <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full live-pulse-green flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Chart Area */}
        <div className="lg:col-span-3 bg-slate-950/40 border border-white/5 rounded-xl p-3 h-[250px] flex items-center justify-center">
          {renderActiveChart()}
        </div>
      </div>

      {/* Footer: Telemetry summary + explanation toggle */}
      <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-3">
        <span className="text-[10px] text-zinc-500 font-mono">
          {stats.workflowsCount || 6} workflows · {stats.documentsCount || 18} docs · {stats.meetingsCount || 4} meetings · {stats.timeSavedMinutes || 402}m saved
        </span>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="px-3 py-1.5 rounded-lg border border-brand-cyan/35 hover:border-brand-cyan/70 text-brand-cyan text-[11px] font-bold cursor-pointer hover:bg-brand-cyan/10 transition-all flex items-center gap-1.5"
        >
          ✨ {showExplanation ? 'Hide AI Explanation' : 'Explain Telemetry Charts'}
        </button>
      </div>

      {showExplanation && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-zinc-300 space-y-2 animate-fade-in font-mono leading-relaxed">
          <div className="flex items-center gap-1.5 text-brand-cyan font-bold">
            <TrendingUp size={12} />
            <span>AI Telemetry Explanation Console</span>
          </div>
          <p>
            {activeTab === 'revenue' && `Gross Revenue at ${revenueFormatted} — up 18.4% month-on-month, driven by Enterprise SaaS contracts and repeat licensing renewals. Operating expenses held at $28K, yielding a 71% net profit margin.`}
            {activeTab === 'sales' && `Sales team closed ${salesDeals} deals this period, beating targets by ${Math.max(0, Math.round((salesDeals / 30 - 1) * 100))}%. South Region led with +18% contract value. Returning clients contributed 45% repeat volume.`}
            {activeTab === 'productivity' && `Autonomous Agent utility at ${stats.successRate || 98.4}%. CEO Agent routed ${(stats.workflowsCount || 6) * 25}+ tasks with zero latency. Finance Agent automated ${stats.documentsCount || 18} document operations. Knowledge Agent indexed all policy queries instantly.`}
          </p>
        </div>
      )}
    </div>
  );
}
