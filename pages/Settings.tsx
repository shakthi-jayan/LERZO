
import React from 'react';
import { Settings as SettingsIcon, Upload, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../constants';

export const Settings = () => {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-slate-800" />
          <h1 className="text-2xl font-bold text-slate-800">Settings - Logo Upload</h1>
        </div>
        <Link to="/" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Centre Logo */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h2 className="text-lg font-bold text-slate-800 mb-4">Upload Centre Logo</h2>
           <div className="space-y-4">
             <label className="block text-xs font-bold text-slate-700">Logo</label>
             <div className="border rounded-md flex items-center overflow-hidden">
               <button className="bg-slate-100 px-4 py-2.5 text-sm text-slate-600 font-medium border-r hover:bg-slate-200">Browse...</button>
               <span className="px-4 py-2.5 text-sm text-slate-400 italic">No file selected.</span>
             </div>
             <p className="text-xs text-slate-500">Supported formats: JPG, PNG, JPEG. Maximum size: 2MB.<br/>Recommended size: 200x200 pixels.</p>
             
             <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-600 transition-colors shadow-sm">
               <Upload className="w-4 h-4" /> Upload Logo
             </button>
           </div>
        </div>

        {/* Current Logo */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
           <h2 className="text-lg font-bold text-slate-800 mb-6 w-full text-left">Current Logo</h2>
           <div className="bg-black rounded-md p-4 mb-4">
              <div className="text-white font-bold tracking-tighter text-xl flex items-center gap-1">
                 <span>LERZO</span><sup className="text-[0.6rem] text-slate-400">TM</sup>
              </div>
           </div>
           <p className="text-sm text-slate-500">Current logo for {APP_NAME}</p>
        </div>
      </div>

      {/* Centre Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <h2 className="text-lg font-bold text-slate-800 mb-6">Centre Information</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex border-b border-slate-100 pb-3">
                 <span className="w-1/3 text-sm font-bold text-slate-700">Centre Name:</span>
                 <span className="text-sm text-slate-600">{APP_NAME}</span>
              </div>
               <div className="flex border-b border-slate-100 pb-3">
                 <span className="w-1/3 text-sm font-bold text-slate-700">Email:</span>
                 <span className="text-sm text-slate-600">shakthijayan19@gmail.com</span>
              </div>
               <div className="flex pb-3">
                 <span className="w-1/3 text-sm font-bold text-slate-700">Phone:</span>
                 <span className="text-sm text-slate-600">8778936713</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex border-b border-slate-100 pb-3">
                 <span className="w-1/3 text-sm font-bold text-slate-700">City:</span>
                 <span className="text-sm text-slate-600">CHENNAI</span>
              </div>
               <div className="flex border-b border-slate-100 pb-3">
                 <span className="w-1/3 text-sm font-bold text-slate-700">Pincode:</span>
                 <span className="text-sm text-slate-600">600052</span>
              </div>
               <div className="flex pb-3">
                 <span className="w-1/3 text-sm font-bold text-slate-700">Registered On:</span>
                 <span className="text-sm text-slate-600">23/07/2025</span>
              </div>
            </div>
         </div>
         
         <div className="mt-4 pt-4 border-t border-slate-100">
             <h3 className="text-sm font-bold text-slate-700 mb-1">Address:</h3>
             <p className="text-sm text-slate-600">M.A NAGAR, REDHILLS</p>
         </div>
      </div>
    </div>
  );
};
