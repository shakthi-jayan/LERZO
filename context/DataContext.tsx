
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Student, Enquiry, FeeStatus, EnquiryStatus, Payment, Course, Batch, Scheme } from '../types';

interface DataContextType {
  students: Student[];
  enquiries: Enquiry[];
  payments: Payment[];
  courses: Course[];
  batches: Batch[];
  schemes: Scheme[];
  loading: boolean;
  
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updatedStudent: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  addEnquiry: (enquiry: Enquiry) => void;
  updateEnquiry: (id: string, updatedEnquiry: Partial<Enquiry>) => void;
  deleteEnquiry: (id: string) => void;
  convertEnquiryToStudent: (enquiryId: string) => Promise<Enquiry | undefined>;
  
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

  restoreData: (data: any) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore Collections
  useEffect(() => {
    const unsubStudents = onSnapshot(collection(db, "students"), (snap) => {
      const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Student));
      setStudents(data);
    });
    const unsubEnquiries = onSnapshot(collection(db, "enquiries"), (snap) => {
        const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Enquiry));
        setEnquiries(data);
    });
    const unsubCourses = onSnapshot(collection(db, "courses"), (snap) => {
        const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Course));
        setCourses(data);
    });
    const unsubBatches = onSnapshot(collection(db, "batches"), (snap) => {
        const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Batch));
        setBatches(data);
    });
    const unsubSchemes = onSnapshot(collection(db, "schemes"), (snap) => {
        const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Scheme));
        setSchemes(data);
    });
    const unsubPayments = onSnapshot(collection(db, "payments"), (snap) => {
        const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Payment));
        setPayments(data);
    });

    setLoading(false);

    return () => {
        unsubStudents();
        unsubEnquiries();
        unsubCourses();
        unsubBatches();
        unsubSchemes();
        unsubPayments();
    };
  }, []);

  // --- Helpers ---
  // We use setDoc with the ID provided by the app logic (usually Date.now()) to keep consistency
  // rather than addDoc which creates random IDs, because some app logic might rely on the generated ID before saving.

  // --- Student Actions ---
  const addStudent = async (student: Student) => {
    await setDoc(doc(db, "students", student.id), student);
  };

  const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
    await updateDoc(doc(db, "students", id), updatedStudent);
  };

  const deleteStudent = async (id: string) => {
    await deleteDoc(doc(db, "students", id));
    // Cleanup payments
    const studentPayments = payments.filter(p => p.studentId === id);
    const batch = writeBatch(db);
    studentPayments.forEach(p => {
        batch.delete(doc(db, "payments", p.id));
    });
    await batch.commit();
  };

  const getStudent = (id: string) => students.find(s => s.id === id);

  // --- Enquiry Actions ---
  const addEnquiry = async (enquiry: Enquiry) => {
    await setDoc(doc(db, "enquiries", enquiry.id), enquiry);
  };

  const updateEnquiry = async (id: string, updatedEnquiry: Partial<Enquiry>) => {
    await updateDoc(doc(db, "enquiries", id), updatedEnquiry);
  };

  const deleteEnquiry = async (id: string) => {
    await deleteDoc(doc(db, "enquiries", id));
  };

  const getEnquiry = (id: string) => enquiries.find(e => e.id === id);

  const convertEnquiryToStudent = async (enquiryId: string) => {
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (enquiry) {
      await updateEnquiry(enquiryId, { status: EnquiryStatus.CONVERTED });
      return enquiry;
    }
    return undefined;
  };

  // --- Payment Actions ---
  const recordPayment = async (payment: Payment) => {
      await setDoc(doc(db, "payments", payment.id), payment);
      
      // Update Student Balance automatically
      const student = students.find(s => s.id === payment.studentId);
      if (student) {
          const newPaid = (student.paidFee || 0) + Number(payment.amount);
          const netFee = (student.totalFee || 0) - (student.concession || 0);
          const newBalance = netFee - newPaid;
          
          let newStatus = FeeStatus.UNPAID;
          if (newPaid >= netFee) newStatus = FeeStatus.PAID;
          else if (newPaid > 0) newStatus = FeeStatus.PARTIAL;

          await updateStudent(student.id, {
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
  const addCourse = async (course: Course) => {
    await setDoc(doc(db, "courses", course.id), course);
  };
  const updateCourse = async (id: string, updatedCourse: Partial<Course>) => {
    await updateDoc(doc(db, "courses", id), updatedCourse);
  };
  const deleteCourse = async (id: string) => {
    await deleteDoc(doc(db, "courses", id));
  };
  const getCourse = (id: string) => courses.find(c => c.id === id);

  // --- Batch Actions ---
  const addBatch = async (batch: Batch) => {
    await setDoc(doc(db, "batches", batch.id), batch);
  };
  const updateBatch = async (id: string, updatedBatch: Partial<Batch>) => {
    await updateDoc(doc(db, "batches", id), updatedBatch);
  };
  const deleteBatch = async (id: string) => {
    await deleteDoc(doc(db, "batches", id));
  };
  const getBatch = (id: string) => batches.find(b => b.id === id);

  // --- Scheme Actions ---
  const addScheme = async (scheme: Scheme) => {
    await setDoc(doc(db, "schemes", scheme.id), scheme);
  };
  const updateScheme = async (id: string, updatedScheme: Partial<Scheme>) => {
    await updateDoc(doc(db, "schemes", id), updatedScheme);
  };
  const deleteScheme = async (id: string) => {
    await deleteDoc(doc(db, "schemes", id));
  };
  const getScheme = (id: string) => schemes.find(s => s.id === id);

  // --- Restore Action (Writes bulk data to Firestore) ---
  const restoreData = async (data: any) => {
    const batch = writeBatch(db);

    if (data.students) data.students.forEach((s: any) => batch.set(doc(db, "students", s.id), s));
    if (data.enquiries) data.enquiries.forEach((e: any) => batch.set(doc(db, "enquiries", e.id), e));
    if (data.payments) data.payments.forEach((p: any) => batch.set(doc(db, "payments", p.id), p));
    if (data.courses) data.courses.forEach((c: any) => batch.set(doc(db, "courses", c.id), c));
    if (data.batches) data.batches.forEach((b: any) => batch.set(doc(db, "batches", b.id), b));
    if (data.schemes) data.schemes.forEach((s: any) => batch.set(doc(db, "schemes", s.id), s));

    await batch.commit();
  };

  return (
    <DataContext.Provider
      value={{
        students, enquiries, payments, courses, batches, schemes, loading,
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
