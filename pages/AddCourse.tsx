
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft, Save } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AddCourse = () => {
  const { addCourse, updateCourse, getCourse } = useData();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
      name: '',
      duration: '',
      fees: '',
      description: '',
      status: 'Active'
  });

  useEffect(() => {
      if (id) {
          const course = getCourse(id);
          if (course) {
              setFormData({
                  name: course.name,
                  duration: course.duration.toString(),
                  fees: course.fees.toString(),
                  description: course.description,
                  status: course.status
              });
          }
      }
  }, [id, getCourse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const newValue = (type === 'text' || type === 'textarea') ? value.toUpperCase() : value;
      setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = () => {
      if (!formData.name || !formData.fees) {
          alert("Course Name and Fees are required");
          return;
      }

      const courseData = {
          id: id || Date.now().toString(),
          name: formData.name,
          duration: Number(formData.duration) || 0,
          fees: Number(formData.fees) || 0,
          description: formData.description,
          status: formData.status as 'Active' | 'Inactive',
          studentsEnrolled: 0 
      };

      if (id) {
          updateCourse(id, courseData);
          alert("Course updated successfully!");
      } else {
          addCourse(courseData);
          alert("Course added successfully!");
      }
      navigate('/courses');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Plus className="w-6 h-6 text-slate-800" />
          <h1 className="text-xl font-bold text-slate-800">{id ? 'Edit Course' : 'Add Course'}</h1>
        </div>
        <Link to="/courses" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-xs font-medium">
          <ArrowLeft className="w-3 h-3" /> Back to Courses
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-6">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Course Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
                </div>
                <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Months)</label>
                    <input name="duration" value={formData.duration} onChange={handleChange} type="number" className="w-full border-slate-300 rounded-md p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fees</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500 text-sm">₹</span>
                        <input name="fees" value={formData.fees} onChange={handleChange} type="number" className="w-full border-slate-300 rounded-md p-2 pl-7 text-sm border focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter course description..." rows={4} className="w-full border-slate-300 rounded-md p-2 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase"></textarea>
            </div>
            <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                 <select name="status" value={formData.status} onChange={handleChange} className="border-slate-300 rounded-md p-2 text-sm border focus:ring-blue-500 focus:border-blue-500 bg-white">
                     <option value="Active">Active</option>
                     <option value="Inactive">Inactive</option>
                 </select>
            </div>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
           <Link to="/courses" className="px-6 py-2 rounded-md bg-slate-500 text-white text-sm font-bold hover:bg-slate-600 transition-colors">Cancel</Link>
           <button onClick={handleSubmit} className="px-6 py-2 rounded-md bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 shadow-sm transition-colors flex items-center gap-2">
             <Save className="w-4 h-4" /> {id ? 'Update Course' : 'Save Course'}
           </button>
        </div>
      </div>
    </div>
  );
};
