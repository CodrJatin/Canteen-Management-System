import React from 'react';
import { Plus, RefreshCw, PackageSearch } from "lucide-react";
import EditableRow from ".././admin/EditableRow";

export default function StockView({ stock, onUpdate, onDeleteReq, onOpenAddModal, onFetchManual }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase">
                        Inventory<span className="text-orange-500">.</span>
                    </h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                        <PackageSearch size={14} className="text-orange-500" /> Control Terminal
                    </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={onFetchManual}
                        className="flex-1 md:flex-none bg-white/5 text-gray-400 px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={14} className="text-orange-500" />
                        Sync Data
                    </button>

                    <button
                        onClick={onOpenAddModal}
                        className="flex-1 md:flex-none bg-orange-600 text-white px-6 md:px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 shadow-2xl shadow-orange-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        <Plus size={16} strokeWidth={4} /> Add Item
                    </button>
                </div>
            </div>

            {/* --- DESKTOP TABLE (DEEP GLASS) --- */}
            <div className="hidden md:block overflow-hidden">
                <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr>
                            <th className="pb-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-left">Item Identity</th>
                            {/* --- NEW CATEGORY COLUMN --- */}
                            <th className="pb-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-left">Classification</th>
                            <th className="pb-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-left">Unit Price</th>
                            <th className="pb-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-left">Volume</th>
                            <th className="pb-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="before:block before:h-2">
                        {stock && stock.length > 0 ? (
                            stock.map(item => (
                                <EditableRow
                                    key={item._id}
                                    item={item}
                                    onSave={onUpdate}
                                    onDeleteReq={onDeleteReq}
                                />
                            ))
                        ) : (
                            <tr>
                                {/* --- UPDATED COLSPAN TO 5 --- */}
                                <td colSpan="5" className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                                        <PackageSearch size={48} className="text-gray-400" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                                            No data stream detected. Initiate Sync.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MOBILE LIST --- */}
            <div className="md:hidden space-y-6">
                {stock && stock.length > 0 ? (
                    stock.map(item => (
                        <EditableRow
                            key={item._id}
                            item={item}
                            onSave={onUpdate}
                            onDeleteReq={onDeleteReq}
                            mobile
                        />
                    ))
                ) : (
                    <div className="py-20 text-center opacity-20">
                        <PackageSearch size={40} className="mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Database Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
}