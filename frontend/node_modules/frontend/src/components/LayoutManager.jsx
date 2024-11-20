/* eslint-disable react/prop-types */
import {
  faBars,
  faCartPlus,
  faCartShopping,
  faGauge,
  faList,
  faRightFromBracket,
  faShirt,
  faUpRightAndDownLeftFromCenter,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate, useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

import logo from "../assets/images/logo-foot.png";

import { useState } from "react";

function LayoutManager({ children, currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapse, setCollapse] = useState(false);
  function handleLogout() {
    window.localStorage.removeItem("user");
    setCurrentUser(null);
    // if (window.location.pathname === "/") window.location.reload();
    // else
    navigate("/");
  }
  return (
    currentUser?.role == 1 && (
      <div>
        <div
          className=" h-screen float-left text-white"
          style={{
            backgroundColor: "#2a2a2a",
            width: !collapse ? "250px" : "80px",
          }}
        >
          <Link to={"/"}>
            <div
              // style={{ height: 90, width: 90 }}
              className={`flex ${collapse ? "" : "justify-center"} p-1`}
              style={{ alignItems: "center" }}
            >
              {/* {!collapse ? ( */}
              <img
                src={logo}
                alt="logo"
                className="w-52 "
                style={{ maxWidth: 70 }}
              />

              <h1 className="text-2xl ml-3 font-bold">Watch Shop</h1>
            </div>
          </Link>
          <hr />
          <div className="flex flex-col items-center p-5">
            <div className="w-20">
              <img src={currentUser.avatar} alt={currentUser.lastName}></img>
            </div>
            <div>
              ADMIN: {currentUser.firstName + " " + currentUser.lastName}
            </div>
          </div>{" "}
          <hr />
          <div>
            <div
              className="font-normal divide-y divide-gray-100 rounded dark:bg-gray-700 dark:divide-gray-600"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <ul className="py-1 dark:text-white-400">
                <>
                  <li>
                    <Link
                      to={"/admin/dashboard"}
                      className={`${location.pathname === "/admin/dashboard"
                        ? "border-l-2 border-blue-400 text-white-600"
                        : "border-l-2 border-gray-800  text-gray-400"
                        } block pl-4 pr-4 py-2 hover:bg-gray-700 ${collapse ? "flex justify-center" : ""
                        }`}
                    >
                      <span className="pr-3">
                        <FontAwesomeIcon
                          size={!collapse ? "1x" : "2x"}
                          icon={faGauge}
                        />
                      </span>
                      {!collapse && <span> Dashboard</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin/bill"}
                      className={`${location.pathname === "/admin/bill"
                        ? "border-l-2 border-blue-400 text-white-600"
                        : "border-l-2 border-gray-800  text-gray-400"
                        } block pl-4 pr-4 py-2 hover:bg-gray-700 ${collapse ? "flex justify-center" : ""
                        }`}
                    >
                      <span className="pr-3">
                        <FontAwesomeIcon
                          size={!collapse ? "1x" : "2x"}
                          icon={faList}
                        />
                      </span>
                      {!collapse && <span> Bill Management</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin/order"}
                      className={`${location.pathname === "/admin/order"
                        ? "border-l-2 border-blue-400 text-white-600"
                        : "border-l-2 border-gray-800  text-gray-400"
                        } block pl-4 pr-4 py-2 hover:bg-gray-700 ${collapse ? "flex justify-center" : ""
                        }`}
                    >
                      <span className="pr-3">
                        <FontAwesomeIcon
                          size={!collapse ? "1x" : "2x"}
                          icon={faShirt}
                        />
                      </span>
                      {!collapse && <span> Order Management</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin/customer"}
                      className={`${location.pathname === "/admin/customer"
                        ? "border-l-2 border-blue-400 text-white-600"
                        : "border-l-2 border-gray-800  text-gray-400"
                        } block pl-4 pr-4 py-2 hover:bg-gray-700 ${collapse ? "flex justify-center" : ""
                        }`}
                    >
                      <span className="pr-3">
                        <FontAwesomeIcon
                          size={!collapse ? "1x" : "2x"}
                          icon={faUser}
                        />
                      </span>
                      {!collapse && <span> Customer Management</span>}
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={"/admin/product"}
                      className={`${location.pathname === "/admin/product"
                        ? "border-l-2 border-blue-400 text-white-600"
                        : "border-l-2 border-gray-800  text-gray-400"
                        } block pl-4 pr-4 py-2 hover:bg-gray-700 ${collapse ? "flex justify-center" : ""
                        }`}
                    >
                      <span className="pr-3">
                        <FontAwesomeIcon
                          size={!collapse ? "1x" : "2x"}
                          icon={faCartShopping}
                        />
                      </span>
                      {!collapse && <span> Product Management</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin/category"}
                      className={`${location.pathname === "/admin/category"
                        ? "border-l-2 border-blue-400 text-white-600"
                        : "border-l-2 border-gray-800  text-gray-400"
                        } block pl-4 pr-4 py-2 hover:bg-gray-700 ${collapse ? "flex justify-center" : ""
                        }`}
                    >
                      <span className="pr-3">
                        <FontAwesomeIcon
                          size={!collapse ? "1x" : "2x"}
                          icon={faCartPlus}
                        />
                      </span>
                      {!collapse && <span> Category Management</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin/size"}
                      className={`${location.pathname === "/admin/size"
                        ? "border-l-2 border-blue-400 text-white-600"
                        : "border-l-2 border-gray-800  text-gray-400"
                        } block pl-4 pr-4 py-2 hover:bg-gray-700 ${collapse ? "flex justify-center" : ""
                        }`}
                    >
                      <span className="pr-3">
                        <FontAwesomeIcon
                          size={!collapse ? "1x" : "2x"}
                          icon={faUpRightAndDownLeftFromCenter}
                        />
                      </span>
                      {!collapse && <span> Size Management</span>}
                    </Link>
                  </li>
                </>
              </ul>
              <div className="py-1">
                <div
                  className="block pl-4 py-2 hover:bg-gray-600 text-gray-400"
                  onClick={() => handleLogout()}
                >
                  <span className="pr-3">
                    <FontAwesomeIcon
                      size={!collapse ? "1x" : "2x"}
                      icon={faRightFromBracket}
                    />
                  </span>
                  {!collapse && <span> Logout</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className=" float-left h-screen overflow-x-auto overflow-y-auto"
          style={{
            width: !collapse ? "calc(100% - 250px)" : "calc(100% - 80px)",
          }}
        >
          <div className="bg-white shadow-sm h-14 text-black p-3">
            <div
              className="float-left cursor-pointer"
              onClick={() => setCollapse(!collapse)}
            >
              <FontAwesomeIcon icon={faBars} />
            </div>
            <div className="float-right font-bold">
              Hello, {currentUser.firstName + " " + currentUser.lastName} !
            </div>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  );
}

export default LayoutManager;
