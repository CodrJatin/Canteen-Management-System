import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2, CheckCircle2, LogOut, Camera, ChevronDown } from 'lucide-react';
import { useAuth } from "../../context/authContext";

export default function AdminScanner() {
    const { user, logout } = useAuth();
    const [status, setStatus] = useState('ready');
    const [lastOrder, setLastOrder] = useState("");
    const [isScannerStarted, setIsScannerStarted] = useState(false);
    const [manualId, setManualId] = useState("");

    const [cameras, setCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState("");

    const scannerRef = useRef(null);

    useEffect(() => {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                setCameras(devices);

                setSelectedCameraId(devices[0].id);
            }
        }).catch(err => {
            console.error("Error fetching cameras:", err);
        });

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, []);

    const startScanner = async (cameraId = null) => {

        if (scannerRef.current && isScannerStarted) {
            await scannerRef.current.stop();
        }

        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const targetId = cameraId || selectedCameraId;
        const config = { fps: 20, qrbox: { width: 250, height: 250 } };

        try {
            setIsScannerStarted(true);
            await html5QrCode.start(
                targetId,
                config,
                async (decodedText) => {
                    if (status === 'processing') return;
                    handleScanSuccess(decodedText);
                }
            );
        } catch (err) {
            console.error("Camera Start Error:", err);
            setIsScannerStarted(false);
            alert("Camera Access Denied or Not Found. Check HTTPS/Localhost.");
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!manualId.trim()) return;
        const formattedId = `ORD-${manualId.trim().toUpperCase()}`;
        handleScanSuccess(formattedId);
        setManualId("");
    };

    const handleCameraChange = (e) => {
        const newId = e.target.value;
        setSelectedCameraId(newId);

        if (isScannerStarted) {
            startScanner(newId);
        }
    };

    const handleScanSuccess = async (orderId) => {
        setStatus('processing');
        setLastOrder(orderId);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/status/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setStatus('success');
                setTimeout(() => setStatus('ready'), 3000);
            } else {
                throw new Error("Invalid Ticket");
            }
        } catch (err) {
            setStatus('error');
            setTimeout(() => setStatus('ready'), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white font-sans relative">

            <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 z-50">
                <h1 className="font-black italic tracking-tighter text-xl">SCANNER<span className="text-orange-500">.</span></h1>
                <button onClick={logout} className="p-2 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 active:scale-95 transition-transform">
                    <LogOut size={20} />
                </button>
            </div>

            <div className="w-full max-w-sm space-y-6 z-10">

                {cameras.length > 1 && (
                    <div className="relative group animate-in fade-in slide-in-from-top-2">
                        <select
                            value={selectedCameraId}
                            onChange={handleCameraChange}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] appearance-none focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                        >
                            {cameras.map((camera) => (
                                <option key={camera.id} value={camera.id} className="bg-[#020617] text-white">
                                    {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-orange-500 transition-colors" size={16} />
                    </div>
                )}

                <div className={`relative aspect-square rounded-[50px] overflow-hidden border-2 transition-all duration-500 ${status === 'success' ? 'border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.2)]' : 'border-white/10 bg-white/5'}`}>

                    <div id="reader" className="w-full h-full bg-black"></div>

                    {!isScannerStarted && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-md">
                            <button
                                onClick={() => startScanner()}
                                className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-110 transition-transform animate-pulse"
                            >
                                <Camera size={32} />
                            </button>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Initialize Lens</p>
                        </div>
                    )}

                    {status === 'processing' && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                            <Loader2 className="animate-spin text-orange-500" size={40} />
                            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-orange-500">Verifying...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="absolute inset-0 bg-green-500 flex flex-col items-center justify-center z-50 animate-in zoom-in duration-300">
                            <CheckCircle2 size={60} />
                            <p className="text-2xl font-black mt-2 italic tracking-tighter uppercase">{lastOrder}</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Order Updated</p>
                        </div>
                    )}
                </div>

                <div className="text-center space-y-2 mt-4">
                    <p className="text-gray-500 font-black text-[9px] uppercase tracking-[0.4em] mb-4">Scan Student Order QR</p>

                    <div className="flex items-center justify-center gap-4 py-2">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest px-2">OR ENTER MANUAL ID</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <form onSubmit={handleManualSubmit} className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-black italic text-sm">ORD-</span>
                            <input
                                type="text"
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                                placeholder="XXXXXX"
                                maxLength={6}
                                className="w-full bg-white/5 border border-white/10 pl-[52px] p-4 rounded-2xl text-sm font-black text-white placeholder:text-gray-600 uppercase tracking-[0.1em] focus:outline-none focus:border-orange-500 transition-colors"
                            />
                        </div>
                        <button type="submit" disabled={!manualId.trim()} className="bg-orange-600 text-white px-6 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            GO
                        </button>
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                #reader video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
                #reader__scan_region { background: transparent !important; }
            `}} />
        </div>
    );
}