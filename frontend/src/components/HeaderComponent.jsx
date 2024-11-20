/* eslint-disable react/prop-types */
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

import logo from "../assets/images/logo.png";

import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import "../css/HeaderComponent.css";
import { readOrderDetailInCartByUserId, readUserById } from "../services/api";

function HeaderComponent({ setCurrentUser, currentUser, countOrder = -1 }) {
  const navigate = useNavigate();
  const [isShowNav, setIsShowNav] = useState(false);

  function handleLogout() {
    window.localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <Link to={"/"}>
            <img src={logo} alt="logo" className="h-16" />
          </Link>
        </div>
        <div className="flex items-center md:hidden">
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => setIsShowNav(!isShowNav)}
            className="text-2xl cursor-pointer"
          />
        </div>
        <nav
          className={`${isShowNav ? "block" : "hidden"
            } md:flex md:items-center md:space-x-6 fixed inset-y-0 right-0 bg-black bg-opacity-90 z-50 md:relative md:bg-transparent md:bg-opacity-100`}
        >
          <div className="flex justify-end p-4 md:hidden">
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => setIsShowNav(false)}
              className="text-2xl cursor-pointer"
            />
          </div>
          <ul className="flex flex-col md:flex-row md:space-x-8 p-8 md:p-0">
            <li className="mb-4 md:mb-0">
              <Link to={"/"} className="hover:text-gray-400" onClick={() => setIsShowNav(false)}>
                Home
              </Link>
            </li>
            <li className="mb-4 md:mb-0">
              <Link to={"/about"} className="hover:text-gray-400" onClick={() => setIsShowNav(false)}>
                About Us
              </Link>
            </li>
            {currentUser?.id > 0 && (
              <li className="mb-4 md:mb-0">
                <Link to={"/profile"} className="hover:text-gray-400" onClick={() => setIsShowNav(false)}>
                  My account
                </Link>
              </li>
            )}
            {currentUser?.role === 1 && (
              <li className="mb-4 md:mb-0">
                <div
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.cursor = "pointer")
                  }
                  onClick={() => {
                    navigate("/admin/dashboard");
                    setIsShowNav(false);
                  }}
                  className="hover:text-gray-400"
                >
                  Go to admin
                </div>
              </li>
            )}
            {currentUser && (
              <li className="mb-4 md:mb-0">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsShowNav(false);
                  }}
                  className="hover:text-gray-400"
                >
                  Log out
                </button>
              </li>
            )}
            <li className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="text-sm mr-2">
                  {currentUser?.firstName ? (
                    <span>
                      Hi, {currentUser?.firstName + " " + currentUser?.lastName}!
                    </span>
                  ) : (
                    <div>
                      <span className="pr-2">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                      <Link to={"/login"} className="hover:text-gray-400" onClick={() => setIsShowNav(false)}>
                        Login
                      </Link>{" "}
                      /{" "}
                      <Link to={"/signup"} className="hover:text-gray-400" onClick={() => setIsShowNav(false)}>
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </li>
            <li>
              <div>
                <Link to={"/purchase"} onClick={() => setIsShowNav(false)}>
                  <span className="relative inline-flex items-center">
                    <FontAwesomeIcon icon={faCartShopping} />
                    {countOrder > 0 && (
                      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gray-500 border-2 border-white rounded-full -top-2 -right-2">
                        {countOrder}
                      </div>
                    )}
                  </span>
                </Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HeaderComponent;
