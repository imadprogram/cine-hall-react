import { Link } from "react-router-dom";
import MovieIcon from '@mui/icons-material/Movie'
import "./Welcome.css";


export default function Welcome() {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <MovieIcon className="welcome-icon" />
                <h1 className="welcome-title">
                    Unlimited movies, TV shows, and more.
                </h1>
                <p className="welcome-subtitle">
                    Watch anywhere. Cancel anytime. Ready to watch?
                </p>
                <div className="auth-btns">
                    <Link to="/register" className="welcome-button auth-btn">
                        Sign Up
                    </Link>
                    <Link to="/login" className="welcome-button auth-btn">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}