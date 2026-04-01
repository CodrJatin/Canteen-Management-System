import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {

    const handleInternalClose = () => {
        setIsVisible(false);
        if (onClose) {
            onClose(); // Call the parent function if it exists
        }
    };

    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const isSuccess = type === 'success';

    return (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-1000 animate-in fade-in slide-in-from-top-8 duration-500">
            <div className={`
        relative px-6 py-4 rounded-3xl backdrop-blur-2xl border flex items-center gap-4 shadow-2xl
        ${isSuccess
                    ? 'bg-green-500/10 border-green-500/20 shadow-green-500/10'
                    : 'bg-orange-500/10 border-orange-500/20 shadow-orange-500/10'}
      `}>
                {/* Animated Glow Backdrop */}
                <div className={`absolute inset-0 blur-xl opacity-20 rounded-3xl ${isSuccess ? 'bg-green-500' : 'bg-orange-500'}`}></div>

                <div className={`p-2 rounded-xl ${isSuccess ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                    {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                </div>

                <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-white">
                        {isSuccess ? 'System Verified' : 'Access Denied'}
                    </p>
                    <p className="text-sm font-bold text-white italic uppercase tracking-tighter whitespace-nowrap">
                        {message}
                    </p>
                </div>

                <button
                    onClick={handleInternalClose}
                    className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;