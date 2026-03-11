'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const UserStats = () => {

    const [sessionIsActive, setSessionIsActive] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            if (!supabase) {
                toast.error("Authentication service not available");
                router.replace("/signup");
                return;
            }
            
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                setSessionIsActive(true);
            } else {
                toast.error("You need to log in to view stats!");
                router.replace("/signup")
            }
        };

        checkSession();
    }, [router]);

    return (
        <div>
            {
                sessionIsActive && "User is logged in"
            }
        </div>
    )
}

export default UserStats