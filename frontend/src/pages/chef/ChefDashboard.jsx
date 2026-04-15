import React, { useEffect, useState } from 'react';
import { LogOut, CheckCircle, Clock, UtensilsCrossed, Loader2 } from 'lucide-react';
import { useAuth } from "../../context/authContext";

export default function ChefDashboard() {
    const { logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/chef`);
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching chef orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleServe = async (orderId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/serve/${orderId}`, {
                method: 'PATCH'
            });
            if (response.ok) {

                setOrders(prev => prev.filter(order => order.id !== orderId));
            }
        } catch (error) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans">

            <header className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <UtensilsCrossed className="text-orange-500" size={28} />
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase">
                        Kitchen<span className="text-orange-500">.</span>
                    </h1>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-2xl border border-red-500/20 transition-all font-black text-xs uppercase tracking-widest"
                >
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <main className="pt-28 p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">Active Queue</h2>
                    <span className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                        {orders.length} Preparing
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Loading Kitchen Data...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                        <p className="text-gray-500 font-bold italic">No active orders. All clear!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white/5 border border-white/10 rounded-4xl p-6 hover:border-orange-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-1">{order.id}</p>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Clock size={14} />
                                            <span className="text-xs font-bold italic">Started: {order.timePreparing}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleServe(order.id)}
                                        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl shadow-lg shadow-green-500/20 transition-all transform active:scale-90"
                                    >
                                        <CheckCircle size={24} />
                                    </button>
                                </div>

                                <div className="bg-black/20 rounded-2xl p-4 space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <p className="font-black text-lg italic tracking-tight uppercase">
                                                <span className="text-orange-500 mr-2">{item.qty}x</span>
                                                {item.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}