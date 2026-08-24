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
        console.error("Error signing up:", error);
        return;
      }
      console.log("User signed up:", authData);
    } catch (error) {
      console.error("Error signing up:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center py-3">
      <div className="bgClass absolute inset-0"></div>

      <div className="glass-card relative z-10 w-[90%] sm:w-125  px-9 py-6">
        <h2 className="text-[#815bda] border-s-4 px-3 my-4 mb-7 text-4xl font-bold">
          Sign up
        </h2>
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
                className="border p-2 glass-card-btn mb-2"
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
                className="border p-2 glass-card-btn mb-2"
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
            className="border p-2 glass-card-btn mb-2"
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
            className="border p-2 glass-card-btn mb-2"
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
            className="border p-2 glass-card-btn mb-2"
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
            className="submitBtn bg-[#815bda] text-white p-2 rounded cursor-pointer my-3"
          >
            {loading ? "Loading..." : "Create Account"}
            {/* Create Account */}
          </button>
          <p className="text-center">
            Already have an account?
            <a href="/login" className="text-[#815bda] hover:underline ms-2">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
