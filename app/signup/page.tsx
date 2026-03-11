'use client';

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      console.log("Supabase not available");
      return;
    }

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log(error.message);
        return;
      }

      const token = data.session?.access_token;

      if (token) {
        localStorage.setItem("token", token);
      }

      router.push("/");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        console.log(error.message);
        return;
      }

      const token = data.session?.access_token;

      if (token) {
        localStorage.setItem("token", token);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8">

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg py-2 font-medium hover:opacity-90 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>

        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? " Sign up" : " Log in"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;