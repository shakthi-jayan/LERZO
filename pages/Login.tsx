
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, AuthError } from "firebase/auth";
import { auth, googleProvider } from '../lib/firebase';
import { AlertTriangle, Copy, ShieldOff, Globe, Clock, Cookie } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isDomainError, setIsDomainError] = useState(false);
  const [detectedDomain, setDetectedDomain] = useState<string>('');

  useEffect(() => {
    // Robust domain detection for various environments (local, iframe, cloud preview)
    let domain = window.location.hostname;
    
    if (!domain) {
        domain = window.location.host;
    }
    
    // If we are in a strictly sandboxed environment where hostname is empty or null
    if (!domain || domain === 'null') {
       domain = window.location.origin !== 'null' ? window.location.origin : window.location.href;
    }
    
    setDetectedDomain(domain);
  }, []);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsDomainError(false);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      console.error("Login Failed", err);
      const firebaseError = err as AuthError;
      if (firebaseError.code === 'auth/unauthorized-domain' || firebaseError.code === 'auth/operation-not-supported-in-this-environment') {
        setIsDomainError(true);
      } else {
        setError(firebaseError.message);
      }
    }
  };

  const handleBypass = () => {
    localStorage.setItem('lerzo_bypass_auth', 'true');
    // Use navigate instead of reload to prevent CORS/Sandbox crashes in preview environments
    navigate('/');
  };

  const getCleanDomain = (url: string) => {
    return url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="mb-8">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-lg text-white text-2xl font-bold mb-4">L</div>
           <h1 className="text-2xl font-bold text-slate-800">Welcome to Lerzo</h1>
           <p className="text-slate-500 mt-2">Sign in to manage your student centre</p>
        </div>

        {isDomainError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-lg text-sm text-left mb-6 relative overflow-hidden">
            <div className="font-bold flex items-center gap-2 mb-3 text-amber-900">
              <AlertTriangle className="w-5 h-5" />
              Authentication Setup Required
            </div>
            
            <p className="mb-4 text-xs leading-relaxed text-amber-800">
              The current preview domain is not authorized in Firebase.
            </p>
            
            <div className="bg-white p-3 rounded border border-amber-200 font-mono text-xs mb-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2 overflow-hidden w-full">
                  <Globe className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="truncate select-all block w-full text-slate-700 font-bold" title={detectedDomain}>
                    {getCleanDomain(detectedDomain) || "Unknown Domain"}
                  </span>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(getCleanDomain(detectedDomain))} 
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 ml-2 flex-shrink-0 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                title="Copy Domain"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>

            <div className="space-y-2 mb-5">
                <div className="flex items-start gap-2">
                   <Clock className="w-3.5 h-3.5 mt-0.5 text-amber-700 flex-shrink-0" />
                   <span className="text-xs text-amber-800">
                     <strong>Already added?</strong> It takes up to <strong>10-15 minutes</strong> for changes to propagate globally.
                   </span>
                </div>
                <div className="flex items-start gap-2">
                   <Cookie className="w-3.5 h-3.5 mt-0.5 text-amber-700 flex-shrink-0" />
                   <span className="text-xs text-amber-800">
                     <strong>Cookies:</strong> Ensure 3rd-party cookies are enabled if you are using Chrome Incognito.
                   </span>
                </div>
            </div>

            <div className="pt-4 border-t border-amber-200">
                <p className="text-xs font-bold text-amber-900 mb-2 text-center uppercase tracking-wide">Recommended for Preview</p>
                <button 
                  onClick={handleBypass}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <ShieldOff className="w-4 h-4" /> Enter Developer Mode (Skip Login)
                </button>
            </div>
          </div>
        )}

        {error && !isDomainError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-left flex items-start gap-2 border border-red-100">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
                <span className="font-bold block">Authentication Error</span> 
                {error}
            </div>
          </div>
        )}

        {!isDomainError && (
          <>
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors shadow-sm group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="group-hover:text-blue-600 transition-colors">Continue with Google</span>
            </button>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button onClick={handleBypass} className="text-slate-400 hover:text-slate-600 text-xs flex items-center justify-center gap-2 w-full transition-colors">
                <ShieldOff className="w-3 h-3" /> Developer Mode: Bypass Authentication
              </button>
              <p className="text-[10px] text-slate-300 mt-2">
                Use bypass for UI testing if you cannot configure Firebase domains.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
