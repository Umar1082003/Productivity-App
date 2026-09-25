"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { supabase } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMsg("");
      setLoading(true);

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        console.log("User signed in:", authData);
        router.push("/dashboard"); // Redirect to dashboard after successful login
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center py-3">
      <div className="bg-[#0B0B10] absolute inset-0"></div>

      <div className="relative z-10 w-[90%] sm:w-125 px-9 py-6 bg-[#15151E] rounded-2xl border border-[#292936] shadow-md/30 shadow-[#8B5CF6]/50">
        <h2 className="text-[#F5F5F7] border-s-4 border-[#8B5CF6] px-3 my-4 mb-2 text-3xl font-bold">
          Log in to Your <span className="text-[#8B5CF6]">Account ✨</span>
        </h2>
        <p className="text-[#9A9AA6] mb-7 text-md">
          Start your journey with us today!
        </p>
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {errorMsg}
          </div>
        )}
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <input
            type="email"
            id="email"
            className="bg-[#101017] border border-[#292936] rounded p-2 mb-2"
            placeholder="Email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <span className="text-red-500 text-xs sm:text-sm">
              {form.formState.errors.email.message}
            </span>
          )}
          <input
            type="password"
            id="password"
            className="bg-[#101017] border border-[#292936] rounded p-2 mb-2"
            placeholder="Password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <span className="text-red-500 text-xs sm:text-sm">
              {form.formState.errors.password.message}
            </span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white p-2 rounded-lg font-semibold h-11 cursor-pointer my-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-center">
            I haven`t an account?
            <a href="/signup" className="text-[#815bda] hover:underline ms-2">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
