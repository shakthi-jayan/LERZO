
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, User, Phone, GraduationCap, Save } from 'lucide-react';
import { useData } from '../context/DataContext';
import { EnquiryStatus } from '../types';

export const AddEnquiry = () => {
  const { addEnquiry, updateEnquiry, getEnquiry } = useData();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    fathersName: '',
    sex: 'Select',
    mobile: '',
    mobile2: '',
    address1: '',
    address2: '',
    city: '',
    pincode: '',
    employmentStatus: '',
    qualification: '',
    courseInterested: 'Select Course',
    scheme: 'Select Scheme',
    reason: '',
    joiningPlan: '',
    source: ''
  });

  useEffect(() => {
    if (id) {
      const enquiry = getEnquiry(id);
      if (enquiry) {
        setFormData({
          name: enquiry.name,
          fathersName: enquiry.fathersName || '',
          sex: enquiry.sex || 'Select',
          mobile: enquiry.mobile,
          mobile2: enquiry.mobile2 || '',
          address1: enquiry.address1 || '',
          address2: enquiry.address2 || '',
          city: enquiry.city || '',
          pincode: enquiry.pincode || '',
          employmentStatus: enquiry.employmentStatus || '',
          qualification: enquiry.qualification || '',
          courseInterested: enquiry.courseInterested || 'Select Course',
          scheme: enquiry.scheme || 'Select Scheme',
          reason: enquiry.reason || '',
          joiningPlan: enquiry.joiningPlan || '',
          source: enquiry.source || ''
        });
      }
    }
  }, [id, getEnquiry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const newValue = (type === 'text' || e.target.tagName === 'TEXTAREA') ? value.toUpperCase() : value;
      setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.mobile) {
      alert("Name and Mobile are required!");
      return;
    }

    const enquiryData = {
      id: id || Date.now().toString(),
      name: formData.name,
      fathersName: formData.fathersName,
      sex: formData.sex,
      mobile: formData.mobile,
      mobile2: formData.mobile2,
      address1: formData.address1,
      address2: formData.address2,
      city: formData.city,
      pincode: formData.pincode,
      employmentStatus: formData.employmentStatus,
      qualification: formData.qualification,
      courseInterested: formData.courseInterested,
      scheme: formData.scheme,
      reason: formData.reason,
      joiningPlan: formData.joiningPlan,
      source: formData.source,
      status: EnquiryStatus.ACTIVE,
      addedOn: new Date().toISOString().split('T')[0]
    };

    if (id) {
      updateEnquiry(id, enquiryData);
      alert("Enquiry updated successfully!");
    } else {
      addEnquiry(enquiryData);
      alert("Enquiry added successfully!");
    }
    navigate('/enquiries');
  };

  const handleConvert = () => {
    if (id) {
      navigate(`/students/add?enquiryId=${id}`);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-slate-800" />
          <h1 className="text-2xl font-bold text-slate-800">{id ? 'Edit Enquiry' : 'Add Enquiry'}</h1>
        </div>
        <div className="flex items-center gap-3">
            {id && (
              <button onClick={handleConvert} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm font-medium text-sm">
                <UserPlus className="w-4 h-4" /> Convert to Student
              </button>
            )}
            <Link to="/enquiries" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Enquiries
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-8">
          
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-100">
              <User className="w-5 h-5" />
              <h2 className="text-lg font-medium">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name</label>
                <input name="fathersName" value={formData.fathersName} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sex</label>
                <select name="sex" value={formData.sex} onChange={handleChange} className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 bg-white uppercase">
                  <option>Select</option>
                  <option>MALE</option>
                  <option>FEMALE</option>
                  <option>OTHER</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-100">
              <Phone className="w-5 h-5" />
              <h2 className="text-lg font-medium">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile 1</label>
                <input name="mobile" value={formData.mobile} onChange={handleChange} type="tel" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile 2</label>
                <input name="mobile2" value={formData.mobile2} onChange={handleChange} type="tel" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address Line 1</label>
                <input name="address1" value={formData.address1} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address Line 2</label>
                <input name="address2" value={formData.address2} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input name="city" value={formData.city} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                <input name="pincode" value={formData.pincode} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>

          {/* Academic & Interest Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-100">
              <GraduationCap className="w-5 h-5" />
              <h2 className="text-lg font-medium">Academic & Interest Information</h2>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Employment Status</label>
                <input name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                <input name="qualification" value={formData.qualification} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Interested</label>
                <select name="courseInterested" value={formData.courseInterested} onChange={handleChange} className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 bg-white uppercase">
                  <option>Select Course</option>
                  <option>HDCA TALLY</option>
                  <option>DCA</option>
                  <option>PGDCA</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scheme</label>
                <select name="scheme" value={formData.scheme} onChange={handleChange} className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 bg-white uppercase">
                  <option>Select Scheme</option>
                  <option>SAT 2025</option>
                  <option>CHRISTMAS 2025</option>
                </select>
              </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Interest</label>
                <input name="reason" value={formData.reason} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Joining Plan</label>
                <input name="joiningPlan" value={formData.joiningPlan} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Source of Information</label>
                <input name="source" value={formData.source} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
            </div>
          </div>

        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
           <Link to="/enquiries" className="px-6 py-2.5 rounded-md bg-slate-500 text-white text-sm font-medium hover:bg-slate-600 transition-colors">Cancel</Link>
           <button onClick={handleSubmit} className="px-6 py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
             <Save className="w-4 h-4" /> {id ? 'Update Enquiry' : 'Save Enquiry'}
           </button>
        </div>
      </div>
    </div>
  );
};
