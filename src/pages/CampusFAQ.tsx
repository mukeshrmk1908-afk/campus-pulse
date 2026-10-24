import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  PhoneCall,
  Clock,
  ShieldAlert,
  Zap,
  Wifi,
  Droplets,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Response Times',
    question: 'How fast do campus maintenance teams respond to reported issues?',
    answer:
      'High-priority emergency issues (such as water leaks, exposed electrical wiring, or security access faults) are dispatched within 2 hours. Medium-priority requests (classroom projectors, Wi-Fi connectivity) are typically serviced within 24 hours. General cosmetic maintenance is resolved in 2-3 business days.',
  },
  {
    category: 'Tracking',
    question: 'How do I check the live status of my submitted request?',
    answer:
      'Every submission receives a unique ticket ID (e.g. CMP-2026-1042). You can view the live progress on the "My Requests" tab or search by ID directly in the dashboard search bar. When staff change the status or post resolution notes, your dashboard updates immediately.',
  },
  {
    category: 'Wi-Fi & IT',
    question: 'What should I do if the campus eduroam / Wi-Fi is down during an exam?',
    answer:
      'For immediate exam disruptions, please inform your exam proctor or lab technician right away. You can also file a ticket under "Wi-Fi / Internet" with priority set to "High", including your exact room number and device MAC address if known.',
  },
  {
    category: 'Hostel & Residential',
    question: 'Who handles hostel room maintenance after hours?',
    answer:
      'Hostel Resident Assistants (RAs) and on-call facility caretakers are on duty 24/7. For plumbing overflows or lockouts after 9 PM, contact the hostel front desk or call the 24/7 Security Hotline at ext. 4444.',
  },
  {
    category: 'Submissions',
    question: 'Can I submit an issue on behalf of a friend or classmate?',
    answer:
      'Yes! When filing the form, enter the name and contact details of the person nearest to the issue so maintenance crews can coordinate entry or verify resolution directly.',
  },
];

export const CampusFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 rounded-3xl p-6 sm:p-10 text-white space-y-3 shadow-xl shadow-indigo-600/15">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Student Support Resource</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Campus Help & Guidelines
        </h1>
        <p className="text-xs sm:text-base text-indigo-100 max-w-2xl leading-relaxed">
          Quick answers to common campus facility questions, expected resolution times, and emergency directory contacts.
        </p>
      </div>

      {/* SLA Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            High Priority / Safety
          </h3>
          <p className="text-xl font-extrabold text-rose-600">&lt; 2 Hours</p>
          <p className="text-[11px] text-slate-500">
            Water leaks, power blackouts, hazardous blockages, entry security.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Medium Priority
          </h3>
          <p className="text-xl font-extrabold text-indigo-600">&lt; 24 Hours</p>
          <p className="text-[11px] text-slate-500">
            Classroom projectors, network drops, canteen fountains, transit delays.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Low Priority
          </h3>
          <p className="text-xl font-extrabold text-emerald-600">2-3 Business Days</p>
          <p className="text-[11px] text-slate-500">
            Aesthetic touch-ups, light fixture replacements, furniture tweaks.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3 pt-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-3 text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Contact Hub */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-400" />
              <span>Campus Emergency Directory</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              For immediate threats to life, medical emergencies, or building hazards.
            </p>
          </div>
          <Link
            to="/submit"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-indigo-50 self-start sm:self-auto transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Submit Issue Now</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Campus Security
            </span>
            <span className="font-mono text-sm font-bold text-white">Ext. 4444</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">24/7 Central Dispatch</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Campus Health Center
            </span>
            <span className="font-mono text-sm font-bold text-white">Ext. 2110</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Mon-Sat (8 AM - 8 PM)</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              IT Systems Helpdesk
            </span>
            <span className="font-mono text-sm font-bold text-white">Ext. 1200</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">it-help@campus.edu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
