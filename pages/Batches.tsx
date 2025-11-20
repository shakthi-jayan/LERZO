import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Plus, Edit, Trash } from 'lucide-react';
import { useData } from '../context/DataContext';
import { DeleteModal } from '../components/DeleteModal';

export const Batches = () => {
  const { batches, deleteBatch } = useData();
  const navigate = useNavigate();

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<{id: string, name: string} | null>(null);

  const initiateDelete = (id: string, name: string) => {
    setBatchToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (batchToDelete) {
      deleteBatch(batchToDelete.id);
      setIsDeleteModalOpen(false);
      setBatchToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-slate-800" />
          <h1 className="text-xl font-bold text-slate-800">Batches</h1>
        </div>
        <Link to="/batches/add" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm transition-colors">
           <Plus className="w-4 h-4" /> Add Batch
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4">Batch Name</th>
                        <th className="px-6 py-4">Timing</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Students Enrolled</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {batches.map((batch) => (
                        <tr key={batch.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-bold text-slate-800 uppercase">{batch.name}</td>
                            <td className="px-6 py-4 text-slate-600 uppercase">{batch.startTime} - {batch.endTime}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${batch.status === 'Active' ? 'bg-green-500 text-white' : 'bg-slate-400 text-white'}`}>{batch.status}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{batch.studentsEnrolled}</td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => navigate(`/batches/edit/${batch.id}`)}
                                        className="p-1.5 border border-amber-400 text-amber-500 rounded hover:bg-amber-50 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>
                                    <button 
                                        onClick={() => initiateDelete(batch.id, batch.name)}
                                        className="p-1.5 border border-red-400 text-red-500 rounded hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash className="w-3 h-3" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {batches.length === 0 && (
                         <tr>
                             <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No batches found.</td>
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
        title="Delete Batch"
        message="Are you sure you want to delete this batch?"
        itemName={batchToDelete?.name}
      />
    </div>
  );
};
