import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router';
import {
    Lock, User, ShieldCheck, Utensils,
    ScanQrCode, ChevronRight, UserPlus, LogIn
} from 'lucide-react';
// We'll update TabButton internally to match the new theme.
import TabButton from '../components/admin/TabButton';
import { API_ENDPOINTS } from '../api/config';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [mode, setMode] = useState('login');
    const [role, setRole] = useState('customer');
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });

    const roles = [
        { id: 'customer', label: 'User', icon: <User size={16} /> },
        { id: 'cook', label: 'Chef', icon: <Utensils size={16} /> },
        { id: 'scanner', label: 'Scan', icon: <ScanQrCode size={16} /> },
        { id: 'admin', label: 'Admin', icon: <ShieldCheck size={16} /> },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = mode === 'login' ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    role: role
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (mode === 'login') {
                    // If login was successful, save the REAL user data
                    login(data.user);
                    navigate(`/${data.user.role}`);
                } else {
                    // If registration was successful, switch to login mode
                    alert("Account created! Please sign in.");
                    setMode('login');
                }
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error("Auth Error:", err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-6 selection:bg-orange-500/30 font-sans relative overflow-hidden">
            {/* --- ORANGE DECORATIVE BLOBS --- */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-600/15 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="w-full max-w-115 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                {/* --- FLOATING ORANGE ROLE BAR --- */}
                <div className="flex justify-center mb-10">
                    <div className="gap-2 inline-flex p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-3xl">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRole(r.id)}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black transition-all duration-300 ${role === r.id
                                        ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/30 scale-105' // Active Orange
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {r.icon}
                                <span className="hidden sm:inline uppercase tracking-tighter">{r.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- MAIN CONTENT CARD (GLASSMORHISM) --- */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[45px] p-10 md:p-14 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)]">
                    <header className="mb-12 text-center">
                        {/* Orange Period Accent */}
                        <h1 className="text-5xl font-black text-white tracking-tighter italic">
                            CANTEEN<span className="text-orange-500 text-6xl">.</span>
                        </h1>
                        <div className="mt-7 flex justify-center">
                            <div className="bg-black/25 p-1.5 rounded-2xl inline-flex gap-1.5">
                                <TabButton
                                    active={mode === 'login'}
                                    onClick={() => setMode('login')}
                                    icon={<LogIn size={16} />}
                                    label="Log In"
                                />
                                <TabButton
                                    active={mode === 'register'}
                                    onClick={() => setMode('register')}
                                    icon={<UserPlus size={16} />}
                                    label="Register"
                                />
                            </div>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group relative">
                            <input
                                type="text"
                                required
                                placeholder="Username"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-7 py-4.5 text-white font-bold placeholder:text-gray-500 focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="group relative">
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-7 py-4.5 text-white font-bold placeholder:text-gray-500 focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {mode === 'register' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <input
                                    type="password"
                                    required
                                    placeholder="Confirm Password"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-7 py-4.5 text-white font-bold placeholder:text-gray-500 focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        )}

                        {/* --- ORANGE ACTION BUTTON --- */}
                        <button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-3xl shadow-3xl shadow-orange-600/25 transition-all transform active:scale-[0.96] flex items-center justify-center gap-3 mt-10 group"
                        >
                            {mode === 'login' ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                </div>

            </div>
        </div>
    );
}