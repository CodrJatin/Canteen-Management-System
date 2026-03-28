import {Plus} from "lucide-react"
import EditableRow from ".././admin/EditableRow";

export default function StockView({ inventory, onUpdate, onDeleteReq, onOpenAddModal }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Inventory</h2>
                    <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage Menu & Stock</p>
                </div>
                <button onClick={onOpenAddModal} className="bg-blue-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 cursor-pointer text-sm md:text-base">
                    <Plus size={18} strokeWidth={3} /> Add
                </button>
            </div>

            {/* --- DESKTOP TABLE (Visible on md and up) --- */}
            <div className="hidden md:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Item Name</th>
                            <th className="pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Price</th>
                            <th className="pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Stock</th>
                            <th className="pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => <EditableRow key={item.id} item={item} onSave={onUpdate} onDeleteReq={onDeleteReq} />)}
                    </tbody>
                </table>
            </div>

            {/* --- MOBILE LIST (Visible on small screens only) --- */}
            <div className="md:hidden space-y-4">
                {inventory.map(item => <EditableRow key={item.id} item={item} onSave={onUpdate} onDeleteReq={onDeleteReq} mobile />)}
            </div>
        </div>
    );
}