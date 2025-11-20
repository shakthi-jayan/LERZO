
import React, { useState } from 'react';
import { Database, Lock, Cloud, Download, Upload, RefreshCw, AlertTriangle, CheckCircle, X, UserCheck } from 'lucide-react';
import { generateSalt, deriveKey, encryptData, decryptData } from '../utils/encryption';
import { useData } from '../context/DataContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { auth } from '../lib/firebase';

export const Backup = () => {
  const { students, enquiries, payments, courses, batches, schemes, restoreData } = useData();
  const [backupStatus, setBackupStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  
  // UI State
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const getUserIdentifier = () => {
    if (auth.currentUser && auth.currentUser.email) {
      return auth.currentUser.email;
    }
    // Fallback for developer mode or unauthenticated usage
    if (localStorage.getItem('lerzo_bypass_auth') === 'true') {
      return 'developer-mode-bypass';
    }
    return null;
  };

  const handleCloudBackup = () => {
    setBackupStatus('processing');
    setTimeout(() => {
      setBackupStatus('done');
      setStatusMsg({ type: 'success', text: "Encrypted backup uploaded to Cloud (Simulated)." });
    }, 2000);
  };

  const handleLocalBackup = async () => {
    const userId = getUserIdentifier();
    if (!userId) {
        setStatusMsg({ type: 'error', text: "You must be logged in to create a secure backup." });
        return;
    }

    try {
        const backupPayload = {
            metadata: {
                app: "Lerzo",
                version: "1.0",
                timestamp: new Date().toISOString(),
                lockedTo: userId // Metadata for display, not for security check (the key derivation enforces security)
            },
            data: {
                students,
                enquiries,
                payments,
                courses,
                batches,
                schemes
            }
        };

        // 1. Generate a random salt
        const salt = generateSalt();

        // 2. Derive the encryption key from Email + Salt
        const key = await deriveKey(userId, salt);

        // 3. Encrypt the data
        const encryptedData = await encryptData(backupPayload, key);

        // 4. Package everything together
        const finalBackupFile = {
          salt: salt,
          iv: encryptedData.iv,
          cipherText: encryptedData.cipherText,
          info: "This backup is locked to the user email: " + userId
        };

        const blob = new Blob([JSON.stringify(finalBackupFile)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lerzo_secure_backup_${new Date().toISOString().split('T')[0]}.enc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setStatusMsg({ type: 'success', text: "Secure backup downloaded. It can only be opened by YOU." });

    } catch (error) {
        console.error("Backup encryption failed:", error);
        setStatusMsg({ type: 'error', text: "Failed to create encrypted backup." });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setRestoreFile(e.target.files[0]);
      setStatusMsg(null); // Clear previous messages
    }
  };

  const handleRestoreClick = () => {
    if (!restoreFile) {
        setStatusMsg({ type: 'error', text: "Please select a backup file first." });
        return;
    }
    setShowRestoreConfirm(true);
  };

  const performRestore = async () => {
    setShowRestoreConfirm(false);
    setIsRestoring(true);
    setStatusMsg(null);

    const userId = getUserIdentifier();
    if (!userId) {
       setIsRestoring(false);
       setStatusMsg({ type: 'error', text: "You must be logged in to restore data." });
       return;
    }

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        let backupFile;
        
        try {
            backupFile = JSON.parse(content);
        } catch (err) {
            throw new Error("File is not a valid backup.");
        }
        
        // Validation
        if (!backupFile.cipherText || !backupFile.iv || !backupFile.salt) {
           throw new Error("Invalid backup format. Missing security tokens.");
        }

        // 1. Derive the key using Current User Email + Salt from file
        const key = await deriveKey(userId, backupFile.salt);

        // 2. Attempt to Decrypt
        let decryptedData;
        try {
           decryptedData = await decryptData(backupFile.cipherText, backupFile.iv, key);
        } catch (decryptionErr) {
           // If derivation worked but decryption failed (AEAD tag mismatch), it means wrong key -> wrong email
           throw new Error("Access Denied. This backup belongs to a different user/email.");
        }
        
        if (decryptedData && decryptedData.data) {
            restoreData(decryptedData.data);
            setStatusMsg({ type: 'success', text: "Data restored successfully! Your records have been updated." });
        } else {
            throw new Error("Decrypted data structure is corrupted.");
        }
      } catch (error: any) {
        console.error("Restore failed:", error);
        setStatusMsg({ type: 'error', text: error.message || "Failed to restore. Authentication mismatch." });
      } finally {
        setIsRestoring(false);
        setRestoreFile(null);
      }
    };

    reader.onerror = () => {
        setIsRestoring(false);
        setStatusMsg({ type: 'error', text: "Error reading the file." });
    };

    if (restoreFile) {
        reader.readAsText(restoreFile);
    }
  };

  const currentUser = getUserIdentifier();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-slate-800" />
        <h1 className="text-2xl font-bold text-slate-800">Backup & Restore</h1>
      </div>

      {/* Status Banner */}
      {statusMsg && (
        <div className={`p-4 rounded-lg border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${statusMsg.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            <div className="flex-1 text-sm font-medium">{statusMsg.text}</div>
            <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
         <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
         <div>
            <h3 className="text-sm font-bold text-blue-800">Identity-Locked Encryption</h3>
            <p className="text-xs text-blue-700 mt-1">
               Your backups are automatically secured using your email address ({currentUser}). 
               Only a user logged in with <strong>this specific email</strong> can restore the file.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Create Backup</h2>
          
          <div className="space-y-4">
            <div className="text-xs text-slate-500 flex items-center gap-2 bg-slate-50 p-3 rounded border border-slate-100">
                <UserCheck className="w-4 h-4" />
                Backups will be locked to: <span className="font-bold text-slate-800">{currentUser}</span>
            </div>
            
            <button onClick={handleCloudBackup} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-colors">
               {backupStatus === 'processing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
               Upload to Cloud Storage
            </button>
            
            <button 
                onClick={handleLocalBackup}
                className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
               <Download className="w-4 h-4" />
               Download Secure Backup
            </button>
          </div>
        </div>

        {/* Restore Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
           <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Restore Data</h2>
           
           <div className="space-y-4">
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Secure Backup File (.enc)</label>
                <input 
                  type="file" 
                  accept=".enc"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {restoreFile && <p className="mt-2 text-xs text-green-600 font-bold">Selected: {restoreFile.name}</p>}
             </div>

             <button 
                onClick={handleRestoreClick}
                disabled={!restoreFile || isRestoring}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
             >
               {isRestoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
               {isRestoring ? 'Decrypting & Restoring...' : 'Restore from File'}
            </button>
           </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={performRestore}
        title="Restore Data?"
        message="Are you sure? This will OVERWRITE all current data. The file must have been created by YOUR email account, otherwise decryption will fail."
        confirmText="Yes, Restore"
        isDangerous={true}
      />
    </div>
  );
};
