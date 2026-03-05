import { FaKeyboard } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 px-6 py-4 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo + Webpage Name */}
        <div className="flex items-center space-x-3">
          <FaKeyboard className="text-gray-900 dark:text-gray-100" />
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">KeyVelocity</span>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800">
            <IoStatsChartOutline />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800">
            <GiPlagueDoctorProfile />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
