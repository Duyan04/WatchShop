import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";

import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";

import { changeStatusOrder, readOrder, readUser } from "../../services/api";

function OrderManaPageAdmin() {
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [visibleVerify, setVisibleVerify] = useState(false);
  const [visibleCancel, setVisibleCancel] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [itemOffset, setItemOffset] = useState(0);
  const [ordersDetailHistoryAdmin, setOrdersDetailHistoryAdmin] = useState([]);
  const [orderDetail, setOrderDetail] = useState({});
  // const [vouchers, setVouchers] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("ALL");
  useEffect(() => {
    readUser().then((res) => setUsers(res.data));
    readOrder().then((res) => setOrdersDetailHistoryAdmin(res.data));
    // readVoucher(setVouchers, 1);
  }, []);

  const getUser = (id) => {
    return users?.find((u) => u?.id == id);
  };
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const arr = ordersDetailHistoryAdmin;

  const arrFilter = arr?.filter((x) => {
    let currentUser = getUser(x.customer);
    return (
      ((currentUser?.firstName + " " + currentUser?.lastName)
        .toLowerCase()
        .includes(valueSearch.toLowerCase()) ||
        x.id.toString().includes(valueSearch) ||
        x?.fullName.toLowerCase().includes(valueSearch.toLowerCase()) ||
        x?.phoneNumber.includes(valueSearch)) &&
      (filter === "ALL" ? true : x.status == filter)
    );
  });

  const currentItems = arrFilter?.slice(itemOffset, endOffset);
  const pageCount = arrFilter?.length
    ? Math.ceil(arrFilter?.length / itemsPerPage)
    : 1;

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % arrFilter.length;
    setItemOffset(newOffset);
  };

  function showDetail(x) {
    setVisibleDetail(true);
    setOrderDetail(x);
  }

  function showVerify(x) {
    setVisibleVerify(true);
    setOrderDetail(x);
  }
  function showCancel(x) {
    setVisibleCancel(true);
    setOrderDetail(x);
  }
  function handleVerify() {
    changeStatusOrder(orderDetail.id, 1).then((result) => {
      if (result.status === "ok") {
        setVisibleVerify(false);
        setOrdersDetailHistoryAdmin(
          ordersDetailHistoryAdmin.map((odha) => {
            if (odha.id === orderDetail.id) odha.status = 1;
            return odha;
          })
        );
        toast.success("Confirm Order Success", { autoClose: 1000 });
      } else
        toast.error("Confirm Order Failed. " + result, { autoClose: 1000 });
    });
  }
  function handleCancel() {
    changeStatusOrder(orderDetail.id, 2).then((result) => {
      if (result.status === "ok") {
        setOrdersDetailHistoryAdmin(
          ordersDetailHistoryAdmin.map((odha) => {
            if (odha.id === orderDetail.id) odha.status = 2;
            return odha;
          })
        );
        setVisibleCancel(false);
        toast.success("Update Order Success", { autoClose: 1000 });
      } else toast.error("Update Order Failed. " + result, { autoClose: 1000 });
    });
  }

  return (
    <>
      <ToastContainer />
      <div className="font-bold">Order Management Page</div>
      <div className="grid grid-cols-3 gap-2 py-3">
        <div>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              onChange={(e) =>
                setTimeout(() => setValueSearch(e.target.value), 1000)
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
              placeholder="Search..."
              required
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
              <label>Filter:</label>
            </div>
            <select
              type="text"
              id="simple-filter"
              onChange={(e) =>
                setTimeout(() => setFilter(e.target.value), 1000)
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block  pl-20 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
              placeholder="Filter..."
              required
            >
              <option>ALL</option>
              <option value={0}>PENDING</option>
              <option value={1}>APPROVED</option>
              <option value={2}>CANCELLED</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                  Customer
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
                <th scope="col" className="px-3 py-2">
                  Status
                </th>{" "}
                <th scope="col" colSpan={2} className="px-3 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((x) => {
                let currentUser = getUser(x.customer);
                let count = x.orderDetails?.reduce(
                  (acc, o) => acc + parseInt(o.quantity),
                  0
                );
                return (
                  <tr
                    key={x.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-3 py-2">{x.id}</td>
                    <td className="px-3 py-2">
                      {currentUser?.firstName
                        ? currentUser?.firstName + " " + currentUser?.lastName
                        : "Guest"}
                    </td>
                    <td className="px-3 py-2">{x.fullName}</td>
                    <td className="px-3 py-2">{x.phoneNumber}</td>
                    <td className="px-3 py-2">{x.address}</td>
                    <td className="px-3 py-2">{x.orderDate}</td>
                    <td className="px-3 py-2">{count}</td>
                    <td className="px-3 py-2">
                      {x.status == 1
                        ? "APPROVED"
                        : x.status == 0
                          ? "PENDING"
                          : "CANCELLED"}
                    </td>
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
                          e.currentTarget.style.backgroundColor = "#385639e5";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#385639cc";
                        }}
                      >
                        Detail
                      </button>
                    </td>
                    {x.status == 0 && (
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            showVerify(x);
                          }}
                          style={{
                            width: 70,
                            height: 34,
                            backgroundColor: "#385156cc",
                            color: "white",
                            borderRadius: "5px",
                            margin: "0 5px",
                            padding: "8px",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#385156e5";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#385156cc";
                          }}
                        >
                          Confirm
                        </button>
                      </td>
                    )}{" "}
                    {x.status != 2 && (
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            showCancel(x);
                          }}
                          style={{
                            width: 70,
                            height: 34,
                            backgroundColor: "#385156cc",
                            color: "white",
                            borderRadius: "5px",
                            margin: "0 5px",
                            padding: "8px",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#385156e5";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#385156cc";
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                  <label>Order Customer</label>
                  <input
                    type="text"
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                    value={
                      getUser(orderDetail.customer)?.firstName +
                      " " +
                      getUser(orderDetail.customer)?.lastName
                    }
                  />
                </div>
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
                  <label>Recipient Phone Number</label>
                  <input
                    type="text"
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                    value={orderDetail?.phoneNumber}
                  />
                </div>
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
                          orderDetail.retailer?.address
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
                              {x.totalPrice?.toLocaleString()}$
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
          {/* Modal Verify */}
          <Modal
            show={visibleVerify}
            size="xl"
            popup={true}
            onClose={() => setVisibleVerify(false)}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Confirm order?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="success"
                    onClick={() => {
                      handleVerify();
                    }}
                  >
                    Yes
                  </Button>
                  <Button color="gray" onClick={() => setVisibleVerify(false)}>
                    No, quit
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {/* Modal Cancel */}
          <Modal
            show={visibleCancel}
            size="xl"
            popup={true}
            onClose={() => setVisibleCancel(false)}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Cancel order?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="success"
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    Yes
                  </Button>
                  <Button color="gray" onClick={() => setVisibleCancel(false)}>
                    No, quit
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
        {/* Pagination */}
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
      </div>
    </>
  );
}

export default OrderManaPageAdmin;
