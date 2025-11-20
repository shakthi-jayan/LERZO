import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tag, Plus, Trash2, Edit } from 'lucide-react';
import { useData } from '../context/DataContext';
import { DeleteModal } from '../components/DeleteModal';

export const Schemes = () => {
  const { schemes, deleteScheme } = useData();
  const navigate = useNavigate();

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schemeToDelete, setSchemeToDelete] = useState<{id: string, name: string} | null>(null);

  const initiateDelete = (id: string, name: string) => {
    setSchemeToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (schemeToDelete) {
      deleteScheme(schemeToDelete.id);
      setIsDeleteModalOpen(false);
      setSchemeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6 text-slate-800" />
          <h1 className="text-xl font-bold text-slate-800">Schemes</h1>
        </div>
        <Link to="/schemes/add" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm transition-colors">
           <Plus className="w-4 h-4" /> Add Scheme
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {schemes.length === 0 ? (
             <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <Tag className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-600">No schemes found</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">Add your first scheme to get started</p>
                <Link to="/schemes/add" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm transition-colors">
                   <Plus className="w-4 h-4" /> Add Scheme
                </Link>
             </div>
         ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Scheme Name</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Discount</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {schemes.map((scheme) => (
                            <tr key={scheme.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-slate-800 uppercase">{scheme.name}</td>
                                <td className="px-6 py-4 text-slate-600 uppercase">{scheme.description}</td>
                                <td className="px-6 py-4 text-green-600 font-bold">{scheme.discountPercent}%</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => navigate(`/schemes/edit/${scheme.id}`)}
                                            className="p-1.5 border border-amber-400 text-amber-500 rounded hover:bg-amber-50 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-3 h-3" />
                                        </button>
                                        <button 
                                            onClick={() => initiateDelete(scheme.id, scheme.name)}
                                            className="p-1.5 border border-red-400 text-red-500 rounded hover:bg-red-50 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
         )}
      </div>

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Scheme"
        message="Are you sure you want to delete this scheme?"
        itemName={schemeToDelete?.name}
      />
    </div>
  );
};
