import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';

export default function Header() {

    const isAdmin = localStorage.getItem('is_admin') === 'true'


    return (
        <header className="absolute top-0 left-0 w-full p-6 flex items-center z-50 text-white">
            <div className='flex gap-30 items-center justify-center font-bold'>
                <Link to="/" className="text-yellow-400 hover:text-yellow-300 transition-all hover:scale-105">
                    <MovieIcon sx={{ fontSize: 45 }} className="drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                </Link>

                <Link to="/home">
                    Home
                </Link>
            </div>
            <div className='w-full'></div>
            {isAdmin && (
                <Link to="/admin" className="text-yellow-400 font-bold underline mr-6">
                    Admin
                </Link>
            )}
            <Link to="/profile">
                <PersonIcon sx={{ fontSize: 40 }}></PersonIcon>
            </Link>
        </header>
    )
}