import React, { useState } from 'react';
import { Clock, Activity, History, ChevronDown, ChevronUp } from 'lucide-react';
import TabButton from './TabButton';


export default function OrdersView({ orders }) {
    const [orderTab, setOrderTab] = useState('live');
    
    const liveOrders = orders.filter(o => o.status !== 'Served');
    const historyOrders = orders.filter(o => o.status === 'Served');
    const displayOrders = orderTab === 'live' ? liveOrders : historyOrders;
    
    return (
        <div className="space-y-6">
            {/* SUB-NAVBAR */}
            <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-2xl w-fit">
                <TabButton
                    active={orderTab === 'live'}
                    onClick={() => setOrderTab('live')}
                    icon={<Activity size={18} />}
                    label={`Live Orders (${liveOrders.length})`}
                    />
                <TabButton
                    active={orderTab === 'history'}
                    onClick={() => setOrderTab('history')}
                    icon={<History size={18} />}
                    label={`History (${historyOrders.length})`}
                    />
            </div>

            {/* ORDERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {displayOrders.map(order => (
                    <div key={order.id} className="bg-white border border-gray-100 rounded-[35px] p-6 shadow-sm group hover:border-blue-100 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                                        {order.id}
                                    </span>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <Clock size={12} strokeWidth={3} />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">
                                            {order.date} {/* General relative time if needed */}
                                        </span>
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg italic tracking-tight uppercase">
                                    {order.userName}
                                </h4>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>

                        {/* Items List */}
                        <div className="space-y-2 mb-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs font-bold uppercase">
                                    <span className="text-gray-500">{item.name} <span className="text-blue-600">x{item.qty}</span></span>
                                    <span className="text-gray-400 font-medium">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>

                        {/* BILLING INFO */}
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Total Bill</p>
                            <p className="text-2xl font-black text-gray-900 tracking-tighter italic">₹{order.total}</p>
                        </div>

                        {/* COLLAPSIBLE TIMELINE SECTION */}
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

    // Filter out keys where the value is null or undefined
    const availableTimestamps = Object.entries(timestamps).filter(([_, time]) => time !== null);

    return (
        <div className="mt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-2 border-t border-dashed border-gray-100 group transition-all"
            >
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-600 transition-colors">
                    Timeline
                </span>
                <div className="text-gray-300 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
            </button>

            {isOpen && (
                <div className="space-y-2 py-3 animate-in slide-in-from-top-2 duration-200">
                    {availableTimestamps.map(([key, time]) => (
                        <div key={key} className="flex justify-between items-center px-2">
                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">
                                {key}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
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
        'Paid': 'bg-blue-50 text-blue-600',
        'Preparing': 'bg-amber-50 text-amber-600',
        'Served': 'bg-green-50 text-green-600'
    };
    return (
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
            {status}
        </span>
    );
}