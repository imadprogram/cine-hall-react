import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import toast from 'react-hot-toast';

export default function EditMovie() {
    const { id } = useParams(); // Gets the film ID from the URL
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [genre, setGenre] = useState('');
    const [age, setAge] = useState(10);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [trailer, setTrailer] = useState('');
    const [loading, setLoading] = useState(true);

    // Pre-fill the form with current film data
    useEffect(() => {
        async function fetchFilm() {
            const response = await fetch(`http://localhost:8000/api/films/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setTitle(data.title || '');
            setDuration(data.duration || '');
            setGenre(data.genre || '');
            setAge(data.minimum_age || 10);
            setDescription(data.description || '');
            setImage(data.image || '');
            setTrailer(data.trailer_url || '');
            setLoading(false);
        }
        fetchFilm();
    }, [id]);

    async function handleUpdate(e) {
        e.preventDefault();
        const response = await fetch(`http://localhost:8000/api/films/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, duration, genre, description, minimum_age: age, image, trailer_url: trailer })
        });

        if (response.ok) {
            toast.success("Film updated successfully!");
            navigate('/ManageMovie');
        } else {
            const data = await response.json();
            toast.error(data.message || "Failed to update film.");
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
    const inputClass = "w-full bg-neutral-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500 text-white";

    if (loading) return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <p className="text-neutral-500 text-lg animate-pulse">Loading film data...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-20">
            <Header />

            <main className="max-w-2xl mx-auto pt-32 px-6">
                {/* PAGE TITLE */}
                <div className="mb-10">
                    <p className="text-neutral-500 text-sm mb-1 uppercase tracking-widest">Admin Panel</p>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-yellow-400">Edit Film</h1>
                </div>

                {/* FORM CARD */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-10 shadow-2xl">
                    <form onSubmit={handleUpdate} className="space-y-5">

                        <input value={title} onChange={(e) => setTitle(e.target.value)}
                            className={inputClass} placeholder="Movie Title" />

                        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                            className={inputClass} placeholder="Duration (minutes)" />

                        <input value={image} onChange={(e) => setImage(e.target.value)}
                            className={inputClass} placeholder="Poster Image URL" />

                        <input value={trailer} onChange={(e) => setTrailer(e.target.value)}
                            className={inputClass} placeholder="Trailer Video URL" />

                        {/* GENRE */}
                        <Box>
                            <FormControl fullWidth sx={formControlStyles}>
                                <InputLabel id="genre-label" sx={{ color: 'gray' }}>Genre</InputLabel>
                                <Select labelId="genre-label" value={genre} label="Genre"
                                    onChange={(e) => setGenre(e.target.value)} sx={selectStyles}>
                                    <MenuItem value="Action">Action</MenuItem>
                                    <MenuItem value="Comedy">Comedy</MenuItem>
                                    <MenuItem value="Horror">Horror</MenuItem>
                                    <MenuItem value="Drama">Drama</MenuItem>
                                    <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* MINIMUM AGE */}
                        <Box>
                            <FormControl fullWidth sx={formControlStyles}>
                                <InputLabel id="age-label" sx={{ color: 'gray' }}>Minimum Age</InputLabel>
                                <Select labelId="age-label" value={age} label="Minimum Age"
                                    onChange={(e) => setAge(e.target.value)} sx={selectStyles}>
                                    <MenuItem value={10}>10+</MenuItem>
                                    <MenuItem value={16}>16+</MenuItem>
                                    <MenuItem value={18}>18+</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* DESCRIPTION */}
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                            className={`${inputClass} min-h-[150px] resize-none`}
                            placeholder="Film Description..." />

                        {/* ACTIONS */}
                        <div className="flex gap-4 pt-2">
                            <button type="button" onClick={() => navigate('/ManageMovie')}
                                className="w-full border-2 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white font-bold py-4 rounded-xl transition-all">
                                Cancel
                            </button>
                            <button type="submit"
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-yellow-400/20 active:scale-95">
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}