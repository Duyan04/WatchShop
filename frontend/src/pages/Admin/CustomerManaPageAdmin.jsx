import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import LayoutManager from "../../components/LayoutManager";

import { useRef } from "react";
import {
  changeStatusUser,
  readUser,
  updateUser,
  writeUser,
} from "../../services/api";

function CustomerManaPageAdmin() {
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleRestore, setVisibleRestore] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [itemOffset, setItemOffset] = useState(0);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const fileRef = useRef(null);
  useEffect(() => {
    readUser().then((res) => setUsers(res.data));
  }, []);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const arrFilter = users?.filter(
    (x) =>
      ((x.firstName + " " + x.lastName)
        .toLowerCase()
        .includes(valueSearch.toLowerCase()) ||
        x.id.toString().includes(valueSearch)) &&
      x.role !== 1
  );
  const currentItems = arrFilter?.slice(itemOffset, endOffset);
  const pageCount = arrFilter?.length
    ? Math.ceil(arrFilter?.length / itemsPerPage)
    : 1;

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % arrFilter?.length;
    setItemOffset(newOffset);
  };

  function showAdd() {
    setVisibleAdd(true);
  }

  function showDelete(x) {
    setVisibleDelete(true);
    setUser(x);
  }

  function showRestore(x) {
    setVisibleRestore(true);
    setUser(x);
  }

  function showUpdate(x) {
    setVisibleUpdate(true);
    setUser(x);
  }

  function validateForm(values) {
    const errors = {};
    if (values.firstName.length === 0) {
      errors.firstName = "Required";
    }
    if (values.lastName.length === 0) {
      errors.lastName = "Required";
    }
    if (values.username.length === 0) {
      errors.username = "Required";
    }
    if (values.password.length === 0) {
      errors.password = "Required";
    }
    if (values.email.length === 0) {
      errors.email = "Required";
    }
    if (values.phoneNumber.length === 0) {
      errors.phoneNumber = "Required";
    }
    return errors;
  }

  function handleAdd(values) {
    writeUser(values).then((result) => {
      if (result.status === "ok") {
        setVisibleAdd(false);
        setUsers([...users, result.data]);
        toast.success("Add Customer Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Add Customer Failed", {
          autoClose: 1000,
        });
    });
  }

  function handleDelete() {
    changeStatusUser(user.id, 0).then((result) => {
      if (result.status === "ok") {
        setUsers(
          users.map((u) => {
            if (u.id === user.id) u.status = 0;
            return u;
          })
        );
        setVisibleDelete(false);
        toast.success("Delete Customer Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Delete Customer Failed", {
          autoClose: 1000,
        });
    });
  }

  function handleRestore() {
    changeStatusUser(user.id, 1).then((result) => {
      if (result.status === "ok") {
        setUsers(
          users.map((u) => {
            if (u.id === user.id) u.status = 1;
            return u;
          })
        );
        setVisibleRestore(false);
        toast.success("Restore Customer Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Restore Customer Failed", {
          autoClose: 1000,
        });
    });
  }

  function handleUpdate(values) {
    updateUser(user.id, values).then((result) => {
      if (result.status === "ok") {
        setUsers(
          users.map((u) => {
            if (u.id === user.id) return values;
            return u;
          })
        );
        setVisibleUpdate(false);
        toast.success("Update Customer Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Update Customer Failed", {
          autoClose: 1000,
        });
    });
  }

  return (
    <>
      <ToastContainer />
      <div className="font-bold">Customer Management Page</div>
      <div className="grid grid-cols-2 gap-2 py-3">
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
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => showAdd()}
            style={{
              width: 90,
              height: 40,
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
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Avatar
                </th>
                <th scope="col" className="px-6 py-3">
                  FullName
                </th>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  PhoneNumber
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" colSpan={3} className="px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((x) => (
                <tr
                  key={x.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">{x.id}</td>
                  <td className="px-6 py-4">
                    <img
                      src={x.avatar}
                      alt={x.firstName + " " + x.lastName}
                      className="w-12 h-12 rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {x.firstName + " " + x.lastName}
                  </td>
                  <td className="px-6 py-4">{x.username}</td>
                  <td className="px-6 py-4">{x.email}</td>
                  <td className="px-6 py-4">{x.phoneNumber}</td>
                  <td className="px-6 py-4">
                    {x.status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4">{x.description}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => showUpdate(x)}
                      style={{
                        width: 90,
                        height: 34,
                        backgroundColor: "#4f3856cc",
                        color: "white",
                        borderRadius: "5px",
                        margin: "0 5px",
                        padding: "8px",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#4f3856e5";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#4f3856cc";
                      }}
                    >
                      Update
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {x.status ? (
                      <button
                        type="button"
                        onClick={() => showDelete(x)}
                        style={{
                          width: 60,
                          height: 34,
                          backgroundColor: "#563838cc",
                          color: "white",
                          borderRadius: "5px",
                          margin: "0 5px",
                          padding: "8px",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#563838e5";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#563838cc";
                        }}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => showRestore(x)}
                        style={{
                          width: 90,
                          height: 34,
                          backgroundColor: "#38563ccc",
                          color: "white",
                          borderRadius: "5px",
                          margin: "0 5px",
                          padding: "8px",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#38563ce5";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#38563ccc";
                        }}
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  Confirm Customer deletion?
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
                  <Button color="gray" onClick={() => setVisibleDelete(false)}>
                    No, quit
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          {/* Modal restore */}
          <Modal
            show={visibleRestore}
            size="xl"
            popup={true}
            onClose={() => setVisibleRestore(false)}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Confirm Customer restore?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="success"
                    onClick={() => {
                      handleRestore();
                    }}
                  >
                    Yes
                  </Button>
                  <Button color="gray" onClick={() => setVisibleRestore(false)}>
                    No, quit
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          {/* Modal update */}
          <Modal
            show={visibleUpdate}
            size="4xl"
            popup={true}
            onClose={() => setVisibleUpdate(false)}
          >
            <Modal.Header>
              <div className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Update Customer
              </div>
            </Modal.Header>
            <Modal.Body>
              <Formik
                enableReinitialize
                initialValues={{
                  ...user,
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  avatar: user.avatar || "",
                  username: user.username || "",
                  email: user.email || "",
                  phoneNumber: user.phoneNumber || "",
                  address: user.address || "",
                }}
                validate={(values) => validateForm(values)}
                onSubmit={(values) => handleUpdate(values)}
              >
                {({
                  values,
                  errors,
                  touched,
                  /* and other goodies */
                }) => (
                  <Form>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label>First Name</label>
                        <Field
                          type="text"
                          name="firstName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.firstName}
                        />
                        <div className="text-red-600">
                          {errors.firstName &&
                            touched.firstName &&
                            errors.firstName}
                        </div>
                      </div>
                      <div>
                        <label>Last Name</label>
                        <Field
                          type="text"
                          name="lastName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.lastName}
                        />
                        <div className="text-red-600">
                          {errors.lastName &&
                            touched.lastName &&
                            errors.lastName}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label>Avatar</label>
                        <Field
                          type="text"
                          name="avatar"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.avatar}
                        />
                        <div className="text-red-600">
                          {errors.avatar && touched.avatar && errors.avatar}
                        </div>
                      </div>
                      <div>
                        <label>Username</label>
                        <Field
                          type="text"
                          name="username"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.username}
                        />
                        <div className="text-red-600">
                          {errors.username &&
                            touched.username &&
                            errors.username}
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
                        <div className="text-red-600">
                          {errors.email && touched.email && errors.email}
                        </div>
                      </div>
                      <div>
                        <label>Phone Number</label>
                        <Field
                          type="text"
                          name="phoneNumber"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.phoneNumber}
                        />
                        <div className="text-red-600">
                          {errors.phoneNumber &&
                            touched.phoneNumber &&
                            errors.phoneNumber}
                        </div>
                      </div>{" "}
                      <div>
                        <label>Address</label>
                        <Field
                          type="text"
                          name="address"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.address}
                        />
                        <div className="text-red-600">
                          {errors.address && touched.address && errors.address}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        className="text-white w-full bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                        type="submit"
                      >
                        Update
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
          {/* Modal add */}
          <Modal
            show={visibleAdd}
            size="4xl"
            popup={true}
            onClose={() => setVisibleAdd(false)}
          >
            <Modal.Header>
              <div className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Add new Customer
              </div>
            </Modal.Header>
            <Modal.Body>
              <Formik
                enableReinitialize
                initialValues={{
                  ...user,
                  firstName: "",
                  lastName: "",
                  avatar: null,
                  username: "",
                  password: "",
                  email: "",
                  phoneNumber: "",
                  address: "",
                  status: true,
                  description: "",
                  roles: ["CUSTOMER"],
                }}
                validate={(values) => validateForm(values)}
                onSubmit={(values) => handleAdd(values)}
              >
                {({
                  values,
                  errors,
                  touched,
                  /* and other goodies */
                }) => (
                  <Form>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label>First Name</label>
                        <Field
                          type="text"
                          name="firstName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.firstName}
                        />
                        <div className="text-red-600">
                          {errors.firstName &&
                            touched.firstName &&
                            errors.firstName}
                        </div>
                      </div>
                      <div>
                        <label>Last Name</label>
                        <Field
                          type="text"
                          name="lastName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.lastName}
                        />
                        <div className="text-red-600">
                          {errors.lastName &&
                            touched.lastName &&
                            errors.lastName}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label>Avatar</label>
                        <Field
                          type="text"
                          name="avatar"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.avatar}
                        />
                        <div className="text-red-600">
                          {errors.avatar && touched.avatar && errors.avatar}
                        </div>
                      </div>
                      <div>
                        <label>Username</label>
                        <Field
                          type="text"
                          name="username"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.username}
                        />
                        <div className="text-red-600">
                          {errors.username &&
                            touched.username &&
                            errors.username}
                        </div>
                      </div>
                      <div>
                        <label>Password</label>
                        <Field
                          type="text"
                          name="password"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.password}
                        />
                        <div className="text-red-600">
                          {errors.password &&
                            touched.password &&
                            errors.password}
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
                        <div className="text-red-600">
                          {errors.email && touched.email && errors.email}
                        </div>
                      </div>

                      <div>
                        <label>Phone Number</label>
                        <Field
                          type="text"
                          name="phoneNumber"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.phoneNumber}
                        />
                        <div className="text-red-600">
                          {errors.phoneNumber &&
                            touched.phoneNumber &&
                            errors.phoneNumber}
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
                        <div className="text-red-600">
                          {errors.address && touched.address && errors.address}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        className="text-white w-full bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                        type="submit"
                      >
                        Add
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
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

export default CustomerManaPageAdmin;
