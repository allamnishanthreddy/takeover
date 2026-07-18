import { useState } from 'react';
import { FileText, Download, Copy, Check, FileSpreadsheet, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function DocPreviewer({ activeDoc, documents = {}, onSelectDoc, onSendEmail, onShareWhatsApp }) {
  const [copied, setCopied] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(null);

  const docKeys = [
    { key: 'offer_letter', label: 'Offer Letter', icon: FileText },
    { key: 'invoice', label: 'Invoice', icon: FileSpreadsheet },
    { key: 'quotation', label: 'Quotation', icon: FileText },
    { key: 'meeting_minutes', label: 'Minutes', icon: Calendar },
    { key: 'monthly_report', label: 'Report', icon: TrendingUp }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(documents[activeDoc] || {}, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const currentDoc = documents[activeDoc];
    if (!currentDoc) return;
    
    let csvContent;
    if (activeDoc === 'invoice') {
      csvContent = "Item Description,Qty,Rate,Total\n" + 
        (currentDoc.items || []).map(item => `"${item.desc}",${item.qty},${item.rate},${item.total}`).join("\n") +
        `\nSubtotal,,,${currentDoc.subtotal}\nTotal Due,,,${currentDoc.total}`;
    } else if (activeDoc === 'quotation') {
      csvContent = "Solution Package,Qty,Rate,Total\n" + 
        (currentDoc.items || []).map(item => `"${item.desc}",${item.qty},${item.rate},${item.total}`).join("\n") +
        `\nDiscount,,,${currentDoc.discount}\nNet Price,,,${currentDoc.total}`;
    } else if (activeDoc === 'monthly_report') {
      csvContent = `Metric,Value\nRevenue,${currentDoc.revenue}\nAgent Utility,${currentDoc.utility}\nDeals Closed,${currentDoc.dealsClosed}\nGrowth Rate,${currentDoc.growthRate}`;
    } else {
      csvContent = `Parameter,Value\nDocument,${activeDoc}\nTitle,${currentDoc.title || currentDoc.name || 'Nexus Doc'}\nDate,${currentDoc.date || 'July 6'}`;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeDoc}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    const currentDoc = documents[activeDoc];
    if (!currentDoc) return;

    setPdfProgress(10);
    let currentPct = 10;
    const interval = setInterval(() => {
      currentPct += 20;
      if (currentPct >= 100) {
        clearInterval(interval);
        setPdfProgress(100);
        
        setTimeout(() => {
          const doc = new jsPDF();
          doc.setFont("helvetica", "normal");
          
          if (activeDoc === 'offer_letter') {
            doc.setFontSize(18);
            doc.text(currentDoc.company || "NEXUS AI SYSTEMS INC.", 20, 20);
            doc.setFontSize(10);
            doc.text("100 Enterprise Way, Suite 400, SF, CA", 20, 28);
            doc.text(`Date: ${currentDoc.date}`, 150, 20);
            doc.line(20, 32, 190, 32);
            
            doc.setFontSize(14);
            doc.text("OFFER LETTER OF EMPLOYMENT", 20, 45);
            
            doc.setFontSize(11);
            doc.text(`Dear ${currentDoc.name || 'Alex Rivera'},`, 20, 60);
            doc.text(`We are thrilled to offer you the position of ${currentDoc.role || 'Frontend Engineering Intern'} at Nexus AI.`, 20, 70);
            doc.text(`Compensation stipend is structured at ${currentDoc.salary || '$2,500'} per Month.`, 20, 80);
            doc.text(`Your scheduled commencement date is: ${currentDoc.startDate || 'August 1, 2026'}.`, 20, 90);
            doc.text(`Authorized by: Jonathan Stark, CEO`, 20, 120);
          } else if (activeDoc === 'invoice') {
            doc.setFontSize(18);
            doc.text("INVOICE", 20, 20);
            doc.setFontSize(10);
            doc.text(currentDoc.company || "NEXUS AI INC.", 20, 28);
            doc.text(`Invoice: ${currentDoc.invoiceNo}`, 150, 20);
            doc.text(`Due: ${currentDoc.dueDate}`, 150, 28);
            doc.line(20, 32, 190, 32);
            
            doc.text(`Billed To: ${currentDoc.client}`, 20, 45);
            doc.text(`Address: ${currentDoc.clientAddress}`, 20, 52);
            
            let y = 70;
            doc.text("Line Items:", 20, 62);
            (currentDoc.items || []).forEach(item => {
              doc.text(`${item.desc} (Qty: ${item.qty})`, 20, y);
              doc.text(`$${item.total}`, 160, y);
              y += 10;
            });
            doc.line(20, y, 190, y);
            doc.text(`Subtotal: $${currentDoc.subtotal}`, 130, y + 10);
            doc.text(`Total Due: $${currentDoc.total}`, 130, y + 20);
          } else if (activeDoc === 'quotation') {
            doc.setFontSize(18);
            doc.text("QUOTATION", 20, 20);
            doc.setFontSize(10);
            doc.text(currentDoc.company || "NEXUS AI INC.", 20, 28);
            doc.text(`Quote #: ${currentDoc.quoteNo}`, 150, 20);
            doc.text(`Validity: 30 days`, 150, 28);
            doc.line(20, 32, 190, 32);
            
            doc.text(`Prepared For: ${currentDoc.client}`, 20, 45);
            
            let y = 60;
            (currentDoc.items || []).forEach(item => {
              doc.text(`${item.desc} (Qty: ${item.qty})`, 20, y);
              doc.text(`$${item.total}`, 160, y);
              y += 10;
            });
            doc.line(20, y, 190, y);
            doc.text(`Gross: $${currentDoc.gross}`, 130, y + 10);
            doc.text(`Net Total: $${currentDoc.total}`, 130, y + 20);
          } else {
            doc.setFontSize(18);
            doc.text(currentDoc.title || "Nexus OS Document", 20, 20);
            doc.setFontSize(10);
            doc.text(`Date compiled: ${currentDoc.date || 'July 6'}`, 20, 30);
            doc.text(`Category: ${activeDoc}`, 20, 38);
          }
          
          doc.save(`${activeDoc}_${Date.now()}.pdf`);
          setPdfProgress(null);
        }, 500);
      } else {
        setPdfProgress(currentPct);
      }
    }, 150);
  };

  const currentDoc = documents[activeDoc];

  // Custom renders for different document types to make them look hyper-premium
  const renderDocumentContent = () => {
    if (!currentDoc) {
      const getEmptyStateDetails = () => {
        switch (activeDoc) {
          case 'offer_letter':
            return {
              title: 'No Offer Letter Created Yet',
              description: 'Register an employee profile or speak to HR Agent to compile contract drafts.',
              prompt: 'Hire a frontend intern'
            };
          case 'invoice':
            return {
              title: 'No Invoices Generated Yet',
              description: 'Instruct the Finance Agent to compile billing details and update ledger statistics.',
              prompt: 'Create quotation for ABC Pvt Ltd'
            };
          case 'quotation':
            return {
              title: 'No Quotations Compiled Yet',
              description: 'Trigger the Sales Agent to draft quote licensing documents for active CRM leads.',
              prompt: 'Create quotation for ABC Pvt Ltd'
            };
          case 'meeting_minutes':
            return {
              title: 'No Meeting Minutes Synchronized',
              description: 'Schedule client briefs or sync operational parameters to index session files.',
              prompt: 'Schedule client meeting tomorrow at 3 PM'
            };
          case 'monthly_report':
            return {
              title: 'No Performance Reports Run',
              description: 'Coordinate data pipelines between CEO and Finance databases to compile report structures.',
              prompt: 'Generate July Sales Report'
            };
          default:
            return {
              title: 'Awaiting Document Orchestration',
              description: 'Select an active demo flow or prompt the AI Command Center.',
              prompt: ''
            };
        }
      };

      const details = getEmptyStateDetails();

      return (
        <div className="flex flex-col items-center justify-center h-80 text-center p-6 border border-white/5 border-dashed rounded-xl bg-slate-950/20 font-sans">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-4">
            <Sparkles size={20} className="text-brand-purple" />
          </div>
          <strong className="text-slate-200 text-xs font-semibold uppercase tracking-wider block font-mono">{details.title}</strong>
          <p className="text-[11px] text-zinc-500 mt-2 max-w-[280px] leading-relaxed">{details.description}</p>
          {details.prompt && (
            <div className="mt-4 p-2 bg-slate-950/60 rounded-lg border border-white/5 inline-flex items-center gap-1.5 text-[10px] text-brand-cyan font-mono select-all cursor-pointer" title="Double click to copy prompt text">
              <span className="text-zinc-600 font-bold uppercase text-[8px] tracking-widest bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded">Suggested prompt</span>
              <span>"{details.prompt}"</span>
            </div>
          )}
        </div>
      );
    }

    switch (activeDoc) {
      case 'offer_letter':
        return (
          <div className="p-6 bg-slate-950 text-slate-300 font-sans leading-relaxed text-xs border border-white/5 rounded-xl space-y-4">
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{currentDoc.company || 'NEXUS AI INC.'}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">100 Enterprise Way, Suite 400, SF, CA</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded uppercase">Offer Letter</span>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">Date: {currentDoc.date || 'July 6, 2026'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold text-white">Dear {currentDoc.name || 'Alex Rivera'},</p>
              <p>We are thrilled to offer you the position of <strong className="text-brand-cyan">{currentDoc.role || 'Frontend Engineering Intern'}</strong> at Nexus AI. We were incredibly impressed by your technical evaluations and passion for autonomous workflows.</p>
            </div>

            <div className="bg-slate-900/60 border border-white/5 rounded-lg p-3 grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-zinc-500 block">Compensation</span>
                <strong className="text-white">{currentDoc.salary || '$2,500'} per Month</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Commencement Date</span>
                <strong className="text-white">{currentDoc.startDate || 'August 1, 2026'}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Employment Status</span>
                <strong className="text-white">Temporary / Intern</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Location</span>
                <strong className="text-white">{currentDoc.location || 'Remote (SF HQ Core)'}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <p>Under this agreement, you will be entitled to participating in all weekly hack sprints. You will report directly to the Chief Technical Orchestrator.</p>
              <p>To accept this offer, please sign below and return this document before {currentDoc.expiryDate || 'July 15, 2026'}.</p>
            </div>

            <div className="pt-6 flex justify-between border-t border-white/5 text-[10px]">
              <div>
                <p className="text-zinc-500">Authorized Officer</p>
                <div className="h-6 flex items-end"><span className="italic font-serif text-brand-cyan text-sm">Nexus CEO Agent</span></div>
                <p className="font-semibold text-white mt-1 border-t border-white/10 pt-1">Jonathan Stark</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500">Accepted By Candidate</p>
                <div className="h-6 border-b border-white/10 w-32 ml-auto" />
                <p className="font-semibold text-white mt-1">Date: ____ / ____ / ____</p>
              </div>
            </div>
          </div>
        );

      case 'invoice':
        return (
          <div className="p-6 bg-slate-950 text-slate-300 font-sans leading-relaxed text-xs border border-white/5 rounded-xl space-y-4">
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{currentDoc.company || 'NEXUS AI INC.'}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">Invoicing Department</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded uppercase">Invoice</span>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">Invoice: {currentDoc.invoiceNo || 'INV-2026-089'}</p>
              </div>
            </div>

            <div className="flex justify-between text-[11px] bg-slate-900/40 p-3 rounded-lg border border-white/5">
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[9px] mb-1">Billed To</span>
                <strong className="text-white">{currentDoc.client || 'ABC Pvt Ltd'}</strong>
                <p className="text-zinc-400">{currentDoc.clientAddress || 'Tech Park Hub, Bangalore'}</p>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 block uppercase tracking-wider text-[9px] mb-1">Payment Details</span>
                <p className="text-zinc-400">Date: {currentDoc.date || 'July 6, 2026'}</p>
                <p className="text-zinc-400">Due: {currentDoc.dueDate || 'August 6, 2026'}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-white uppercase tracking-wider text-[9px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(currentDoc.items || [
                  { desc: 'Enterprise SaaS License (Tier 3)', qty: 1, rate: 4500, total: 4500 },
                  { desc: 'Custom AI Agent Integration Services', qty: 20, rate: 120, total: 2400 }
                ]).map((item, index) => (
                  <tr key={index} className="text-zinc-300">
                    <td className="py-2 font-medium">{item.desc}</td>
                    <td className="py-2 text-center">{item.qty}</td>
                    <td className="py-2 text-right">${item.rate.toLocaleString()}</td>
                    <td className="py-2 text-right text-white">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-white/5 pt-3 flex flex-col items-end space-y-1 text-xs">
              <div className="flex justify-between w-48 text-zinc-500">
                <span>Subtotal:</span>
                <span className="text-slate-300">${currentDoc.subtotal?.toLocaleString() || '$6,900'}</span>
              </div>
              <div className="flex justify-between w-48 text-zinc-500">
                <span>Tax (8%):</span>
                <span className="text-slate-300">${currentDoc.tax?.toLocaleString() || '$552'}</span>
              </div>
              <div className="flex justify-between w-48 border-t border-white/10 pt-1 font-bold text-white text-sm">
                <span>Total Due:</span>
                <span className="text-brand-cyan">${currentDoc.total?.toLocaleString() || '$7,452'}</span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-white/5 pt-3">
              <p>Wire instructions: Chase Bank | SWIFT: NEXUSAISF. Thank you for your business!</p>
            </div>
          </div>
        );

      case 'quotation':
        return (
          <div className="p-6 bg-slate-950 text-slate-300 font-sans leading-relaxed text-xs border border-white/5 rounded-xl space-y-4">
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{currentDoc.company || 'NEXUS AI INC.'}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">B2B Sales Pipeline</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">Quotation</span>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">Quote #: {currentDoc.quoteNo || 'QT-2026-904'}</p>
              </div>
            </div>

            <div className="flex justify-between text-[11px] bg-slate-900/40 p-3 rounded-lg border border-white/5">
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[9px] mb-1">Prepared For</span>
                <strong className="text-white">{currentDoc.client || 'XYZ Ltd'}</strong>
                <p className="text-zinc-400">{currentDoc.clientLocation || 'Global Core HQ'}</p>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 block uppercase tracking-wider text-[9px] mb-1">Validity</span>
                <p className="text-zinc-400">Date: {currentDoc.date || 'July 6, 2026'}</p>
                <p className="text-zinc-400">Expires: {currentDoc.expiryDate || 'August 6, 2026'}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-white uppercase tracking-wider text-[9px]">
                  <th className="py-2">Solution Package</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Pricing</th>
                  <th className="py-2 text-right">Extended Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(currentDoc.items || [
                  { desc: 'Nexus Business OS - Enterprise Node licenses', qty: 10, rate: 12000, total: 120000 },
                  { desc: 'Dedicated 24/7 Agent SLA Support Agreement', qty: 1, rate: 15000, total: 15000 }
                ]).map((item, index) => (
                  <tr key={index} className="text-zinc-300">
                    <td className="py-2 font-medium">{item.desc}</td>
                    <td className="py-2 text-center">{item.qty}</td>
                    <td className="py-2 text-right">${item.rate.toLocaleString()}</td>
                    <td className="py-2 text-right text-white">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-white/5 pt-3 flex flex-col items-end space-y-1 text-xs">
              <div className="flex justify-between w-48 text-zinc-500">
                <span>Gross Value:</span>
                <span className="text-slate-300">${currentDoc.gross?.toLocaleString() || '$135,000'}</span>
              </div>
              <div className="flex justify-between w-48 text-brand-purple">
                <span>Special Promo Discount (10%):</span>
                <span>-${currentDoc.discount?.toLocaleString() || '$13,500'}</span>
              </div>
              <div className="flex justify-between w-48 border-t border-white/10 pt-1 font-bold text-white text-sm">
                <span>Net Offer Price:</span>
                <span className="text-brand-cyan">${currentDoc.total?.toLocaleString() || '$121,500'}</span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 p-2.5 bg-slate-900 border border-white/5 rounded">
              <strong>T&C:</strong> Setup requires 7 business days from authorization. This quotation is generated dynamically by the Sales Orchestration Node.
            </div>
          </div>
        );

      case 'meeting_minutes':
        return (
          <div className="p-6 bg-slate-950 text-slate-300 font-sans leading-relaxed text-xs border border-white/5 rounded-xl space-y-4">
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{currentDoc.title || 'Client Alignment Synchronization'}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">Date: {currentDoc.date || 'July 7, 2026'} | Time: {currentDoc.time || '3:00 PM - 4:00 PM'}</p>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded uppercase">Minutes</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-900/40 p-3 rounded-lg border border-white/5">
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[9px] mb-0.5 font-bold">Attendees</span>
                <p className="text-white">{currentDoc.attendees || 'Jonathan Stark (CEO), Alex Rivera (HR), Vanguard Executive Team'}</p>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase tracking-wider text-[9px] mb-0.5 font-bold">Facilitator</span>
                <p className="text-white">{currentDoc.facilitator || 'Sales Agent Core'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <strong className="text-white uppercase tracking-wider text-[9px] block mb-1">Key Agenda & Discussions</strong>
                <ul className="list-disc pl-4 space-y-1 text-zinc-300">
                  {(currentDoc.agenda || [
                    'Reviewed Q3 enterprise software rollout requirements.',
                    'Evaluated custom knowledge base integrations with Client legacy CRM.',
                    'Discussed developer support SLA hours and pricing metrics.'
                  ]).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-white uppercase tracking-wider text-[9px] block mb-1">Action Items</strong>
                <ul className="list-decimal pl-4 space-y-1 text-zinc-300">
                  {(currentDoc.actions || [
                    'Sales Agent to compile custom proposal before Tuesday.',
                    'Finance Agent to verify volume discount margins.',
                    'HR Agent to reserve engineer slot for sandbox setup.'
                  ]).map((point, i) => (
                    <li key={i}><strong className="text-brand-cyan">[TODO]</strong> {point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-white/5 pt-2 flex justify-between">
              <span>Status: Calendar Block Reserved</span>
              <span>Compiled by: AI Minutes Processor</span>
            </div>
          </div>
        );

      case 'monthly_report':
        return (
          <div className="p-6 bg-slate-950 text-slate-300 font-sans leading-relaxed text-xs border border-white/5 rounded-xl space-y-4">
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{currentDoc.title || 'Corporate Performance Report'}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">Period: {currentDoc.period || 'June 2026 / Q2 Wrapup'}</p>
              </div>
              <span className="text-xs font-bold text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded uppercase">Monthly Report</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase font-bold">Total Revenue</span>
                <strong className="text-brand-cyan text-sm font-mono">{currentDoc.revenue || '$642,800'}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase font-bold">Avg Agent Utility</span>
                <strong className="text-brand-purple text-sm font-mono">{currentDoc.utility || '94.2%'}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase font-bold">Sales Closed</span>
                <strong className="text-white text-sm font-mono">{currentDoc.dealsClosed || '38'}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <strong className="text-white uppercase tracking-wider text-[9px] block">AI Analytics & Insights</strong>
              <div className="space-y-1.5 p-3 bg-slate-900/60 border border-white/5 rounded-lg text-zinc-300">
                <p>🚀 <strong className="text-white">Growth Spike:</strong> Revenue surged by <span className="text-emerald-400 font-bold">{currentDoc.growthRate || '14.2%'}</span> driven by customized developer integrations.</p>
                <p>📈 <strong className="text-white">Sales Efficiency:</strong> Average sales proposal cycles dropped from 48h to 24m using automated quotation agents.</p>
                <p>👥 <strong className="text-white">Team Synergy:</strong> Employee productivity is at record levels. The knowledge base answers over 90% of leave policy/office hours inquiries automatically.</p>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono border-t border-white/5 pt-2 flex justify-between">
              <span>Security level: RESTRICTED</span>
              <span>Generated: July 6, 2026 15:00</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col h-full min-h-[500px] relative overflow-hidden">
      {/* PDF Generation Loader Overlay */}
      {pdfProgress !== null && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-center rounded-2xl p-4">
          <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-semibold text-white font-mono">
            {pdfProgress === 100 ? '✓ PDF Generated' : `Generating PDF... ${pdfProgress}%`}
          </p>
          <div className="w-48 h-1.5 bg-slate-900 border border-white/5 rounded-full mt-2 overflow-hidden">
            <div className="bg-brand-cyan h-full transition-all duration-200" style={{ width: `${pdfProgress}%` }} />
          </div>
        </div>
      )}
      {/* Top section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-brand-purple" />
            AI Document Generator
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Preview generated business files dynamically.</p>
        </div>

        {/* Action buttons */}
        {currentDoc && (
          <div className="flex flex-wrap gap-1.5 justify-end">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-zinc-300 hover:text-white flex items-center gap-1 text-[10px] transition-all cursor-pointer"
              title="Copy details as raw payload"
            >
              {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
              <span>Payload</span>
            </button>
            
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-zinc-300 hover:text-white flex items-center gap-1 text-[10px] transition-all cursor-pointer"
              title="Print Document"
            >
              <span>Print</span>
            </button>

            <button
              onClick={() => onSendEmail(activeDoc, currentDoc)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-brand-cyan hover:text-white flex items-center gap-1 text-[10px] transition-all cursor-pointer"
              title="Dispatch as Email Attachment"
            >
              <span>Email</span>
            </button>

            <button
              onClick={() => onShareWhatsApp(activeDoc, currentDoc)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-emerald-400 hover:text-white flex items-center gap-1 text-[10px] transition-all cursor-pointer"
              title="Share via WhatsApp API"
            >
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-amber-500 hover:text-white flex items-center gap-1 text-[10px] transition-all cursor-pointer"
              title="Export as CSV/Excel Spreadsheet"
            >
              <span>CSV</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-lg text-[10px] hover:scale-102 cursor-pointer flex items-center gap-1.5 font-semibold"
              title="Download compiled PDF file"
            >
              <Download size={10} />
              <span>PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar mb-4 flex-shrink-0">
        {docKeys.map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeDoc === tab.key;
          const hasDoc = !!documents[tab.key];

          return (
            <button
              key={tab.key}
              onClick={() => onSelectDoc(tab.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-slate-900/50'
              }`}
            >
              <TabIcon size={12} className={hasDoc ? 'text-brand-cyan' : ''} />
              <span>{tab.label}</span>
              {hasDoc && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* File Preview Display Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {renderDocumentContent()}
      </div>
    </div>
  );
}
