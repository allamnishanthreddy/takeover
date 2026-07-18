import { Calendar as CalendarIcon, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarScheduler({ meetings = [], onAddMeeting }) {
  // Static list of calendar dates representing this week
  const daysOfWeek = [
    { name: 'Mon', date: '6', hasMeeting: false, isToday: true },
    { name: 'Tue', date: '7', hasMeeting: true, isToday: false },
    { name: 'Wed', date: '8', hasMeeting: false, isToday: false },
    { name: 'Thu', date: '9', hasMeeting: true, isToday: false },
    { name: 'Fri', date: '10', hasMeeting: false, isToday: false },
    { name: 'Sat', date: '11', hasMeeting: false, isToday: false },
    { name: 'Sun', date: '12', hasMeeting: false, isToday: false },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <CalendarIcon size={16} className="text-brand-cyan" />
            Meeting Scheduler & Calendar
          </h3>
          <div className="flex gap-2 items-center">
            <button
              onClick={onAddMeeting}
              className="text-[9px] font-mono bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/20 text-brand-cyan px-2 py-1 rounded-xl cursor-pointer transition-all active:scale-95"
            >
              + Book Meeting
            </button>
            <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-white/5 text-zinc-400">
              July 2026
            </span>
          </div>
        </div>

        {/* Horizontal Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center mb-5">
          {daysOfWeek.map((day, index) => {
            // Check if this date has any scheduled meeting in the current state
            // If the date is '7' (Tuesday/Tomorrow) and we scheduled a meeting tomorrow, it highlights it.
            const dateHasMeeting = day.hasMeeting || (day.date === '7' && meetings.length > 0);

            return (
              <div
                key={index}
                className={`py-2.5 rounded-xl border flex flex-col items-center transition-all ${
                  day.isToday
                    ? 'bg-brand-purple/15 border-brand-purple/40 text-white'
                    : dateHasMeeting
                    ? 'bg-slate-900 border-brand-cyan/25'
                    : 'bg-slate-950/20 border-white/5'
                }`}
              >
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">{day.name}</span>
                <span className={`text-xs font-mono font-semibold mt-1 ${day.isToday ? 'text-brand-purple' : dateHasMeeting ? 'text-brand-cyan' : 'text-zinc-400'}`}>
                  {day.date}
                </span>
                
                {/* Meeting Glow Bullet */}
                {dateHasMeeting && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* List of Meetings */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Upcoming Events</h4>
          
          <AnimatePresence initial={false}>
            {meetings.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 border border-dashed border-white/5 rounded-xl text-xs">
                No client engagements scheduled.
              </div>
            ) : (
              meetings.map((meeting) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-brand-cyan/20 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">{meeting.title}</span>
                      <span className="text-[9px] font-mono bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 px-1.5 rounded">
                        CONFIRMED
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock size={10} className="text-brand-purple" />
                        {meeting.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={10} className="text-zinc-500" />
                        {meeting.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={10} className="text-zinc-500" />
                        {meeting.attendee}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-zinc-500 flex-shrink-0" />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info indicator */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] text-zinc-500 font-mono">
        <span>Integrated with Google Calendar</span>
        <span>Timezone: IST (GMT+5:30)</span>
      </div>
    </div>
  );
}
