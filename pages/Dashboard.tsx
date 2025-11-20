
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, IndianRupee, Clock, AlertTriangle, Download } from 'lucide-react';
import { useData } from '../context/DataContext';
import { FeeStatus } from '../types';

const StatCard = ({ title, value, icon: Icon, bgClass, subText }: any) => (
  <div className={`p-6 rounded-xl shadow-sm text-white ${bgClass} relative overflow-hidden`}>
    <div className="relative z-10">
      <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
      {subText && <p className="mt-2 text-sm opacity-90">{subText}</p>}
    </div>
    <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 opacity-20" />
  </div>
);

const QuickAction = ({ label, icon: Icon, color, onClick, isLink, to }: any) => {
  const className = `flex items-center justify-center gap-2 w-full p-3 rounded-lg border transition-all font-medium text-sm ${color}`;
  if (isLink) {
    return <Link to={to} className={className}><Icon className="w-4 h-4" /> {label}</Link>;
  }
  return <button onClick={onClick} className={className}><Icon className="w-4 h-4" /> {label}</button>;
};

export const Dashboard = () => {
  const { students, enquiries } = useData();

  // Calculate Real-time Stats
  const totalStudents = students.length;
  const totalEnquiries = enquiries.filter(e => e.status !== 'Converted' && e.status !== 'Closed').length; // Only Active
  
  const feesCollected = students.reduce((sum, student) => sum + (student.paidFee || 0), 0);
  const pendingFees = students.reduce((sum, student) => sum + (student.balance || 0), 0);
  
  const fullyPaidStudents = students.filter(s => s.feeStatus === FeeStatus.PAID).length;
  const partialStudents = students.filter(s => s.feeStatus === FeeStatus.PARTIAL).length;
  const unpaidStudents = students.filter(s => s.feeStatus === FeeStatus.UNPAID).length;

  // Get Recent Data
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 5);
    
  const recentEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-slate-800">
          <div className="p-2 bg-blue-100 rounded-lg">
             <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/students/add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
            <UserPlus className="w-4 h-4" /> Add Student
          </Link>
          <Link to="/enquiries/add" className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium shadow-sm">
            <UserPlus className="w-4 h-4" /> Add Enquiry
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={totalStudents} 
          icon={Users} 
          bgClass="bg-blue-600" 
        />
        <StatCard 
          title="Active Enquiries" 
          value={totalEnquiries} 
          icon={UserPlus} 
          bgClass="bg-sky-500" 
        />
        <StatCard 
          title="Fees Collected" 
          value={`₹${feesCollected.toLocaleString('en-IN')}`} 
          icon={IndianRupee} 
          bgClass="bg-green-600" 
        />
        <StatCard 
          title="Pending Fees" 
          value={`₹${pendingFees.toLocaleString('en-IN')}`} 
          icon={Clock} 
          bgClass="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-slate-600 font-medium mb-6">Fee Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-100 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{fullyPaidStudents}</div>
              <div className="text-sm text-green-700 font-medium">Fully Paid</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{partialStudents}</div>
              <div className="text-sm text-orange-700 font-medium">Partially Paid</div>
            </div>
            <div className="bg-red-50 border border-red-100 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">{unpaidStudents}</div>
              <div className="text-sm text-red-700 font-medium">Unpaid</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-slate-600 font-medium mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <QuickAction 
              label="View Unpaid Students" 
              icon={AlertTriangle} 
              color="bg-white text-red-600 border-red-600 hover:bg-red-50" 
              isLink to="/students?filter=unpaid"
            />
            <QuickAction 
              label="View Partial Payments" 
              icon={Clock} 
              color="bg-white text-orange-600 border-orange-600 hover:bg-orange-50" 
              isLink to="/students?filter=partial"
            />
            <QuickAction 
              label="Export Data" 
              icon={Download} 
              color="bg-white text-blue-600 border-blue-600 hover:bg-blue-50" 
              isLink to="/export"
            />
          </div>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-blue-500 font-medium">Recent Students</h2>
            <Link to="/students" className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.length > 0 ? recentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-blue-600">{student.name}</td>
                    <td className="px-6 py-4 text-slate-600">{student.course}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        student.feeStatus === FeeStatus.PAID ? 'bg-green-100 text-green-700' :
                        student.feeStatus === FeeStatus.PARTIAL ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {student.feeStatus}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="p-4 text-center text-slate-400">No students yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-blue-500 font-medium">Recent Enquiries</h2>
            <Link to="/enquiries" className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Mobile</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEnquiries.length > 0 ? recentEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{enquiry.name}</td>
                    <td className="px-6 py-4 text-slate-600">{enquiry.courseInterested}</td>
                    <td className="px-6 py-4 text-slate-600">{enquiry.mobile}</td>
                    <td className="px-6 py-4">
                       <Link to={`/enquiries/edit/${enquiry.id}`} className="bg-green-500 text-white p-1.5 rounded hover:bg-green-600 inline-block">
                         <UserPlus className="w-4 h-4" />
                       </Link>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="p-4 text-center text-slate-400">No enquiries yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
