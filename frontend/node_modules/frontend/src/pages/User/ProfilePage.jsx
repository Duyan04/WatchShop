/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Button, Tabs, Modal } from "flowbite-react";
import { Field, Form, Formik } from "formik";

import ReactPaginate from "react-paginate";
import bcryptjs from "bcryptjs";

import {
  readOrderByUserId,
  readUserById,
  updateUser,
} from "../../services/api";
function ProfilePage() {
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});

  const [visibleChangePass, setVisinleChangePass] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (currentUser?.id) {
      readUserById(currentUser?.id).then((res) => setCurrentUser(res.data));
      readOrderByUserId(currentUser?.id).then((res) => setOrders(res.data));
    }
  }, []);
  function showDetail(x) {
    setVisibleDetail(true);
    setOrderDetail(x);
  }

  function handleUpdate(values, touched) {
    updateUser(currentUser.id, values).then((result) => {
      if (result.status === "ok") {
        localStorage.setItem("user", JSON.stringify(result.data));
        setCurrentUser(result.data);
        toast.success("Successfully changed information!", {
          autoClose: 1000,
        });
      } else
        toast.error("Changed information Failed!", {
          autoClose: 1000,
        });
    });
  }

  function validateForm(values) {
    const errors = {};
    if (values.firstName.length === 0) {
      errors.firstName = "Required";
    }
    if (values.lastName.length === 0) {
      errors.lastName = "Required";
    }
    return errors;
  }

  function handleChangePassword() {
    if (bcryptjs.compareSync(oldPass, currentUser.password)) {
      if (newPass === reNewPass) {
        currentUser.password = newPass;
        updateUser(currentUser.id, currentUser).then((result) => {
          if (result.status === "ok") {
            localStorage.setItem("user", JSON.stringify(result.data));
            setCurrentUser(result.data);
            setVisinleChangePass(false);
            toast.success("Change password successfully!", {
              autoClose: 1000,
            });
          } else
            toast.error("Change password Failed!", {
              autoClose: 1000,
            });
        });
      } else {
        toast.error("Wrong confirmation password!", {
          autoClose: 1000,
        });
      }
    } else {
      toast.error("Wrong password!", {
        autoClose: 1000,
      });
    }
  }

  return (
    <>
      <div className="bg-slate-100 py-4 px-28">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to={"/"}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>My account</span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="mt-6">
          <div className="col-start-2 col-end-5 bg-white rounded-md">
            <Tabs.Group aria-label="Tabs with underline" style="underline">
              <Tabs.Item active={true} title="Account">
                <Formik
                  enableReinitialize
                  initialValues={{
                    ...currentUser,
                    address: currentUser.address || "",
                    phoneNumber: currentUser.phoneNumber || "",
                    email: currentUser.email || "",
                  }}
                  validate={(values) => validateForm(values)}
                  onSubmit={(values, touched) => handleUpdate(values, touched)}
                >
                  {({
                    values,
                    errors,
                    touched,
                    /* and other goodies */
                  }) => (
                    <Form>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex justify-center items-center p-3 border-2 border-white">
                          <img
                            src={
                              values.avatar ||
                              "https://firebasestorage.googleapis.com/v0/b/shoeshop-e5f23.appspot.com/o/default-avatar.png?alt=media"
                            }
                            alt={currentUser.lastName}
                            className="rounded-md w-56 h-56"
                          />
                        </div>
                        <div className="col-start-2 col-end-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label>First Name</label>
                              <Field
                                type="text"
                                name="firstName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                value={values.firstName}
                              />
                              <div className="text-gray-600">
                                {errors.firstName && touched.firstName}
                              </div>
                            </div>{" "}
                            <div>
                              <label>Last Name</label>
                              <Field
                                type="text"
                                name="lastName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                value={values.lastName}
                              />
                              <div className="text-gray-600">
                                {errors.lastName && touched.lastName}
                              </div>
                            </div>
                            <div>
                              <label>Email</label>
                              <Field
                                type="text"
                                name="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                value={values.email}
                              />
                              <div className="text-gray-600">
                                {errors.email && touched.email}
                              </div>
                            </div>{" "}
                            <div>
                              <label>Phone Number</label>
                              <Field
                                type="text"
                                name="phoneNumber"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                value={values.phoneNumber}
                              />
                              <div className="text-gray-600">
                                {errors.phoneNumber && touched.phoneNumber}
                              </div>
                            </div>
                            <div>
                              <label>Address</label>
                              <Field
                                type="text"
                                name="address"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                value={values.address}
                              />
                              <div className="text-gray-600">
                                {errors.address && touched.address}
                              </div>
                            </div>{" "}
                            <div>
                              <label>Avatar</label>
                              <Field
                                type="text"
                                name="avatar"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                value={values.avatar}
                              />
                              <div className="text-gray-600">
                                {errors.avatar && touched.avatar}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-6">
                            <div>
                              <button
                                className="text-white w-full bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                                type="submit"
                              >
                                Save
                              </button>
                            </div>
                            <div>
                              <button
                                type="button"
                                className="text-white w-full bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                                onClick={() => setVisinleChangePass(true)}
                              >
                                Change password
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Tabs.Item>
              {["Pending", "Approved", "Canceled"].map((value, index) => {
                const orderFilter = orders?.filter((x) => x.status === index);
                const itemsPerPage = 10;
                const endOffset = itemOffset + itemsPerPage;
                const currentItems = orderFilter?.slice(itemOffset, endOffset);
                const pageCount =
                  Math.ceil(orderFilter?.length / itemsPerPage) || 1;

                // Invoke when user click to request another page.
                const handlePageClick = (event) => {
                  const newOffset =
                    (event.selected * itemsPerPage) % orderFilter?.length;
                  setItemOffset(newOffset);
                };
                return (
                  <Tabs.Item key={"item" + index} title={value}>
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th
                              scope="col"
                              className="px-3 py-2"
                              style={{ textAlign: "center" }}
                            >
                              ID
                            </th>
                            <th scope="col" className="px-3 py-2">
                              Recipient FullName
                            </th>
                            <th scope="col" className="px-3 py-2">
                              Recipient Phone Number
                            </th>
                            <th scope="col" className="px-3 py-2">
                              Recipient Address
                            </th>
                            <th scope="col" className="px-3 py-2">
                              Order Date
                            </th>
                            <th scope="col" className="px-3 py-2">
                              Total Quantity
                            </th>
                            <th
                              scope="col"
                              colSpan={1}
                              className="px-3 py-2 text-center"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems?.map((x) => {
                            let count = x.orderDetails.reduce(
                              (acc, o) => acc + parseInt(o.quantity),
                              0
                            );
                            return (
                              <tr
                                key={x.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                              >
                                <td className="px-3 py-2">{x.id}</td>

                                <td className="px-3 py-2">{x.fullName}</td>
                                <td className="px-3 py-2">{x.phoneNumber}</td>
                                <td className="px-3 py-2">{x.address}</td>
                                <td className="px-3 py-2">{x.orderDate}</td>
                                <td className="px-3 py-2">{count}</td>

                                <td className="px-3 py-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => showDetail(x)}
                                    style={{
                                      width: 70,
                                      height: 34,
                                      backgroundColor: "#385639cc",
                                      color: "white",
                                      borderRadius: "5px",
                                      margin: "0 5px",
                                      padding: "8px",
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        "#385639e5";
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        "#385639cc";
                                    }}
                                  >
                                    Detail
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">> Next"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel="Prev <<"
                      renderOnZeroPageCount={null}
                      containerClassName="pagination"
                      pageLinkClassName="page-num"
                      previousLinkClassName="page-num"
                      nextLinkClassName="page-num"
                      activeLinkClassName="active-num"
                    />
                  </Tabs.Item>
                );
              })}
            </Tabs.Group>{" "}
            {/* Modal detail */}
            <Modal
              show={visibleDetail}
              size="5xl"
              popup={true}
              onClose={() => setVisibleDetail(false)}
            >
              <Modal.Header>Detail</Modal.Header>
              <Modal.Body>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label>Recipient FullName</label>
                    <input
                      type="text"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                      value={orderDetail?.fullName}
                    />
                  </div>{" "}
                  <div>
                    <label>Phone Number</label>
                    <input
                      type="text"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                      value={orderDetail?.phoneNumber}
                    />
                  </div>{" "}
                  <div>
                    <label>Recipient Address</label>
                    <input
                      type="text"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                      value={orderDetail.address || ""}
                    />
                  </div>
                  <div>
                    <label>Order Date</label>
                    <input
                      type="text"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                      value={orderDetail.orderDate || ""}
                    />
                  </div>
                  {orderDetail.retailer?.id && (
                    <div>
                      <label>Retailer</label>
                      <input
                        type="text"
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                        value={
                          orderDetail.retailer?.id
                            ? orderDetail.retailer?.id +
                            " - " +
                            orderDetail.retailer?.name +
                            " - " +
                            orderDetail.retailer?.name
                            : ""
                        }
                      />
                    </div>
                  )}
                  {orderDetail.driver?.id && (
                    <div>
                      <label>Driver</label>
                      <input
                        type="text"
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                        value={
                          orderDetail.driver?.id
                            ? orderDetail.driver?.id +
                            " - " +
                            orderDetail.driver?.firstName +
                            " " +
                            orderDetail.driver?.lastName
                            : ""
                        }
                      />
                    </div>
                  )}
                  {orderDetail?.description && (
                    <div>
                      <label>Description</label>
                      <textarea
                        type="text"
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                        value={orderDetail.description || ""}
                      />
                    </div>
                  )}
                  <div className="col-start-1 col-end-3 font-bold">
                    List Order Product
                  </div>
                  <div
                    className="col-start-1 col-end-3 relative overflow-y-auto"
                    style={{ maxHeight: "12rem" }}
                  >
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th
                            colSpan={2}
                            scope="col"
                            className="px-3 py-2"
                            style={{ textAlign: "center" }}
                          >
                            Product Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2"
                            style={{ textAlign: "center" }}
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2"
                            style={{ textAlign: "center" }}
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2"
                            style={{ textAlign: "center" }}
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2"
                            style={{ textAlign: "center" }}
                          >
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetail.orderDetails?.map((x) => {
                          return (
                            <tr
                              key={"previewCheckout-" + x.id}
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              <td
                                className="px-3 py-2"
                                style={{ textAlign: "center" }}
                              >
                                <img
                                  src={x.product.image}
                                  alt={x.product.name}
                                  className="h-12 w-12 rounded-md"
                                />
                              </td>
                              <td
                                className="px-3 py-2"
                                style={{ textAlign: "center" }}
                              >{`${x.product.name}-${x.size.size}`}</td>
                              <td
                                className="px-3 py-2"
                                style={{ textAlign: "center" }}
                              >
                                {x.price?.toLocaleString()}$
                              </td>
                              <td
                                className="px-3 py-2"
                                style={{ textAlign: "center" }}
                              >
                                {x.quantity}
                              </td>
                              <td
                                className="px-3 py-2"
                                style={{ textAlign: "center" }}
                              >
                                {x.category?.name}
                              </td>
                              <td
                                className="px-3 py-2"
                                style={{ textAlign: "center" }}
                              >
                                {x.total?.toLocaleString()}$
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-start-1 col-end-3 text-gray-600 font-bold">
                    Total Payment:{" "}
                    <span>{orderDetail.total?.toLocaleString()}$</span>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>

      {/* Modal change password */}
      <Modal
        show={visibleChangePass}
        size="xl"
        popup={true}
        onClose={() => setVisinleChangePass(false)}
      >
        <Modal.Header>Change password</Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <div>
                <label>Old password</label>
                <input
                  type="password"
                  onChange={(e) => setOldPass(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                />
              </div>
              <div>
                <label>New password</label>
                <input
                  type="password"
                  onChange={(e) => setNewPass(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                />
              </div>
              <div>
                <label>Confirm new password</label>
                <input
                  type="password"
                  onChange={(e) => setReNewPass(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                style={{ backgroundColor: "gray" }}
                className="w-full"
                onClick={() => {
                  handleChangePassword();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProfilePage;
