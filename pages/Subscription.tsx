import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowLeft, FileText, CheckCircle } from 'lucide-react';

export const Subscription = () => {

  const handlePayment = (plan: string) => {
    alert(`Opening Razorpay Mock for ${plan} plan. Order ID would be generated from backend.`);
    // In real implementation:
    // 1. Call /api/payment/create-order
    // 2. const rzp = new window.Razorpay(options);
    // 3. rzp.open();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-slate-800" />
          <h1 className="text-2xl font-bold text-slate-800">Subscription Invoices</h1>
        </div>
        <Link to="/settings" className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Settings
        </Link>
      </div>

      {/* Subscription Status / Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-blue-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">CURRENT PLAN</div>
          <h3 className="text-lg font-bold text-slate-800">Monthly</h3>
          <div className="text-3xl font-bold text-blue-600 my-4">₹699<span className="text-sm text-slate-400 font-medium">/month</span></div>
          <ul className="space-y-2 mb-6">
             <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle className="w-4 h-4 text-green-500"/> Unlimited Students</li>
             <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle className="w-4 h-4 text-green-500"/> Cloud Backup</li>
             <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle className="w-4 h-4 text-green-500"/> Priority Support</li>
          </ul>
          <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-2 rounded cursor-not-allowed">Active</button>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">BEST VALUE</div>
          <h3 className="text-lg font-bold text-slate-800">Yearly</h3>
          <div className="text-3xl font-bold text-slate-800 my-4">₹6999<span className="text-sm text-slate-400 font-medium">/year</span></div>
           <ul className="space-y-2 mb-6">
             <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle className="w-4 h-4 text-green-500"/> Save ₹1389/year</li>
             <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle className="w-4 h-4 text-green-500"/> All Pro Features</li>
          </ul>
          <button onClick={() => handlePayment('Yearly')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors shadow-sm">Upgrade Now</button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
         <div className="flex flex-col items-center justify-center text-slate-400">
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-slate-600 mb-2">No Invoices Found</h3>
            <p className="text-sm">You don't have any subscription payments yet.</p>
         </div>
      </div>

      {/* Help Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <div className="flex items-center gap-2 mb-6 text-slate-800">
            <div className="bg-black rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">?</div>
            <h2 className="text-lg font-bold">Need Help?</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
               <h3 className="font-medium text-slate-700 mb-2">Download Invoices</h3>
               <p className="text-xs text-slate-500 leading-relaxed">Click the download button to get PDF invoices for your records.</p>
            </div>
             <div>
               <h3 className="font-medium text-slate-700 mb-2">Payment Support</h3>
               <p className="text-xs text-slate-500 leading-relaxed">For payment issues, contact support with your Payment ID.</p>
            </div>
             <div>
               <h3 className="font-medium text-slate-700 mb-2">Billing Questions</h3>
               <p className="text-xs text-slate-500 leading-relaxed">Need to update billing info? Contact our support team.</p>
            </div>
         </div>
      </div>
    </div>
  );
};