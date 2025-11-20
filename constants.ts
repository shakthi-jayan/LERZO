
import { DashboardStats, Invoice } from './types';

export const APP_NAME = "Lerzo";
export const APP_SUBTITLE = "Student Management System";

export const MOCK_STATS: DashboardStats = {
  totalStudents: 0,
  totalEnquiries: 0,
  feesCollected: 0,
  pendingFees: 0,
  unpaidStudents: 0,
  partialStudents: 0,
  fullyPaidStudents: 0
};

// Mock data removed in favor of Firestore data
export const MOCK_STUDENTS = [];
export const MOCK_ENQUIRIES = [];
export const MOCK_COURSES = [];
export const MOCK_BATCHES = [];
export const MOCK_INVOICES: Invoice[] = [];

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { section: 'STUDENTS' },
  { label: 'All Students', path: '/students', icon: 'Users' },
  { label: 'Add Student', path: '/students/add', icon: 'UserPlus' },
  { label: 'Bulk SMS', path: '/bulk-sms', icon: 'MessageSquare' },
  { section: 'ENQUIRIES' },
  { label: 'All Enquiries', path: '/enquiries', icon: 'ClipboardList' },
  { label: 'Add Enquiry', path: '/enquiries/add', icon: 'FilePlus' },
  { section: 'MANAGE' },
  { label: 'Courses', path: '/courses', icon: 'BookOpen' },
  { label: 'Schemes', path: '/schemes', icon: 'Tag' },
  { label: 'Batches', path: '/batches', icon: 'Clock' },
  { label: 'Export Data', path: '/export', icon: 'Download' },
  { section: 'SYSTEM' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
  { label: 'Subscription', path: '/subscription', icon: 'CreditCard' },
  { label: 'Backup & Restore', path: '/backup', icon: 'Database' },
];
