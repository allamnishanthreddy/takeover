import React, { useState } from 'react';
import { Database, ShieldCheck, Users, Briefcase, FileCheck, Sliders } from 'lucide-react';

export default function MemoryVault({ stats = {}, meetings = [], documents = {}, activities = [], employees = [], onAddEmployee, onEditEmployee }) {
  const [activeTab, setActiveTab] = useState('directory');

  // Derive CRM client list dynamically from state
  const clientsList = [
    { name: 'Vanguard Enterprises', status: meetings.length > 2 ? 'Active Client (Double Sync)' : 'Active Client' },
    { name: 'ABC Pvt Ltd', status: stats.salesCount >= 39 ? 'Proposal Sent (v2)' : 'Proposal Sent (v1)' },
    { name: 'XYZ Ltd', status: 'Lead Pipeline' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'directory':
        return (
          <div className="space-y-4">
            {/* Employees */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 block flex items-center gap-1 font-bold">
                  <Briefcase size={10} className="text-brand-purple" /> Employees Directory ({employees.length})
                </span>
                <button
                  type="button"
                  onClick={onAddEmployee}
                  className="px-2 py-0.5 rounded bg-brand-purple/10 hover:bg-brand-purple/20 border border-brand-purple/20 text-brand-purple text-[8px] font-mono cursor-pointer transition-all active:scale-95"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-1.5 max-h-[85px] overflow-y-auto no-scrollbar">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => onEditEmployee(emp)}
                    className="flex justify-between items-center bg-slate-950/60 hover:bg-slate-950 hover:border-brand-purple/35 p-2 rounded-lg border border-white/5 text-[10px] cursor-pointer transition-all hover:scale-102"
                    title="Click to edit or delete employee profile"
                  >
                    <div>
                      <span className="text-slate-200 font-medium block">{emp.name}</span>
                      <span className="text-zinc-500 font-mono text-[9px]">{emp.role}</span>
                    </div>
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono border ${
                      emp.status === 'Active' ? 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400' : 'bg-amber-400/10 border-amber-400/25 text-amber-400'
                    }`}>
                      {emp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customers */}
            <div>
              <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 block mb-1.5 flex items-center gap-1 font-bold">
                <Users size={10} className="text-brand-cyan" /> Customer CRM ({clientsList.length})
              </span>
              <div className="space-y-1.5 max-h-[85px] overflow-y-auto no-scrollbar">
                {clientsList.map((client, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-white/5 text-[10px]">
                    <span className="text-slate-200 font-medium">{client.name}</span>
                    <span className="text-[8px] font-mono text-zinc-400 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded">
                      {client.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-2.5 text-[10px]">
            <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 block mb-1 flex items-center gap-1 font-bold">
              <Sliders size={10} className="text-brand-purple" /> Business Parameters
            </span>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                <span className="text-zinc-500 block text-[9px]">Intern Stipend</span>
                <strong className="text-white font-mono">$2,500 / Month</strong>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                <span className="text-zinc-500 block text-[9px]">Office Hours</span>
                <strong className="text-white font-mono">09:00 - 18:00 (Mon-Fri)</strong>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                <span className="text-zinc-500 block text-[9px]">Promo Discount</span>
                <strong className="text-white font-mono">10.0% Standard</strong>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                <span className="text-zinc-500 block text-[9px]">Tax Rate</span>
                <strong className="text-white font-mono">8.0% Sales Tax</strong>
              </div>
            </div>

            <div className="bg-slate-950/40 p-2 rounded-lg border border-dashed border-white/5 mt-2 text-[9px] text-zinc-500 font-mono flex items-center gap-1">
              <ShieldCheck size={10} className="text-brand-cyan" /> Securely backed up in localStorage
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 block mb-1.5 flex items-center gap-1 font-bold">
              <FileCheck size={10} className="text-emerald-400" /> Work Approvals & Files
            </span>
            
            <div className="space-y-1.5 max-h-[170px] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-white/5 text-[9px] font-mono">
                <span className="text-zinc-400">Offer Letter (Alex)</span>
                <span className="text-emerald-400 font-bold">GENERATED (v1)</span>
              </div>
              {stats.employees >= 14 && (
                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-white/5 text-[9px] font-mono">
                  <span className="text-zinc-400">Offer Letter (Liam)</span>
                  <span className="text-emerald-400 font-bold">GENERATED (v2)</span>
                </div>
              )}
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-white/5 text-[9px] font-mono">
                <span className="text-zinc-400">Quotation (ABC)</span>
                <span className={stats.salesCount >= 39 ? "text-brand-cyan font-bold" : "text-zinc-500"}>
                  {stats.salesCount >= 39 ? "REVISED (QT-904)" : "COMPILED (v1)"}
                </span>
              </div>
              {documents.quotation?.quoteNo === 'QT-2026-905' && (
                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-white/5 text-[9px] font-mono">
                  <span className="text-zinc-400">Quotation (ABC v2)</span>
                  <span className="text-brand-cyan font-bold">CREATED (QT-905)</span>
                </div>
              )}
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-white/5 text-[9px] font-mono">
                <span className="text-zinc-400">Invoice (ABC Pvt Ltd)</span>
                <span className="text-zinc-500">COMPILED (INV-089)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-white/5 text-[9px] font-mono">
                <span className="text-zinc-400">Monthly Performance Report</span>
                <span className={documents.monthly_report?.revenue === '$764,300' ? 'text-brand-purple font-bold' : 'text-zinc-500'}>
                  {documents.monthly_report?.revenue === '$764,300' ? 'REGENERATED ($764K)' : 'COMPILED ($642K)'}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 h-full flex flex-col justify-between min-h-[300px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Database size={16} className="text-brand-purple animate-pulse" />
            Business Memory Vault
          </h3>
          <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-white/5 text-zinc-400">
            Node Database
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-white/5 mb-4">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'directory' ? 'bg-slate-900 border border-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'preferences' ? 'bg-slate-900 border border-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-slate-900 border border-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Work History
          </button>
        </div>

        {/* Tab Content Display Area */}
        <div className="min-h-[170px]">{renderContent()}</div>
      </div>

      {/* Info indicator */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] text-zinc-500 font-mono">
        <span>Persistent Context State</span>
        <span>Auto-Sync Enabled</span>
      </div>
    </div>
  );
}
