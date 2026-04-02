import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

export default function MovieDetails() {
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function fetchFilm() {
            try {
                const response = await fetch(`http://localhost:8000/api/films/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await response.json();
                setFilm(data);
            } catch {
                console.error("Failed to fetch film.");
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

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans">
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

                {/* NO SESSIONS YET */}
                <div className="border border-dashed border-neutral-700 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <div className="text-5xl mb-4">🎬</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Sessions Available Yet</h3>
                    <p className="text-neutral-500 text-sm max-w-sm">
                        Sessions for this film haven't been scheduled yet. Check back soon!
                    </p>
                </div>
            </div>
        </div>
    );
}