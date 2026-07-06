import React, { useState, useEffect } from 'react';
import { X, UserPlus, Calendar, Mail, Send, Check, AlertTriangle, Paperclip } from 'lucide-react';

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
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1">
              <p className="text-sm text-white font-semibold">Encrypting and Dispatching Mail...</p>
              <p className="text-xs text-zinc-500 font-mono">Progress: {progress}%</p>
            </div>
            
            <div className="w-64 h-1.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-purple transition-all duration-200" style={{ width: `${progress}%` }} />
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
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-lg cursor-pointer hover:scale-102 active:scale-98 transition-all font-semibold flex items-center gap-1.5"
              >
                <Send size={12} /> Send Email
              </button>
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
