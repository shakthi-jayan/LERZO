
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IndianRupee, ArrowLeft, Save, User } from 'lucide-react';
import { useData } from '../context/DataContext';
import { FeeStatus } from '../types';

export const RecordPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudent, recordPayment } = useData();
  const student = getStudent(id || '');

  const [formData, setFormData] = useState({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      method: 'Cash',
      receiptNo: '',
      notes: ''
  });

  if (!student) return <div>Student not found</div>;

  const netFee = student.totalFee - (student.concession || 0);
  const balance = netFee - student.paidFee;

  const handleSubmit = () => {
      if (!formData.amount || Number(formData.amount) <= 0) {
          alert("Please enter a valid amount");
          return;
      }
      if (Number(formData.amount) > balance) {
          if (!window.confirm("Amount exceeds current balance. Do you want to proceed with overpayment/advance?")) {
              return;
          }
      }

      recordPayment({
          id: Date.now().toString(),
          studentId: student.id,
          amount: Number(formData.amount),
          date: formData.date,
          method: formData.method,
          receiptNo: formData.receiptNo,
          notes: formData.notes
      });

      alert("Payment Recorded Successfully!");
      navigate(`/students/${student.id}`);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <IndianRupee className="w-6 h-6" /> Record Fee Payment
           </h1>
        </div>
        <Link to={`/students/${student.id}`} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Student
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Payment Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Payment Details</h2>
            </div>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Amount</label>
                        <div className="relative">
                             <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-bold">₹</span>
                             <input 
                                type="number" 
                                value={formData.amount}
                                onChange={e => setFormData({...formData, amount: e.target.value})}
                                className="w-full border-slate-300 rounded-md p-2.5 pl-8 text-sm border focus:ring-blue-500 focus:border-blue-500"
                             />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Maximum: ₹{balance.toFixed(2)}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Payment Date</label>
                        <input 
                            type="date" 
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                            className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                        <select 
                            value={formData.method}
                            onChange={e => setFormData({...formData, method: e.target.value})}
                            className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option>Cash</option>
                            <option>Online (UPI/GPay)</option>
                            <option>Bank Transfer</option>
                            <option>Cheque</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Number</label>
                        <input 
                            type="text" 
                            placeholder="Optional"
                            value={formData.receiptNo}
                            onChange={e => setFormData({...formData, receiptNo: e.target.value})}
                            className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
                    <textarea 
                        placeholder="Any additional notes..."
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                        className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 h-24"
                    />
                </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
               <Link to={`/students/${student.id}`} className="px-6 py-2.5 rounded-md bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors">Cancel</Link>
               <button onClick={handleSubmit} className="px-6 py-2.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 shadow-sm transition-colors flex items-center gap-2">
                 <Save className="w-4 h-4" /> Record Payment
               </button>
            </div>
        </div>

        {/* Right Column: Summaries */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3 text-sm">Student Details</h2>
                <div className="space-y-2">
                    <div className="font-bold text-slate-800 uppercase">{student.name}</div>
                    <div className="text-xs text-slate-500">{student.enrollmentNo}</div>
                    <div className="text-xs text-slate-600">Course: <span className="font-semibold text-slate-800">{student.course}</span></div>
                    <div className="text-xs text-slate-600">Mobile: <span className="font-semibold text-slate-800">{student.mobile}</span></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3 text-sm">Fee Summary</h2>
                <div className="space-y-3">
                    <div className="bg-white border border-slate-200 p-2 rounded text-center">
                        <p className="text-[10px] text-slate-500 font-medium uppercase">Total Fees</p>
                        <p className="text-sm font-bold text-slate-800">₹{student.totalFee.toFixed(2)}</p>
                    </div>
                     <div className="bg-sky-50 border border-sky-100 p-2 rounded text-center">
                        <p className="text-[10px] text-sky-600 font-medium uppercase">Concession</p>
                        <p className="text-sm font-bold text-sky-700">₹{(student.concession || 0).toFixed(2)}</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-2 rounded text-center">
                        <p className="text-[10px] text-slate-500 font-medium uppercase">Net Fees</p>
                        <p className="text-sm font-bold text-slate-800">₹{netFee.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-2 rounded text-center">
                        <p className="text-[10px] text-green-600 font-medium uppercase">Paid So Far</p>
                        <p className="text-sm font-bold text-green-700">₹{student.paidFee.toFixed(2)}</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 p-2 rounded text-center">
                        <p className="text-[10px] text-orange-600 font-medium uppercase">Balance Due</p>
                        <p className="text-lg font-bold text-orange-700">₹{balance.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
