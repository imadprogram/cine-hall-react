import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import toast from 'react-hot-toast'


export default function ManageMovie() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false)

    // 1. Separate States for each field
    const [title, setTitle] = useState('')
    const [duration, setDuration] = useState('')
    const [genre, setGenre] = useState('')
    const [age, setAge] = useState(10)
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [trailer, setTrailer] = useState('')
    const [error, setError] = useState(null)
    const [films, setFilms] = useState([])


    useEffect(() => {
        async function fetchFilms() {
            const response = await fetch("http://localhost:8000/api/films", {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await response.json()
            setFilms(data)
        }
        fetchFilms()
    }, [])


    async function addMovie(e) {
        e.preventDefault()
        setError(null)

        try {
            const response = await fetch("http://localhost:8000/api/films", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title: title, duration: duration, genre: genre, description: description, minimum_age: age, image: image, trailer_url: trailer })
            })

            const data = await response.json()


            if (!response.ok) {
                toast.error("Movie failed to add")
            } else {
                setIsOpen(false)
                toast.success("Movie has added succussfully")
            }
        } catch {
            setError("Could not connect to the server")
        }
    }

    return (
        <div className="bg-[#091413] min-h-screen w-full">
            <Header />

            <main className="pt-24 px-10">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Manage Movies
                    </h1>

                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-yellow-400/10"
                        onClick={() => setIsOpen(true)}
                    >
                        <AddIcon />
                        <span>Add a Movie</span>
                    </button>
                </div>

                {/* FILMS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {films.map((film) => (
                        <div key={film.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-yellow-400 transition-all group">
                            <div className="aspect-[2/3] overflow-hidden">
                                <img
                                    src={film.image || 'https://placehold.co/300x450/1a1a1a/555?text=No+Poster'}
                                    alt={film.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-bold text-sm truncate mb-1">{film.title}</h3>
                                <p className="text-neutral-500 text-xs">{film.genre} • {film.duration} min</p>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <button onClick={() => navigate(`/EditMovie/${film.id}`)} className="text-xs border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 py-1.5 rounded-lg transition-all">
                                        Edit
                                    </button>
                                    <button className="text-xs border border-red-500/50 text-red-400 hover:bg-red-500/10 py-1.5 rounded-lg transition-all">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>




            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg p-10 rounded-3xl shadow-2xl relative">

                        <h2 className="text-2xl font-bold mb-8 text-yellow-400">Add New Film</h2>

                        <form className="space-y-4" onSubmit={addMovie}>
                            {/* TITLE & DURATION */}
                            <input
                                value={title} onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-neutral-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500 text-white" placeholder="Movie Title"
                            />
                            <input
                                type="number"
                                value={duration} onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-neutral-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500 text-white" placeholder="Duration (minutes)"
                            />
                            <input
                                value={image} onChange={(e) => setImage(e.target.value)}
                                className="w-full bg-neutral-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500 text-white"
                                placeholder="Poster Image URL (e.g. https://...)"
                            />
                            <input
                                value={trailer} onChange={(e) => setTrailer(e.target.value)}
                                className="w-full bg-neutral-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500 text-white"
                                placeholder="Trailer Video URL (YouTube link)"
                            />

                            {/* GENRE SELECT */}
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth sx={{
                                    '& .MuiInputLabel-root': { color: '#888' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
                                }}>
                                    <InputLabel id="genre-label" sx={{ color: 'gray' }}>Select Genre</InputLabel>
                                    <Select
                                        labelId="genre-label"
                                        value={genre}
                                        label="Select Genre"
                                        onChange={(e) => setGenre(e.target.value)}
                                        sx={{ color: 'white', bgcolor: '#262626', borderRadius: '12px', '& .MuiSvgIcon-root': { color: 'white' } }}
                                    >
                                        <MenuItem value="Action">Action</MenuItem>
                                        <MenuItem value="Comedy">Comedy</MenuItem>
                                        <MenuItem value="Horror">Horror</MenuItem>
                                        <MenuItem value="Drama">Drama</MenuItem>
                                        <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* AGE SELECT */}
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth sx={{
                                    '& .MuiInputLabel-root': { color: '#888' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
                                }}>
                                    <InputLabel id="age-label" sx={{ color: 'gray' }}>Minimum Age</InputLabel>
                                    <Select
                                        labelId="age-label"
                                        value={age}
                                        label="Minimum Age"
                                        onChange={(e) => setAge(e.target.value)}
                                        sx={{ color: 'white', bgcolor: '#262626', borderRadius: '12px', '& .MuiSvgIcon-root': { color: 'white' } }}
                                    >
                                        <MenuItem value={10}>10+</MenuItem>
                                        <MenuItem value={16}>16+</MenuItem>
                                        <MenuItem value={18}>18+</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* DESCRIPTION TEXTAREA */}
                            <textarea
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-neutral-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500 text-white min-h-[150px] resize-none"
                                placeholder="Film Description..."
                            ></textarea>

                            <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 transition-all">
                                Add to Database
                            </button>
                        </form>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-neutral-500 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}