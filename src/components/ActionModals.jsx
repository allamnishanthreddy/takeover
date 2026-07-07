import React, { useState, useEffect } from 'react';
import { X, UserPlus, Calendar, Mail, Send, Check, AlertTriangle, Paperclip, DollarSign, TrendingUp, CheckCircle2, Activity, Briefcase, ArrowUpRight } from 'lucide-react';

// 1. ADD/EDIT EMPLOYEE MODAL
export function EmployeeModal({ isOpen, onClose, employee, onSave, onDelete }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [stipend, setStipend] = useState('$2,500');
  const [startDate, setStartDate] = useState('August 1, 2026');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (employee) {
      setName(employee.name || '');
      setRole(employee.role || '');
      setStipend(employee.stipend || '$2,500');
      setStartDate(employee.startDate || 'August 1, 2026');
      setStatus(employee.status || 'Active');
    } else {
      setName('');
      setRole('');
      setStipend('$2,500');
      setStartDate('August 1, 2026');
      setStatus('Active');
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    onSave({
      id: employee?.id || `emp-${Date.now()}`,
      name,
      role,
      stipend,
      startDate,
      status
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <UserPlus size={16} className="text-brand-purple" />
            {employee ? 'Edit Employee Record' : 'Add Employee Profile'}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Verma"
              className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none p-2.5 rounded-lg text-slate-100 placeholder-zinc-600"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Corporate Role</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Backend Software Engineer"
              className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none p-2.5 rounded-lg text-slate-100 placeholder-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Monthly Stipend</label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="$2,500"
                className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none p-2.5 rounded-lg text-slate-100 placeholder-zinc-600"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Start Date</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="August 1, 2026"
                className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none p-2.5 rounded-lg text-slate-100 placeholder-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1.5 font-mono uppercase text-[9px] tracking-wider">Onboarding Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none p-2.5 rounded-lg text-slate-100"
            >
              <option value="Active">Active Employee</option>
              <option value="Onboarding">Onboarding Queue</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
            {employee ? (
              <button
                type="button"
                onClick={() => onDelete(employee.id)}
                className="px-3 py-2 rounded-lg bg-red-950/20 hover:bg-red-950/50 border border-red-500/20 hover:border-red-500/50 text-red-400 font-semibold cursor-pointer transition-all"
              >
                Delete Profile
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-lg cursor-pointer hover:scale-102 active:scale-98 transition-all"
              >
                {employee ? 'Save Changes' : 'Register Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. MEETING SCHEDULER MODAL FORM
export function MeetingModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('Tomorrow, 3:00 PM - 4:00 PM');
  const [location, setLocation] = useState('Nexus Virtual Core Room 4');
  const [attendee, setAttendee] = useState('Sales Team & Stark (CEO)');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: `m-${Date.now()}`,
      title,
      time,
      location,
      attendee
    });
    setTitle('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Calendar size={16} className="text-brand-cyan" />
            Schedule Corporate Sync
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Sync Subject</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vanguard Alignment Sync"
              className="w-full bg-slate-950 border border-white/10 focus:border-brand-cyan focus:outline-none p-2.5 rounded-lg text-slate-100 placeholder-zinc-600"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Time Slot</label>
            <input
              type="text"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. Tomorrow, 3:00 PM - 4:00 PM"
              className="w-full bg-slate-950 border border-white/10 focus:border-brand-cyan focus:outline-none p-2.5 rounded-lg text-slate-100"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Virtual Room / Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Nexus Virtual Core Room 4"
              className="w-full bg-slate-950 border border-white/10 focus:border-brand-cyan focus:outline-none p-2.5 rounded-lg text-slate-100"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Key Attendees</label>
            <input
              type="text"
              required
              value={attendee}
              onChange={(e) => setAttendee(e.target.value)}
              placeholder="e.g. Vanguard Executive Board & CEO Stark"
              className="w-full bg-slate-950 border border-white/10 focus:border-brand-cyan focus:outline-none p-2.5 rounded-lg text-slate-100"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 border-t border-white/5 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-blue text-white shadow-lg cursor-pointer hover:scale-102 active:scale-98 transition-all font-semibold"
            >
              Book Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. MOCK MAIL DISPATCHER MODAL
export function MailModal({ isOpen, onClose, emailData, onSendSuccess }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (emailData) {
      setTo(emailData.to || 'finance@xyzcorp.com');
      setSubject(emailData.subject || 'Generated Business Documents');
      setBody(emailData.body || 'Hi,\n\nPlease find the attached documents generated by Nexus OS Core.\n\nRegards,\nNexus AI');
    }
    setIsSending(false);
    setProgress(0);
  }, [emailData, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    setIsSending(true);
    setProgress(0);

    // Simulate sending email progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSending(false);
            onSendSuccess({ to, subject, attachment: emailData?.attachmentName });
            onClose();
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleGmailCompose = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
    onSendSuccess({ to, subject, attachment: emailData?.attachmentName });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Mail size={16} className="text-brand-purple" />
            Email Dispatch Gateway
          </h3>
          <button onClick={onClose} disabled={isSending} className="text-zinc-400 hover:text-white cursor-pointer disabled:opacity-30">
            <X size={16} />
          </button>
        </div>

        {/* Sending Loader Overlay */}
        {isSending ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            {/* Flying envelope animation container */}
            <div className="relative w-40 h-20 bg-slate-950/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
              {progress < 100 ? (
                <Mail size={24} className="text-brand-cyan animate-envelope-fly absolute" />
              ) : (
                <Check size={28} className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-full border border-emerald-500/35 relative" />
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-white font-semibold">
                {progress === 100 ? '✓ Delivered Successfully!' : 'Sending Email...'}
              </p>
              <p className="text-xs text-zinc-500 font-mono">Progress: {progress}%</p>
            </div>
            
            <div className="w-64 h-1.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Recipient (To)</label>
              <input
                type="email"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@company.com"
                className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none p-2.5 rounded-lg text-slate-100"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Documents Attached"
                className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none p-2.5 rounded-lg text-slate-100"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-mono uppercase text-[9px] tracking-wider">Message</label>
              <textarea
                required
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none p-2.5 rounded-lg text-slate-100 font-mono text-[11px] leading-relaxed"
              />
            </div>

            {/* Simulated Attachment */}
            {emailData?.attachmentName && (
              <div className="p-3 bg-slate-950/60 border border-brand-purple/20 rounded-xl flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Paperclip size={12} className="text-brand-purple" />
                  <span>{emailData.attachmentName}</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 bg-slate-900 border border-white/5 px-2 py-0.5 rounded uppercase">
                  PDF ATTACHED
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
              <button
                type="button"
                onClick={handleGmailCompose}
                className="px-3 py-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-500/25 hover:border-red-500/50 text-red-400 font-semibold cursor-pointer transition-all flex items-center gap-1.5 text-xs"
                title="Compose and send using your Gmail Web account"
              >
                <span>Compose in Gmail</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-lg cursor-pointer hover:scale-102 active:scale-98 transition-all font-semibold flex items-center gap-1.5"
                >
                  <Send size={12} /> Send Email
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// 4. MOCK WHATSAPP SHARE MODAL
export function WhatsAppModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const phone = data.phone || '919876543210';
  const textMessage = data.message || 'Hello ABC Pvt Ltd, Please find your invoice attached. Regards, Nexus AI';

  const handleShareClick = () => {
    // Generate real WhatsApp API link
    const formattedUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(textMessage)}`;
    window.open(formattedUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            WhatsApp Client Sharing Gateway
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* UI preview */}
        <div className="space-y-4 text-xs">
          <div className="bg-slate-950 p-4 border border-emerald-500/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-1">
              <span className="font-mono text-zinc-500 uppercase text-[9px]">Recipient Phone:</span>
              <strong className="text-white">+{phone}</strong>
            </div>
            
            <div className="bg-emerald-950/15 border border-emerald-500/25 rounded-lg p-3 text-emerald-300 font-mono text-[11px] leading-relaxed relative">
              <span className="text-[8px] uppercase tracking-wider text-emerald-500 block mb-1">Outbox Draft</span>
              <p className="whitespace-pre-wrap">{textMessage}</p>
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 font-mono flex items-start gap-1">
            <AlertTriangle size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Clicking below triggers the official WhatsApp API. For demo evaluations, this launches the chat interface pre-filled with the message template.</span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-white/5 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleShareClick}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 cursor-pointer hover:scale-102 active:scale-98 transition-all font-semibold"
            >
              Dispatch to WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. STATS DETAIL MODAL (NEW)
export function StatsDetailModal({ isOpen, onClose, type, stats = {}, employees = [], meetings = [] }) {
  if (!isOpen) return null;

  const defaultRevenueItems = [
    { client: 'Vanguard Enterprises', service: 'Annual Enterprise SaaS License', value: 150000, date: 'July 2, 2026', status: 'Paid', invoice: 'INV-2026-089' },
    { client: 'ABC Pvt Ltd', service: 'Custom Developer Integrations', value: 7452, date: 'July 7, 2026', status: 'Paid', invoice: 'INV-2026-090' },
    { client: 'Zenith Solutions', service: 'Technical Support Retainer', value: 24000, date: 'June 20, 2026', status: 'Paid', invoice: 'INV-2026-086' },
    { client: 'XYZ Ltd', service: 'Consulting & Setup Hours', value: 4800, date: 'July 5, 2026', status: 'Overdue', invoice: 'INV-2026-088' },
    { client: 'Acme Corp', service: 'Annual Subscription Renewal', value: 18000, date: 'June 15, 2026', status: 'Paid', invoice: 'INV-2026-085' }
  ];

  const defaultSalesDeals = [
    { client: 'Vanguard Enterprises', dealType: 'Enterprise License', amount: 150000, date: 'July 2, 2026', owner: 'Sales Agent v2', status: 'Closed' },
    { client: 'ABC Pvt Ltd', dealType: 'Custom Integration Upgrade', amount: 7452, date: 'July 7, 2026', owner: 'Finance Agent', status: 'Closed' },
    { client: 'Helix Ventures', dealType: 'Multi-Agent Suite Trial', amount: 85000, date: 'In Negotiation', owner: 'CEO Agent', status: 'Negotiating' },
    { client: 'Zenith Solutions', dealType: 'Support Contract Renewal', amount: 24000, date: 'June 20, 2026', owner: 'Sales Agent v1', status: 'Closed' },
    { client: 'Apex Labs', dealType: 'API Integration Plan', amount: 12000, date: 'June 18, 2026', owner: 'Developer Agent', status: 'Closed' }
  ];

  const defaultTasks = [
    { name: 'Dunning notices dispatch', description: 'Review unpaid lists and send overdue payment reminders', priority: 'High', agent: 'Finance', status: 'Queued' },
    { name: 'Interview candidate reviews', description: 'Assess coding tests and structure HR onboarding packages', priority: 'High', agent: 'HR', status: 'In Progress' },
    { name: 'Forecast analytics check', description: 'Run predictive models for August revenue growth curves', priority: 'Medium', agent: 'CEO', status: 'Pending Approval' },
    { name: 'Knowledgebase sync', description: 'Update leaves, rules, and policy guidelines files', priority: 'Low', agent: 'Knowledge', status: 'Completed' }
  ];

  const defaultWorkflows = [
    { name: 'Invoice Generation Pipeline', triggeredBy: 'Finance Agent', runtime: '2.4s', successRate: 100, lastRun: '02:14 PM', status: 'Success' },
    { name: 'CRM Lead Synchronization', triggeredBy: 'Sales Agent', runtime: '4.1s', successRate: 100, lastRun: '11:30 AM', status: 'Success' },
    { name: 'Intern Onboarding Sequence', triggeredBy: 'HR Agent', runtime: '5.8s', successRate: 95, lastRun: '09:15 AM', status: 'Warning' },
    { name: 'Performance Forecast Audit', triggeredBy: 'CEO Agent', runtime: '3.6s', successRate: 100, lastRun: 'Yesterday', status: 'Success' }
  ];

  const renderModalContent = () => {
    switch (type) {
      case 'revenue': {
        const total = stats.revenue || 1850000;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Gross Earnings</span>
                <strong className="text-brand-cyan text-base font-mono">${total.toLocaleString()}</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">YoY Growth</span>
                <strong className="text-emerald-400 text-base font-mono">+18.4%</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Net Profit Margin</span>
                <strong className="text-brand-purple text-base font-mono">71.2%</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-bold font-mono">Revenue Channel Breakdown</span>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-zinc-300">Enterprise SaaS Contracts (75%)</span>
                    <strong className="text-white font-mono">${(total * 0.75).toLocaleString(undefined, {maximumFractionDigits:0})}</strong>
                  </div>
                  <div className="w-full bg-slate-950 border border-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-cyan h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-zinc-300">Custom Developer Integrations (22%)</span>
                    <strong className="text-white font-mono">${(total * 0.22).toLocaleString(undefined, {maximumFractionDigits:0})}</strong>
                  </div>
                  <div className="w-full bg-slate-950 border border-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-purple h-full rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-zinc-300">Professional Advisory Fees (8%)</span>
                    <strong className="text-white font-mono">${(total * 0.08).toLocaleString(undefined, {maximumFractionDigits:0})}</strong>
                  </div>
                  <div className="w-full bg-slate-950 border border-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '8%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-bold font-mono">Recent Billing Invoice Ledger</span>
              <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-xl bg-slate-950/40">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950 text-zinc-500 font-mono text-[9px] uppercase">
                      <th className="p-2.5">Invoice ID</th>
                      <th className="p-2.5">Client Name</th>
                      <th className="p-2.5">Contract Value</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {defaultRevenueItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-2.5 font-mono text-zinc-400">{item.invoice}</td>
                        <td className="p-2.5 font-semibold text-slate-200">{item.client}</td>
                        <td className="p-2.5 font-mono text-brand-cyan">${item.value.toLocaleString()}</td>
                        <td className="p-2.5 text-zinc-500">{item.date}</td>
                        <td className="p-2.5 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono border ${
                            item.status === 'Paid' ? 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400' : 'bg-red-400/10 border-red-400/25 text-red-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'employees': {
        const payrollTotal = employees.reduce((acc, emp) => {
          const val = parseInt(emp.stipend?.replace(/[^0-9]/g, '') || '0', 10);
          return acc + val;
        }, 0);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Registry Pool</span>
                <strong className="text-brand-purple text-base font-mono">{employees.length} Active</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Monthly Payroll Cost</span>
                <strong className="text-brand-cyan text-base font-mono">${payrollTotal.toLocaleString()}/mo</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Onboarding Queue</span>
                <strong className="text-amber-500 text-base font-mono">1 Pending</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-bold font-mono">Staff Directory & Stipend Structures</span>
              <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-xl bg-slate-950/40">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950 text-zinc-500 font-mono text-[9px] uppercase">
                      <th className="p-2.5">Full Name</th>
                      <th className="p-2.5">Corporate Role</th>
                      <th className="p-2.5">Stipend Rate</th>
                      <th className="p-2.5">Start Date</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-2.5 font-semibold text-slate-200">{emp.name}</td>
                        <td className="p-2.5 text-zinc-400 font-mono">{emp.role}</td>
                        <td className="p-2.5 font-mono text-brand-purple">{emp.stipend || '$2,500'}</td>
                        <td className="p-2.5 text-zinc-500">{emp.startDate || 'August 1, 2026'}</td>
                        <td className="p-2.5 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono border ${
                            emp.status === 'Active' ? 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400' : 'bg-amber-400/10 border-amber-400/25 text-amber-400'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'sales': {
        const closedCount = stats.salesCount || 18;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Contracts Closed</span>
                <strong className="text-amber-500 text-base font-mono">{closedCount} Deals</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Target Completion</span>
                <strong className="text-emerald-400 text-base font-mono">105.8%</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Avg Deal Value</span>
                <strong className="text-brand-cyan text-base font-mono">$41,200</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-bold font-mono">Operational Deal Pipeline & Contract Log</span>
              <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-xl bg-slate-950/40">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950 text-zinc-500 font-mono text-[9px] uppercase">
                      <th className="p-2.5">Client Account</th>
                      <th className="p-2.5">Licensing Model</th>
                      <th className="p-2.5">Contract Value</th>
                      <th className="p-2.5">Closer Agent</th>
                      <th className="p-2.5 text-right">Pipeline Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {defaultSalesDeals.map((deal, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-2.5 font-semibold text-slate-200">{deal.client}</td>
                        <td className="p-2.5 text-zinc-400">{deal.dealType}</td>
                        <td className="p-2.5 font-mono text-amber-500">${deal.amount.toLocaleString()}</td>
                        <td className="p-2.5 font-mono text-zinc-500">{deal.owner}</td>
                        <td className="p-2.5 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono border ${
                            deal.status === 'Closed' ? 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400' : 'bg-brand-purple/10 border-brand-purple/25 text-brand-purple'
                          }`}>
                            {deal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'tasks': {
        const totalTasks = stats.pendingTasks || 4;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Pending Tasks</span>
                <strong className="text-pink-500 text-base font-mono">{totalTasks} Operations</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Priority Queue High</span>
                <strong className="text-red-400 text-base font-mono">2</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Worker Utility Avg</span>
                <strong className="text-brand-purple text-base font-mono">96.2%</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-bold font-mono">System Task Log & Priority Allocations</span>
              <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-xl bg-slate-950/40">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950 text-zinc-500 font-mono text-[9px] uppercase">
                      <th className="p-2.5">Task Description</th>
                      <th className="p-2.5">Responsible Agent</th>
                      <th className="p-2.5">Priority</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {defaultTasks.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-2.5">
                          <strong className="text-slate-200 block text-[10px]">{t.name}</strong>
                          <span className="text-zinc-500 text-[9px]">{t.description}</span>
                        </td>
                        <td className="p-2.5 font-mono text-zinc-400">{t.agent} Agent</td>
                        <td className="p-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono border ${
                            t.priority === 'High' ? 'bg-red-400/10 border-red-400/25 text-red-400' : t.priority === 'Medium' ? 'bg-amber-400/10 border-amber-400/25 text-amber-400' : 'bg-zinc-400/10 border-zinc-400/25 text-zinc-400'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <span className="text-[9px] font-mono text-brand-purple">{t.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'meetings': {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Bridges Active</span>
                <strong className="text-blue-500 text-base font-mono">{meetings.length} Syncs</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Zoom Host Core</span>
                <strong className="text-emerald-400 text-base font-mono">Online</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Client Contacts Inbound</span>
                <strong className="text-brand-purple text-base font-mono">3 Scheduled</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-bold font-mono">Today's Scheduled Video Conferences</span>
              <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-xl bg-slate-950/40">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950 text-zinc-500 font-mono text-[9px] uppercase">
                      <th className="p-2.5">Scheduled Sync Time</th>
                      <th className="p-2.5">Topic Agenda</th>
                      <th className="p-2.5">Virtual Link</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {meetings.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-2.5 font-mono font-semibold text-brand-blue">{m.time}</td>
                        <td className="p-2.5 text-slate-200 font-medium">{m.title}</td>
                        <td className="p-2.5">
                          <a
                            href={`https://${m.zoomLink || 'zoom.us/j/nexus-test'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-brand-cyan flex items-center gap-1 font-mono hover:underline cursor-pointer"
                          >
                            {m.zoomLink || 'zoom.us/j/nexus-test'} <ArrowUpRight size={10} />
                          </a>
                        </td>
                        <td className="p-2.5 text-right">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono border bg-blue-500/10 border-blue-500/25 text-blue-400">
                            Active Sync
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'workflows': {
        const rate = stats.successRate || 98.4;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Reliability Rating</span>
                <strong className="text-emerald-400 text-base font-mono">{rate}%</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Average Core Latency</span>
                <strong className="text-brand-cyan text-base font-mono">140ms</strong>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider font-mono">Autonomous Decisioning</span>
                <strong className="text-brand-purple text-base font-mono">Verified OK</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-2 font-bold font-mono">Multi-Agent Workflow Pipelines</span>
              <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-xl bg-slate-950/40">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950 text-zinc-500 font-mono text-[9px] uppercase">
                      <th className="p-2.5">Workflow Pipeline</th>
                      <th className="p-2.5">Trigger Host</th>
                      <th className="p-2.5 font-mono">Latency</th>
                      <th className="p-2.5">Last Run</th>
                      <th className="p-2.5 text-right">Health Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {defaultWorkflows.map((w, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-2.5">
                          <strong className="text-slate-200 block text-[10px]">{w.name}</strong>
                          <span className="text-zinc-500 text-[8px] font-mono">Reliability: {w.successRate}%</span>
                        </td>
                        <td className="p-2.5 text-zinc-400 font-mono">{w.triggeredBy}</td>
                        <td className="p-2.5 font-mono text-zinc-400">{w.runtime}</td>
                        <td className="p-2.5 text-zinc-500">{w.lastRun}</td>
                        <td className="p-2.5 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono border ${
                            w.status === 'Success' ? 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400' : 'bg-amber-400/10 border-amber-400/25 text-amber-400'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    switch (type) {
      case 'revenue': return 'Corporate Financial Ledger Breakdown';
      case 'employees': return 'Active Employee Database Directory';
      case 'sales': return 'Closed Contracts & Pipeline Telemetry';
      case 'tasks': return 'Autonomous Priority Task Queue';
      case 'meetings': return 'Virtual Zoom Calendar Schedules';
      case 'workflows': return 'Agent Workflow Latency & Reliability Logs';
      default: return 'Telemetry Details Panel';
    }
  };

  const getHeaderIcon = () => {
    switch (type) {
      case 'revenue': return <DollarSign size={16} className="text-brand-cyan" />;
      case 'employees': return <Briefcase size={16} className="text-brand-purple" />;
      case 'sales': return <TrendingUp size={16} className="text-amber-500" />;
      case 'tasks': return <Activity size={16} className="text-pink-500" />;
      case 'meetings': return <Calendar size={16} className="text-brand-blue" />;
      case 'workflows': return <CheckCircle2 size={16} className="text-emerald-400" />;
      default: return <Activity size={16} className="text-brand-purple" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in animate-duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
        {/* Header decoration glow lights */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse" />

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-4 z-10">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
            {getHeaderIcon()}
            {getHeaderTitle()}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Core Content */}
        <div className="overflow-y-auto no-scrollbar z-10 flex-grow pr-1">
          {renderModalContent()}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex justify-end border-t border-white/5 pt-4 mt-6 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-zinc-300 cursor-pointer font-semibold text-xs hover:scale-102 transition-all"
          >
            Dismiss Panel
          </button>
        </div>
      </div>
    </div>
  );
}
