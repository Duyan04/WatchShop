/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */

import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { Button, Modal } from "flowbite-react";

import { toast } from "react-toastify";

import visa from "../../assets/images/visa.png";
import mastercard from "../../assets/images/mastercard.png";
import discover from "../../assets/images/discover.png";
import amex from "../../assets/images/amex.png";
import jcb from "../../assets/images/jcb.png";
import "./css/purchasePage.scss";
import {
  changeStatusOrderDetailInCart,
  readCategory,
  readOrderDetailInCartByUserId,
  readProduct,
  readSize,
  updateOrderDetailInCart,
  updateUser,
  writeOrder,
} from "../../services/api";

// eslint-disable-next-line react/prop-types
function PurchasePage({ setCountOrder, countOrder }) {
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  // const [isCheckAll, setIsCheckAll] = useState(false);
  // const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState({});
  const [order, setOrder] = useState({});
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [change, setChange] = useState(0);
  const [orderDetailInCart, setOrderDetailInCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCheckout, setVisibleCheckout] = useState(false);

  useEffect(() => {
    readSize().then((res) => setSizes(res.data));
    readCategory().then((res) => setCategories(res.data));
    readProduct().then((res) => setProducts(res.data));
    if (currentUser?.id)
      readOrderDetailInCartByUserId(currentUser.id).then((res) =>
        setOrderDetailInCart(res.data)
      );
  }, []);

  function showDelete(x) {
    setOrderDetail(x);
    setVisibleDelete(true);
  }
  function handleDelete() {
    if (currentUser) {
      changeStatusOrderDetailInCart(orderDetail.id, 0).then((result) => {
        if (result.status === "ok") {
          setOrderDetailInCart(
            orderDetailInCart.filter((odic) => odic.id !== orderDetail.id)
          );
          setCountOrder(countOrder - 1);
          setVisibleDelete(false);
          toast.success("Successful delete", {
            autoClose: 1000,
          });
        } else
          toast.error("Delete failed", {
            autoClose: 1000,
          });
      });
    } else {
      sessionStorage.setItem(
        "orderDetailInCart",
        JSON.stringify(
          orderDetails.length > 1
            ? orderDetails.filter((od) => {
              return (
                od.size !== orderDetail.size ||
                od.product !== orderDetail.product
              );
            })
            : []
        )
      );
      setCountOrder(countOrder - 1);
      setVisibleDelete(false);
    }
  }

  function handleCheckbox(e, order) {
    if (currentUser) {
      const checked = e.target.checked;
      setOrderDetailInCart(
        orderDetailInCart.map((x) => {
          if (x.id && order.id === x.id) {
            order.check = checked ? 1 : 0;
            updateOrderDetailInCart(order.id, order);
            x.check = checked ? 1 : 0;
          }
          return x;
        })
      );
      const check = !orderDetailInCart?.some((x) => !x.check);
      currentUser.checkAll = check;
      updateUser(currentUser.id, currentUser);
      if (currentUser)
        localStorage.setItem("user", JSON.stringify(currentUser));
      setChange(change + 1);
    } else {
      const checked = e.target.checked;
      sessionStorage.setItem(
        "orderDetailInCart",
        JSON.stringify(
          orderDetails.map((x) => {
            if (
              order.size === x.size &&
              order.product === x.product
            ) {
              x.check = checked;
            }
            return x;
          })
        )
      );
      const check = !orderDetails?.some((x) => !x.check);
      sessionStorage.setItem("checkAll", check);
      setChange(change + 1);
    }
  }

  function handleDecreaseQuantity(order) {
    if (currentUser) {
      if (order.quantity > 1) {
        order.quantity -= 1;
        updateOrderDetailInCart(order.id, order).then((res) => {
          if (res.status === "ok") setChange(change + 1);
        });
      }
    } else {
      if (order.quantity > 1) {
        sessionStorage.setItem(
          "orderDetailInCart",
          JSON.stringify(
            orderDetails.map((x) => {
              if (
                x.size === order.size &&
                x.product === order.product
              )
                x.quantity = parseInt(x.quantity) - 1;
              return x;
            })
          )
        );
        setChange(change + 1);
      }
    }
  }

  function handleIncreaseQuantity(order) {
    if (currentUser) {
      order.quantity += 1;
      updateOrderDetailInCart(order.id, order).then((res) => {
        if (res.status === "ok") setChange(change + 1);
      });
    } else {
      sessionStorage.setItem(
        "orderDetailInCart",
        JSON.stringify(
          orderDetails.map((x) => {
            if (
              x.size === order.size &&
              x.product === order.product
            )
              x.quantity = parseInt(x.quantity) + 1;
            return x;
          })
        )
      );
      setChange(change + 1);
    }
  }

  function handleAllSelect() {
    if (currentUser) {
      const check = orderDetailInCart?.some((x) => !x.check);
      currentUser.checkAll = check ? 1 : 0;
      updateUser(currentUser.id, currentUser);
      if (currentUser)
        localStorage.setItem("user", JSON.stringify(currentUser));
      setOrderDetailInCart(
        orderDetailInCart.map((x) => {
          x.check = check ? 1 : 0;
          updateOrderDetailInCart(x.id, x);
          return x;
        })
      );
    } else {
      const check = orderDetails?.some((x) => !x.check);
      sessionStorage.setItem("checkAll", check);
      sessionStorage.setItem(
        "orderDetailInCart",
        JSON.stringify(
          orderDetails.map((o) => {
            return { ...o, check: check ? 1 : 0 };
          })
        )
      );
    }
    setChange(change + 1);
  }

  const orderDetails =
    JSON.parse(sessionStorage.getItem("orderDetailInCart")) ?? [];
  const getProduct = (id) => {
    return products?.find((c) => c?.id == id);
  };
  const getSize = (id) => {
    return sizes?.find((c) => c?.id == id);
  };
  const getCategory = (id) => {
    return categories?.find((c) => c?.id == id);
  };

  const [total, setTotal] = useState(0);
  useEffect(() => {
    let result = 0;
    (currentUser ? orderDetailInCart : orderDetails).forEach((od) => {
      const currentProduct = getProduct(od.product);
      const currentProductDetail = currentProduct?.productDetails.find(
        (pd) => pd.size == od.size
      );
      if (od.check) result += currentProductDetail?.price * od.quantity;
    });
    setTotal(result);
  }, [currentUser, orderDetailInCart, orderDetails]);

  function handleCheckout() {
    let error = "";
    if (order.fullName.length === 0) {
      error = "Full Name Required";
    } else if (order.phoneNumber.length === 0) {
      error = "Phone Number Required";
    } else if (order.address.length === 0) {
      error = "Address Required";
    }
    if (error !== "") {
      toast.error(error + "!", {
        autoClose: 1000,
      });
    } else {
      writeOrder(order).then((result) => {
        if (result.status === "ok") {
          if (!currentUser) {
            const orderDetailsNew = orderDetails.filter((x) => !x.check);
            sessionStorage.setItem(
              "orderDetailInCart",
              JSON.stringify(
                orderDetailsNew.length === 0 ? [] : orderDetailsNew
              )
            );

            setChange(change + 1);
          } else {
            const orderDetailInCartNew = orderDetailInCart.filter(
              (x) => !x.check
            );
            setCountOrder(orderDetailInCartNew.length);
            setOrderDetailInCart(orderDetailInCartNew);
          }
          setVisibleCheckout(false);
          toast.success("Checkout Success!", {
            autoClose: 1000,
          });
        } else {
          toast.error("Checkout failed! " + result.message, {
            autoClose: 1000,
          });
        }
      });
    }
  }
  return (
    <div>
      <div>
        <div className="bg-slate-100 py-4 px-44 page">
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
                  <span>My purchase</span>
                </div>
              </li>
            </ol>
          </nav>
          {(currentUser && orderDetailInCart?.length > 0) ||
            orderDetails.length > 0 ? (
            <div>
              <div className="mt-6">
                <div className="relative overflow-x-auto ">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          <input
                            type="checkbox"
                            checked={
                              (currentUser && currentUser.checkAll) ||
                              (!currentUser &&
                                JSON.parse(sessionStorage.getItem("checkAll")))
                            }
                            onChange={(e) => handleAllSelect(e)}
                            className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            style={{ border: "1px solid black" }}
                          />
                          <label
                            htmlFor="checkbox-purchase"
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Product Image
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3"
                          style={{ textAlign: "center" }}
                        >
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(currentUser ? orderDetailInCart : orderDetails).map(
                        (x) => {
                          let currentProduct = getProduct(x.product);
                          let currentProductDetail = getProduct(
                            x.product
                          )?.productDetails.find(
                            (pd) => pd.size == x.size
                          );
                          let currentSize = getSize(x.size);
                          return (
                            <tr
                              key={x.id}
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <div
                                  className="flex items-center"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <input
                                    id="checkbox-purchase"
                                    type="checkbox"
                                    checked={x.check ?? x.orders?.selected}
                                    onChange={(e) =>
                                      handleCheckbox(e, currentUser ? x : x)
                                    }
                                    style={{ border: "1px solid black" }}
                                    className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <label
                                    htmlFor="checkbox-purchase"
                                    className="sr-only"
                                  >
                                    checkbox
                                  </label>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <Link
                                  to={`/product/${currentProduct?.id}/${currentProduct?.name}`}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    src={currentProduct?.image}
                                    alt={currentProduct?.name}
                                    className="rounded-md"
                                    width={50}
                                  />
                                </Link>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {currentProduct?.name?.length > 30
                                  ? currentProduct?.name.substring(0, 30) +
                                  "..."
                                  : currentProduct?.name}{" "}
                                - size {currentSize?.size}
                              </td>
                              <td className="px-6 py-4">
                                ${currentProductDetail?.price?.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 grid grid-cols-3 mt-4">
                                <button
                                  style={{ zIndex: 1 }}
                                  className="flex justify-center items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full  hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600"
                                  onClick={() => handleDecreaseQuantity(x)}
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </button>
                                <div className="flex justify-center">
                                  <input
                                    type="number"
                                    onChange={(e) => {
                                      if (currentUser)
                                        setOrderDetailInCart(
                                          orderDetailInCart.map((odic) => {
                                            if (odic.id === x.id)
                                              odic.quantity = parseInt(
                                                e.target.value
                                              );
                                            return odic;
                                          })
                                        );
                                      else {
                                        sessionStorage.setItem(
                                          "orderDetailInCart",
                                          JSON.stringify(
                                            orderDetails.map((odic) => {
                                              if (
                                                x.size == odic.size &&
                                                x.product == odic.product
                                              )
                                                x.quantity = parseInt(
                                                  e.target.value
                                                );
                                              return odic;
                                            })
                                          )
                                        );
                                        setChange(change + 1);
                                      }
                                    }}
                                    value={x.quantity}
                                    className="bg-gray-50 text-center w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                  />
                                </div>
                                <button
                                  className="flex justify-center items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full  hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600"
                                  onClick={() => handleIncreaseQuantity(x)}
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </button>
                              </td>
                              <td className="px-6 py-4 text-gray-600 font-bold">
                                $
                                {(
                                  currentProductDetail?.price * x?.quantity
                                ).toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // if (currentUser) showDelete(x);
                                    // else
                                    showDelete(x);
                                  }}
                                  className="px-3 py-2 text-xs font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="purchase">
                <div className="purchase__card">
                  <img src={visa} alt="visa" />
                  <img src={mastercard} alt="mastercard" />
                  <img src={discover} alt="discover" />
                  <img src={amex} alt="amex" />
                  <img src={jcb} alt="jcb" />
                </div>
                <div className="purchase__button">
                  <div>
                    <span>
                      Total payment (
                      {
                        (currentUser ? orderDetailInCart : orderDetails).filter(
                          (x) => x.check
                        ).length
                      }{" "}
                      products) :{" "}
                      <span className="text-gray-600 font-bold">
                        ${total.toLocaleString()}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          (currentUser
                            ? orderDetailInCart
                            : orderDetails
                          )?.some((x) => x.check)
                        ) {
                          setOrder({
                            ...order,
                            customer: currentUser?.id || 0,
                            fullName: currentUser?.firstName
                              ? currentUser.firstName +
                              " " +
                              currentUser.lastName
                              : "",
                            phoneNumber: currentUser?.phoneNumber || "",
                            address: currentUser?.address || "",
                            orderDetails: (currentUser
                              ? orderDetailInCart
                              : orderDetails
                            )
                              ?.filter((x) => x.check)
                              .map((x, index) => {
                                let currentProduct = getProduct(x.product);
                                let currentProductDetail = getProduct(
                                  x.product
                                )?.productDetails.find(
                                  (pd) =>
                                    pd.size == x.size
                                );
                                let currentSize = getSize(x.size);
                                let currentCategory = getCategory(
                                  currentProduct.category
                                );
                                return {
                                  id: x.id || index,
                                  product: currentProduct,
                                  size: currentSize,
                                  quantity: x.quantity,
                                  category: currentCategory,
                                  price: currentProductDetail.price,
                                  totalPrice:
                                    currentProductDetail.price * x.quantity,
                                };
                              }),
                            total: total,
                            status: 0,
                          });
                          setVisibleCheckout(true);
                        } else
                          toast.error(
                            "You have not selected any products to pay for!",
                            {
                              autoClose: 1000,
                            }
                          );
                      }}
                      ////////////////////////////////////////////////
                      className="mx-3 px-3 py-2 w-60 font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                      CHECKOUT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-14 mb-10 text-center">
              <div>Your shopping cart is empty !</div>
              <div className="text-gray-600">
                <Link to={"/"}>Go buy now !</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal delete */}
      <Modal
        show={visibleDelete}
        size="xl"
        popup={true}
        onClose={() => setVisibleDelete(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                style={{ backgroundColor: "gray" }}
                onClick={() => {
                  handleDelete();
                }}
              >
                Yes
              </Button>
              <Button
                style={{ backgroundColor: "white", color: "black" }}
                onClick={() => setVisibleDelete(false)}
              >
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Model confirm */}
      <Modal
        show={visibleConfirm}
        size="xl"
        popup={true}
        onClose={() => setVisibleConfirm(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to payment this cart ?
            </h3>
          </div>
        </Modal.Body>
      </Modal>
      {/* Modal Checkout */}
      <Modal
        show={visibleCheckout}
        size="5xl"
        popup={true}
        onClose={() => setVisibleCheckout(false)}
      >
        <Modal.Header>Confirm delivery information</Modal.Header>
        <Modal.Body>
          <div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  defaultValue={order.fullName}
                  onChange={(e) => {
                    order.fullName = e.target.value;
                    setOrder(order);
                  }}
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  defaultValue={order.phoneNumber}
                  onChange={(e) => {
                    order.phoneNumber = e.target.value;
                    setOrder(order);
                  }}
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  defaultValue={order.address}
                  onChange={(e) => {
                    order.address = e.target.value;
                    setOrder(order);
                  }}
                />
              </div>
              <div>
                <label>Description</label>
                <input
                  type="textarea"
                  name="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  defaultValue={order.description}
                  onChange={(e) => {
                    order.description = e.target.value;
                    setOrder(order);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-start-1 col-end-3 font-bold">
                List Order Product
              </div>
              <div className="col-start-1 col-end-3 relative overflow-y-auto h-48">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th
                        colSpan={2}
                        scope="col"
                        className="px-6 py-3"
                        style={{ textAlign: "center" }}
                      >
                        Product Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        style={{ textAlign: "center" }}
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        style={{ textAlign: "center" }}
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        style={{ textAlign: "center" }}
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                        style={{ textAlign: "center" }}
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderDetails?.map((x) => {
                      return (
                        <tr
                          key={"previewCheckout-" + x.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td
                            className="px-6 py-4"
                            style={{ textAlign: "center" }}
                          >
                            <img
                              src={x.product.image}
                              alt={x.product.name}
                              className="h-12 w-12 rounded-md"
                            />
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{ textAlign: "center" }}
                          >{`${x.product.name}-${x.size.size}`}</td>
                          <td
                            className="px-6 py-4"
                            style={{ textAlign: "center" }}
                          >
                            {x.price?.toLocaleString()}$
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{ textAlign: "center" }}
                          >
                            {x.quantity}
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{ textAlign: "center" }}
                          >
                            {x.category.name}
                          </td>
                          <td
                            className="px-6 py-4"
                            style={{ textAlign: "center" }}
                          >
                            {x.totalPrice.toLocaleString()}$
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col-start-1 col-end-3 text-gray-600 font-bold">
                Total Payment: <span>{total.toLocaleString()}$</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="w-full bg-gray-700 bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                onClick={() => {
                  handleCheckout();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PurchasePage;
