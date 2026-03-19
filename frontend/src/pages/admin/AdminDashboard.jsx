import React, { useState, useEffect } from 'react';
import {
    LogOut, TrendingUp, CheckCircle, AlertTriangle,
    Package, ShoppingBag, Users as UsersIcon, Plus, Edit3, Trash2, Minus
} from 'lucide-react';
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stock');

    // --- SERVER-SYNCED STATES ---
    const [inventory, setInventory] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, orders: 0, lowStock: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- EFFECT: FETCH DATA FROM SERVER ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Replace these URLs with your actual backend endpoints later:
                // const invResponse = await fetch('http://localhost:5000/api/inventory');
                // const statsResponse = await fetch('http://localhost:5000/api/stats');

                // DUMMY DELAY (Simulating Server Latency)
                setTimeout(() => {
                    setInventory([
                        { id: 1, name: 'Masala Dosa', price: 60, quantity: 45 },
                        { id: 2, name: 'Thali Special', price: 120, quantity: 12 },
                        { id: 3, name: 'Samosa (2pc)', price: 30, quantity: 0 },
                    ]);
                    setStats({ revenue: 4250, orders: 128, lowStock: 5 });
                    setIsLoading(false);
                }, 800);
            } catch (err) {
                setError("Failed to connect to server");
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab]); // Refetch when switching tabs (Optional: depending on your API strategy)

    // --- SERVER-SYNCED ACTIONS ---
    const handleUpdateQty = async (id, newQty) => {
        // OPTIMISTIC UPDATE (Update UI immediately for speed)
        const originalInventory = [...inventory];
        setInventory(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));

        try {
            // await fetch(`http://localhost:5000/api/inventory/${id}`, {
            //   method: 'PATCH',
            //   body: JSON.stringify({ quantity: newQty })
            // });
            console.log(`Syncing ID ${id} with quantity ${newQty} to database...`);
        } catch (err) {
            // ROLLBACK if server fails
            setInventory(originalInventory);
            alert("Failed to sync with database. Reverting...");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* --- NAVBAR --- */}
            <nav className="bg-white px-8 py-4 shadow-sm flex justify-between items-center sticky top-0 z-30 border-b border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Console</h1>
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Live Server Connected</span>
                </div>
                <button
                    onClick={() => { logout(); navigate("/"); }}
                    className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-5 py-2.5 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                >
                    <LogOut size={20} /> Logout
                </button>
            </nav>

            <div className="p-8 max-w-7xl mx-auto w-full space-y-8">

                {/* --- STATS SECTION --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Today's Revenue" value={`₹${stats.revenue}`} icon={<TrendingUp />} color="green" />
                    <StatCard label="Orders Served" value={stats.orders} icon={<CheckCircle />} color="blue" />
                    <StatCard label="Low Stock Alerts" value={stats.lowStock} icon={<AlertTriangle />} color="orange" />
                </div>

                {/* --- TABS ROW --- */}
                <div className="flex gap-2 p-1.5 bg-gray-200/50 rounded-2xl w-fit backdrop-blur-sm">
                    <TabButton active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Package size={18} />} label="Stock" />
                    <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={18} />} label="Orders" />
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<UsersIcon size={18} />} label="Users" />
                </div>

                {/* --- DYNAMIC CONTENT AREA --- */}
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 min-h-[500px] relative overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing Data...</p>
                            </div>
                        </div>
                    )}

                    {error && <div className="p-12 text-center text-red-500 font-bold">{error}</div>}

                    <div className="p-8">
                        {activeTab === 'stock' && (
                            <StockView inventory={inventory} onUpdateQty={handleUpdateQty} />
                        )}
                        {activeTab === 'orders' && <div className="p-10 text-center font-bold text-gray-300">Active Orders Component Placeholder</div>}
                        {activeTab === 'users' && <div className="p-10 text-center font-bold text-gray-300">User Management Component Placeholder</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: STOCK VIEW ---
function StockView({ inventory, onUpdateQty }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-800">Inventory Management</h2>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer">
                    <Plus size={20} strokeWidth={3} /> Add New Item
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">Item Details</th>
                            <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                            <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Stock Control</th>
                            <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {inventory.map((item) => (
                            <tr key={item.id} className="group transition-colors hover:bg-gray-50/50">
                                <td className="py-6">
                                    <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                                    {item.quantity === 0 && <span className="text-[10px] text-red-500 font-black uppercase">Sold Out</span>}
                                </td>
                                <td className="py-6 font-black text-gray-700 text-lg">₹{item.price}</td>
                                <td className="py-6">
                                    <div className="flex items-center justify-center gap-3 bg-gray-100 rounded-2xl p-1.5 border border-gray-200 w-fit mx-auto">
                                        <button onClick={() => onUpdateQty(item.id, Math.max(0, item.quantity - 1))} className="p-2 hover:bg-white text-gray-400 hover:text-red-600 rounded-xl transition-all cursor-pointer"><Minus size={18} strokeWidth={3} /></button>
                                        <span className="w-10 text-center font-black text-lg">{item.quantity}</span>
                                        <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} className="p-2 hover:bg-white text-gray-400 hover:text-green-600 rounded-xl transition-all cursor-pointer"><Plus size={18} strokeWidth={3} /></button>
                                    </div>
                                </td>
                                <td className="py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Edit3 size={18} /></button>
                                        <button className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- REUSABLE UI ELEMENTS ---
function StatCard({ label, value, icon, color }) {
    const colors = { green: "bg-green-100 text-green-600", blue: "bg-blue-100 text-blue-600", orange: "bg-orange-100 text-orange-600" };
    return (
        <div className="bg-white p-7 rounded-[35px] border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
            <div className={`${colors[color]} p-4 rounded-2xl`}>{icon}</div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all cursor-pointer ${active ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-700"}`}>
            {icon} {label}
        </button>
    );
}