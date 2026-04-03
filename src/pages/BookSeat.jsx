import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import toast from 'react-hot-toast';

export default function BookSeat() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [seance, setSeance] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function fetchSessionData() {
            try {
                const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

                // Fetch the seance details
                const res = await fetch(`http://localhost:8000/api/seances/${id}`, { headers });

                const data = await res.json();
                console.log("SEANCE API RESPONSE:", data);

                let fetchedSeance = data.seance;

                // Handle missing nested relations by fetching them just in case
                if (!fetchedSeance.film || !fetchedSeance.salle) {
                    const [filmsRes, roomsRes] = await Promise.all([
                        fetch(`http://localhost:8000/api/films`, { headers }),
                        fetch(`http://localhost:8000/api/rooms`, { headers })
                    ]);

                    if (filmsRes.ok) {
                        const films = await filmsRes.json();
                        fetchedSeance.film = films.find(f => f.id === fetchedSeance.film_id);
                    }
                    if (roomsRes.ok) {
                        const rooms = await roomsRes.json();
                        fetchedSeance.salle = rooms.find(r => r.id === fetchedSeance.salle_id);
                    }
                }

                setSeance(fetchedSeance);

                // Use the true reserved seat ids given by the API
                const reservedIds = data.reserved_seat_ids || [];

                const rowsCount = fetchedSeance.salle?.total_rows || 5;
                const seatsPerRow = fetchedSeance.salle?.seats_per_row || 10;

                const processSeats = (seatArray) => {
                    return seatArray.map((seat, index) => {
                        const calculatedRow = Math.floor(index / seatsPerRow) + 1;
                        const calculatedSeat = (index % seatsPerRow) + 1;
                        return {
                            ...seat,
                            row_number: seat.row_number || calculatedRow,
                            seat_number: seat.seat_number || calculatedSeat,
                            is_reserved: reservedIds.includes(seat.id)
                        };
                    });
                };

                if (fetchedSeance.seats && fetchedSeance.seats.length > 0) {
                    setSeats(processSeats(fetchedSeance.seats));
                } else if (fetchedSeance.salle && fetchedSeance.salle.seats && fetchedSeance.salle.seats.length > 0) {
                    setSeats(processSeats(fetchedSeance.salle.seats));
                } else if (fetchedSeance.salle) {
                    // MOCK SEATS GRID if API doesn't explicitly return spatial seat data
                    const mockSeats = [];
                    let seatCounter = 1;
                    for (let r = 1; r <= rowsCount; r++) {
                        for (let s = 1; s <= seatsPerRow; s++) {
                            mockSeats.push({
                                id: seatCounter,
                                row_number: r,
                                seat_number: s,
                                is_reserved: reservedIds.includes(seatCounter)
                            });
                            seatCounter++;
                        }
                    }
                    setSeats(mockSeats);
                }

            } catch (err) {
                console.error(err);
                toast.error("Failed to load session data");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const toggleSeat = (seat) => {
        if (seat.is_reserved) return; // Can't select reserved seats

        if (selectedSeats.find(s => s.id === seat.id)) {
            // Remove if already selected
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            // Add if not selected
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleCheckout = async () => {
        if (selectedSeats.length === 0) {
            toast.error("Please select at least one seat.");
            return;
        }

        try {
            const seatIds = selectedSeats.map(seat => seat.id);

            const req = await fetch(`http://localhost:8000/api/reservations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    seance_id: parseInt(id),
                    seat_ids: seatIds
                })
            });

            const res = await req.json();

            if (!req.ok) {
                toast.error(res.message || "Failed to make reservation");
                return;
            }

            toast.success("Reservation secured! Redirecting to payment...");

            // Extract the reservation ID (handles different common API structures)
            const reservationId = res.reservation?.id || res.data?.id || res.id;

            if (!reservationId) {
                toast.error("Error: Could not retrieve reservation ID.");
                return;
            }

            // 2. Hit the Stripe Checkout API
            const checkoutReq = await fetch(`http://localhost:8000/api/reservations/${reservationId}/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    payment_method: "stripe"
                })
            });

            const checkoutRes = await checkoutReq.json();

            if (!checkoutReq.ok) {
                toast.error("Failed to initialize Stripe checkout.");
                return;
            }

            // 3. Redirect to Stripe Checkout URL matching common field names
            const stripeUrl = checkoutRes.url || checkoutRes.checkout_url || checkoutRes.session_url;

            if (stripeUrl) {
                window.location.href = stripeUrl; // Redirect securely to Stripe!
            } else {
                toast.error("Stripe URL not found in response.");
                console.log("Checkout Response:", checkoutRes);
            }

        } catch (err) {
            console.error("Payment flow error:", err);
            toast.error("Server connection failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <p className="animate-pulse text-neutral-500">Loading Screening Room...</p>
        </div>
    );

    if (!seance) return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <p className="text-red-400">Session not found.</p>
        </div>
    );

    const price = seance.base_price || 0;
    const totalPrice = price * selectedSeats.length;

    // Grouping seats physically by row for rendering
    const rows = seats.reduce((acc, seat) => {
        if (!acc[seat.row_number]) acc[seat.row_number] = [];
        acc[seat.row_number].push(seat);
        return acc;
    }, {});

    return (
        <div className="bg-neutral-950 min-h-screen font-sans text-white pb-20">
            <Header />

            <div className="max-w-7xl mx-auto px-6 pt-32 grid lg:grid-cols-3 gap-12 relative">

                {/* LEFT: THE CINEMA ROOM */}
                <div className="lg:col-span-2">

                    {/* INFO HEADER */}
                    <div className="mb-12">
                        <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-white text-sm mb-4 transition-colors">
                            ← Back to Movie
                        </button>
                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
                            {seance.film?.title || "Movie Name"}
                        </h1>
                        <p className="text-neutral-400">
                            {seance.salle?.name || "Room"} • {new Date(seance.start_time).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • {seance.language}
                        </p>
                    </div>

                    {/* THE SCREEN */}
                    <div className="relative w-full max-w-3xl mx-auto mb-16 perspective-[800px]">
                        {/* Glow effect */}
                        <div className="absolute top-0 left-10 right-10 h-8 bg-yellow-400/20 blur-2xl" />

                        {/* The physical screen */}
                        <div
                            className="w-full h-12 bg-gradient-to-t from-neutral-800 to-neutral-700/50 rounded-t-[50%] border-t-4 border-yellow-400 shadow-[0_-15px_30px_rgba(250,204,21,0.15)]"
                            style={{ transform: 'rotateX(30deg)' }}
                        />
                        <p className="text-center text-xs text-neutral-600 font-bold tracking-[0.5em] uppercase mt-6">
                            Screen
                        </p>
                    </div>

                    {/* THE SEATS GRID */}
                    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
                        {Object.values(rows).map((row, index) => (
                            <div key={index} className="flex justify-center gap-3 sm:gap-4">
                                {row.map(seat => {
                                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                                    const isReserved = seat.is_reserved;

                                    return (
                                        <button
                                            key={seat.id}
                                            onClick={() => toggleSeat(seat)}
                                            disabled={isReserved}
                                            className={`
                                                group relative w-10 h-10 sm:w-12 sm:h-12 rounded-t-2xl rounded-b-md transition-all flex items-end justify-center pb-1
                                                ${isReserved
                                                    ? 'bg-neutral-800 border-x-4 border-t-2 border-neutral-900 cursor-not-allowed opacity-40'
                                                    : isSelected
                                                        ? 'bg-yellow-400 border-x-4 border-t-2 border-yellow-600 shadow-[0_0_15px_rgba(250,204,21,0.4)] -translate-y-2'
                                                        : 'bg-neutral-700 border-x-4 border-t-2 border-neutral-950 hover:bg-neutral-600 hover:-translate-y-1'
                                                }
                                            `}
                                        >
                                            {/* Inner Cushion */}
                                            <div className={`absolute bottom-1 w-[70%] h-[60%] rounded-t-lg transition-colors
                                                ${isReserved ? 'bg-neutral-900' : isSelected ? 'bg-yellow-300' : 'bg-neutral-500'}
                                            `} />
                                            <span className={`text-[10px] font-bold z-10 mb-1 ${isSelected ? 'text-black' : 'text-neutral-300'}`}>
                                                {seat.seat_number}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                    {/* LEGEND */}
                    <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-neutral-800">
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-t-2xl rounded-b-md bg-neutral-700 border-x-4 border-t-2 border-neutral-950 flex items-end justify-center pb-1">
                                <div className="absolute bottom-1 w-[70%] h-[60%] rounded-t-md bg-neutral-500" />
                            </div>
                            <span className="text-sm font-bold text-neutral-400" style={{ zIndex: 10 }}>Available</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-t-2xl rounded-b-md bg-yellow-400 border-x-4 border-t-2 border-yellow-600 shadow-[0_0_10px_rgba(250,204,21,0.4)] flex items-end justify-center pb-1">
                                <div className="absolute bottom-1 w-[70%] h-[60%] rounded-t-md bg-yellow-300" />
                            </div>
                            <span className="text-sm font-bold text-yellow-400" style={{ zIndex: 10 }}>Selected</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-50">
                            <div className="relative w-8 h-8 rounded-t-2xl rounded-b-md bg-neutral-800 border-x-4 border-t-2 border-neutral-900 flex items-end justify-center pb-1">
                                <div className="absolute bottom-1 w-[70%] h-[60%] rounded-t-md bg-neutral-900" />
                            </div>
                            <span className="text-sm font-bold text-neutral-600" style={{ zIndex: 10 }}>Taken</span>
                        </div>
                    </div>

                </div>

                {/* RIGHT: CHECKOUT SIDEBAR */}
                <div className="lg:sticky lg:top-32 h-fit">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
                        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 pb-6 border-b border-neutral-800">
                            Booking Summary
                        </h2>

                        <div className="space-y-6 mb-8">
                            <div>
                                <p className="text-neutral-500 text-sm mb-1 uppercase tracking-wider font-bold">Session Type</p>
                                <p className="text-lg uppercase text-white">
                                    {seance.session_type === 'vip' ? '★ VIP' : 'Normal'}
                                </p>
                            </div>

                            <div>
                                <p className="text-neutral-500 text-sm mb-2 uppercase tracking-wider font-bold">Selected Seats</p>
                                {selectedSeats.length === 0 ? (
                                    <p className="text-neutral-600 italic">None selected yet</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSeats.map(s => (
                                            <span key={s.id} className="bg-neutral-800 border border-neutral-700 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                                R{s.row_number} - S{s.seat_number}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-800 mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-neutral-400 font-bold uppercase tracking-wider">Total</span>
                                <span className="text-4xl font-black text-yellow-400">${totalPrice.toFixed(2)}</span>
                            </div>
                            <p className="text-right text-neutral-600 text-sm">{selectedSeats.length} x ${price.toFixed(2)}</p>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={selectedSeats.length === 0}
                            className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all ${selectedSeats.length === 0
                                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                                : 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.3)] active:scale-95'
                                }`}
                        >
                            Confirm & Pay
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
