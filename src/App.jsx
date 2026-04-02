import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast'
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ManageMovie from "./pages/admin/ManageMovie";
import EditMovie from "./pages/admin/EditMovie";
import MovieDetails from "./pages/MovieDetails";
import Rooms from "./pages/admin/Rooms"

export default function App() {

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/ManageMovie" element={<ManageMovie />} />
        <Route path="/EditMovie/:id" element={<EditMovie />} />
        <Route path="/Rooms" element={<Rooms />} />
      </Routes>
    </>
  )


}