import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Movies from "./pages/Movies"
import Profile from "./pages/Profile";
import { Toaster } from 'react-hot-toast'

export default function App() {

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )


}