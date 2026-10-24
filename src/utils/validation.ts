import { RequestCategory, RequestPriority } from '../types';

export interface FormValues {
  title: string;
  category: RequestCategory | '';
  description: string;
  location: string;
  contactName: string;
  contactInfo: string;
  priority: RequestPriority;
}

export interface FormErrors {
  title?: string;
  category?: string;
  description?: string;
  location?: string;
  contactName?: string;
  contactInfo?: string;
}

export function validateRequestForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Issue title is required.';
  } else if (values.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long.';
  } else if (values.title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters.';
  }

  if (!values.category) {
    errors.category = 'Please select a valid campus category.';
  }

  if (!values.description.trim()) {
    errors.description = 'Detailed description is required.';
  } else if (values.description.trim().length < 15) {
    errors.description = 'Please provide more detail (at least 15 characters).';
  }

  if (!values.location.trim()) {
    errors.location = 'Campus location is required (e.g. Block C, Room 302).';
  } else if (values.location.trim().length < 3) {
    errors.location = 'Please specify a clear location (at least 3 characters).';
  }

  if (!values.contactName.trim()) {
    errors.contactName = 'Student name is required.';
  } else if (values.contactName.trim().length < 2) {
    errors.contactName = 'Name must be at least 2 characters.';
  }

  if (!values.contactInfo.trim()) {
    errors.contactInfo = 'Contact email or phone number is required.';
  } else {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactInfo.trim());
    const isPhone = /^[\d+()-\s]{7,16}$/.test(values.contactInfo.trim());
    if (!isEmail && !isPhone) {
      errors.contactInfo = 'Please enter a valid email address or phone number.';
    }
  }

  return errors;
}
