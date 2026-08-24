import React from 'react'

function Login() {
  return (
    <div className="relative w-full min-h-screen flex justify-center items-center py-3">
      <div className="bgClass absolute inset-0"></div>

      <div className="glass-card relative z-10 w-[90%] sm:w-125  px-9 py-6">
        <h2 className="text-[#815bda] border-s-4 px-3 my-4 mb-7 text-4xl capitalize font-bold">
          Login
        </h2>
        <form
          className="flex flex-col gap-2"
          // onSubmit={form.handleSubmit(onSubmit)}
        >
          <input
            type="email"
            id="email"
            className="border p-2 glass-card-btn mb-2"
            placeholder="Email"
            // {...form.register("email")}
          />
          <input
            type="password"
            id="password"
            className="border p-2 glass-card-btn mb-2"
            placeholder="Password"
            // {...form.register("password")}
          />
          <button
            type="submit"
            className="bg-[#815bda] text-white p-2 rounded cursor-pointer my-3"
          >
            {/* {loading ? "Creating Account" : "Create Account..."} */}
            Log in
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