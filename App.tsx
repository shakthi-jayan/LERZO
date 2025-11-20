
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './lib/firebase';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { AddStudent } from './pages/AddStudent';
import { StudentDetails } from './pages/StudentDetails';
import { RecordPayment } from './pages/RecordPayment';
import { Enquiries } from './pages/Enquiries';
import { AddEnquiry } from './pages/AddEnquiry';
import { ExportData } from './pages/ExportData';
import { Courses } from './pages/Courses';
import { AddCourse } from './pages/AddCourse';
import { Schemes } from './pages/Schemes';
import { AddScheme } from './pages/AddScheme';
import { Batches } from './pages/Batches';
import { AddBatch } from './pages/AddBatch';
import { Settings } from './pages/Settings';
import { Subscription } from './pages/Subscription';
import { Backup } from './pages/Backup';
import { Login } from './pages/Login';
import { BulkSMS } from './pages/BulkSMS';
import { WifiOff } from 'lucide-react';
import { DataProvider } from './context/DataContext';

// Private Route Wrapper
const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
     // Check for developer bypass
     if (localStorage.getItem('lerzo_bypass_auth') === 'true') {
        setIsAuthenticated(true);
        return;
     }

     const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
           setIsAuthenticated(true);
        } else {
           setIsAuthenticated(false);
        }
     });
     return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) return <div className="h-screen flex items-center justify-center text-slate-400 text-sm font-medium">Loading Application...</div>;

  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
      <Route path="/students/add" element={<PrivateRoute><AddStudent /></PrivateRoute>} />
      <Route path="/students/edit/:id" element={<PrivateRoute><AddStudent /></PrivateRoute>} />
      <Route path="/students/:id" element={<PrivateRoute><StudentDetails /></PrivateRoute>} />
      <Route path="/students/:id/pay-fees" element={<PrivateRoute><RecordPayment /></PrivateRoute>} />
      <Route path="/bulk-sms" element={<PrivateRoute><BulkSMS /></PrivateRoute>} />
      
      <Route path="/enquiries" element={<PrivateRoute><Enquiries /></PrivateRoute>} />
      <Route path="/enquiries/add" element={<PrivateRoute><AddEnquiry /></PrivateRoute>} />
      <Route path="/enquiries/edit/:id" element={<PrivateRoute><AddEnquiry /></PrivateRoute>} />
      
      <Route path="/export" element={<PrivateRoute><ExportData /></PrivateRoute>} />
      
      <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
      <Route path="/courses/add" element={<PrivateRoute><AddCourse /></PrivateRoute>} />
      <Route path="/courses/edit/:id" element={<PrivateRoute><AddCourse /></PrivateRoute>} />
      
      <Route path="/schemes" element={<PrivateRoute><Schemes /></PrivateRoute>} />
      <Route path="/schemes/add" element={<PrivateRoute><AddScheme /></PrivateRoute>} />
      <Route path="/schemes/edit/:id" element={<PrivateRoute><AddScheme /></PrivateRoute>} />
      
      <Route path="/batches" element={<PrivateRoute><Batches /></PrivateRoute>} />
      <Route path="/batches/add" element={<PrivateRoute><AddBatch /></PrivateRoute>} />
      <Route path="/batches/edit/:id" element={<PrivateRoute><AddBatch /></PrivateRoute>} />
      
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
      <Route path="/backup" element={<PrivateRoute><Backup /></PrivateRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <DataProvider>
      <Router>
        <AppRoutes />
      </Router>
    </DataProvider>
  );
};

export default App;
