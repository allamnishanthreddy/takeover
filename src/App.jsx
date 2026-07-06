import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Users,
  DollarSign,
  TrendingUp,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Bell,
  Activity,
  ChevronRight,
  Shield,
  HelpCircle,
  FileText,
  Search,
  CheckCircle2,
  Trash2,
  Moon,
  Info,
  Presentation,
  Play,
  Check
} from 'lucide-react';

// Import our custom visual components
import CommandCenter from './components/CommandCenter';
import AgentGrid from './components/AgentGrid';
import WorkflowTimeline from './components/WorkflowTimeline';
import DocPreviewer from './components/DocPreviewer';
import AnalyticsPanel from './components/AnalyticsPanel';
import CalendarScheduler from './components/CalendarScheduler';
import MemoryVault from './components/MemoryVault';
import { EmployeeModal, MeetingModal, MailModal, WhatsAppModal } from './components/ActionModals';
import TimeMachine from './components/TimeMachine';

// Default Document Template Payloads
const DEFAULT_DOCUMENTS = {
  offer_letter: {
    company: 'NEXUS AI SYSTEMS INC.',
    date: 'July 6, 2026',
    name: 'Alex Rivera',
    role: 'Frontend Engineering Intern',
    salary: '$2,500',
    startDate: 'August 1, 2026',
    location: 'Remote (SF HQ Core)',
    expiryDate: 'July 15, 2026'
  },
  invoice: {
    company: 'NEXUS AI SYSTEMS INC.',
    invoiceNo: 'INV-2026-089',
    client: 'ABC Pvt Ltd',
    clientAddress: 'Tech Park Hub, Block B, Bangalore',
    date: 'July 6, 2026',
    dueDate: 'August 6, 2026',
    items: [
      { desc: 'Enterprise SaaS Core License (Tier 3)', qty: 1, rate: 4500, total: 4500 },
      { desc: 'Custom AI Agent Integration Services', qty: 20, rate: 120, total: 2400 }
    ],
    subtotal: 6900,
    tax: 552,
    total: 7452
  },
  quotation: {
    company: 'NEXUS AI SYSTEMS INC.',
    quoteNo: 'QT-2026-904',
    client: 'XYZ Ltd',
    clientLocation: 'Global Tech Park, London',
    date: 'July 6, 2026',
    expiryDate: 'August 6, 2026',
    items: [
      { desc: 'Nexus Business OS - Enterprise Node licenses', qty: 10, rate: 12000, total: 120000 },
      { desc: 'Dedicated 24/7 Agent SLA Support Agreement', qty: 1, rate: 15000, total: 15000 }
    ],
    gross: 135000,
    discount: 13500,
    total: 121500
  },
  meeting_minutes: {
    title: 'Vanguard Alignment Sync',
    date: 'July 7, 2026',
    time: '3:00 PM - 4:00 PM',
    attendees: 'Jonathan Stark (CEO), Alex Rivera (HR), Vanguard Executives',
    facilitator: 'Sales Agent Core',
    agenda: [
      'Reviewed Q3 enterprise software rollout requirements.',
      'Evaluated custom knowledge base integrations with client CRM.',
      'Discussed developer support SLA hours and pricing metrics.'
    ],
    actions: [
      'Sales Agent to compile custom proposal before Tuesday.',
      'Finance Agent to verify volume discount margins.',
      'HR Agent to reserve engineer slot for sandbox setup.'
    ]
  },
  monthly_report: {
    title: 'July Q2 Performance Audit',
    period: 'June 2026 / Q2 Wrapup',
    revenue: '$642,800',
    utility: '94.2%',
    dealsClosed: '38',
    growthRate: '14.2%'
  }
};

// Initial Meeting List
const INITIAL_MEETINGS = [
  {
    id: 'm-1',
    title: 'Daily Standup Sync',
    time: 'Today, 10:00 AM - 10:30 AM',
    location: 'Main Huddle Room (Virtual)',
    attendee: 'All Agents & Teams'
  },
  {
    id: 'm-2',
    title: 'Budget Allocation Review',
    time: 'Today, 2:00 PM - 2:45 PM',
    location: 'Executive Boardroom',
    attendee: 'CEO Stark & Finance Agent'
  }
];

// Initial Activity logs
const INITIAL_ACTIVITIES = [
  { time: '09:15', desc: 'HR Agent created job posting for Frontend Intern', category: 'hr' },
  { time: '09:16', desc: 'Finance Agent approved hiring budget allocation', category: 'finance' },
  { time: '09:17', desc: 'Offer Letter generated and saved to Drafts', category: 'hr' },
  { time: '09:18', desc: 'Google Calendar slots synchronised successfully', category: 'sales' },
  { time: '09:19', desc: 'Sales pipeline reports pushed to Executive team', category: 'ceo' }
];

