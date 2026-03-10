'use client';

import { FaKeyboard } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { SiGnuprivacyguard } from "react-icons/si";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const Navbar = () => {

  const [sessionIsAactive, setSessionIsActive] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setSessionIsActive(true);
      }

    }
    checkSession()
  }, [setSessionIsActive]);

  const handleStatsClick = () => {
    if (!sessionIsAactive) {
      toast.info("You need to log in to view stats!");
    } else {
      router.push("/stats");
    }
  }

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
          <button onClick={handleStatsClick}>
            <IoStatsChartOutline />
          </button>
          {!sessionIsAactive ?
            <Link href="/signup">
              <SiGnuprivacyguard />
            </Link>
            :
            <div onClick={() => setLogoutPopup(!logoutPopup)}>
              <GiPlagueDoctorProfile />
            </div>
          }
          {logoutPopup && (
            <div className="absolute right-80 top-18 bg-card border border-border rounded-lg shadow-lg p-4">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setSessionIsActive(false);
                }}>
                Logout
              </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
