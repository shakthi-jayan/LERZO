import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, UserPlus, Search, Filter, Eye, Edit, Trash, IndianRupee } from 'lucide-react';
import { FeeStatus } from '../types';
import { useData } from '../context/DataContext';
import { DeleteModal } from '../components/DeleteModal';

export const Students = () => {
  const { students, deleteStudent } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Students');
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{id: string, name: string} | null>(null);

  const initiateDelete = (id: string, name: string) => {
    setStudentToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.enrollmentNo.includes(searchTerm) || 
                          student.mobile.includes(searchTerm);
    
    if (filterStatus === 'All Students') return matchesSearch;
    return matchesSearch && student.feeStatus === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-slate-800">
           <Users className="w-8 h-8" />
           <h1 className="text-2xl font-bold">Students</h1>
        </div>
        <Link to="/students/add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm font-medium text-sm">
          <UserPlus className="w-4 h-4" /> Add Student
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">Fee Status</label>
          <select 
            className="w-full border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 p-2.5 border"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All Students">All Students</option>
            <option value={FeeStatus.PAID}>Fully Paid</option>
            <option value={FeeStatus.PARTIAL}>Partially Paid</option>
            <option value={FeeStatus.UNPAID}>Unpaid</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">Batch</label>
          <select className="w-full border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 p-2.5 border">
            <option>All Batches</option>
            <option>Morning (8-10 AM)</option>
            <option>Evening (4-6 PM)</option>
          </select>
        </div>
        <div className="md:col-span-5 relative">
          <label className="block text-xs font-bold text-slate-700 mb-1">Search</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by name, enrollment number, or mobile"
              className="w-full border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 p-2.5 border pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="md:col-span-1">
          <button className="w-full bg-blue-500 text-white p-2.5 rounded-md flex items-center justify-center gap-2 text-sm hover:bg-blue-600 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold">
              <tr>
                <th className="px-6 py-4">Enrollment No.</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Fee Status</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{student.enrollmentNo}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-blue-600">{student.name}</div>
                    {student.fathersName && <div className="text-xs text-slate-500">S/O {student.fathersName}</div>}
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium w-32">{student.course}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900">{student.batch.split(' ')[0]}</div>
                    <div className="text-xs text-slate-500">{student.batch.match(/\((.*?)\)/)?.[1]}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{student.mobile}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block min-w-[80px] text-center ${
                      student.feeStatus === FeeStatus.PAID ? 'bg-green-500 text-white' :
                      student.feeStatus === FeeStatus.PARTIAL ? 'bg-orange-400 text-white' : 'bg-red-400 text-white'
                    }`}>
                      {student.feeStatus === FeeStatus.PARTIAL ? 'Partial' : student.feeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-red-500 font-medium">₹{student.balance.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-600 rounded bg-white transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/students/edit/${student.id}`)}
                        className="p-1.5 text-amber-500 hover:bg-amber-50 border border-amber-500 rounded bg-white transition-colors" 
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/students/${student.id}/pay-fees`)}
                        className="p-1.5 text-teal-600 hover:bg-teal-50 border border-teal-600 rounded bg-white transition-colors" 
                        title="Pay Fees"
                      >
                        <IndianRupee className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => initiateDelete(student.id, student.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 border border-red-600 rounded bg-white transition-colors" 
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone and will remove all related fee records."
        itemName={studentToDelete?.name}
      />
    </div>
  );
};
