import { useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    async function handleLogin(e) {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })

        const data = await response.json();

        console.log(data)
    }



    return (
        <div className="min-h-screen bg-neutral-950 flex justify-center items-center p-4 relative overflow-hidden">

            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[100%] h-[300px] bg-yellow-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 bg-neutral-900 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-neutral-800">

                <div className="mb-6 flex">
                    <Link to="/" className="text-neutral-500 hover:text-yellow-400 flex items-center gap-2 transition-colors">
                        <ArrowBackIcon fontSize="small" />
                        <span className="font-semibold text-sm">Back to Home</span>
                    </Link>
                </div>

                <h2 className="text-3xl font-extrabold text-white text-center mb-8">
                    Login to Your Account
                </h2>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                    <input
                        className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-neutral-500 transition-all"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-neutral-500 transition-all"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-lg px-4 py-3 mt-4 shadow-lg hover:shadow-yellow-400/20 transition-all active:scale-95"
                    >
                        Login Now
                    </button>

                </form>
            </div>
        </div>
    )
}