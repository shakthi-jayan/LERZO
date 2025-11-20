
import { Student, Enquiry, Course, Batch, FeeStatus, EnquiryStatus, DashboardStats, Invoice } from './types';

export const APP_NAME = "Lerzo";
export const APP_SUBTITLE = "Student Management System";

export const MOCK_STATS: DashboardStats = {
  totalStudents: 1,
  totalEnquiries: 1,
  feesCollected: 5000.00,
  pendingFees: 7000.00,
  unpaidStudents: 0,
  partialStudents: 1,
  fullyPaidStudents: 0
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    enrollmentNo: '12345',
    name: 'SHAKTHI JAYAN',
    fathersName: 'JAYAN',
    course: 'HDCA TALLY',
    batch: 'Evening (4-6 PM)',
    mobile: '8778936713',
    feeStatus: FeeStatus.PARTIAL,
    totalFee: 12000,
    paidFee: 5000,
    balance: 7000,
    joinDate: '23/07/2025'
  }
];

export const MOCK_ENQUIRIES: Enquiry[] = [
  {
    id: '1',
    name: 'HUSSAIN',
    courseInterested: 'HDCA TALLY',
    mobile: '9344477375',
    qualification: '12TH',
    status: EnquiryStatus.ACTIVE,
    addedOn: '26/07/2025'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    name: 'HDCA TALLY',
    description: '-',
    duration: 6,
    fees: 12000,
    status: 'Active',
    studentsEnrolled: 1
  }
];

export const MOCK_BATCHES: Batch[] = [
  { id: '1', name: 'Morning (8-10 AM)', timing: '08:00 AM - 10:00 AM', startTime: '08:00', endTime: '10:00', status: 'Active', studentsEnrolled: 0 },
  { id: '2', name: 'Morning (10-12 PM)', timing: '10:00 AM - 12:00 PM', startTime: '10:00', endTime: '12:00', status: 'Active', studentsEnrolled: 0 },
  { id: '3', name: 'Afternoon (12-2 PM)', timing: '12:00 PM - 02:00 PM', startTime: '12:00', endTime: '14:00', status: 'Active', studentsEnrolled: 0 },
  { id: '4', name: 'Evening (4-6 PM)', timing: '04:00 PM - 06:00 PM', startTime: '16:00', endTime: '18:00', status: 'Active', studentsEnrolled: 1 },
];

export const MOCK_INVOICES: Invoice[] = [];

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { section: 'STUDENTS' },
  { label: 'All Students', path: '/students', icon: 'Users' },
  { label: 'Add Student', path: '/students/add', icon: 'UserPlus' },
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