export default function App() {
  // Core dashboard metrics state
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('nexus_stats');
    return saved ? JSON.parse(saved) : {
      revenue: 1850000,
      employees: 12,
      salesCount: 38,
      pendingTasks: 5,
      meetingsToday: 2,
      activeWorkflows: 0,
      successRate: 98.4
    };
  });

  // Flashing indicator flags to draw the judge's eyes to stats changes
  const [flashingStats, setFlashingStats] = useState({
    revenue: false,
    employees: false,
    salesCount: false,
    pendingTasks: false,
    meetingsToday: false,
    successRate: false
  });

  // Employees directory database state
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('nexus_employees');
    return saved ? JSON.parse(saved) : [
      { id: 'emp-1', name: 'Jonathan Stark', role: 'Chief Executive Officer', stipend: '$15,000', startDate: 'June 1, 2026', status: 'Active' },
      { id: 'emp-2', name: 'Sarah Connor', role: 'Head of Finance', stipend: '$10,000', startDate: 'June 15, 2026', status: 'Active' },
      { id: 'emp-3', name: 'Alex Rivera', role: 'Frontend Engineering Intern', stipend: '$2,500', startDate: 'July 6, 2026', status: 'Active' }
    ];
  });

  // Chat Conversation logs
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('nexus_chat_history');
    return saved ? JSON.parse(saved) : [
      {
        sender: 'ai',
        text: 'Greetings. I am Nexus Core, your corporate AI operations console. I coordinate CEO, HR, Finance, Sales, and Knowledge agents autonomously. Enter an instruction below to execute business workflows.',
        timestamp: '10:00',
        agent: 'ceo'
      }
    ];
  });

  // Calendar meetings
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('nexus_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  // Document templates state
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('nexus_documents');
    return saved ? JSON.parse(saved) : DEFAULT_DOCUMENTS;
  });
  const [activeDocKey, setActiveDocKey] = useState('monthly_report');

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('nexus_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'System Core boot completed successfully.', type: 'info', time: '10m ago' },
      { id: 2, text: 'HR database synchronized with standard local policies.', type: 'success', time: '15m ago' }
    ];
  });
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Workflow timeline orchestration states
  const [workflow, setWorkflow] = useState({
    isRunning: false,
    steps: [],
    activeStepIndex: -1,
    statusText: '',
    command: ''
  });

  // Activity Feed
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('nexus_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Active AI Agents highlights
  const [activeAgents, setActiveAgents] = useState([]);

  // Business Memory: Pending decision state
  const [pendingMemoryAction, setPendingMemoryAction] = useState(null);

  // Modal displays toggle states
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailData, setMailData] = useState(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppData, setWhatsAppData] = useState(null);
  const [showTimeMachine, setShowTimeMachine] = useState(false);

  // AI Cognitive Rationale Explanation State
  const [workflowReasoning, setWorkflowReasoning] = useState(null);

  // Global search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Chained operations queue state
  const [postWorkflowChain, setPostWorkflowChain] = useState(null);

  // Floating Presenter Panel
  const [showPresenter, setShowPresenter] = useState(true);
  const [presenterHighlightText, setPresenterHighlightText] = useState("Tip: Click 'Run' next to any demo scenario in this panel to trigger the workflow. Watch the timeline animate and the highlighted metric cards glow when completed!");

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('nexus_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('nexus_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('nexus_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('nexus_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('nexus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nexus_activities', JSON.stringify(activities));
  }, [activities]);

  // Centralized Chained Workflow Event Trigger
  useEffect(() => {
    if (!workflow.isRunning && postWorkflowChain) {
      const timer = setTimeout(() => {
        if (postWorkflowChain.action === 'email') {
          const docType = activeDocKey;
          const attachmentName = `${docType.toUpperCase()}_${Date.now()}.pdf`;
          
          setMailData({
            to: postWorkflowChain.to,
            subject: `Automated Dispatch: ${docType.replace('_', ' ').toUpperCase()}`,
            body: `Hi ${postWorkflowChain.recipientName},\n\nPlease find the attached files compiled dynamically by the Nexus AI Core scheduler.\n\nRegards,\nNexus OS Core`,
            attachmentName
          });
          setShowMailModal(true);
        }
        setPostWorkflowChain(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [workflow.isRunning, postWorkflowChain, activeDocKey]);

  // Helper to flash a stat card
  const flashStatCard = (key) => {
    setFlashingStats((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setFlashingStats((prev) => ({ ...prev, [key]: false }));
    }, 4500);
  };

  // Helper to add notification toast + list item
  const pushNotification = (text, type = 'info') => {
    const id = Date.now();
    const newNotif = { id, text, type, time: 'Just now' };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Helper to prepend to activity log
  const pushActivity = (desc, category = 'system') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setActivities((prev) => [{ time, desc, category }, ...prev]);
  };

  // EMPLOYEE CRUD ACTION HANDLERS
  const handleSaveEmployee = (emp) => {
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === emp.id);
      let updated;
      if (exists) {
        updated = prev.map((e) => e.id === emp.id ? emp : e);
        pushActivity(`Employee profile updated: ${emp.name}`, 'hr');
        pushNotification(`Updated profile for ${emp.name}`, 'info');
      } else {
        updated = [...prev, emp];
        pushActivity(`New employee onboarded: ${emp.name}`, 'hr');
        pushNotification(`Registered profile for ${emp.name}`, 'success');
      }
      setStats((s) => ({ ...s, employees: updated.length }));
      flashStatCard('employees');
      return updated;
    });
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (empId) => {
    setEmployees((prev) => {
      const target = prev.find((e) => e.id === empId);
      const updated = prev.filter((e) => e.id !== empId);
      if (target) {
        pushActivity(`Employee profile deleted: ${target.name}`, 'hr');
        pushNotification(`Deleted profile for ${target.name}`, 'info');
      }
      setStats((s) => ({ ...s, employees: updated.length }));
      flashStatCard('employees');
      return updated;
    });
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
  };

  const handleExportEmployeesCSV = () => {
    let csvContent = "ID,Name,Role,Monthly Stipend,Start Date,Status\n" + 
      employees.map(emp => `"${emp.id}","${emp.name}","${emp.role}","${emp.stipend}","${emp.startDate}","${emp.status}"`).join("\n");
      
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `EmployeeList_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    pushNotification("Exported Employee Directory to CSV!", "success");
    pushActivity("Exported Employee Directory list to CSV", "hr");
  };

  // MEETING BOOKING HANDLER
  const handleSaveMeeting = (meeting) => {
    setMeetings((prev) => [meeting, ...prev]);
    setStats((prev) => ({ ...prev, meetingsToday: prev.meetingsToday + 1 }));
    flashStatCard('meetingsToday');
    pushActivity(`Meeting booked: ${meeting.title} (${meeting.time})`, 'sales');
    pushNotification(`Meeting scheduled: ${meeting.title}`, 'success');
    setShowMeetingModal(false);
  };

  // EMAIL GATEWAY INTEGRATION HANDLERS
  const handleOpenMailModal = (docKey, docData) => {
    let recipient = 'finance@abc-corp.com';
    let subjectLine = `Nexus AI Document Delivery: ${docKey.toUpperCase()}`;
    
    if (docKey === 'offer_letter') {
      recipient = 'alex.rivera@interns.nexus.com';
      subjectLine = 'Nexus AI Onboarding: Internship Contract';
    } else if (docKey === 'quotation') {
      recipient = 'procurement@xyzcorp.com';
      subjectLine = 'Revised Proposal Quote QT-2026-904';
    }

    const attachmentName = `${docKey.toUpperCase()}_${Date.now()}.pdf`;
    setMailData({
      to: recipient,
      subject: subjectLine,
      body: `Hello,\n\nPlease find the attached ${docKey.replace('_', ' ')} generated dynamically by the Nexus AI Core Operating System.\n\nRegards,\nNexus AI`,
      attachmentName
    });
    setShowMailModal(true);
  };

  const handleSendMailSuccess = (data) => {
    pushActivity(`Email dispatched: ${data.attachmentName} sent to ${data.to}`, 'finance');
    pushNotification(`Document emailed to ${data.to}`, 'success');
  };

  // WHATSAPP INTEGRATION HANDLER
  const handleOpenWhatsAppModal = (docKey, docData) => {
    let clientName = docData.client || docData.name || 'ABC Pvt Ltd';
    setWhatsAppData({
      phone: '919876543210',
      message: `Hello ${clientName},\n\nPlease find your generated ${docKey.replace('_', ' ').toUpperCase()} details attached.\n\nRegards,\nNexus AI`
    });
    setShowWhatsAppModal(true);
  };

  // BUSINESS TIME MACHINE RESTORE HANDLER
  const handleReopenItem = (key, rawData, title) => {
    if (key === 'command_chat') {
      pushNotification(`Focused Chat command: "${rawData.text}"`, 'info');
    } else if (key === 'workflow_log') {
      pushNotification(`Inspecting workflow telemetry log: "${rawData.desc}"`, 'info');
    } else {
      setActiveDocKey(key);
      pushNotification(`Restored document node view: ${title}`, 'success');
    }
    pushActivity(`Time Machine: Restored workspace state of ${title}`, 'system');
    setShowTimeMachine(false);
  };

  // GLOBAL SEARCH RENDER METHOD
  const renderSearchResults = () => {
    const query = searchQuery.toLowerCase().trim();
    const results = [];

    // Filter Employees
    employees.forEach(emp => {
      if (emp.name.toLowerCase().includes(query) || emp.role.toLowerCase().includes(query)) {
        results.push({
          type: 'Employee',
          title: emp.name,
          subtitle: emp.role,
          action: () => {
            setSelectedEmployee(emp);
            setShowEmployeeModal(true);
            setSearchQuery('');
          }
        });
      }
    });

    // Filter Documents
    Object.keys(documents).forEach(key => {
      const doc = documents[key];
      const docTitle = doc.title || doc.invoiceNo || doc.quoteNo || doc.name || key;
      if (docTitle.toLowerCase().includes(query) || key.toLowerCase().includes(query)) {
        results.push({
          type: 'Document',
          title: `File: ${docTitle}`,
          subtitle: `Type: ${key.replace('_', ' ').toUpperCase()}`,
          action: () => {
            setActiveDocKey(key);
            setSearchQuery('');
            pushNotification(`Opened document node: ${docTitle}`);
          }
        });
      }
    });

    // Filter Meetings
    meetings.forEach(m => {
      if (m.title.toLowerCase().includes(query) || m.attendee.toLowerCase().includes(query)) {
        results.push({
          type: 'Meeting',
          title: m.title,
          subtitle: `${m.time} | ${m.location}`,
          action: () => {
            pushNotification(`Meeting info: ${m.title}`);
            setSearchQuery('');
          }
        });
      }
    });

    if (results.length === 0) {
      return (
        <div className="text-center py-4 text-zinc-500 font-mono text-[10px]">
          No matching records.
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        {results.map((res, i) => (
          <div
            key={i}
            onClick={res.action}
            className="p-2 bg-slate-950/60 hover:bg-slate-950 hover:border-brand-purple/35 border border-white/5 rounded-xl cursor-pointer transition-all flex justify-between items-center text-[10px]"
          >
            <div>
              <span className="text-slate-200 font-medium block leading-normal">{res.title}</span>
              <span className="text-zinc-500 text-[9px] block font-mono mt-0.5">{res.subtitle}</span>
            </div>
            <span className="text-[8px] font-mono text-zinc-500 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded uppercase">
              {res.type}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // BUSINESS MEMORY EXECUTION: UPDATE
  const executeMemoryUpdate = (action) => {
    if (action.type === 'quotation') {
      const steps = [
        { title: 'CEO Agent retrieves Quote QT-2026-904', agent: 'ceo', description: 'Querying historical document repositories for ABC Pvt Ltd...' },
        { title: 'Finance Agent computes rate modifications', agent: 'finance', description: 'Applying revised volume pricing metrics...' },
        { title: 'Sales Agent updates active CRM proposal status', agent: 'sales', description: 'Tagging record status as "[REVISED]"...' }
      ];
      setWorkflowReasoning({
        title: "Quotation Revision Rationale",
        rationale: "Retrieved previous Quote QT-2026-904 from database memory.\n\nChecked client preferences and updated line-item counts to 12. Recalculated subtotal using revised volumes, applying a standard 10% discount. Gross value is adjusted to $158,333 with a net offering of $142,500."
      });
      setWorkflow({
        isRunning: true,
        steps,
        activeStepIndex: 0,
        statusText: 'CEO Agent fetching previous Quotation file...',
        command: 'Update Existing'
      });
      setActiveAgents(['ceo']);

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setWorkflow((prev) => ({
            ...prev,
            activeStepIndex: currentStep,
            statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
          }));
          setActiveAgents([steps[currentStep].agent]);
        } else {
          clearInterval(interval);
          setDocuments((prev) => ({
            ...prev,
            quotation: {
              ...prev.quotation,
              client: 'ABC Pvt Ltd (REVISED)',
              total: 142500,
              items: [
                { desc: 'Nexus Business OS - Enterprise Node licenses', qty: 12, rate: 12000, total: 144000 },
                { desc: 'Dedicated 24/7 Agent SLA Support Agreement', qty: 1, rate: 15000, total: 15000 }
              ],
              gross: 159000,
              discount: 16500,
              date: 'July 6, 2026 (Updated)'
            }
          }));
          setActiveDocKey('quotation');
          flashStatCard('salesCount');

          pushActivity('Quotation QT-2026-904 updated to REVISED status', 'finance');
          pushNotification('Quotation updated successfully.', 'success');

          setChatHistory((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: 'Existing Quotation for ABC Pvt Ltd revised! Standard package licensing quantity updated to 12. Net quote value recalculated to $142,500. View updated quotation in the document panel.',
              timestamp: 'Just now',
              agent: 'finance'
            }
          ]);

          setPresenterHighlightText("✅ Memory resolved: Existing Quotation updated to [REVISED] state with increased quantities ($142,500).");
          setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
          setActiveAgents([]);
        }
      }, 1100);
    } else if (action.type === 'intern') {
      setActiveDocKey('offer_letter');
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Opening Alex Rivera's Frontend Engineering Intern offer contract for review in the Document Panel.",
          timestamp: 'Just now',
          agent: 'hr'
        }
      ]);
    } else if (action.type === 'meeting') {
      const steps = [
        { title: 'CEO Agent searches calendar database', agent: 'ceo', description: 'Checking Vanguard huddle details...' },
        { title: 'HR Agent reschedules slots', agent: 'hr', description: 'Moving slot to Tomorrow, 5:00 PM...' }
      ];
      setWorkflowReasoning({
        title: "Rescheduling Request Rationale",
        rationale: "Detected scheduling conflict in database memory for Vanguard Enterprises Sync.\n\nScanned available time slots on Tomorrow calendar agenda. Rescheduled to 5:00 PM next open slot, avoiding the 3:00 PM conflict. Notified CEO and HR agents."
      });
      setWorkflow({
        isRunning: true,
        steps,
        activeStepIndex: 0,
        statusText: 'CEO Agent querying scheduled items...',
        command: 'Reschedule Sync'
      });
      setActiveAgents(['ceo']);

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setWorkflow((prev) => ({
            ...prev,
            activeStepIndex: currentStep,
            statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
          }));
          setActiveAgents([steps[currentStep].agent]);
        } else {
          clearInterval(interval);
          setMeetings((prev) => prev.map(m => m.title.includes('Vanguard') ? { ...m, time: 'Tomorrow, 5:00 PM - 6:00 PM' } : m));
          flashStatCard('meetingsToday');
          pushActivity('Meeting Vanguard Sync rescheduled to 5:00 PM', 'hr');

          setChatHistory((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: 'Vanguard alignment meeting rescheduled successfully to Tomorrow, 5:00 PM - 6:00 PM. Calendar agendas updated.',
              timestamp: 'Just now',
              agent: 'hr'
            }
          ]);

          setPresenterHighlightText("✅ Memory resolved: Vanguard Sync rescheduled to 5:00 PM.");
          setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
          setActiveAgents([]);
        }
      }, 1100);
    }
  };

  // BUSINESS MEMORY EXECUTION: CREATE NEW
  const executeMemoryNew = (action) => {
    if (action.type === 'quotation') {
      const steps = [
        { title: 'CEO Agent initializes Quote QT-2026-905', agent: 'ceo', description: 'Starting fresh proposal draft payload...' },
        { title: 'Finance Agent runs base licensing calculations', agent: 'finance', description: 'Budgeting 15x Enterprise Licenses ($180,000)...' },
        { title: 'Sales Agent appends separate deal record', agent: 'sales', description: 'Pushing Quote v2 node to CRM pipeline...' }
      ];
      setWorkflowReasoning({
        title: "Secondary Proposal Rationale",
        rationale: "Instructed to create a new quotation version instead of modifying Quote QT-2026-904.\n\nCalculated 15x Enterprise Licenses ($180,000 gross). Applied standard volume discount of 10% ($18,000). Registered new unique invoice reference QT-2026-905 in database CRM."
      });
      setWorkflow({
        isRunning: true,
        steps,
        activeStepIndex: 0,
        statusText: 'CEO Agent drafting new proposal sequence...',
        command: 'Create New'
      });
      setActiveAgents(['ceo']);

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setWorkflow((prev) => ({
            ...prev,
            activeStepIndex: currentStep,
            statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
          }));
          setActiveAgents([steps[currentStep].agent]);
        } else {
          clearInterval(interval);
          setStats(prev => ({ ...prev, salesCount: prev.salesCount + 1 }));
          setDocuments((prev) => ({
            ...prev,
            quotation: {
              ...prev.quotation,
              quoteNo: 'QT-2026-905',
              client: 'ABC Pvt Ltd (v2)',
              total: 162000,
              items: [
                { desc: 'Nexus Business OS - Enterprise Node licenses', qty: 15, rate: 12000, total: 180000 },
                { desc: 'Dedicated 24/7 Agent SLA Support Agreement', qty: 1, rate: 15000, total: 15000 }
              ],
              gross: 195000,
              discount: 18000,
              date: 'July 6, 2026'
            }
          }));
          setActiveDocKey('quotation');
          flashStatCard('salesCount');

          pushActivity('New Quotation QT-2026-905 created for ABC Pvt Ltd', 'finance');
          pushNotification('New Quotation generated.', 'success');

          setChatHistory((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: 'New Quotation v2 generated (Quote #QT-2026-905) for ABC Pvt Ltd. Total proposal price set at $162,000. Look at the Quotation tab inside the Document Generator.',
              timestamp: 'Just now',
              agent: 'finance'
            }
          ]);

          setPresenterHighlightText("✅ Memory resolved: Created separate Quotation v2 ($162,000). Sales Deal count updated.");
          setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
          setActiveAgents([]);
        }
      }, 1100);
    } else if (action.type === 'intern') {
      const steps = [
        { title: 'CEO Agent registers secondary intern intake', agent: 'ceo', description: 'Confirming software capacity...' },
        { title: 'HR Agent drafts agreement for Liam Patel', agent: 'hr', description: 'Generating Frontend Intern spec...' },
        { title: 'Finance Agent checks stipend budget', agent: 'finance', description: 'Approving monthly allowance of $2,500/mo...' }
      ];
      setWorkflowReasoning({
        title: "Secondary Recruitment Intake Rationale",
        rationale: "Instructed to hire a second frontend intern instead of reviewing Alex's contract.\n\nHR Agent drafted contract for Liam Patel. Checked payroll budget limitations ($2,500 stipend approved by Finance). Updated database active employee count to 14."
      });
      setWorkflow({
        isRunning: true,
        steps,
        activeStepIndex: 0,
        statusText: 'CEO Agent initializing intern spec...',
        command: 'Hire Liam'
      });
      setActiveAgents(['ceo']);

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setWorkflow((prev) => ({
            ...prev,
            activeStepIndex: currentStep,
            statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
          }));
          setActiveAgents([steps[currentStep].agent]);
        } else {
          clearInterval(interval);
          setStats(prev => ({ ...prev, employees: prev.employees + 1 }));
          setDocuments((prev) => ({
            ...prev,
            offer_letter: {
              ...prev.offer_letter,
              name: 'Liam Patel',
              role: 'Frontend Engineering Intern (Version 2)',
              date: 'July 6, 2026'
            }
          }));
          setActiveDocKey('offer_letter');
          flashStatCard('employees');

          pushActivity('Frontend Intern position created for Liam Patel', 'hr');
          pushNotification('Second Offer letter generated.', 'success');

          setChatHistory((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: "Second Frontend Intern (Liam Patel) onboarded successfully. Offer letter details loaded in the Offer Letter panel. Employees directory updated to 14.",
              timestamp: 'Just now',
              agent: 'hr'
            }
          ]);

          setPresenterHighlightText("✅ Memory resolved: Second Frontend Intern (Liam Patel) successfully onboarded.");
          setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
          setActiveAgents([]);
        }
      }, 1100);
    } else if (action.type === 'meeting') {
      const steps = [
        { title: 'Sales Agent maps secondary meeting node', agent: 'sales', description: 'Creating contact calendar linkage...' },
        { title: 'HR Agent adds calendar booking', agent: 'hr', description: 'Setting slot to Wednesday, 11:00 AM...' }
      ];
      setWorkflowReasoning({
        title: "Additional Meeting Scheduler Rationale",
        rationale: "Instructed to schedule a second sync instead of rescheduling the first one.\n\nHR Agent mapped Wednesday 11:00 AM slot. Created calendar invite link. Logged activity in sales and marketing databases."
      });
      setWorkflow({
        isRunning: true,
        steps,
        activeStepIndex: 0,
        statusText: 'Sales Agent mapping meeting...',
        command: 'Add Huddle'
      });
      setActiveAgents(['sales']);

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
          setWorkflow((prev) => ({
            ...prev,
            activeStepIndex: currentStep,
            statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
          }));
          setActiveAgents([steps[currentStep].agent]);
        } else {
          clearInterval(interval);
          const newMeeting = {
            id: `m-${Date.now()}`,
            title: 'Vanguard Follow-up Huddle',
            time: 'Wednesday, July 8, 11:00 AM - 11:30 AM',
            location: 'Nexus Virtual Core Room 2',
            attendee: 'Sales Team & Vanguard'
          };
          setMeetings(prev => [newMeeting, ...prev]);
          setStats(prev => ({ ...prev, meetingsToday: prev.meetingsToday + 1 }));
          flashStatCard('meetingsToday');
          pushActivity('Second meeting scheduled: Vanguard Follow-up Huddle', 'sales');

          setChatHistory((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: 'Secondary alignment sync scheduled successfully for Wednesday, July 8, 11:00 AM. Added to agenda.',
              timestamp: 'Just now',
              agent: 'sales'
            }
          ]);

          setPresenterHighlightText("✅ Memory resolved: Added separate Follow-up Huddle for Vanguard.");
          setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
          setActiveAgents([]);
        }
      }, 1100);
    }
  };

  // Central Command Router (NLP intent detector & dispatcher)
  const handleExecuteCommand = (commandText) => {
    if (workflow.isRunning) return;

    const trimmedCmd = commandText.trim();
    let lowerCmd = trimmedCmd.toLowerCase();

    // INTERCEPT: If there is an active memory confirmation being resolved
    if (pendingMemoryAction) {
      if (trimmedCmd === 'update') {
        executeMemoryUpdate(pendingMemoryAction);
        setPendingMemoryAction(null);
        return;
      }
      if (trimmedCmd === 'new') {
        executeMemoryNew(pendingMemoryAction);
        setPendingMemoryAction(null);
        return;
      }
      // If user typed anything else, reset memory action and run it normally
      setPendingMemoryAction(null);
    }

    // MULTI-ACTION COMMAND CHAINING: e.g. "Generate July Sales Report and email it to Sarah Connor"
    let nextChain = null;
    if (lowerCmd.includes(' and email it to ') || lowerCmd.includes(' and mail it to ') || lowerCmd.includes(' and send it to ')) {
      const splitTerm = lowerCmd.includes(' and email it to ') 
        ? ' and email it to ' 
        : lowerCmd.includes(' and mail it to ') 
        ? ' and mail it to ' 
        : ' and send it to ';
        
      const parts = lowerCmd.split(splitTerm);
      lowerCmd = parts[0]; // execute primary action text
      
      const recipientName = parts[1]?.trim() || 'sarah';
      let recipientEmail = 'sarah.connor@nexus.com';
      if (recipientName.includes('finance') || recipientName.includes('sarah')) recipientEmail = 'sarah.connor@nexus.com';
      if (recipientName.includes('manager')) recipientEmail = 'finance.manager@nexus.com';
      if (recipientName.includes('abc') || recipientName.includes('client')) recipientEmail = 'procurement@abc-corp.com';
      
      nextChain = {
        action: 'email',
        to: recipientEmail,
        recipientName: recipientName.charAt(0).toUpperCase() + recipientName.slice(1)
      };
      setPostWorkflowChain(nextChain);
      pushNotification(`Queued automated email delivery to ${recipientName}`);
    }

    // Add command to chat log
    setChatHistory((prev) => [...prev, { sender: 'user', text: commandText, timestamp: 'Now' }]);
    pushActivity(`Executing user instruction: "${commandText}"`, 'user');

    // 6. INTENT: Generate invoice
    if (lowerCmd.includes('invoice') || lowerCmd.includes('bill')) {
      triggerInvoiceWorkflow(commandText);
    }
    // 1. INTENT: Quotation for ABC
    else if (lowerCmd.includes('quotation') || lowerCmd.includes('quote')) {
      // Memory check: Have we generated a quote previously?
      // Default initial salesCount is 38. If it's already higher than 38, we have generated one!
      if (stats.salesCount > 38) {
        setPendingMemoryAction({ type: 'quotation', entity: 'ABC Pvt Ltd' });
        setPresenterHighlightText("Business Memory triggered: AI found a previous quotation for ABC Pvt Ltd. Make your selection using the chat dialogue options.");
        
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'I found your previous quotation for ABC Pvt Ltd created on July 6 (Quote #QT-2026-904). Would you like to update the existing one or create a new version?',
            timestamp: 'Just now',
            agent: 'finance',
            choices: [
              { label: 'Update Existing Quote', value: 'update' },
              { label: 'Create New Version', value: 'new' }
            ]
          }
        ]);
        return;
      }
      triggerQuotationWorkflow(commandText);
    }
    // 2. INTENT: Hire Intern
    else if (lowerCmd.includes('hire') || lowerCmd.includes('intern')) {
      // Memory check: Have we already hired Alex Rivera?
      if (stats.employees > 12) {
        setPendingMemoryAction({ type: 'intern', entity: 'Alex Rivera' });
        setPresenterHighlightText("Business Memory triggered: AI found a previous hiring contract for Alex Rivera. Resolve using options inside the chat log.");
        
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'Alex Rivera has already been onboarded as a Frontend Intern. Would you like to review Alex\'s existing contract or onboard a second frontend intern?',
            timestamp: 'Just now',
            agent: 'hr',
            choices: [
              { label: 'Review Alex\'s Contract', value: 'update' },
              { label: 'Hire Second Intern (Liam Patel)', value: 'new' }
            ]
          }
        ]);
        return;
      }
      triggerHireInternWorkflow(commandText);
    }
    // 3. INTENT: Schedule meeting
    else if (lowerCmd.includes('meeting') || lowerCmd.includes('schedule') || lowerCmd.includes('calendar')) {
      // Memory check: Has a meeting already been scheduled?
      // Initial meetings length is 2. If it is greater, we scheduled a meeting!
      if (meetings.length > 2) {
        setPendingMemoryAction({ type: 'meeting', entity: 'Vanguard' });
        setPresenterHighlightText("Business Memory triggered: Vanguard huddle already scheduled. Confirm using options inside the chat log.");

        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'A Vanguard Sync meeting is already scheduled for tomorrow at 3:00 PM. Would you like to reschedule it to 5:00 PM or add a second follow-up huddle?',
            timestamp: 'Just now',
            agent: 'sales',
            choices: [
              { label: 'Reschedule to 5:00 PM', value: 'update' },
              { label: 'Add Second Sync', value: 'new' }
            ]
          }
        ]);
        return;
      }
      triggerScheduleMeetingWorkflow(commandText);
    }
    // 4. INTENT: Report
    else if (lowerCmd.includes('report') || lowerCmd.includes('sales report')) {
      triggerSalesReportWorkflow(commandText);
    }
    // 5. INTENT: Q&A
    else if (lowerCmd.includes('leave') || lowerCmd.includes('policy') || lowerCmd.includes('timing') || lowerCmd.includes('reimburse') || lowerCmd.includes('office')) {
      triggerKnowledgeQuery(commandText);
    }
    // Generic
    else {
      triggerGenericOrchestration(commandText);
    }
  };

  // WORKFLOW 6: GENERATE INVOICE
  const triggerInvoiceWorkflow = (command) => {
    const steps = [
      { title: 'CEO Agent maps billing task', agent: 'ceo', description: 'Querying project deliverables for ABC Pvt Ltd...' },
      { title: 'Finance Agent runs ledger updates', agent: 'finance', description: 'Generating Invoice INV-2026-090 for $7,452...' },
      { title: 'Knowledge Agent registers tax records', agent: 'knowledge', description: 'Verifying standard 8.0% sales tax calculations...' }
    ];

    setWorkflowReasoning({
      title: "Invoice Generation Rationale",
      rationale: "Parsed instruction to generate an invoice for ABC Pvt Ltd.\n\nFinance Agent checked active SaaS packages. Compiled INV-2026-090 for $7,452 (includes SaaS license at $4,500 and integration hours at $2,400, plus 8% sales tax). Updated corporate revenue from $1,850,000 to $1,857,452."
    });

    setStats((prev) => ({ ...prev, activeWorkflows: prev.activeWorkflows + 1 }));
    setWorkflow({
      isRunning: true,
      steps,
      activeStepIndex: 0,
      statusText: 'CEO Agent mapping billing details...',
      command
    });
    setActiveAgents(['ceo']);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setWorkflow((prev) => ({
          ...prev,
          activeStepIndex: currentStep,
          statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
        }));
        setActiveAgents([steps[currentStep].agent]);
      } else {
        clearInterval(interval);

        setStats((prev) => ({
          ...prev,
          revenue: prev.revenue + 7452,
          salesCount: prev.salesCount + 1,
          activeWorkflows: Math.max(0, prev.activeWorkflows - 1)
        }));
        flashStatCard('revenue');
        flashStatCard('salesCount');

        setDocuments((prev) => ({
          ...prev,
          invoice: {
            company: 'NEXUS AI SYSTEMS INC.',
            invoiceNo: 'INV-2026-090',
            client: 'ABC Pvt Ltd',
            clientAddress: 'Tech Park Hub, Block B, Bangalore',
            date: 'July 6, 2026',
            dueDate: 'August 6, 2026',
            items: [
              { desc: 'Enterprise SaaS Core License (Tier 3)', qty: 1, rate: 4500, total: 4500 },
              { desc: 'Custom AI Agent Integration Services', qty: 20, rate: 120, total: 2400 }
            ],
            subtotal: 6900,
            tax: 552,
            total: 7452
          }
        }));
        setActiveDocKey('invoice');

        pushActivity('Invoice INV-2026-090 compiled for ABC Pvt Ltd ($7,452)', 'finance');
        pushNotification('Invoice INV-2026-090 created.', 'success');

        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'Invoice INV-2026-090 generated for ABC Pvt Ltd ($7,452). Checked tax guidelines and pushed changes to database ledger. The Invoice has been loaded in the document preview panel.',
            timestamp: 'Just now',
            agent: 'finance'
          }
        ]);

        setPresenterHighlightText("✅ Invoice generated! Notice the 'Revenue' metric card flashes to show the updated revenue of $1,857,452. The new invoice is ready for download/email.");
        setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
        setActiveAgents([]);
      }
    }, 1100);
  };

  // WORKFLOW 1: HIRE FRONTEND INTERN
  const triggerHireInternWorkflow = (command) => {
    const steps = [
      { title: 'CEO Agent registers intake request', agent: 'ceo', description: 'Analyzing engineering headcount allocations...' },
      { title: 'HR Agent drafts Job Listing spec', agent: 'hr', description: 'Generating core skills requirements for React/Tailwind...' },
      { title: 'Finance Agent checks payroll margins', agent: 'finance', description: 'Approving monthly internship stipend ($2,500/mo)...' },
      { title: 'Knowledge Agent verifies leave guidelines', agent: 'knowledge', description: 'Reviewing employee handbook terms for intern eligibility...' },
      { title: 'HR Agent compiles official Offer Contract', agent: 'hr', description: 'Issuing document for candidate Alex Rivera...' },
      { title: 'Dashboard statistics synchronised', agent: 'ceo', description: 'Employee tally incremented and logged.' }
    ];

    setPresenterHighlightText("Executing Intern Hire Flow: Watch the HR and Finance agents light up. On completion, the Active Employees count increments, and a draft Offer Letter opens in the Document Panel!");
    setStats((prev) => ({ ...prev, activeWorkflows: prev.activeWorkflows + 1 }));
    setWorkflowReasoning({
      title: "Intern Onboarding Rationale",
      rationale: "HR Agent queried latest company policies. Finance Agent checked payroll margins ($2,500/mo stipend fits in $30,000 yearly headcount allocations buffer). CEO Agent authorized contract issuing for Alex Rivera."
    });
    setWorkflow({
      isRunning: true,
      steps,
      activeStepIndex: 0,
      statusText: 'CEO Agent analyzing engineering capacity...',
      command
    });
    setActiveAgents(['ceo']);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setWorkflow((prev) => ({
          ...prev,
          activeStepIndex: currentStep,
          statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
        }));

        const activeAgentId = steps[currentStep].agent;
        setActiveAgents([activeAgentId]);
      } else {
        clearInterval(interval);
        
        // Finalize execution
        setStats((prev) => ({
          ...prev,
          employees: prev.employees + 1,
          pendingTasks: prev.pendingTasks - 1,
          activeWorkflows: Math.max(0, prev.activeWorkflows - 1)
        }));
        flashStatCard('employees');

        // Populate and select Offer Letter doc
        const newOfferLetter = {
          ...DEFAULT_DOCUMENTS.offer_letter,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
        setDocuments((prev) => ({ ...prev, offer_letter: newOfferLetter }));
        setActiveDocKey('offer_letter');

        // Log completion events
        pushActivity('Frontend Intern position created successfully', 'hr');
        pushActivity('Offer letter generated for Alex Rivera', 'hr');
        pushNotification('Offer letter drafted for candidate Alex Rivera!', 'success');
        pushNotification('Employee metrics directory updated (+1).', 'info');

        // Log to chat dialogue
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'Offer Letter generated for candidate Alex Rivera! The contract has been routed to the Document Generator. Notice the Active Employees card on the left is flashing purple and has been incremented to 13.',
            timestamp: 'Just now',
            agent: 'hr'
          }
        ]);

        setPresenterHighlightText("✅ Intern Hire complete! Review the custom contract in the 'Offer Letter' tab on the right. Notice 'Active Employees' metric flashed purple.");

        setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
        setActiveAgents([]);
      }
    }, 1100);
  };

  // WORKFLOW 2: MONTHLY SALES REPORT
  const triggerSalesReportWorkflow = (command) => {
    const steps = [
      { title: 'CEO Agent initiates financial audit', agent: 'ceo', description: 'Reviewing quarterly targets and KPI margins...' },
      { title: 'Sales Agent retrieves CRM logs', agent: 'sales', description: 'Consolidating client account deal totals for July...' },
      { title: 'Finance Agent computes cost totals', agent: 'finance', description: 'Summing hardware & infrastructure expense entries...' },
      { title: 'CEO Agent executes predictive forecast', agent: 'ceo', description: 'Structuring net revenue projections & feedback...' }
    ];

    setPresenterHighlightText("Executing Sales Report Flow: CEO coordinates CRM details and finance ledgers. On completion, the Total Revenue metrics flash, and the compiled Performance Audit loads in the preview panel.");
    setStats((prev) => ({ ...prev, activeWorkflows: prev.activeWorkflows + 1 }));
    setWorkflowReasoning({
      title: "Monthly Audit Rationale",
      rationale: "Compiled active client accounts and deal counts. Verified infrastructure expenditures and computed July net revenue of $1,850,000. Verified agent utility metrics at 98.4%."
    });
    setWorkflow({
      isRunning: true,
      steps,
      activeStepIndex: 0,
      statusText: 'CEO Agent querying revenue tables...',
      command
    });
    setActiveAgents(['ceo']);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setWorkflow((prev) => ({
          ...prev,
          activeStepIndex: currentStep,
          statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
        }));
        setActiveAgents([steps[currentStep].agent]);
      } else {
        clearInterval(interval);

        setStats((prev) => ({
          ...prev,
          revenue: 764300,
          activeWorkflows: Math.max(0, prev.activeWorkflows - 1)
        }));
        flashStatCard('revenue');

        setDocuments((prev) => ({
          ...prev,
          monthly_report: {
            ...DEFAULT_DOCUMENTS.monthly_report,
            revenue: '$764,300',
            utility: '96.2%',
            growthRate: '18.9%'
          }
        }));
        setActiveDocKey('monthly_report');

        pushActivity('July Corporate Performance Audit complete', 'ceo');
        pushNotification('Monthly Performance Audit report available.', 'success');
        
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'The July Q2 Performance Audit report has been compiled and is previewed on the right, showing 18.9% revenue growth. Note that the Total Revenue metric card is flashing cyan and has been updated to $764,300.',
            timestamp: 'Just now',
            agent: 'ceo'
          }
        ]);

        setPresenterHighlightText("✅ Audit Complete! Toggle between 'Monthly Expenses' or 'Revenue Growth' tabs in the Performance Analytics panel below to view updated charts.");

        setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
        setActiveAgents([]);
      }
    }, 1100);
  };

  // WORKFLOW 3: SCHEDULE MEETING
  const triggerScheduleMeetingWorkflow = (command) => {
    let timeText = 'Tomorrow, 3:00 PM - 4:00 PM';
    if (command.toLowerCase().includes('4 pm') || command.toLowerCase().includes('4pm')) {
      timeText = 'Tomorrow, 4:00 PM - 5:00 PM';
    }

    const steps = [
      { title: 'Sales Agent links client data', agent: 'sales', description: 'Confirming contact record for Vanguard Sync...' },
      { title: 'CEO Agent reviews availability', agent: 'ceo', description: 'Checking executive calendars for conflict loops...' },
      { title: 'HR Agent handles calendar block', agent: 'hr', description: 'Allocating virtual workspace room & time slots...' },
      { title: 'Calendar scheduler dispatches invitations', agent: 'sales', description: 'Registering event nodes to Google Calendar...' }
    ];

    setPresenterHighlightText("Scheduling meeting: Watch Sales and HR agents reserve room slots. On completion, the meetings calendar below updates and flashes.");
    setStats((prev) => ({ ...prev, activeWorkflows: prev.activeWorkflows + 1 }));
    setWorkflowReasoning({
      title: "Calendar Booking Rationale",
      rationale: `Mapped meeting instructions for Vanguard Sync.\n\nChecked CEO calendar availability. Tomorrow 3:00 PM (or slot '${timeText}') was verified clear of conflicts. Reserved virtual boardroom and dispatched team calendar notifications.`
    });
    setWorkflow({
      isRunning: true,
      steps,
      activeStepIndex: 0,
      statusText: 'Sales Agent fetching Vanguard account files...',
      command
    });
    setActiveAgents(['sales']);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setWorkflow((prev) => ({
          ...prev,
          activeStepIndex: currentStep,
          statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
        }));
        setActiveAgents([steps[currentStep].agent]);
      } else {
        clearInterval(interval);

        const newMeeting = {
          id: `m-${Date.now()}`,
          title: 'Vanguard Alignment Sync',
          time: timeText,
          location: 'Nexus Virtual Core Room 4',
          attendee: 'Stark (CEO) & Sales Team'
        };

        setMeetings((prev) => [newMeeting, ...prev]);
        setStats((prev) => ({
          ...prev,
          meetingsToday: prev.meetingsToday + 1,
          activeWorkflows: Math.max(0, prev.activeWorkflows - 1)
        }));
        flashStatCard('meetingsToday');

        setActiveDocKey('meeting_minutes');

        pushActivity(`Meeting scheduled: Vanguard Sync (${timeText})`, 'sales');
        pushNotification(`Calendar updated: Meeting booked for ${timeText}!`, 'success');

        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `Vanguard Sync booked successfully for ${timeText}! Calendar scheduler has updated the agenda list, and a placeholder for meeting minutes is opened. The meetings today metric count flashes blue.`,
            timestamp: 'Just now',
            agent: 'sales'
          }
        ]);

        setPresenterHighlightText("✅ Meeting scheduled! Look at the 'Upcoming Events' log inside the Meeting Scheduler calendar below to see the Vanguard Sync block.");

        setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
        setActiveAgents([]);
      }
    }, 1100);
  };

  // WORKFLOW 4: CREATE QUOTATION
  const triggerQuotationWorkflow = (command) => {
    let clientName = 'ABC Pvt Ltd';
    if (command.toLowerCase().includes('xyz')) {
      clientName = 'XYZ Ltd';
    }

    const steps = [
      { title: 'Sales Agent accesses CRM records', agent: 'sales', description: 'Loading account file parameters for client profile...' },
      { title: 'Finance Agent evaluates price tables', agent: 'finance', description: 'Calculating package estimates for Enterprise licenses...' },
      { title: 'CEO Agent reviews discount margins', agent: 'ceo', description: 'Approving 10% promotional markdown adjustments...' },
      { title: 'Finance Agent generates final Quotation', agent: 'finance', description: 'Compiling Quote invoice payload #QT-2026-904...' }
    ];

    setPresenterHighlightText("Compiling quotation: Finance computes package quantities. Watch the Sales card increment and the Quotation tab populate!");
    setStats((prev) => ({ ...prev, activeWorkflows: prev.activeWorkflows + 1 }));
    setWorkflowReasoning({
      title: "Quotation Drafting Rationale",
      rationale: `Mapped client account name to: "${clientName}".\n\nFinance Agent verified licensing parameters. Checked promotional SLA rates and computed package estimates ($135,000 gross). Applied CEO-approved 10% volume discount ($13,500), outputting QT-2026-904 with a net valuation of $121,500.`
    });
    setWorkflow({
      isRunning: true,
      steps,
      activeStepIndex: 0,
      statusText: 'Sales Agent querying CRM contact details...',
      command
    });
    setActiveAgents(['sales']);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setWorkflow((prev) => ({
          ...prev,
          activeStepIndex: currentStep,
          statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
        }));
        setActiveAgents([steps[currentStep].agent]);
      } else {
        clearInterval(interval);

        setStats((prev) => ({
          ...prev,
          salesCount: prev.salesCount + 1,
          activeWorkflows: Math.max(0, prev.activeWorkflows - 1)
        }));
        flashStatCard('salesCount');

        const newQuotation = {
          ...DEFAULT_DOCUMENTS.quotation,
          client: clientName,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };
        setDocuments((prev) => ({ ...prev, quotation: newQuotation }));
        setActiveDocKey('quotation');

        pushActivity(`Quotation QT-2026-904 compiled for ${clientName}`, 'finance');
        pushNotification(`Quotation generated for ${clientName}!`, 'success');

        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `Quotation generated for ${clientName}! Pricing values calculated at $121,500 (10% volume discount applied). Draft proposal visible inside the 'Quotation' preview node. Sales Count card is flashing orange and updated.`,
            timestamp: 'Just now',
            agent: 'finance'
          }
        ]);

        setPresenterHighlightText(`✅ Quotation compiled! Review quote numbers inside the 'Quotation' tab on the right. Notice that 'Sales count' card has incremented to 39.`);

        setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
        setActiveAgents([]);
      }
    }, 1100);
  };

  // WORKFLOW 5: KNOWLEDGE POLICY QUERY
  const triggerKnowledgeQuery = (command) => {
    const steps = [
      { title: 'Knowledge Agent queries semantic index', agent: 'knowledge', description: 'Searching company document vaults for relevant guidelines...' },
      { title: 'HR Agent evaluates latest policies', agent: 'hr', description: 'Confirming terms match active 2026 guidelines...' },
      { title: 'Knowledge Agent structures answers', agent: 'knowledge', description: 'Synthesizing response summary for user cockpit...' }
    ];

    setPresenterHighlightText("Querying company knowledge: Knowledge Agent scans corporate archives and generates a direct answer bubble above the text input.");
    setStats((prev) => ({ ...prev, activeWorkflows: prev.activeWorkflows + 1 }));
    setWorkflowReasoning({
      title: "Semantic Indexing Rationale",
      rationale: "Parsed policy query using NLP keyword mapping.\n\nKnowledge Agent queried local file directories for 'leave_policy.md' and matched Section 4 guidelines. Confirmed 1.5 paid leaves monthly allowance for interns."
    });
    setWorkflow({
      isRunning: true,
      steps,
      activeStepIndex: 0,
      statusText: 'Knowledge Agent scanning doc repositories...',
      command
    });
    setActiveAgents(['knowledge']);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setWorkflow((prev) => ({
          ...prev,
          activeStepIndex: currentStep,
          statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
        }));
        setActiveAgents([steps[currentStep].agent]);
      } else {
        clearInterval(interval);

        setStats((prev) => ({
          ...prev,
          activeWorkflows: Math.max(0, prev.activeWorkflows - 1)
        }));

        let answer = '';
        let matchedCategory = '';

        if (command.toLowerCase().includes('leave')) {
          answer = "💡 HR Leave Policy: Full-time employees receive 21 days of paid annual vacation plus 7 sick days. Unused leaves up to 10 days can be rolled over to the next financial year. Claims must be requested through HR.";
          matchedCategory = 'Leave Policy';
        } else if (command.toLowerCase().includes('timing') || command.toLowerCase().includes('hour') || command.toLowerCase().includes('office')) {
          answer = "💡 Office Hours & Timings: Core collaboration hours are 10:30 AM to 4:30 PM. Standard flexible hours span 9:00 AM to 6:00 PM, Monday through Friday.";
          matchedCategory = 'Office Timings';
        } else if (command.toLowerCase().includes('reimburse')) {
          answer = "💡 Expense Reimbursements: Business hardware, travel, and software tools are fully reimbursable. Upload digitised invoices within 30 days of purchase for payroll processing.";
          matchedCategory = 'Reimbursements';
        } else {
          answer = "💡 Standard Guidelines: Travel expenses require manager pre-approval. Unused leaves rollover is capped at 10 days.";
          matchedCategory = 'General Guidelines';
        }

        pushActivity(`Company Knowledge database scanned for: "${matchedCategory}"`, 'knowledge');
        pushNotification(`Knowledge lookup completed for: ${matchedCategory}`, 'success');

        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: answer,
            timestamp: 'Just now',
            agent: 'knowledge'
          }
        ]);

        setPresenterHighlightText("✅ Lookup complete! The Knowledge Agent fetched the answers instantly. Review the bubble answer text directly inside the Command center dialogue log.");

        setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
        setActiveAgents([]);
      }
    }, 1100);
  };

  // GENERIC ORCHESTRATION FOR CUSTOM INPUTS
  const triggerGenericOrchestration = (command) => {
    let targetAgent = 'ceo';
    if (command.toLowerCase().includes('hire') || command.toLowerCase().includes('employee') || command.toLowerCase().includes('payroll')) {
      targetAgent = 'hr';
    } else if (command.toLowerCase().includes('bill') || command.toLowerCase().includes('invoice') || command.toLowerCase().includes('money') || command.toLowerCase().includes('tax')) {
      targetAgent = 'finance';
    } else if (command.toLowerCase().includes('client') || command.toLowerCase().includes('crm') || command.toLowerCase().includes('pipeline')) {
      targetAgent = 'sales';
    } else if (command.toLowerCase().includes('policy') || command.toLowerCase().includes('document') || command.toLowerCase().includes('rule')) {
      targetAgent = 'knowledge';
    }

    const steps = [
      { title: 'CEO Agent analyzes custom instruction', agent: 'ceo', description: 'Interpreting NLP semantics and identifying workflows...' },
      { title: `Routing execution to ${targetAgent.toUpperCase()} Agent`, agent: targetAgent, description: `Tasking specialist node to handle custom business logic...` },
      { title: 'Orchestrating state sync across modules', agent: 'ceo', description: 'Validating final database integrity constraints...' }
    ];

    setStats((prev) => ({ ...prev, activeWorkflows: prev.activeWorkflows + 1 }));
    setWorkflowReasoning({
      title: "Custom Command Orchestration Rationale",
      rationale: `Parsed custom text input: "${command}".\n\nMapped target routing to: ${targetAgent.toUpperCase()} Agent. Triggered standard pipeline sync and compiled results under database task queues.`
    });
    setWorkflow({
      isRunning: true,
      steps,
      activeStepIndex: 0,
      statusText: 'Parsing custom business command...',
      command
    });
    setActiveAgents(['ceo']);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setWorkflow((prev) => ({
          ...prev,
          activeStepIndex: currentStep,
          statusText: `${steps[currentStep].agent.toUpperCase()} Agent: ${steps[currentStep].description}`
        }));
        setActiveAgents([steps[currentStep].agent]);
      } else {
        clearInterval(interval);

        setStats((prev) => ({
          ...prev,
          pendingTasks: prev.pendingTasks + 1,
          activeWorkflows: Math.max(0, prev.activeWorkflows - 1)
        }));
        flashStatCard('pendingTasks');

        pushActivity(`Custom agent action executed: "${command}"`, targetAgent);
        pushNotification(`Custom request compiled by ${targetAgent.toUpperCase()} Agent.`, 'success');

        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `Custom execution complete! Handled by ${targetAgent.toUpperCase()} agent. Pending tasks list updated.`,
            timestamp: 'Just now',
            agent: targetAgent
          }
        ]);

        setWorkflow((prev) => ({ ...prev, activeStepIndex: steps.length, isRunning: false, statusText: '' }));
        setActiveAgents([]);
      }
    }, 1100);
  };

  // Simulating background telemetry fluctuations
  useEffect(() => {
    const statInterval = setInterval(() => {
      setStats((prev) => {
        const deltaProductivity = (Math.random() * 0.4 - 0.2);
        return {
          ...prev,
          successRate: Math.max(95, Math.min(100, +(prev.successRate + deltaProductivity).toFixed(1)))
        };
      });
    }, 9000);

    return () => clearInterval(statInterval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dot-grid font-sans relative overflow-hidden pb-12">
      {/* Background Blurs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-gradient-to-br from-brand-blue/15 to-brand-purple/15 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-gradient-to-tr from-brand-purple/10 to-pink-500/10 rounded-full blur-3xl -z-10" />

      {/* HEADER SECTION */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue shadow-lg shadow-brand-purple/20">
              <Sparkles size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white m-0 leading-none">Nexus AI</h1>
              <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">Autonomous Business OS</p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="hidden lg:flex items-center relative w-64 mx-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees, files..."
              className="w-full bg-slate-900 border border-white/5 focus:border-brand-purple focus:outline-none pl-8 pr-4 py-1.5 rounded-xl text-xs text-slate-100 placeholder-zinc-500 transition-all font-mono"
            />
            <Search className="absolute left-2.5 text-zinc-500" size={12} />
            
            {/* Search results dropdown panel */}
            {searchQuery.trim() !== "" && (
              <div className="absolute top-10 left-0 w-80 rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-lg shadow-2xl p-4 z-50 text-xs text-zinc-300 max-h-80 overflow-y-auto no-scrollbar space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-1 font-semibold text-[9px] text-zinc-400 font-mono">
                  <span>SEARCH RESULTS</span>
                  <button onClick={() => setSearchQuery("")} className="hover:text-white cursor-pointer font-sans">Clear</button>
                </div>
                {renderSearchResults()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 border-r border-white/5 pr-4 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Node 1: Online</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>NLP Engine: Active</span>
              </div>
            </div>

            {/* Time Machine Button */}
            <button
              onClick={() => setShowTimeMachine(true)}
              className="text-[10px] font-mono bg-slate-900 border border-white/5 hover:border-brand-purple/40 hover:bg-slate-800 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1"
              title="Open Business Time Machine history browser"
            >
              Time Machine
            </button>

            {/* Reset Memory Button */}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-[10px] font-mono bg-red-950/20 border border-red-500/25 hover:border-red-500/60 hover:bg-red-950/40 text-red-400 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all"
              title="Flush sandbox database cache and reload"
            >
              Reset OS Memory
            </button>

            {/* Notification badge */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="relative p-2 rounded-xl bg-slate-900 border border-white/5 hover:border-brand-purple/40 text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-purple text-[9px] font-bold flex items-center justify-center text-white border border-slate-950">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotificationPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-lg shadow-2xl p-4 z-50 text-xs"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2 font-semibold">
                      <span className="text-slate-200">System Notifications</span>
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={10} /> Clear all
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-zinc-500 font-mono text-[10px]">No new notifications.</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5 flex gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'success' ? 'bg-emerald-400' : 'bg-brand-cyan'}`} />
                            <div className="min-w-0">
                              <p className="text-zinc-300 font-medium leading-normal">{n.text}</p>
                              <span className="text-[9px] text-zinc-600 font-mono block mt-0.5">{n.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1.5 rounded-xl">
              <Shield size={12} />
              <span>HACKATHON DEMO MODE</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        
        {/* METRICS DASHBOARD GRID WITH PITCH GLOW STATES */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          
          {/* Card 1: Revenue */}
          <div
            className={`glass-panel p-4 rounded-2xl border transition-all duration-700 relative overflow-hidden flex flex-col justify-between ${
              flashingStats.revenue
                ? 'border-brand-cyan bg-brand-cyan/10 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-102 z-20'
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Total Revenue</span>
              <div className="p-1.5 rounded-lg bg-brand-cyan/15 text-brand-cyan"><DollarSign size={14} /></div>
            </div>
            <div className="mt-3">
              <motion.h2
                key={stats.revenue}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-bold font-mono text-white m-0"
              >
                ${stats.revenue.toLocaleString()}
              </motion.h2>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
                <span>+18.4%</span>
                <span>YoY Growth</span>
              </div>
            </div>
          </div>

          {/* Card 2: Employees */}
          <div
            className={`glass-panel p-4 rounded-2xl border transition-all duration-700 relative overflow-hidden flex flex-col justify-between ${
              flashingStats.employees
                ? 'border-brand-purple bg-brand-purple/10 shadow-[0_0_25px_rgba(168,85,247,0.4)] scale-102 z-20'
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Active Employees</span>
              <div className="p-1.5 rounded-lg bg-brand-purple/15 text-brand-purple"><Users size={14} /></div>
            </div>
            <div className="mt-3">
              <motion.h2
                key={stats.employees}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-bold font-mono text-white m-0"
              >
                {stats.employees}
              </motion.h2>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono mt-1">
                <span>1 pending onboarding</span>
              </div>
            </div>
          </div>

          {/* Card 3: Sales Deals */}
          <div
            className={`glass-panel p-4 rounded-2xl border transition-all duration-700 relative overflow-hidden flex flex-col justify-between ${
              flashingStats.salesCount
                ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-102 z-20'
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Sales count</span>
              <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500"><TrendingUp size={14} /></div>
            </div>
            <div className="mt-3">
              <motion.h2
                key={stats.salesCount}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-bold font-mono text-white m-0"
              >
                {stats.salesCount}
              </motion.h2>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
                <span>+12% this month</span>
              </div>
            </div>
          </div>

          {/* Card 4: Pending Tasks */}
          <div
            className={`glass-panel p-4 rounded-2xl border transition-all duration-700 relative overflow-hidden flex flex-col justify-between ${
              flashingStats.pendingTasks
                ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_25px_rgba(236,72,153,0.4)] scale-102 z-20'
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Pending Tasks</span>
              <div className="p-1.5 rounded-lg bg-pink-500/15 text-pink-500"><Activity size={14} /></div>
            </div>
            <div className="mt-3">
              <motion.h2
                key={stats.pendingTasks}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-bold font-mono text-white m-0"
              >
                {stats.pendingTasks}
              </motion.h2>
              <div className="flex items-center gap-1 text-[10px] text-brand-purple font-mono mt-1">
                <span>AI queue priority high</span>
              </div>
            </div>
          </div>

          {/* Card 5: Meetings Today */}
          <div
            className={`glass-panel p-4 rounded-2xl border transition-all duration-700 relative overflow-hidden flex flex-col justify-between ${
              flashingStats.meetingsToday
                ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.4)] scale-102 z-20'
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Meetings Today</span>
              <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400"><CalendarIcon size={14} /></div>
            </div>
            <div className="mt-3">
              <motion.h2
                key={stats.meetingsToday}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-bold font-mono text-white m-0"
              >
                {stats.meetingsToday}
              </motion.h2>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono mt-1">
                <span>All Zoom bridges active</span>
              </div>
            </div>
          </div>

          {/* Card 6: Workflow success */}
          <div className="glass-panel p-4 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Workflow Success</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400"><CheckCircle2 size={14} /></div>
            </div>
            <div className="mt-3">
              <h2 className="text-xl font-bold font-mono text-white m-0">
                {stats.successRate}%
              </h2>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
                <span>Autonomous status OK</span>
              </div>
            </div>
          </div>

        </section>

        {/* AGENTS GRID */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
              <Users size={12} className="text-brand-purple" />
              Active Autonomous AI Agent Core Room
            </h3>
            <span className="text-[10px] text-zinc-500">Highlighted cards show active workers</span>
          </div>
          <AgentGrid activeAgents={activeAgents} />
        </section>

        {/* SPLIT SCREEN: CONSOLE & ACTIONS LEFT, TIMELINE & PREVIEWS RIGHT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE: COMMAND CENTER & ANALYTICS (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <CommandCenter
              onExecuteCommand={handleExecuteCommand}
              isRunning={workflow.isRunning}
              chatHistory={chatHistory}
            />
            <AnalyticsPanel stats={stats} />
          </div>

          {/* RIGHT SIDE: LIVE TIMELINE & DOC GENERATOR (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <WorkflowTimeline
              steps={workflow.steps}
              activeStepIndex={workflow.activeStepIndex}
              isRunning={workflow.isRunning}
              statusText={workflow.statusText}
              reasoning={workflowReasoning}
            />
            <DocPreviewer
              activeDoc={activeDocKey}
              documents={documents}
              onSelectDoc={(key) => setActiveDocKey(key)}
              onSendEmail={handleOpenMailModal}
              onShareWhatsApp={handleOpenWhatsAppModal}
            />
          </div>

        </section>

        {/* BOTTOM METRICS: CALENDAR, MEMORY VAULT & ACTIVITY LOG */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-4">
            <CalendarScheduler
              meetings={meetings}
              onAddMeeting={() => setShowMeetingModal(true)}
            />
          </div>

          <div className="lg:col-span-4">
            <MemoryVault
              stats={stats}
              meetings={meetings}
              documents={documents}
              activities={activities}
              employees={employees}
              onAddEmployee={() => {
                setSelectedEmployee(null);
                setShowEmployeeModal(true);
              }}
              onEditEmployee={(emp) => {
                setSelectedEmployee(emp);
                setShowEmployeeModal(true);
              }}
              onExportEmployees={handleExportEmployeesCSV}
            />
          </div>

          {/* Activity Log Feed */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <Activity size={16} className="text-brand-purple" />
                  System Activity Log
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Live Operations feed</span>
              </div>

              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {activities.map((act, idx) => {
                  let badgeColor = 'bg-slate-900 border-zinc-800 text-zinc-400';
                  if (act.category === 'hr') badgeColor = 'bg-pink-500/10 border-pink-500/20 text-pink-400';
                  if (act.category === 'finance') badgeColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                  if (act.category === 'sales') badgeColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                  if (act.category === 'ceo') badgeColor = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
                  if (act.category === 'user') badgeColor = 'bg-purple-500/15 border-purple-500/20 text-brand-purple font-semibold';

                  return (
                    <div key={idx} className="flex gap-4 items-start text-xs border-b border-white/3 pb-2.5 last:border-b-0">
                      <span className="font-mono text-zinc-500 flex-shrink-0">{act.time}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-300 leading-normal font-sans font-medium">{act.desc}</p>
                      </div>
                      <span className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border ${badgeColor} flex-shrink-0`}>
                        {act.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span>Total Logged Operations: {activities.length}</span>
              <span className="flex items-center gap-1">
                <Info size={11} /> Sandbox records automatically flush hourly.
              </span>
            </div>
          </div>

        </section>

      </main>

      {/* FLOATING HACKATHON PRESENTATION ASSISTANT */}
      <AnimatePresence>
        {showPresenter && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 right-4 w-96 rounded-2xl bg-slate-900/95 border border-brand-purple/30 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.15)] p-4 z-50 text-xs"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
              <div className="flex items-center gap-2 text-brand-purple font-bold">
                <Presentation size={14} />
                <span>Hackathon Presentation Assistant</span>
              </div>
              <button
                onClick={() => setShowPresenter(false)}
                className="text-[10px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Hide
              </button>
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-white/5 mb-3 font-mono">
              {presenterHighlightText}
            </p>

            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500">Quick Pitch Demos:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  disabled={workflow.isRunning}
                  onClick={() => handleExecuteCommand("Hire a frontend intern")}
                  className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-white/5 text-zinc-300 hover:text-white flex items-center justify-between cursor-pointer disabled:opacity-50 text-[10px]"
                >
                  <span>1. Hire Intern</span>
                  <Play size={8} className="text-brand-purple" />
                </button>
                <button
                  disabled={workflow.isRunning}
                  onClick={() => handleExecuteCommand("Generate July Sales Report")}
                  className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-white/5 text-zinc-300 hover:text-white flex items-center justify-between cursor-pointer disabled:opacity-50 text-[10px]"
                >
                  <span>2. Sales Report</span>
                  <Play size={8} className="text-brand-cyan" />
                </button>
                <button
                  disabled={workflow.isRunning}
                  onClick={() => handleExecuteCommand("Schedule client meeting tomorrow at 3 PM")}
                  className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-white/5 text-zinc-300 hover:text-white flex items-center justify-between cursor-pointer disabled:opacity-50 text-[10px]"
                >
                  <span>3. Scheduler</span>
                  <Play size={8} className="text-blue-400" />
                </button>
                <button
                  disabled={workflow.isRunning}
                  onClick={() => handleExecuteCommand("Create quotation for ABC Pvt Ltd")}
                  className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-white/5 text-zinc-300 hover:text-white flex items-center justify-between cursor-pointer disabled:opacity-50 text-[10px]"
                >
                  <span>4. Quotation</span>
                  <Play size={8} className="text-amber-500" />
                </button>
              </div>

              <button
                disabled={workflow.isRunning}
                onClick={() => handleExecuteCommand("What is our leave policy?")}
                className="w-full mt-1 px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-white/5 text-zinc-300 hover:text-white flex items-center justify-between cursor-pointer disabled:opacity-50 text-[10px] rounded-lg"
              >
                <span>5. Q&A: Leave Policy Lookup</span>
                <HelpCircle size={10} className="text-brand-purple" />
              </button>
            </div>
          </motion.div>
        )}

        {!showPresenter && (
          <button
            onClick={() => {
              setShowPresenter(true);
              setPresenterHighlightText("Tip: Click 'Run' next to any demo scenario in this panel to trigger the workflow. Watch the timeline animate and the highlighted metric cards glow when completed!");
            }}
            className="fixed bottom-4 right-4 p-3 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-xl hover:scale-105 transition-all z-50 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <Presentation size={14} />
            <span>Show Presenter Assistant</span>
          </button>
        )}
      </AnimatePresence>
      
      {/* Action Modals Mounting Core */}
      <EmployeeModal
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        onDelete={handleDeleteEmployee}
      />

      <MeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSave={handleSaveMeeting}
      />

      <MailModal
        isOpen={showMailModal}
        onClose={() => {
          setShowMailModal(false);
          setMailData(null);
        }}
        emailData={mailData}
        onSendSuccess={handleSendMailSuccess}
      />

      <WhatsAppModal
        isOpen={showWhatsAppModal}
        onClose={() => {
          setShowWhatsAppModal(false);
          setWhatsAppData(null);
        }}
        data={whatsAppData}
      />

      <TimeMachine
        isOpen={showTimeMachine}
        onClose={() => setShowTimeMachine(false)}
        stats={stats}
        activities={activities}
        chatHistory={chatHistory}
        meetings={meetings}
        documents={documents}
        onReopenItem={handleReopenItem}
      />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 text-center text-[11px] font-mono text-zinc-600 space-y-1">
        <p>© 2026 Nexus Core. Built for Hackathon MVP Showcase.</p>
        <p>Dynamic simulated backend interfaces enabled. All credentials and connections mocked.</p>
      </footer>
    </div>
  );
}
