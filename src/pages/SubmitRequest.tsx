import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import { validateRequestForm, FormValues, FormErrors } from '../utils/validation';
import { generateRequestId } from '../utils/generateRequestId';
import { RequestCategory, RequestPriority, CampusRequest } from '../types';
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Send,
  ArrowLeft,
  MapPin,
  User,
  Mail,
  FileText,
  Layers,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES: RequestCategory[] = [
  'Electrical',
  'Plumbing',
  'Wi-Fi / Internet',
  'Classroom / Laboratory',
  'Cleaning and Maintenance',
  'Hostel',
  'Transport',
  'Canteen',
  'Other',
];

const INITIAL_FORM: FormValues = {
  title: '',
  category: '',
  description: '',
  location: '',
  contactName: '',
  contactInfo: '',
  priority: 'Medium',
};

export const SubmitRequest: React.FC = () => {
  const { createRequest } = useRequests();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormValues>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<CampusRequest | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePrioritySelect = (priority: RequestPriority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRequestForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error smoothly
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate brief network latency for realistic feel
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newId = generateRequestId();
      const created = await createRequest({
        id: newId,
        title: formData.title.trim(),
        category: formData.category as RequestCategory,
        description: formData.description.trim(),
        location: formData.location.trim(),
        contactName: formData.contactName.trim(),
        contactInfo: formData.contactInfo.trim(),
        priority: formData.priority,
        status: 'Open',
        assignedStaff: 'Awaiting Staff Assignment',
      });

      setSubmittedTicket(created);
      // Clear form
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      console.error('Failed to submit request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketId = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If successfully submitted, render confirmation screen
  if (submittedTicket) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Request Submitted Successfully!</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your campus helpdesk ticket has been logged and queued for facility review. You can track updates at any time using your ticket ID.
            </p>
          </div>

          {/* Ticket ID Box */}
          <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-md mx-auto">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Assigned Ticket ID
              </span>
              <span className="font-mono text-xl font-extrabold text-indigo-700">
                {submittedTicket.id}
              </span>
            </div>

            <button
              onClick={copyTicketId}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Ticket summary mini recap */}
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 text-left text-xs space-y-1.5 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold text-slate-800">{submittedTicket.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-800">{submittedTicket.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-rose-600">{submittedTicket.status}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setSubmittedTicket(null)}
              className="px-6 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Submit Another Request
            </button>
            <Link
              to={`/requests/${submittedTicket.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Track My Request</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="mb-6 space-y-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Report a Campus Issue
            </h1>
            <p className="text-xs text-slate-500">
              Submit your maintenance, technical, or facility concern directly to staff.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Form Card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6"
      >
        {/* Category & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="category"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Issue Category</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.category
                  ? 'border-rose-300 ring-rose-200 text-rose-900'
                  : 'border-slate-200 focus:ring-indigo-500 text-slate-800'
              }`}
            >
              <option value="">Select a campus category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.category}</span>
              </p>
            )}
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Priority Level</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as RequestPriority[]).map((level) => {
                const isSelected = formData.priority === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handlePrioritySelect(level)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? level === 'High'
                          ? 'bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-300'
                          : level === 'Medium'
                          ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-300'
                          : 'bg-indigo-50 border-indigo-400 text-indigo-700 ring-2 ring-indigo-300'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {formData.priority === 'High' && 'Urgent safety or campus outage.'}
              {formData.priority === 'Medium' && 'Standard facility issue requiring attention.'}
              {formData.priority === 'Low' && 'Minor aesthetic or non-urgent suggestion.'}
            </p>
          </div>
        </div>

        {/* Issue Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Short Issue Heading / Title</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Wi-Fi drops out in Library Quiet Zone, Water leak in Block B..."
            className={`w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              errors.title
                ? 'border-rose-300 ring-rose-200 text-rose-900'
                : 'border-slate-200 focus:ring-indigo-500 text-slate-800'
            }`}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Detailed Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Detailed Explanation</span>
            <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Please describe what happened, when it started, and any symptoms or specific equipment involved..."
            className={`w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${
              errors.description
                ? 'border-rose-300 ring-rose-200 text-rose-900'
                : 'border-slate-200 focus:ring-indigo-500 text-slate-800'
            }`}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Campus Location</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Science Block A, 2nd Floor, Room 204 or East Campus Cafeteria"
            className={`w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              errors.location
                ? 'border-rose-300 ring-rose-200 text-rose-900'
                : 'border-slate-200 focus:ring-indigo-500 text-slate-800'
            }`}
          />
          {errors.location && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.location}</span>
            </p>
          )}
        </div>

        {/* Student Contact Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
          <div>
            <label
              htmlFor="contactName"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Student / Reporter Name</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="e.g. Jordan Smith"
              className={`w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.contactName
                  ? 'border-rose-300 ring-rose-200 text-rose-900'
                  : 'border-slate-200 focus:ring-indigo-500 text-slate-800'
              }`}
            />
            {errors.contactName && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.contactName}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contactInfo"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Contact Email or Phone</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="e.g. jsmith@campus.edu or 555-0182"
              className={`w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.contactInfo
                  ? 'border-rose-300 ring-rose-200 text-rose-900'
                  : 'border-slate-200 focus:ring-indigo-500 text-slate-800'
              }`}
            />
            {errors.contactInfo && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.contactInfo}</span>
              </p>
            )}
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 shadow-lg shadow-indigo-600/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Logging Issue...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Ticket</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
