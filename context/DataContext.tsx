
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Enquiry, FeeStatus, EnquiryStatus, Payment, Course, Batch, Scheme } from '../types';
import { MOCK_STUDENTS, MOCK_ENQUIRIES, MOCK_COURSES, MOCK_BATCHES } from '../constants';

interface DataContextType {
  students: Student[];
  enquiries: Enquiry[];
  payments: Payment[];
  courses: Course[];
  batches: Batch[];
  schemes: Scheme[];
  
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updatedStudent: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  addEnquiry: (enquiry: Enquiry) => void;
  updateEnquiry: (id: string, updatedEnquiry: Partial<Enquiry>) => void;
  deleteEnquiry: (id: string) => void;
  convertEnquiryToStudent: (enquiryId: string) => Enquiry | undefined;
  
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updatedCourse: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  addBatch: (batch: Batch) => void;
  updateBatch: (id: string, updatedBatch: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  addScheme: (scheme: Scheme) => void;
  updateScheme: (id: string, updatedScheme: Partial<Scheme>) => void;
  deleteScheme: (id: string) => void;

  getStudent: (id: string) => Student | undefined;
  getEnquiry: (id: string) => Enquiry | undefined;
  getCourse: (id: string) => Course | undefined;
  getBatch: (id: string) => Batch | undefined;
  getScheme: (id: string) => Scheme | undefined;

  recordPayment: (payment: Payment) => void;
  getStudentPayments: (studentId: string) => Payment[];

  restoreData: (data: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or fallback to MOCK data
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('lerzo_students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('lerzo_enquiries');
    return saved ? JSON.parse(saved) : MOCK_ENQUIRIES;
  });
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('lerzo_courses');
    return saved ? JSON.parse(saved) : MOCK_COURSES;
  });
  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem('lerzo_batches');
    return saved ? JSON.parse(saved) : MOCK_BATCHES;
  });
  const [schemes, setSchemes] = useState<Scheme[]>(() => {
    const saved = localStorage.getItem('lerzo_schemes');
    return saved ? JSON.parse(saved) : [{ id: '1', name: 'CHRISTMAS 2025', description: 'Holiday special', discountPercent: 10 }];
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('lerzo_payments');
    return saved ? JSON.parse(saved) : [{ id: '101', studentId: '1', amount: 2000, date: '2025-11-20', method: 'Online', notes: 'Initial payment' }];
  });

  // Persist to localStorage whenever state changes
  useEffect(() => localStorage.setItem('lerzo_students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('lerzo_enquiries', JSON.stringify(enquiries)), [enquiries]);
  useEffect(() => localStorage.setItem('lerzo_courses', JSON.stringify(courses)), [courses]);
  useEffect(() => localStorage.setItem('lerzo_batches', JSON.stringify(batches)), [batches]);
  useEffect(() => localStorage.setItem('lerzo_schemes', JSON.stringify(schemes)), [schemes]);
  useEffect(() => localStorage.setItem('lerzo_payments', JSON.stringify(payments)), [payments]);

  // --- Student Actions ---
  const addStudent = (student: Student) => {
    setStudents((prev) => [student, ...prev]);
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, ...updatedStudent } : student))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
    setPayments((prev) => prev.filter((p) => p.studentId !== id));
  };

  const getStudent = (id: string) => {
    return students.find(s => s.id === id);
  };

  // --- Enquiry Actions ---
  const addEnquiry = (enquiry: Enquiry) => {
    setEnquiries((prev) => [enquiry, ...prev]);
  };

  const updateEnquiry = (id: string, updatedEnquiry: Partial<Enquiry>) => {
    setEnquiries((prev) =>
      prev.map((enq) => (enq.id === id ? { ...enq, ...updatedEnquiry } : enq))
    );
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((enq) => enq.id !== id));
  };

  const getEnquiry = (id: string) => {
    return enquiries.find(e => e.id === id);
  };

  const convertEnquiryToStudent = (enquiryId: string) => {
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (enquiry) {
      updateEnquiry(enquiryId, { status: EnquiryStatus.CONVERTED });
      return enquiry;
    }
    return undefined;
  };

  // --- Payment Actions ---
  const recordPayment = (payment: Payment) => {
      setPayments(prev => [payment, ...prev]);
      
      // Update Student Balance automatically
      const student = students.find(s => s.id === payment.studentId);
      if (student) {
          const newPaid = (student.paidFee || 0) + Number(payment.amount);
          const netFee = (student.totalFee || 0) - (student.concession || 0);
          const newBalance = netFee - newPaid;
          
          let newStatus = FeeStatus.UNPAID;
          if (newPaid >= netFee) newStatus = FeeStatus.PAID;
          else if (newPaid > 0) newStatus = FeeStatus.PARTIAL;

          updateStudent(student.id, {
              paidFee: newPaid,
              balance: newBalance,
              feeStatus: newStatus
          });
      }
  };

  const getStudentPayments = (studentId: string) => {
      return payments.filter(p => p.studentId === studentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // --- Course Actions ---
  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };
  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updatedCourse } : c));
  };
  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };
  const getCourse = (id: string) => courses.find(c => c.id === id);

  // --- Batch Actions ---
  const addBatch = (batch: Batch) => {
    setBatches(prev => [...prev, batch]);
  };
  const updateBatch = (id: string, updatedBatch: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updatedBatch } : b));
  };
  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
  };
  const getBatch = (id: string) => batches.find(b => b.id === id);

  // --- Scheme Actions ---
  const addScheme = (scheme: Scheme) => {
    setSchemes(prev => [...prev, scheme]);
  };
  const updateScheme = (id: string, updatedScheme: Partial<Scheme>) => {
    setSchemes(prev => prev.map(s => s.id === id ? { ...s, ...updatedScheme } : s));
  };
  const deleteScheme = (id: string) => {
    setSchemes(prev => prev.filter(s => s.id !== id));
  };
  const getScheme = (id: string) => schemes.find(s => s.id === id);

  // --- Restore Action ---
  const restoreData = (data: any) => {
    if (data.students && Array.isArray(data.students)) setStudents(data.students);
    if (data.enquiries && Array.isArray(data.enquiries)) setEnquiries(data.enquiries);
    if (data.payments && Array.isArray(data.payments)) setPayments(data.payments);
    if (data.courses && Array.isArray(data.courses)) setCourses(data.courses);
    if (data.batches && Array.isArray(data.batches)) setBatches(data.batches);
    if (data.schemes && Array.isArray(data.schemes)) setSchemes(data.schemes);
    
    // Alert removed to prevent sandbox blocking. 
    // The calling component should handle notifications.
  };

  return (
    <DataContext.Provider
      value={{
        students, enquiries, payments, courses, batches, schemes,
        addStudent, updateStudent, deleteStudent, getStudent,
        addEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, convertEnquiryToStudent,
        addCourse, updateCourse, deleteCourse, getCourse,
        addBatch, updateBatch, deleteBatch, getBatch,
        addScheme, updateScheme, deleteScheme, getScheme,
        recordPayment, getStudentPayments,
        restoreData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
