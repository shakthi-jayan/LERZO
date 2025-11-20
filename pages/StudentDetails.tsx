import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Edit, Trash, IndianRupee, Plus, Clock, Tag } from 'lucide-react';
import { useData } from '../context/DataContext';
import { FeeStatus } from '../types';
import { DeleteModal } from '../components/DeleteModal';

export const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudent, getStudentPayments, deleteStudent } = useData();
  
  const student = getStudent(id || '');
  const payments = id ? getStudentPayments(id) : [];
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!student) {
    return (
        <div className="flex flex-col items-center justify-center h-96">
            <p className="text-slate-500 mb-4">Student not found.</p>
            <Link to="/students" className="text-blue-500 hover:underline">Back to Students</Link>
        </div>
    );
  }

  const confirmDelete = () => {
    deleteStudent(student.id);
    setIsDeleteModalOpen(false);
    navigate('/students');
  };

  const netFee = student.totalFee - (student.concession || 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-slate-800" />
          <h1 className="text-2xl font-bold text-slate-800">{student.name}</h1>
        </div>
        <div className="flex gap-2">
            <Link to={`/students/${student.id}/pay-fees`} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm font-medium text-sm">
                <IndianRupee className="w-4 h-4" /> Pay Fees
            </Link>
            <Link to={`/students/edit/${student.id}`} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm font-medium text-sm">
                <Edit className="w-4 h-4" /> Edit
            </Link>
            <Link to="/students" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 px-2 py-2 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Back
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Information */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-600" />
                    <h2 className="font-bold text-slate-800">Student Information</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Enrollment Number</label>
                        <p className="text-sm font-semibold text-slate-800">{student.enrollmentNo}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Mobile 1</label>
                        <p className="text-sm font-semibold text-slate-800">{student.mobile}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                        <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Mobile 2</label>
                        <p className="text-sm font-semibold text-slate-800">{student.mobile2 || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Father's Name</label>
                        <p className="text-sm font-semibold text-slate-800">{student.fathersName || '-'}</p>
                    </div>
                    <div className="space-y-1 row-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                        <p className="text-sm font-semibold text-slate-800 whitespace-pre-line">
                            {[student.address1, student.address2, student.city, student.pincode ? `- ${student.pincode}` : ''].filter(Boolean).join('\n') || '-'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Sex</label>
                        <p className="text-sm font-semibold text-slate-800">{student.sex || '-'}</p>
                    </div>
                     <div className="space-y-1 hidden md:block"></div> 
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Age</label>
                        <p className="text-sm font-semibold text-slate-800">{student.age || '-'}</p>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Qualification</label>
                        <p className="text-sm font-semibold text-slate-800">{student.qualification || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                        <p className="text-sm font-semibold text-slate-800">{student.dob || '-'}</p>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Course</label>
                        <p className="text-sm font-semibold text-slate-800">{student.course}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Date of Joining</label>
                        <p className="text-sm font-semibold text-slate-800">{student.joinDate}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Batch</label>
                        <p className="text-sm font-semibold text-slate-800">{student.batch}</p>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Scheme</label>
                        <p className="text-sm font-semibold text-slate-800">{student.scheme || '-'}</p>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Bill Number</label>
                        <p className="text-sm font-semibold text-slate-800">-</p>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-600" />
                        <h2 className="font-bold text-slate-800">Payment History</h2>
                    </div>
                    <Link to={`/students/${student.id}/pay-fees`} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 flex items-center gap-1 font-medium">
                        <Plus className="w-3 h-3" /> Add Payment
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Method</th>
                                <th className="px-6 py-3">Receipt No.</th>
                                <th className="px-6 py-3">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.length > 0 ? payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-800">{payment.date}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">₹{payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">{payment.method}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{payment.receiptNo || '-'}</td>
                                    <td className="px-6 py-4 text-slate-500 italic">{payment.notes || '-'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No payment history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="space-y-6">
             {/* Fee Summary Card */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-slate-600" />
                    <h2 className="font-bold text-slate-800">Fee Summary</h2>
                </div>
                <div className="p-4 space-y-3">
                    <div className="bg-white border border-slate-200 p-3 rounded-lg text-center">
                        <p className="text-xs text-slate-500 font-medium mb-1">Total Fees</p>
                        <p className="text-lg font-bold text-slate-800">₹{student.totalFee.toFixed(2)}</p>
                    </div>
                    <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg text-center">
                        <p className="text-xs text-sky-600 font-medium mb-1">Concession</p>
                        <p className="text-lg font-bold text-sky-700">₹{(student.concession || 0).toFixed(2)}</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-lg text-center">
                        <p className="text-xs text-slate-500 font-medium mb-1">Net Fees</p>
                        <p className="text-lg font-bold text-slate-800">₹{netFee.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-3 rounded-lg text-center">
                        <p className="text-xs text-green-600 font-medium mb-1">Paid Amount</p>
                        <p className="text-lg font-bold text-green-700">₹{student.paidFee.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-center">
                        <p className="text-xs text-red-600 font-medium mb-1">Balance</p>
                        <p className="text-lg font-bold text-red-700">₹{student.balance.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-center mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            student.feeStatus === FeeStatus.PAID ? 'bg-green-500 text-white' :
                            student.feeStatus === FeeStatus.PARTIAL ? 'bg-orange-400 text-white' : 'bg-red-500 text-white'
                        }`}>
                            {student.feeStatus === FeeStatus.PARTIAL ? 'Partially Paid' : student.feeStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-slate-600" />
                    <h2 className="font-bold text-slate-800">Quick Actions</h2>
                </div>
                <div className="p-4 space-y-3">
                    <Link to={`/students/${student.id}/pay-fees`} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                        <IndianRupee className="w-4 h-4" /> Record Payment
                    </Link>
                     <Link to={`/students/edit/${student.id}`} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                        <Edit className="w-4 h-4" /> Edit Student
                    </Link>
                     <button onClick={() => setIsDeleteModalOpen(true)} className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                        <Trash className="w-4 h-4" /> Delete Student
                    </button>
                </div>
            </div>
        </div>
      </div>

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        itemName={student.name}
      />
    </div>
  );
};
