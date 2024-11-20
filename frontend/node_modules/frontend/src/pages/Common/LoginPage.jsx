import { useState } from "react";
import background from "../../assets/images/watch-background.jpg";

import { ToastContainer, toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";

import "./css/loginPage.scss";
import { login } from "../../services/api";

function LoginPage({ setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit() {
    if (username && password) {
      login(username, password).then((result) => {
        if (result.status === "ok") {
          toast.success("Login Success!", {
            autoClose: 1000,
          });
          localStorage.setItem("user", JSON.stringify(result.data));
          setCurrentUser(result.data);
          navigate("/");
        } else {
          toast.error("Login Failed!", {
            autoClose: 1000,
          });
        }
      });
    } else {
      toast.error("Do not leave information blank!", {
        autoClose: 0,
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
            LOG IN ACCOUNT
          </div>
          <div className="mt-8">
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Username
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center transition duration-200"
              onClick={() => handleSubmit()}
            >
              Login
            </button>
            <div className="mt-6 text-center">
              You don't have an account?{" "}
              <span>
                <Link to={"/signup"} className="text-yellow-500 hover:underline">
                  Register now
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
