import MovieIcon from '@mui/icons-material/Movie';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="absolute top-0 left-0 w-full p-6 flex items-center z-50">
            {/* Link makes clicking the logo return you home */}
            <Link to="/" className="text-yellow-400 hover:text-yellow-300 transition-all hover:scale-105">
                <MovieIcon sx={{ fontSize: 45 }} className="drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            </Link>
        </header>
    )
}