import { useEffect, useState } from "react";
import Header from "../../components/Header";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import toast from 'react-hot-toast';

export default function ManageSessions() {
    const [sessions, setSessions] = useState([]);
    const [films, setFilms] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [filmId, setFilmId] = useState('');
    const [salleId, setSalleId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [language, setLanguage] = useState('');
    const [sessionType, setSessionType] = useState('normal');

    async function fetchData() {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const sessionsRes = await fetch("http://localhost:8000/api/seances", { headers });
            if (sessionsRes.ok) setSessions(await sessionsRes.json());

            const filmsRes = await fetch("http://localhost:8000/api/films", { headers });
            if (filmsRes.ok) setFilms(await filmsRes.json());

            const roomsRes = await fetch("http://localhost:8000/api/rooms", { headers });
            if (roomsRes.ok) setRooms(await roomsRes.json());

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function addSession(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/seances", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    film_id: filmId,
                    salle_id: salleId,
                    start_time: `${date} ${time}:00`,
                    base_price: parseFloat(basePrice),
                    language,
                    session_type: sessionType
                })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || data.error || "Failed to create session");
                console.log("Validation errors:", data.errors);
            } else {
                setIsOpen(false);
                toast.success("Session created successfully!");
                fetchData();

                setFilmId('');
                setSalleId('');
                setDate('');
                setTime('');
                setBasePrice('');
                setLanguage('');
                setSessionType('standard');
            }
        } catch (err) {
            console.error("The exact error is: ", err);
            toast.error("Could not connect to the server. Check console.");
        }
    }

    const selectStyles = {
        color: 'white',
        bgcolor: '#262626',
        borderRadius: '12px',
        '& .MuiSvgIcon-root': { color: 'white' }
    };
    const formControlStyles = {
        '& .MuiInputLabel-root': { color: '#888' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
    };

    return (
        <div className="bg-[#091413] min-h-screen w-full pb-20">
            <Header />

            <main className="pt-24 px-10 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Manage Sessions
                    </h1>

                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-yellow-400/10"
                        onClick={() => setIsOpen(true)}
                    >
                        <AddIcon />
                        <span>Add a Session</span>
                    </button>
                </div>

                {/* SESSIONS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions.map((session, index) => (
                        <div key={session.id} className="animate-slide-up bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-yellow-400 transition-all group"
                            style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    {/* Usually the API returns nested objects or you map the ID to find the name */}
                                    <h3 className="text-white font-bold text-xl mb-1">
                                        {session.film?.title || films.find(f => f.id === session.film_id)?.title || `Film #${session.film_id}`}
                                    </h3>
                                    <span className="text-neutral-400 text-sm font-medium">
                                        {session.salle?.name || rooms.find(r => r.id === session.salle_id)?.name || `Room #${session.salle_id}`}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-lg text-center mb-1">
                                        <p className="text-yellow-400 font-bold tracking-widest">
                                            {session.start_time ? new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                        </p>
                                    </div>
                                    {session.session_type === 'vip' && (
                                        <span className="text-yellow-400 text-[10px] uppercase font-bold tracking-wider mt-1 block">★ VIP</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-neutral-950/50 border border-neutral-800 p-3 rounded-xl">
                                <span className="text-xl">📅</span>
                                <span className="text-white font-bold tracking-wide">
                                    {session.start_time ? new Date(session.start_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    ))}

                    {sessions.length === 0 && (
                        <div className="col-span-full border-2 border-dashed border-neutral-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                            <div className="text-5xl mb-4 opacity-50">🍿</div>
                            <h3 className="text-xl font-bold text-white mb-2">No Sessions Found</h3>
                            <p className="text-neutral-500 max-w-sm">Schedule your first movie showing by clicking the "Add a Session" button above.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* ADD SESSION MODAL */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md p-10 rounded-3xl shadow-2xl relative">
                        <h2 className="text-2xl font-bold mb-8 text-yellow-400">Add New Session</h2>

                        <form onSubmit={addSession} className="space-y-5">

                            {/* FILM SELECT */}
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth sx={formControlStyles}>
                                    <InputLabel id="film-label" sx={{ color: 'gray' }}>Select Film</InputLabel>
                                    <Select
                                        labelId="film-label"
                                        value={filmId}
                                        label="Select Film"
                                        onChange={(e) => setFilmId(e.target.value)}
                                        sx={selectStyles}
                                        required
                                    >
                                        {films.map(film => (
                                            <MenuItem key={film.id} value={film.id}>{film.title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* ROOM SELECT */}
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth sx={formControlStyles}>
                                    <InputLabel id="room-label" sx={{ color: 'gray' }}>Select Room (Salle)</InputLabel>
                                    <Select
                                        labelId="room-label"
                                        value={salleId}
                                        label="Select Room (Salle)"
                                        onChange={(e) => setSalleId(e.target.value)}
                                        sx={selectStyles}
                                        required
                                    >
                                        {rooms.map(room => (
                                            <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <div className="grid grid-cols-2 gap-4">
                                {/* DATE INPUT */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Date</label>
                                    <input
                                        type="date"
                                        value={date} onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-neutral-800 border-2 border-transparent focus:border-yellow-400/50 p-4 rounded-xl outline-none text-white placeholder-gray-500 transition-all font-bold"
                                        required
                                    />
                                </div>
                                {/* TIME INPUT */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Time</label>
                                    <input
                                        type="time"
                                        value={time} onChange={(e) => setTime(e.target.value)}
                                        className="w-full bg-neutral-800 border-2 border-transparent focus:border-yellow-400/50 p-4 rounded-xl outline-none text-white placeholder-gray-500 transition-all font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            {/* BASE PRICE */}
                            <input
                                type="number" min="0" step="0.01"
                                value={basePrice} onChange={(e) => setBasePrice(e.target.value)}
                                className="w-full bg-neutral-800 border-2 border-transparent focus:border-yellow-400/50 p-4 rounded-xl outline-none text-white placeholder-gray-500 transition-all"
                                placeholder="Base Price (e.g. 12.50)"
                                required
                            />

                            {/* LANGUAGE */}
                            <input
                                value={language} onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-neutral-800 border-2 border-transparent focus:border-yellow-400/50 p-4 rounded-xl outline-none text-white placeholder-gray-500 transition-all"
                                placeholder="Language (e.g. English (Subtitled))"
                                required
                            />

                            {/* SESSION TYPE */}
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth sx={formControlStyles}>
                                    <InputLabel id="type-label" sx={{ color: 'gray' }}>Session Type</InputLabel>
                                    <Select
                                        labelId="type-label"
                                        value={sessionType}
                                        label="Session Type"
                                        onChange={(e) => setSessionType(e.target.value)}
                                        sx={selectStyles}
                                    >
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="vip">VIP</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 hover:shadow-yellow-400/40 transition-all mt-4 active:scale-95 text-lg">
                                Create Session
                            </button>
                        </form>

                        <button
                            onClick={() => setIsOpen(false)}
                            type="button"
                            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}