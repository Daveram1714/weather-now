import { useState } from "react";
import { FaBell } from "react-icons/fa";

function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className=" flex flex-row justify-between items-center p-4   bg-gray-200/10 backdrop-blur-sm rounded-4xl border border-white/20 relative overflow-x-hidden">

            <div className="text-lg sm:text-xl font-bold logo-font text-gray-200">
                Climate
            </div>

            <div className="hidden sm:block">
                <input
                    type="text"
                    placeholder="Search city"
                    className="px-3 py-1 bg-gray-200/60 rounded-xl outline-none text-gray-700"
                />
            </div>
            <div className="flex flex-row items-center gap-5 relative">

                <button
                    onClick={() => setOpen(!open)}
                    className="text-2xl text-gray-300 hover:text-white transition relative">
                    <FaBell />
                </button>

                {open && (
                    <div className="absolute top-12 right-0 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg w-52 p-3 text-gray-900 z-50">
                        <p className="text-sm font-medium">No new notifications</p>
                    </div>
                )}

                <img
                    src="src/assets/3.jpg"
                    className="w-10 h-10 rounded-full object-cover shadow-md border border-white/30"
                    alt="Avatar"
                />
            </div>

        </nav>
    );
}

export default Navbar;
