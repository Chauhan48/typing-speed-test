import { FaKeyboard } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo + Webpage Name */}
        <div className="flex items-center space-x-3">
          <FaKeyboard className="text-foreground" />
          <span className="text-2xl font-bold text-foreground">KeyVelocity</span>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200">
            <IoStatsChartOutline />
          </button>
          <Link href="/signup">
            <GiPlagueDoctorProfile />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
