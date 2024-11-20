/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useState } from "react";
import background from "../../assets/images/watch-background-2.jpg";

import { ToastContainer, toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";
import "./css/signupPage.scss";
import { register } from "../../services/api";

function SignupPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const set = (prop, value) => {
    setUser({ ...user, [prop]: value });
  };
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit() {
    if (
      user.username &&
      user.firstName &&
      user.lastName &&
      user.password &&
      confirmPassword
    ) {
      if (confirmPassword === user.password) {
        register(user).then((result) => {
          if (result.status === "ok") {
            toast.success("Signup Success!", {
              autoClose: 1000,
            });
            navigate("/login");
          } else {
            toast.error("Signup Failed!", {
              autoClose: 1000,
            });
          }
        });
      } else {
        toast.error("Wrong confirmation password!", {
          autoClose: 1000,
        });
      }
    } else {
      toast.error("Do not leave information blank!", {
        autoClose: 1000,
      });
    }
  }

  return (
    <>
      <ToastContainer />
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '750px' }}
      >
        <div className="bg-white bg-opacity-90 p-10 rounded-lg shadow-lg w-full max-w-md transform transition duration-500 hover:scale-105">
          <div className="text-center text-3xl font-semibold text-gray-800">
            SIGN UP ACCOUNT
          </div>
          <div className="mt-8">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Username
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                placeholder="Enter Username"
                value={user.username}
                onChange={(e) => set("username", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                placeholder="Enter Password"
                value={user.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <input
                type="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex mb-4">
              <div className="mr-2 w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  First Name
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                  placeholder="Enter First Name"
                  value={user.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
              </div>
              <div className="ml-2 w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Last Name
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                  placeholder="Enter Last Name"
                  value={user.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </div>
            </div>
            <button
              className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center transition duration-200"
              onClick={() => handleSubmit()}
            >
              Sign Up
            </button>
            <div className="mt-6 text-center">
              <Link to={"/login"} className="text-yellow-500 hover:underline">
                Login now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
