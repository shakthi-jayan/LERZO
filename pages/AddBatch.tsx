
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Clock, ArrowLeft, Save } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AddBatch = () => {
  const { addBatch, updateBatch, getBatch } = useData();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
      name: '',
      startTime: '',
      endTime: '',
      status: true // true for Active, false for Inactive
  });

  useEffect(() => {
      if (id) {
          const batch = getBatch(id);
          if (batch) {
              setFormData({
                  name: batch.name,
                  startTime: batch.startTime,
                  endTime: batch.endTime,
                  status: batch.status === 'Active'
              });
          }
      }
  }, [id, getBatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      if (type === 'checkbox') {
          setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
          const newValue = type === 'text' ? value.toUpperCase() : value;
          setFormData(prev => ({ ...prev, [name]: newValue }));
      }
  };

  const handleSubmit = () => {
      if (!formData.name || !formData.startTime || !formData.endTime) {
          alert("Batch Name, Start Time, and End Time are required");
          return;
      }

      const batchData = {
          id: id || Date.now().toString(),
          name: formData.name,
          startTime: formData.startTime,
          endTime: formData.endTime,
          timing: `${formData.startTime} - ${formData.endTime}`,
          status: formData.status ? 'Active' as const : 'Inactive' as const,
          studentsEnrolled: 0
      };

      if (id) {
          updateBatch(id, batchData);
          alert("Batch updated successfully!");
      } else {
          addBatch(batchData);
          alert("Batch added successfully!");
      }
      navigate('/batches');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-slate-800" />
          <h1 className="text-xl font-bold text-slate-800">{id ? 'Edit Batch' : 'Add Batch'}</h1>
        </div>
        <Link to="/batches" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-xs font-medium">
          <ArrowLeft className="w-3 h-3" /> Back to Batches
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Batch Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="e.g. Morning Batch" className="w-full border-slate-300 rounded-md p-2 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                    <div className="flex items-center gap-2">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                name="status" 
                                id="toggle" 
                                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                                checked={formData.status}
                                onChange={handleChange}
                            />
                            <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${formData.status ? 'bg-blue-500' : 'bg-slate-300'}`}></label>
                        </div>
                        <label htmlFor="toggle" className="text-sm text-slate-700 font-medium">{formData.status ? 'Active' : 'Inactive'}</label>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Active batches will be available for student enrollment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                     <input name="startTime" value={formData.startTime} onChange={handleChange} type="text" placeholder="HH:MM (24-hour format)" className="w-full border-slate-300 rounded-md p-2 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
                     <p className="text-xs text-slate-400 mt-1">Example: 09:00 for 9 AM, 14:30 for 2:30 PM</p>
                </div>
                <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                     <input name="endTime" value={formData.endTime} onChange={handleChange} type="text" placeholder="HH:MM (24-hour format)" className="w-full border-slate-300 rounded-md p-2 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
                     <p className="text-xs text-slate-400 mt-1">Example: 11:00 for 11 AM, 16:30 for 4:30 PM</p>
                </div>
            </div>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
           <Link to="/batches" className="px-6 py-2 rounded-md bg-slate-500 text-white text-sm font-bold hover:bg-slate-600 transition-colors">Cancel</Link>
           <button onClick={handleSubmit} className="px-6 py-2 rounded-md bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 shadow-sm transition-colors flex items-center gap-2">
             <Save className="w-4 h-4" /> {id ? 'Update Batch' : 'Save Batch'}
           </button>
        </div>
      </div>
    </div>
  );
};
