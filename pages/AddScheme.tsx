
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft, Save } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AddScheme = () => {
  const { addScheme, updateScheme, getScheme } = useData();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
      name: '',
      description: '',
      discountPercent: ''
  });

  useEffect(() => {
      if (id) {
          const scheme = getScheme(id);
          if (scheme) {
              setFormData({
                  name: scheme.name,
                  description: scheme.description,
                  discountPercent: scheme.discountPercent.toString()
              });
          }
      }
  }, [id, getScheme]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const newValue = (type === 'text' || type === 'textarea') ? value.toUpperCase() : value;
      setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = () => {
      if (!formData.name || !formData.discountPercent) {
          alert("Scheme Name and Discount Percentage are required");
          return;
      }

      const schemeData = {
          id: id || Date.now().toString(),
          name: formData.name,
          description: formData.description,
          discountPercent: Number(formData.discountPercent) || 0
      };

      if (id) {
          updateScheme(id, schemeData);
          alert("Scheme updated successfully!");
      } else {
          addScheme(schemeData);
          alert("Scheme added successfully!");
      }
      navigate('/schemes');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Plus className="w-6 h-6 text-slate-800" />
          <h1 className="text-xl font-bold text-slate-800">{id ? 'Edit Scheme' : 'Add Scheme'}</h1>
        </div>
        <Link to="/schemes" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-xs font-medium">
          <ArrowLeft className="w-3 h-3" /> Back to Schemes
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Scheme Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
                </div>
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Discount Percentage</label>
                    <div className="relative">
                        <input name="discountPercent" value={formData.discountPercent} onChange={handleChange} type="number" className="w-full border-slate-300 rounded-md p-2 pr-8 text-sm border focus:ring-blue-500 focus:border-blue-500" />
                         <span className="absolute right-3 top-2 text-slate-500 text-sm">%</span>
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter scheme description..." rows={4} className="w-full border-slate-300 rounded-md p-2 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase"></textarea>
            </div>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
           <Link to="/schemes" className="px-6 py-2 rounded-md bg-slate-500 text-white text-sm font-bold hover:bg-slate-600 transition-colors">Cancel</Link>
           <button onClick={handleSubmit} className="px-6 py-2 rounded-md bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 shadow-sm transition-colors flex items-center gap-2">
             <Save className="w-4 h-4" /> {id ? 'Update Scheme' : 'Save Scheme'}
           </button>
        </div>
      </div>
    </div>
  );
};
