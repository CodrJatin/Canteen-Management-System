import React, { useState } from 'react';
import { Clock, Activity, History, ChevronDown, ChevronUp } from 'lucide-react';
import TabButton from './TabButton';

export default function OrdersView({ orders }) {
    const [orderTab, setOrderTab] = useState('live');

    const liveOrders = orders.filter(o => o.status !== 'Served');
    const historyOrders = orders.filter(o => o.status === 'Served');
    const displayOrders = orderTab === 'live' ? liveOrders : historyOrders;

    return (
        <div className="space-y-8">
            {/* --- SUB-NAVBAR (GLASS PILL) --- */}
            <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl w-fit border border-white/10">
                <TabButton
                    active={orderTab === 'live'}
                    onClick={() => setOrderTab('live')}
                    icon={<Activity size={18} />}
                    label={`Live (${liveOrders.length})`}
                />
                <TabButton
                    active={orderTab === 'history'}
                    onClick={() => setOrderTab('history')}
                    icon={<History size={18} />}
                    label={`History (${historyOrders.length})`}
                />
            </div>

            {/* --- ORDERS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {displayOrders.map(order => (
                    <div key={order.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-7 shadow-2xl group hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden">

                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg">
                                        {order.id}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Clock size={12} strokeWidth={3} />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">
                                            {order.date}
                                        </span>
                                    </div>
                                </div>
                                <h4 className="font-black text-white text-xl italic tracking-tight uppercase">
                                    {order.userName}
                                </h4>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>

                        {/* Items List (Glass Inset) */}
                        <div className="space-y-3 mb-6 bg-black/20 p-5 rounded-3xl border border-white/5 relative z-10">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[11px] font-black uppercase tracking-tight">
                                    <span className="text-gray-400">
                                        {item.name} <span className="text-orange-500 ml-1">x{item.qty}</span>
                                    </span>
                                    <span className="text-gray-500 font-mono">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>

                        {/* Billing Info */}
                        <div className="flex justify-between items-end mb-4 relative z-10 px-1">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Final Bill</p>
                            <p className="text-3xl font-black text-white tracking-tighter italic">₹{order.total}</p>
                        </div>

                        {/* Timeline Toggle */}
                        <TimelineSection
                            timestamps={{
                                paid: order.timePaid,
                                preparing: order.timePreparing,
                                served: order.timeServed
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function TimelineSection({ timestamps }) {
    const [isOpen, setIsOpen] = useState(false);
    const availableTimestamps = Object.entries(timestamps).filter(([_, time]) => time !== null);

    return (
        <div className="mt-2 relative z-10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-3 border-t border-dashed border-white/10 group transition-all"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-orange-500 transition-colors">
                    Trace Logs
                </span>
                <div className="text-gray-600 group-hover:text-orange-500 transition-colors flex items-center">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>

            {isOpen && (
                <div className="space-y-2 pb-4 pt-1 animate-in slide-in-from-top-2 duration-300">
                    {availableTimestamps.map(([key, time]) => (
                        <div key={key} className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">
                                {key}
                            </span>
                            <span className="text-[10px] font-mono font-black text-orange-500 px-2 py-0.5">
                                {time}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        'Paid': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'Preparing': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        'Served': 'bg-green-500/10 text-green-400 border-green-500/20'
    };
    return (
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${styles[status]}`}>
            {status}
        </span>
    );
}