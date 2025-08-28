export default function SignupPage() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white px-4 overflow-hidden">
        {/* Card */}
        <div className="bg-white w-full max-w-lg lg:max-w-xl border border-black rounded-xl shadow-md p-10">
          
          {/* Title */}
          <h1 className="text-center text-3xl font-bold mb-8 text-black">
            Sign Up
          </h1>
  
          {/* Form */}
          <form className="flex flex-col space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 border border-black rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 border border-black rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 border border-black rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-4 border border-black rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
            />
  
            <button
              type="submit"
              className="border-2 border-black text-black font-semibold py-4 rounded-md hover:bg-black hover:text-white transition duration-200"
            >
              Sign Up
            </button>
          </form>
  
          {/* Links */}
          <div className="flex flex-col items-center mt-8 space-y-2 text-sm">
            <a href="/login" className="text-gray-600 hover:text-black transition">
              Already have an account? <span className="font-bold hover:underline">Login</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
  