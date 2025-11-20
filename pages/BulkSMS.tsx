
import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Send, Filter, Users, CheckSquare, Square } from 'lucide-react';
import { useData } from '../context/DataContext';
import { FeeStatus } from '../types';

export const BulkSMS = () => {
  const { students, batches, courses } = useData();
  
  // Filter States
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('All Status');
  
  // Message State
  const [message, setMessage] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);

  // Derived list of filtered students
  const filteredStudents = students.filter(student => {
      const matchesBatch = selectedBatch === 'All Batches' || student.batch === selectedBatch;
      const matchesCourse = selectedCourse === 'All Courses' || student.course === selectedCourse;
      const matchesStatus = selectedFeeStatus === 'All Status' || 
                            (selectedFeeStatus === 'Pending Fees' && student.feeStatus !== FeeStatus.PAID) ||
                            student.feeStatus === selectedFeeStatus;
      return matchesBatch && matchesCourse && matchesStatus;
  });

  // Handle "Select All" toggle
  useEffect(() => {
     if (filteredStudents.length > 0) {
         const allIds = new Set(filteredStudents.map(s => s.id));
         setSelectedStudentIds(allIds);
     } else {
         setSelectedStudentIds(new Set());
     }
  }, [filteredStudents.length, selectedBatch, selectedCourse, selectedFeeStatus]);

  const toggleStudent = (id: string) => {
      const newSelection = new Set(selectedStudentIds);
      if (newSelection.has(id)) {
          newSelection.delete(id);
      } else {
          newSelection.add(id);
      }
      setSelectedStudentIds(newSelection);
  };

  const toggleSelectAll = () => {
      if (selectedStudentIds.size === filteredStudents.length && filteredStudents.length > 0) {
          setSelectedStudentIds(new Set());
      } else {
          setSelectedStudentIds(new Set(filteredStudents.map(s => s.id)));
      }
  };

  const handleSendMessage = async () => {
      if (selectedStudentIds.size === 0) {
          alert("Please select at least one student.");
          return;
      }
      if (!message.trim()) {
          alert("Please enter a message to send.");
          return;
      }

      setIsSending(true);

      // Simulate Twilio API call
      // In a real backend, you would send this payload to your API:
      /*
      const payload = {
          to: Array.from(selectedStudentIds).map(id => students.find(s => s.id === id)?.mobile),
          body: message
      };
      await axios.post('/api/send-sms', payload);
      */

      console.log("--- SIMULATING TWILIO SMS SEND ---");
      console.log("API Key:", process.env.REACT_APP_TWILIO_API_KEY ? "API Key Present" : "Missing API Key");
      console.log("Message:", message);
      console.log("Recipients:", Array.from(selectedStudentIds).map(id => {
          const s = students.find(st => st.id === id);
          return `${s?.name} (${s?.mobile})`;
      }));

      // Simulate network delay
      setTimeout(() => {
          setIsSending(false);
          alert(`Successfully sent messages to ${selectedStudentIds.size} students via Twilio!`);
          setMessage('');
      }, 1500);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3 text-slate-800">
         <MessageSquare className="w-8 h-8" />
         <div>
            <h1 className="text-2xl font-bold">Bulk SMS</h1>
            <p className="text-sm text-slate-500">Send fee reminders and updates via Twilio</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Panel: Filters & List */}
         <div className="lg:col-span-2 space-y-4">
             {/* Filters */}
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Filter by Batch</label>
                    <select 
                        value={selectedBatch} 
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="w-full border-slate-300 rounded-md text-sm p-2 border bg-slate-50"
                    >
                        <option>All Batches</option>
                        {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Filter by Course</label>
                     <select 
                        value={selectedCourse} 
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full border-slate-300 rounded-md text-sm p-2 border bg-slate-50"
                    >
                        <option>All Courses</option>
                        {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fee Status</label>
                     <select 
                        value={selectedFeeStatus} 
                        onChange={(e) => setSelectedFeeStatus(e.target.value)}
                        className="w-full border-slate-300 rounded-md text-sm p-2 border bg-slate-50"
                    >
                        <option>All Status</option>
                        <option value="Pending Fees">Pending Fees (Partial + Unpaid)</option>
                        <option value={FeeStatus.UNPAID}>Unpaid Only</option>
                        <option value={FeeStatus.PAID}>Paid Only</option>
                    </select>
                </div>
             </div>

             {/* Student List */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2">
                         <button onClick={toggleSelectAll} className="text-slate-600 hover:text-blue-600">
                            {selectedStudentIds.size > 0 && selectedStudentIds.size === filteredStudents.length ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                         </button>
                         <span className="font-bold text-sm text-slate-700">{selectedStudentIds.size} Selected</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Total Found: {filteredStudents.length}</span>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {filteredStudents.length > 0 ? filteredStudents.map(student => (
                        <div 
                            key={student.id} 
                            onClick={() => toggleStudent(student.id)}
                            className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                                selectedStudentIds.has(student.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-blue-100'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedStudentIds.has(student.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                                    {selectedStudentIds.has(student.id) && <CheckSquare className="w-3 h-3 text-white" />}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{student.name}</div>
                                    <div className="text-xs text-slate-500">{student.mobile} • {student.course}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-xs font-bold ${student.feeStatus === FeeStatus.PAID ? 'text-green-600' : 'text-red-500'}`}>
                                    {student.feeStatus === FeeStatus.PAID ? 'Paid' : `Due: ₹${student.balance}`}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">No students match filters</div>
                    )}
                </div>
             </div>
         </div>

         {/* Right Panel: Message Composer */}
         <div className="lg:col-span-1">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                 <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Send className="w-4 h-4" /> Compose Message
                 </h2>
                 
                 <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Template Variables</label>
                        <div className="flex gap-2 flex-wrap">
                             <span className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-600 border cursor-pointer hover:bg-slate-200" onClick={() => setMessage(prev => prev + ' {name} ')}>Name</span>
                             <span className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-600 border cursor-pointer hover:bg-slate-200" onClick={() => setMessage(prev => prev + ' {balance} ')}>Balance</span>
                             <span className="px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-600 border cursor-pointer hover:bg-slate-200" onClick={() => setMessage(prev => prev + ' {course} ')}>Course</span>
                        </div>
                     </div>

                     <div>
                         <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here... e.g., Hello {name}, your pending fees is ₹{balance}."
                            className="w-full h-48 p-3 text-sm border-slate-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 resize-none"
                         />
                         <div className="text-right mt-1 text-xs text-slate-400">{message.length} characters</div>
                     </div>

                     <div className="bg-amber-50 border border-amber-100 p-3 rounded text-xs text-amber-800">
                         <strong>Note:</strong> Messages will be sent via Twilio. Standard SMS rates apply.
                     </div>

                     <button 
                        onClick={handleSendMessage}
                        disabled={isSending || selectedStudentIds.size === 0}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                     >
                        {isSending ? 'Sending...' : `Send to ${selectedStudentIds.size} Students`}
                     </button>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};
