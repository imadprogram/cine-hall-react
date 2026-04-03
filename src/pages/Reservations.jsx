import { useState, useEffect } from "react";
import Header from "../components/Header";
import toast from 'react-hot-toast';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const openTicketDetails = async (resObj) => {
        setModalLoading(true);
        try {
            const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
            const res = await fetch(`http://localhost:8000/api/reservations/${resObj.id}/ticket`, { headers });
            const data = await res.json();

            if (res.ok) {
                // Combine our base reservation details (Movie, Seats) with the API's QR code & status
                setSelectedTicket({
                    ...resObj,
                    ...(data.ticket || {}),
                    ticket_id: data.ticket?.id || resObj.id, // Ensure we have the explicit ticket ID for downloading
                    payment_status: data.status
                });
            } else {
                toast.error("Could not load digital ticket passes.");
            }
        } catch (err) {
            toast.error("Error connecting to server.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleDownload = async (ticketId) => {
        const toastId = toast.loading("Preparing secure download...");
        try {
            const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
            // Hit the dedicated download API
            const req = await fetch(`http://localhost:8000/api/tickets/${ticketId}/download`, { headers });

            if (!req.ok) throw new Error("Download failed on server.");

            // Convert the API response into a file blob and trigger the browser download
            const blob = await req.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Cinema_Ticket_${ticketId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Ticket downloaded successfully!", { id: toastId });
        } catch (err) {
            console.error("Download Error:", err);
            toast.error("Failed to download the ticket.", { id: toastId });
        }
    };

    useEffect(() => {
        (async function fetchReservations() {
            try {
                const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
                const res = await fetch(`http://localhost:8000/api/reservations`, { headers });

                if (res.ok) {
                    const data = await res.json();

                    // Arrays are often nested depending on the Laravel API setup.
                    // If returning Resource Collections, it's often in data.data
                    if (data.data) {
                        setReservations(data.data);
                    } else if (Array.isArray(data)) {
                        setReservations(data);
                    } else if (data.reservations) {
                        setReservations(data.reservations);
                    }
                } else {
                    toast.error("Failed to load tickets.");
                }
            } catch (err) {
                console.error("Could not fetch reservations", err);
                toast.error("Network Error.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <p className="animate-pulse text-yellow-400 font-bold tracking-widest uppercase">Finding your tickets...</p>
        </div>
    );

    return (
        <div className="bg-neutral-950 min-h-screen text-white pb-20 font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-6 pt-32">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">My Tickets</h1>
                    <p className="text-neutral-500">View and manage your upcoming movie reservations.</p>
                </div>

                {reservations.length === 0 ? (
                    <div className="border border-dashed border-neutral-700 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                        <div className="text-5xl mb-4 opacity-50">🍿</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Tickets Yet</h3>
                        <p className="text-neutral-500 mb-6">Looks like you haven't booked any movies recently.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {reservations.map((res, idx) => {
                            // Extract details safely, as relations (seance, film, seats) might vary in structure!
                            const seance = res.seance || res.session || {};
                            const filmTitle = seance.film?.title || "Movie Session";
                            const roomName = seance.salle?.name || `Room`;
                            const startTimeStr = seance.start_time;
                            const totalPrice = res.total_price || seance.base_price * (res.seats?.length || 1) || "Paid";

                            // Format the date uniquely for tickets
                            const dateObj = startTimeStr ? new Date(startTimeStr) : new Date();
                            const month = dateObj.toLocaleDateString([], { month: 'short' }).toUpperCase();
                            const day = dateObj.toLocaleDateString([], { day: '2-digit' });
                            const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                                <div
                                    key={res.id || idx}
                                    onClick={() => openTicketDetails(res)}
                                    className="relative flex bg-neutral-900 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(250,204,21,0.15)] transition-all duration-300 cursor-pointer border border-neutral-800/50"
                                >

                                    {/* Left Stub (Date & Time) */}
                                    <div className="bg-yellow-400 text-black w-28 flex flex-col justify-center items-center p-4 border-r-2 border-dashed border-yellow-500 relative">
                                        <span className="text-xs font-bold tracking-widest mb-1 opacity-70">{month}</span>
                                        <span className="text-4xl font-black mb-1">{day}</span>
                                        <span className="text-xs font-bold whitespace-nowrap">{time}</span>

                                        {/* Ticket Cutouts */}
                                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-neutral-950 rounded-full" />
                                        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-neutral-950 rounded-full" />
                                    </div>

                                    {/* Main Ticket Body */}
                                    <div className="flex-1 p-6 relative">
                                        <p className="text-xs text-yellow-400 font-bold tracking-widest uppercase mb-1">
                                            {roomName}
                                        </p>
                                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-3">
                                            {filmTitle}
                                        </h3>

                                        <div className="flex justify-between items-end mt-6">
                                            <div>
                                                <p className="text-xs text-neutral-500 font-bold uppercase mb-1 tracking-wider">Seats</p>
                                                <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                    {res.seats && res.seats.length > 0 ? (
                                                        res.seats.map(s => (
                                                            <span key={s.id} className="text-sm font-bold bg-neutral-800 px-2 py-0.5 rounded text-white inline-block">
                                                                R{s.row_number}-S{s.seat_number}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-neutral-400 italic">Seat IDs: {res.seat_ids ? res.seat_ids.join(', ') : 'Standard'}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-neutral-400">Total</span>
                                                <p className="text-xl font-black text-yellow-400">${Number(Math.max(totalPrice, 0)).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Background Barcode Deco */}
                                        <div className="absolute right-6 top-6 opacity-5 flex flex-col items-end gap-1 pointer-events-none">
                                            <div className="w-16 h-1 bg-white" />
                                            <div className="w-12 h-1 bg-white" />
                                            <div className="w-20 h-1 bg-white" />
                                            <div className="w-14 h-1 bg-white" />
                                            <div className="w-8 h-1 bg-white" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* DIGITAL TICKET MODAL */}
            {modalLoading && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                    <p className="animate-pulse text-yellow-400 font-bold tracking-widest uppercase">Retrieving E-Ticket...</p>
                </div>
            )}

            {selectedTicket && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>

                    {/* MODAL CONTAINER */}
                    <div className="bg-neutral-900 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>

                        {/* Close button */}
                        <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors z-20">
                            ✕
                        </button>

                        {/* Top Color Header */}
                        <div className="h-32 bg-yellow-400 relative flex items-center justify-center overflow-hidden">
                            <div className="absolute opacity-20 font-black text-black text-[6rem] -rotate-12 select-none tracking-tighter">
                                ADMIT
                            </div>
                            <h2 className="relative z-10 text-3xl font-black text-black uppercase tracking-widest text-center mt-6">
                                Cinema Pass
                            </h2>
                        </div>

                        {/* Ticket Details */}
                        <div className="px-8 pt-8 pb-4 bg-neutral-900 relative">
                            {/* The Cutouts */}
                            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-black/90" />
                            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-black/90" />

                            <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.2em] mb-1 text-center">
                                {selectedTicket.seance?.salle?.name || 'Standard Room'}
                            </p>
                            <h3 className="text-white text-3xl font-black text-center uppercase tracking-tighter mb-6 leading-none">
                                {selectedTicket.seance?.film?.title || 'Unknown Movie'}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 border-y border-dashed border-neutral-800 py-4 mb-6">
                                <div>
                                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Date & Time</p>
                                    <p className="text-white text-sm font-bold">
                                        {selectedTicket.seance?.start_time ? new Date(selectedTicket.seance.start_time).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Pass Type</p>
                                    <p className="text-white text-sm font-bold uppercase">
                                        {selectedTicket.seance?.session_type || 'Standard'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Seats</p>
                                    <p className="text-white text-sm font-bold text-yellow-400 truncate max-w-[140px]">
                                        {selectedTicket.seats?.length ? selectedTicket.seats.map(s => `R${s.row_number}S${s.seat_number}`).join(', ') : 'Not assigned'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Payment</p>
                                    <p className={`text-sm font-bold uppercase ${selectedTicket.payment_status?.toLowerCase() === 'paid' ? 'text-green-500' : 'text-neutral-300'}`}>
                                        {selectedTicket.payment_status || 'Pending'}
                                    </p>
                                </div>
                            </div>

                            {/* QR/Barcode area placeholder */}
                            <div className="flex flex-col items-center justify-center pb-6">
                                <div className="w-full h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden p-2">
                                    {selectedTicket.qr_code_url ? (
                                        <img src={selectedTicket.qr_code_url} alt="Ticket QR Code" className="h-full object-contain mix-blend-multiply" />
                                    ) : (
                                        <div className="flex w-full h-full justify-between opacity-80" style={{ background: 'repeating-linear-gradient(to right, black, black 4px, white 4px, white 6px, black 6px, black 12px, white 12px, white 14px, black 14px, black 18px, white 18px, white 20px)' }} />
                                    )}
                                </div>
                                <p className="text-xs text-neutral-500 font-mono mt-3 tracking-[0.4em] uppercase">
                                    CINE-TKT-{selectedTicket.id}
                                </p>

                                {/* Download PDF Button if present */}
                                {selectedTicket.pdf_url && (
                                    <button
                                        onClick={() => handleDownload(selectedTicket.ticket_id)}
                                        className="mt-6 w-full py-3 bg-neutral-800 hover:bg-yellow-400 hover:text-black text-white rounded-xl text-xs font-bold tracking-widest uppercase transition-colors text-center"
                                    >
                                        Secure Download
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
