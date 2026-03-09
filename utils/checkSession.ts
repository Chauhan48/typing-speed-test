import { supabase } from "@/lib/supabaseClient";

export default async function checkSession() {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
        return true
    }

    return false
}