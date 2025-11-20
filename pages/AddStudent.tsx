
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, User, Phone, BookOpen, Save } from 'lucide-react';
import { useData } from '../context/DataContext';
import { FeeStatus } from '../types';

export const AddStudent = () => {
  const { addStudent, updateStudent, getStudent, convertEnquiryToStudent, enquiries } = useData();
  const navigate = useNavigate();
  const { id } = useParams(); // For Edit Mode
  const [searchParams] = useSearchParams();
  const enquiryId = searchParams.get('enquiryId'); // For Conversion Mode

  const [formData, setFormData] = useState({
    enrollmentNo: '',
    name: '',
    fathersName: '',
    sex: 'Select',
    age: '',
    dob: '',
    joinDate: new Date().toISOString().split('T')[0],
    mobile: '',
    mobile2: '',
    address1: '',
    address2: '',
    city: '',
    pincode: '',
    qualification: '',
    course: 'Select Course',
    batch: 'Select Batch',
    scheme: 'Select Scheme',
    totalFee: '', 
    paidFee: ''
  });

  // Load data if in Edit Mode or Conversion Mode
  useEffect(() => {
    if (id) {
      // Edit Mode
      const student = getStudent(id);
      if (student) {
         setFormData({
             enrollmentNo: student.enrollmentNo,
             name: student.name,
             fathersName: student.fathersName || '',
             sex: student.sex || 'Select',
             age: student.age?.toString() || '',
             dob: student.dob || '',
             joinDate: student.joinDate,
             mobile: student.mobile,
             mobile2: student.mobile2 || '',
             address1: student.address1 || '',
             address2: student.address2 || '',
             city: student.city || '',
             pincode: student.pincode || '',
             qualification: student.qualification || '',
             course: student.course,
             batch: student.batch,
             scheme: student.scheme || 'Select Scheme',
             totalFee: student.totalFee.toString(),
             paidFee: student.paidFee.toString()
         });
      }
    } else if (enquiryId) {
      // Conversion Mode
      const enquiry = enquiries.find(e => e.id === enquiryId);
      if (enquiry) {
          setFormData(prev => ({
              ...prev,
              name: enquiry.name,
              fathersName: enquiry.fathersName || '',
              sex: enquiry.sex || 'Select',
              mobile: enquiry.mobile,
              mobile2: enquiry.mobile2 || '',
              address1: enquiry.address1 || '',
              address2: enquiry.address2 || '',
              city: enquiry.city || '',
              pincode: enquiry.pincode || '',
              qualification: enquiry.qualification || '',
              course: enquiry.courseInterested || 'Select Course',
              scheme: enquiry.scheme || 'Select Scheme'
          }));
      }
    }
  }, [id, enquiryId, getStudent, enquiries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      // Force Uppercase for text inputs, except dates or specific fields if needed
      const newValue = (type === 'text' || type === 'textarea') ? value.toUpperCase() : value;
      setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = () => {
      // Basic Validation
      if (!formData.name || !formData.mobile || formData.course === 'Select Course') {
          alert("Please fill in required fields (Name, Mobile, Course)");
          return;
      }

      const totalFeeNum = Number(formData.totalFee) || 0;
      const paidFeeNum = Number(formData.paidFee) || 0;

      const studentData = {
          id: id || Date.now().toString(),
          enrollmentNo: formData.enrollmentNo || `LER-${Math.floor(Math.random() * 10000)}`,
          name: formData.name,
          fathersName: formData.fathersName,
          sex: formData.sex,
          age: Number(formData.age) || 0,
          dob: formData.dob,
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          pincode: formData.pincode,
          course: formData.course,
          batch: formData.batch,
          scheme: formData.scheme,
          qualification: formData.qualification,
          mobile: formData.mobile,
          mobile2: formData.mobile2,
          feeStatus: paidFeeNum >= totalFeeNum && totalFeeNum > 0 ? FeeStatus.PAID : paidFeeNum > 0 ? FeeStatus.PARTIAL : FeeStatus.UNPAID,
          totalFee: totalFeeNum,
          paidFee: paidFeeNum,
          balance: totalFeeNum - paidFeeNum,
          joinDate: formData.joinDate,
          concession: 0
      };

      if (id) {
          updateStudent(id, studentData);
          alert("Student updated successfully!");
      } else {
          addStudent(studentData);
          if (enquiryId) {
              convertEnquiryToStudent(enquiryId); // Mark enquiry as converted
          }
          alert("Student added successfully!");
      }
      navigate('/students');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-slate-800" />
          <h1 className="text-2xl font-bold text-slate-800">{id ? 'Edit Student' : 'Add Student'}</h1>
        </div>
        <Link to="/students" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </Link>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Enrollment Number</label>
                <input name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange} type="text" placeholder="Auto-generated if empty" className="w-full border-slate-300 rounded-md p-2.5 text-sm bg-slate-50 border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name</label>
                <input name="fathersName" value={formData.fathersName} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Sex</label>
                <select name="sex" value={formData.sex} onChange={handleChange} className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 bg-white uppercase">
                  <option>Select</option>
                  <option>MALE</option>
                  <option>FEMALE</option>
                  <option>OTHER</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input name="age" value={formData.age} onChange={handleChange} type="number" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                <input name="dob" value={formData.dob} onChange={handleChange} type="date" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 text-slate-500" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Joining</label>
                <input name="joinDate" value={formData.joinDate} onChange={handleChange} type="date" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500" />
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

          {/* Academic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-100">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-medium">Academic Information</h2>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                <input name="qualification" value={formData.qualification} onChange={handleChange} type="text" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 uppercase" />
              </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course</label>
                <select name="course" value={formData.course} onChange={handleChange} className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 bg-white uppercase">
                  <option>Select Course</option>
                  <option>HDCA TALLY</option>
                  <option>DCA</option>
                  <option>PGDCA</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch</label>
                <select name="batch" value={formData.batch} onChange={handleChange} className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500 bg-white uppercase">
                  <option>Select Batch</option>
                  <option>Morning (8-10 AM)</option>
                  <option>Evening (4-6 PM)</option>
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
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">Total Fees</label>
                 <input name="totalFee" value={formData.totalFee} onChange={handleChange} type="number" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">Initial Payment (Paid)</label>
                 <input name="paidFee" value={formData.paidFee} onChange={handleChange} type="number" className="w-full border-slate-300 rounded-md p-2.5 text-sm border focus:ring-blue-500 focus:border-blue-500" />
              </div>
               <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">Net Payable</label>
                 <input type="text" value={`₹ ${Number(formData.totalFee) - Number(formData.paidFee)}`} readOnly className="w-full border-green-200 bg-green-50 text-green-700 rounded-md p-2.5 text-sm border font-bold" />
              </div>
             </div>
          </div>

        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
           <Link to="/students" className="px-6 py-2.5 rounded-md border border-slate-300 text-slate-600 text-sm font-medium hover:bg-white transition-colors">Cancel</Link>
           <button onClick={handleSubmit} className="px-6 py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
             <Save className="w-4 h-4" /> {id ? 'Update Student' : 'Save Student'}
           </button>
        </div>
      </div>
    </div>
  );
};
