import { useEffect, useState } from "react";
import Header from "../../components/Header";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import toast from 'react-hot-toast';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [rows, setRows] = useState('');
    const [seatsPerRow, setSeatsPerRow] = useState('');

    async function fetchRooms() {
        try {
            const response = await fetch("http://localhost:8000/api/rooms", {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
            }
        } catch {
            console.error("Could not fetch rooms");
        }
    }

    useEffect(() => {
        fetchRooms();
    }, []);

    async function addRoom(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/rooms", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name,
                    total_rows: parseInt(rows),
                    seats_per_row: parseInt(seatsPerRow),
                })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || data.error || "Failed to create room");
            } else {
                setIsOpen(false);
                toast.success("Room created successfully!");
                fetchRooms();

                setName('');
                setRows('');
                setSeatsPerRow('');
            }
        } catch {
            toast.error("Could not connect to the server");
        }
    }

    return (
        <div className="bg-[#091413] min-h-screen w-full pb-20">
            <Header />

            <main className="pt-24 px-10 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Manage Rooms
                    </h1>

                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-yellow-400/10"
                        onClick={() => setIsOpen(true)}
                    >
                        <AddIcon />
                        <span>Add a Room</span>
                    </button>
                </div>

                {/* ROOMS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-yellow-400 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-white font-bold text-xl mb-2">{room.name}</h3>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="bg-neutral-800 p-2 rounded-lg text-center mb-1">
                                        <p className="text-white font-bold text-lg leading-none">{(room.total_rows * room.seats_per_row) || 0}</p>
                                    </div>
                                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">Total Seats</p>
                                </div>
                            </div>

                            <div className="flex gap-3 text-sm">
                                <div className="bg-neutral-950/50 border border-neutral-800 p-3 rounded-xl w-full flex justify-between items-center">
                                    <span className="text-neutral-500">Rows</span>
                                    <span className="text-white font-bold">{room.total_rows}</span>
                                </div>
                                <div className="bg-neutral-950/50 border border-neutral-800 p-3 rounded-xl w-full flex justify-between items-center">
                                    <span className="text-neutral-500">Seats/Row</span>
                                    <span className="text-white font-bold">{room.seats_per_row}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {rooms.length === 0 && (
                        <div className="col-span-full border-2 border-dashed border-neutral-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                            <div className="text-5xl mb-4 opacity-50">💺</div>
                            <h3 className="text-xl font-bold text-white mb-2">No Rooms Found</h3>
                            <p className="text-neutral-500 max-w-sm">Create your first cinema hall by clicking the "Add a Room" button above.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* ADD ROOM MODAL */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md p-10 rounded-3xl shadow-2xl relative">
                        <h2 className="text-2xl font-bold mb-8 text-yellow-400">Add New Room</h2>

                        <form onSubmit={addRoom} className="space-y-5">
                            <input
                                value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-neutral-800 border-2 border-transparent focus:border-yellow-400/50 p-4 rounded-xl outline-none text-white placeholder-gray-500 transition-all font-medium"
                                placeholder="Room Name (e.g. Hall A, VIP Room)"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Total Rows</label>
                                    <input
                                        type="number" min="1"
                                        value={rows} onChange={(e) => setRows(e.target.value)}
                                        className="w-full bg-neutral-800 border-2 border-transparent focus:border-yellow-400/50 p-4 rounded-xl outline-none text-white placeholder-gray-500 transition-all font-bold text-center text-lg"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">Seats / Row</label>
                                    <input
                                        type="number" min="1"
                                        value={seatsPerRow} onChange={(e) => setSeatsPerRow(e.target.value)}
                                        className="w-full bg-neutral-800 border-2 border-transparent focus:border-yellow-400/50 p-4 rounded-xl outline-none text-white placeholder-gray-500 transition-all font-bold text-center text-lg"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 hover:shadow-yellow-400/40 transition-all mt-4 active:scale-95 text-lg">
                                Create Room
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