import Header from "../components/Header";
import MovieIcon from '@mui/icons-material/Movie';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SettingsIcon from '@mui/icons-material/Settings';

import { Link } from "react-router-dom";

export default function Admin() {
    const tools = [
        { title: "Manage movies", icon: <MovieIcon fontSize="large" />, desc: "Add, Edit or Remove films", to: "/ManageMovie" },
        { title: "Manage Rooms", icon: <AddLocationIcon fontSize="large" />, desc: "Configure Normal and VIP rooms", to:"/Rooms"},
        { title: "Manage Sessions", icon: <AccessTimeIcon fontSize="large" />, desc: "Assign movies to rooms and times", to:"/Sessions"},
        { title: "System Settings", icon: <SettingsIcon fontSize="large" />, desc: "Configure global app settings", to:"/"},
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans pb-20">
            <Header />

            <main className="max-w-7xl mx-auto pt-32 px-10">
                <h1 className="text-4xl font-black mb-10 text-yellow-400">Admin Control Panel</h1>

                {/* TOOL GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool, index) => (
                        <Link
                            to={tool.to || "#"}
                            key={index}
                            className="group bg-neutral-900 border border-neutral-800 p-8 rounded-2xl cursor-pointer hover:border-yellow-400 transition-all hover:-translate-y-2 shadow-2xl block"
                        >
                            <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                                {tool.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">
                                {tool.title}
                            </h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">
                                {tool.desc}
                            </p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
