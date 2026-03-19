import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router';
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Utensils, ScanQrCode } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('customer');
    const [formData, setFormData] = useState({ username: '', password: '' });

    const roles = [
        { id: 'customer', label: 'Customer', icon: <User size={18} /> },
        { id: 'cook', label: 'Cook', icon: <Utensils size={18} /> },
        { id: 'scanner', label: 'Scanner', icon: <ScanQrCode size={18} /> },
        { id: 'admin', label: 'Admin', icon: <ShieldCheck size={18} /> },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        // MOCK LOGIN: Later, this will be an Axios call to your backend
        const mockUser = {
            username: formData.username,
            role: role, // 'admin', 'customer', etc.
            token: 'mock-jwt-token'
        };

        login(mockUser); // Save to context + localStorage
        navigate(`/${role}`); // Send them to their dashboard
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Canteen Hub</h1>
                    <p className="text-gray-500 mt-2">Select your role and sign in</p>
                </div>

                {/* Role Selector */}
                <div className="grid grid-cols-2 gap-2 mb-8">
                    {roles.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${role === r.id
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            {r.icon}
                            <span className="text-sm font-medium">{r.label}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter username"
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-200 transition-all transform active:scale-[0.98]"
                    >
                        Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;