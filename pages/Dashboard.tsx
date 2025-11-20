import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, IndianRupee, Clock, AlertTriangle, Download } from 'lucide-react';
import { MOCK_STATS, MOCK_STUDENTS, MOCK_ENQUIRIES } from '../constants';
import { FeeStatus } from '../types';

const StatCard = ({ title, value, icon: Icon, bgClass, textClass, subText }: any) => (
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
          value={MOCK_STATS.totalStudents} 
          icon={Users} 
          bgClass="bg-blue-600" 
        />
        <StatCard 
          title="Total Enquiries" 
          value={MOCK_STATS.totalEnquiries} 
          icon={UserPlus} 
          bgClass="bg-sky-500" 
        />
        <StatCard 
          title="Fees Collected" 
          value={`₹${MOCK_STATS.feesCollected.toFixed(2)}`} 
          icon={IndianRupee} 
          bgClass="bg-green-600" 
        />
        <StatCard 
          title="Pending Fees" 
          value={`₹${MOCK_STATS.pendingFees.toFixed(2)}`} 
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
              <div className="text-3xl font-bold text-green-600 mb-1">{MOCK_STATS.fullyPaidStudents}</div>
              <div className="text-sm text-green-700 font-medium">Fully Paid</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{MOCK_STATS.partialStudents}</div>
              <div className="text-sm text-orange-700 font-medium">Partially Paid</div>
            </div>
            <div className="bg-red-50 border border-red-100 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">{MOCK_STATS.unpaidStudents}</div>
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
                {MOCK_STUDENTS.slice(0, 3).map((student) => (
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
                ))}
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
                {MOCK_ENQUIRIES.slice(0, 3).map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{enquiry.name}</td>
                    <td className="px-6 py-4 text-slate-600">{enquiry.courseInterested}</td>
                    <td className="px-6 py-4 text-slate-600">{enquiry.mobile}</td>
                    <td className="px-6 py-4">
                       <button className="bg-green-500 text-white p-1.5 rounded hover:bg-green-600">
                         <UserPlus className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};