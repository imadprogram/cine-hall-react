import { useState, useEffect } from "react";
import Header from "../components/Header";
import toast from 'react-hot-toast'



export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    (async function fetchProfile() {
      const response = await fetch("http://localhost:8000/api/auth/me", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        method: 'POST'
      });
      const data = await response.json();
      setName(data.name);
      setEmail(data.email);
    })();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/profile' , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name , email })
    })

    const data = await response.json();
    let statusMessage;
    if(response.ok){
        toast.success("Profile updated!")
    }else{
        toast.error(data.message || "Failed to update")
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert("Passwords don't match!");
    console.log("Updating password...");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-10">
      <Header />
      <main className="max-w-4xl mx-auto pt-28 px-6">
        <h2 className="text-3xl font-bold mb-10 text-yellow-400">Account Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <section className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl">
            <h3 className="text-xl font-bold mb-6">Personal Info</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <input 
                className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" 
              />
              <input 
                className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" 
              />
              <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-all text-sm italic">
                Update Info
              </button>
            </form>
          </section>

          {/* SECTION 2: PASSWORD CHANGE */}
          <section className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl">
            <h3 className="text-xl font-bold mb-6">Security</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <input 
                className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-400"
                type="password" placeholder="Old Password" onChange={(e) => setOldPassword(e.target.value)}
              />
              <hr className="border-neutral-800 my-2" />
              <input 
                className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)}
              />
              <input 
                className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                type="password" placeholder="Confirm New Password" onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit" className="w-full border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-3 rounded-lg transition-all text-sm italic">
                Change Password
              </button>
            </form>
          </section>

        </div>
      </main>
    </div>
  );
}
