import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function fetchFilms() {
            try {
                const response = await fetch("http://localhost:8000/api/films", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setMovies(data);
            } catch {
                console.error("Failed to fetch films.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-24">
                <h2 className="text-3xl font-bold mb-8 border-l-4 border-yellow-400 pl-4">
                    Now Playing
                </h2>

                {loading ? (
                    <p className="text-center text-neutral-500 animate-pulse">Loading movies...</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {movies.map((movie) => (
                            <Link
                                to={`/movies/${movie.id}`}
                                key={movie.id}
                                className="group cursor-pointer transform transition-all hover:-translate-y-2"
                            >
                                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-neutral-800">
                                    <img
                                        src={movie.image || "https://placehold.co/300x450/1a1a1a/555?text=No+Poster"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        alt={movie.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <span className="text-yellow-400 font-bold text-sm">See details →</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h3 className="font-bold text-lg leading-tight group-hover:text-yellow-400 transition-colors">
                                        {movie.title}
                                    </h3>
                                    <div className="flex gap-2 text-xs text-neutral-500 mt-2">
                                        <span>{movie.duration} min</span>
                                        <span>•</span>
                                        <span>{movie.genre}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}