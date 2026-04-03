import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [film, setFilm] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        (async function fetchData() {
            try {
                const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

                // Fetch Film
                const filmRes = await fetch(`http://localhost:8000/api/films/${id}`, { headers });
                const filmData = await filmRes.json();
                setFilm(filmData);

                // Fetch Sessions and filter for this film
                const sessionRes = await fetch(`http://localhost:8000/api/seances`, { headers });
                const sessionData = await sessionRes.json();

                const filmSessions = sessionData.filter(s => s.film_id === parseInt(id));
                setSessions(filmSessions);

                // Group dates just to pick the first one as default selected
                if (filmSessions.length > 0) {
                    const uniqueDates = [...new Set(filmSessions.map(s => s.start_time.split(' ')[0]))];
                    setSelectedDate(uniqueDates.sort()[0]);
                }

            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <p className="text-neutral-500 animate-pulse text-lg">Loading...</p>
        </div>
    );

    if (!film) return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <p className="text-red-400 text-lg">Film not found.</p>
        </div>
    );

    const groupedSessions = sessions.reduce((acc, session) => {
        const datePart = session.start_time.split(' ')[0]; // gets YYYY-MM-DD
        if (!acc[datePart]) acc[datePart] = [];
        acc[datePart].push(session);
        return acc;
    }, {});

    const availableDates = Object.keys(groupedSessions).sort();

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans pb-20">
            <Header />

            {/* HERO SECTION */}
            <div className="relative w-full min-h-[65vh] flex items-end overflow-hidden">
                {/* BACKGROUND IMAGE */}
                <div className="absolute inset-0">
                    <img
                        src={film.image || "https://placehold.co/1400x700/111/333?text=No+Image"}
                        alt={film.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Dark gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
                </div>

                {/* FILM INFO */}
                <div className="relative z-10 max-w-7xl mx-auto px-10 pb-16 w-full">

                    {/* BADGES */}
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">
                            {film.genre}
                        </span>
                        <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {film.minimum_age}+
                        </span>
                        <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {film.duration} min
                        </span>
                    </div>

                    {/* TITLE */}
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 max-w-2xl leading-none">
                        {film.title}
                    </h1>

                    {/* DESCRIPTION */}
                    <p className="text-neutral-300 text-sm leading-relaxed max-w-xl mb-8">
                        {film.description}
                    </p>

                    {/* TRAILER BUTTON */}
                    {film.trailer_url && (
                        <a
                            href={film.trailer_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-yellow-400/20"
                        >
                            ▶ Watch Trailer
                        </a>
                    )}
                </div>
            </div>

            {/* SESSIONS SECTION */}
            <div className="max-w-7xl mx-auto px-10 py-14">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">
                    Book a Session
                </h2>

                {sessions.length === 0 ? (
                    <div className="border border-dashed border-neutral-700 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                        <div className="text-5xl mb-4">🎬</div>
                        <h3 className="text-xl font-bold text-white mb-2">No Sessions Available Yet</h3>
                        <p className="text-neutral-500 text-sm max-w-sm">
                            Sessions for this film haven't been scheduled yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* DATE TABS */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-8">
                            {availableDates.map(date => {
                                const dateObj = new Date(date);
                                const dayName = dateObj.toLocaleDateString([], { weekday: 'short' });
                                const dayNum = dateObj.toLocaleDateString([], { day: 'numeric' });
                                const monthName = dateObj.toLocaleDateString([], { month: 'short' });
                                const isSelected = selectedDate === date;

                                return (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 flex flex-col items-center justify-center py-4 px-6 rounded-2xl transition-all active:scale-95 ${isSelected
                                                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                                : 'bg-neutral-900 text-white border border-neutral-800 hover:border-yellow-400/50'
                                            }`}
                                    >
                                        <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${isSelected ? 'text-black/60' : 'text-neutral-500'}`}>
                                            {dayName}
                                        </span>
                                        <span className="text-3xl font-black">{dayNum}</span>
                                        <span className={`text-xs font-bold uppercase mt-1 ${isSelected ? 'text-black/60' : 'text-neutral-500'}`}>
                                            {monthName}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* TIME BLOCKS FOR SELECTED DATE */}
                        {selectedDate && groupedSessions[selectedDate] && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {groupedSessions[selectedDate]
                                    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)) // Sort times early to late
                                    .map(session => {
                                        const timeStr = new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                        return (
                                            <button
                                                key={session.id}
                                                onClick={() => navigate(`/book/${session.id}`)}
                                                className="group relative bg-neutral-900 border border-neutral-800 hover:border-yellow-400 rounded-2xl p-5 flex flex-col items-center gap-2 transition-all active:scale-95 text-center overflow-hidden"
                                            >
                                                {/* VIP Background Glow */}
                                                {session.session_type === 'vip' && (
                                                    <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}

                                                <span className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                                    {timeStr}
                                                </span>

                                                <div className="flex flex-col items-center gap-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${session.session_type === 'vip'
                                                            ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                                                            : 'bg-neutral-800 text-neutral-400'
                                                        }`}>
                                                        {session.session_type === 'vip' ? '★ VIP' : 'Normal'}
                                                    </span>
                                                    <span className="text-neutral-500 text-xs text-center truncate w-full">
                                                        {session.language}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}