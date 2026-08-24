"use client";

import { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { supabase } from "@/lib/supabase";

const signupSchema = z
  .object({
    fullName: z.string().min(3).max(30),
    username: z.string().min(3).max(15),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords don`t match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

function Signup() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            username: data.username,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      }
      console.log("User signed up:", authData);
    } catch (error) {
      console.error("Error signing up:", error);
      setLoading(false);
    } finally {
      setLoading(false);
      setSuccessMsg(
        "Account created successfully! Please check your email to verify your account.",
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center py-3">
      <div className="bg-[#0B0B10] absolute inset-0"></div>

      <div className="relative z-10 w-[90%] sm:w-125 px-9 py-6 bg-[#15151E] rounded-2xl border border-[#292936] shadow-md/30 shadow-[#8B5CF6]/50">
        <h2 className="text-[#F5F5F7] border-s-4 px-3 my-4 mb-7 text-4xl font-bold">
          Sign up
        </h2>
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
            {successMsg}
          </div>
        )}
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <div className="w-auto">
              {/* <label className="text-gray-700 font-semibold" htmlFor="fullName">
                Full Name:
              </label> */}
              <input
                type="text"
                id="fullName"
                className="bg-[#101017] border border-[#292936] rounded p-2 mb-2"
                placeholder="Full Name"
                {...form.register("fullName")}
              />
              {form.formState.errors.fullName && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {form.formState.errors.fullName.message}
                </span>
              )}
            </div>
            <div className="w-auto">
              {/* <label className="text-gray-700 font-semibold" htmlFor="username">
                Username:
              </label> */}
              <input
                type="text"
                id="username"
                className="bg-[#101017] border border-[#292936] rounded p-2 mb-2"
                placeholder="Username"
                {...form.register("username")}
              />
              {form.formState.errors.username && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {form.formState.errors.username.message}
                </span>
              )}
            </div>
          </div>
          {/* <label className="text-gray-700 font-semibold" htmlFor="email">
            Email:
          </label> */}
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
          {/* <label className="text-gray-700 font-semibold" htmlFor="password">
            Password:
          </label> */}
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
          {/* <label
            className="text-gray-700 font-semibold"
            htmlFor="confirm-password"
          >
            Confirm Password:
          </label> */}
          <input
            type="password"
            id="confirm-password"
            className="bg-[#101017] border border-[#292936] rounded p-2 mb-2 placeholder:text-[#666674]"
            placeholder="Confirm Password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <span className="text-red-500 text-xs sm:text-sm">
              {form.formState.errors.confirmPassword.message}
            </span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="submitBtn bg-[#8B5CF6] hover:bg-[#7C3AED] text-white p-2 rounded cursor-pointer my-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Create Account"}
            {/* Create Account */}
          </button>
          <p className="text-center text-[#9A9AA6]">
            Already have an account?
            <a
              href="/login"
              className="text-[#8B5CF6] hover:text-[#7C3AED] hover:underline ms-2"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
