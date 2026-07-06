import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, Sparkles, User, ChevronRight } from 'lucide-react';

const DEMO_COMMANDS = [
  { text: "Hire a frontend intern", label: "Hire Intern", agent: "HR" },
  { text: "Generate July Sales Report", label: "Sales Report", agent: "CEO" },
  { text: "Schedule client meeting tomorrow at 3 PM", label: "Schedule Meeting", agent: "Sales" },
  { text: "Create quotation for ABC Pvt Ltd", label: "Create Quotation", agent: "Finance" },
  { text: "What is our leave policy?", label: "Leave Policy", agent: "Knowledge" }
];

export default function CommandCenter({ onExecuteCommand, isRunning, chatHistory = [] }) {
  const [command, setCommand] = useState('');
  const chatEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim() || isRunning) return;
    onExecuteCommand(command);
    setCommand('');
  };

  const handleChipClick = (cmdText) => {
    if (isRunning) return;
    onExecuteCommand(cmdText);
  };

  const handleChoiceClick = (choiceText) => {
    if (isRunning) return;
    onExecuteCommand(choiceText);
  };

  // Scroll to bottom when history updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isRunning]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px] h-[520px]">
      {/* Decorative gradient light */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-purple/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-cyan/20 rounded-full blur-3xl" />

      <div>
        {/* Header Info */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-brand-purple animate-ping' : 'bg-brand-cyan'}`} />
            <span className="text-xs font-mono text-cyan-400/80 uppercase tracking-widest flex items-center gap-1.5">
              <Terminal size={12} /> Command Center
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            Nexus AI Core Online
          </span>
        </div>

        {/* Live Chat logs */}
        <div className="h-[270px] overflow-y-auto no-scrollbar pr-1 mb-4 space-y-3">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-3">
                <Sparkles size={16} className="text-brand-purple" />
              </div>
              <p className="text-xs font-semibold text-zinc-400">Welcome to Nexus Autonomous OS</p>
              <p className="text-[11px] text-zinc-500 mt-1 max-w-[280px] leading-relaxed">
                Choose a quick action below or type a command to trigger multi-agent business operations.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {chatHistory.map((chat, idx) => {
                const isUser = chat.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Icon for AI */}
                    {!isUser && (
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                        N
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed flex flex-col gap-1.5 ${
                        isUser
                          ? 'bg-brand-purple/20 border border-brand-purple/35 text-slate-100 rounded-tr-none font-medium'
                          : 'bg-slate-900/90 border border-white/5 text-slate-300 rounded-tl-none'
                      }`}
                    >
                      {/* Meta header for AI */}
                      {!isUser && chat.agent && (
                        <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-wider block">
                          ↳ Orchestrated by {chat.agent.toUpperCase()} Agent
                        </span>
                      )}
                      
                      <p>{chat.text}</p>

                      {/* Interactive choices buttons for Business Memory */}
                      {!isUser && chat.choices && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {chat.choices.map((choice, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => handleChoiceClick(choice.value)}
                              className="px-2.5 py-1 rounded bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/35 text-brand-cyan font-mono text-[9px] cursor-pointer transition-all active:scale-95 hover:scale-102"
                            >
                              {choice.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Icon for User */}
                    {isUser && (
                      <div className="w-6 h-6 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 text-zinc-400">
                        <User size={12} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loader placeholder while workflow runs */}
              {isRunning && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-6 h-6 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 text-zinc-500 rounded-2xl rounded-tl-none p-3 text-xs leading-relaxed italic animate-pulse">
                    Orchestrating agent workflow parameters...
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input controls & suggestion chips */}
      <div className="mt-auto">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={isRunning}
              placeholder={isRunning ? "AI Core is executing agent path..." : "Type instructions (e.g. 'Hire a frontend intern')..."}
              className="w-full bg-slate-950/80 border border-white/10 hover:border-brand-purple/40 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan text-slate-100 placeholder-zinc-500 pl-4 pr-14 py-3.5 rounded-xl text-xs transition-all shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!command.trim() || isRunning}
              className="absolute right-2 p-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-lg shadow-brand-purple/10 hover:shadow-brand-purple/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Send size={14} />
            </button>
          </div>
        </form>

        {/* Demo Suggestion Chips */}
        <div className="mt-4">
          <div className="flex items-center gap-1 text-[10px] text-zinc-400 mb-1.5 font-medium">
            <Sparkles size={10} className="text-brand-purple animate-pulse" />
            <span>Interactive Demo Flows:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_COMMANDS.map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(cmd.text)}
                disabled={isRunning}
                className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-brand-purple/30 text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 font-mono"
              >
                <ChevronRight size={10} className="text-brand-cyan" />
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
