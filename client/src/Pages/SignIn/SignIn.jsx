import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import {jwtDecode} from "jwt-decode"; // Import JWT decoder
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import signinImage from "../../Assets/signin.png"; // Corrected image import

function SignIn() {
const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    console.log(token)

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        console.log("🔑 Decoded User:", decodedUser);
        
        secureLocalStorage.setItem("auth_token",JSON.stringify(token));
        secureLocalStorage.setItem("profile", JSON.stringify(decodedUser));

        toast.success("Login successful!");

        navigate("/profile", { replace: true });
      } catch (error) {
        console.error("❌ Token decoding failed:", error);
        toast.error("Invalid token. Please log in again.");
        navigate("/signin", { replace: true });
      }
    }
  }, [location, navigate]);

  function handleGoogleLogin() {
    window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self");
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <div className="flex flex-grow">
        {/* Left Side Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${signinImage})` }}
        ></div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="flex flex-col items-center w-4/5">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="mb-5 text-sm">Sign in using your credentials</p>

            {/* 🔹 Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="bg-red-500 text-white px-6 py-2 rounded-md w-full"
            >
              Sign in with Google
            </button>

            <div className="flex items-center w-full my-6">
              <div className="flex-grow h-px bg-gray-500"></div>
              <span className="px-2 text-gray-600">OR</span>
              <div className="flex-grow h-px bg-gray-500"></div>
            </div>

            <p className="text-sm mt-2">
              Don't have an account?{" "}
              <Link to="/signUp" className="underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
