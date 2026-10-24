export type RequestStatus = 'Open' | 'In Progress' | 'Resolved';

export type RequestPriority = 'Low' | 'Medium' | 'High';

export type RequestCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Wi-Fi / Internet'
  | 'Classroom / Laboratory'
  | 'Cleaning and Maintenance'
  | 'Hostel'
  | 'Transport'
  | 'Canteen'
  | 'Other';

export interface TimelineEntry {
  id: string;
  status: RequestStatus;
  timestamp: string;
  updatedBy: string; // e.g. "Campus Facility Team", "Network Admin", "Student (Submission)"
  note?: string;
}

export interface CampusRequest {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  location: string;
  contactName: string;
  contactInfo: string; // email or phone
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
  staffNotes?: string;
  assignedStaff?: string;
}

export type UserRole = 'student' | 'staff';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
