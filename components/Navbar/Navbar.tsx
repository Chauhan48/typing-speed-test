import { FaKeyboard } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";
import { GiPlagueDoctorProfile } from "react-icons/gi";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo + Webpage Name */}
        <div className="flex items-center space-x-3">
          <FaKeyboard />
          <span className="text-2xl font-bold text-gray-900">KeyVelocity</span>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <IoStatsChartOutline />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <GiPlagueDoctorProfile />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
