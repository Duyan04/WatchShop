import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, Formik } from "formik";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import LayoutManager from "../../components/LayoutManager";
import {
  changeStatusCategory,
  readCategory,
  updateCategory,
  writeCategory,
} from "../../services/api";

function CategoryManaPage() {
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleRestore, setVisibleRestore] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [itemOffset, setItemOffset] = useState(0);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    readCategory().then((res) => setCategories(res.data));
  }, []);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const arrFilter = categories?.filter(
    (x) =>
      x.name?.toLowerCase().includes(valueSearch.toLowerCase()) ||
      x.id.toString().includes(valueSearch)
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
    setCategory(x);
  }

  function showRestore(x) {
    setVisibleRestore(true);
    setCategory(x);
  }

  function showUpdate(x) {
    setVisibleUpdate(true);
    setCategory(x);
  }

  function validateForm(values) {
    const errors = {};
    if (values.name.length === 0) {
      errors.name = "Required";
    }
    return errors;
  }

  function handleAdd(values) {
    writeCategory(values).then((result) => {
      if (result.status === "ok") {
        setCategories([...categories, result.data]);
        setVisibleAdd(false);
        toast.success("Add Category Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Add Category Failed", {
          autoClose: 1000,
        });
    });
  }

  function handleDelete() {
    changeStatusCategory(category.id, 0).then((result) => {
      if (result.status === "ok") {
        setCategories(
          categories.map((c) => {
            if (c.id === category.id) c.status = 0;
            return c;
          })
        );
        setVisibleDelete(false);
        toast.success("Delete Category Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Delete Category Failed", {
          autoClose: 1000,
        });
    });
  }

  function handleRestore() {
    changeStatusCategory(category.id, 1).then((result) => {
      if (result.status === "ok") {
        setCategories(
          categories.map((c) => {
            if (c.id === category.id) c.status = 1;
            return c;
          })
        );
        setVisibleRestore(false);
        toast.success("Restore Category Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Restore Category Failed", {
          autoClose: 1000,
        });
    });
  }

  function handleUpdate(values) {
    updateCategory(category.id, values).then((result) => {
      if (result.status === "ok") {
        setCategories(
          categories.map((c) => {
            if (c.id === category.id) return values;
            return c;
          })
        );
        setVisibleUpdate(false);
        toast.success("Update Category Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Update Category Failed", {
          autoClose: 1000,
        });
    });
  }

  return (
    <>
      <ToastContainer />
      <div className="font-bold">Category Management Page</div>
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
              backgroundColor: "#384156cc",
              color: "white",
              borderRadius: "5px",
              margin: "0 5px",
              padding: "8px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#384156e5";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#384156cc";
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
                  Category Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" colSpan={2} className="px-6 py-3 text-center">
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
                  <td className="px-6 py-4">{x.name}</td>
                  <td className="px-6 py-4">{x.description}</td>
                  <td className="px-6 py-4">
                    {x.status ? "Active" : "Inactive"}
                  </td>
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
                  Confirm Category Deletion?
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
                  Confirm Category restore?
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
                Update Category
              </div>
            </Modal.Header>
            <Modal.Body>
              <Formik
                enableReinitialize
                initialValues={{
                  ...category,
                  name: category.name || "",
                  description: category.description || "",
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
                        <label>Category Name</label>
                        <Field
                          type="text"
                          name="name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.name}
                        />
                        <div className="text-red-600">
                          {errors.name && touched.name && errors.name}
                        </div>
                      </div>
                      <div>
                        <label>Description</label>
                        <Field
                          type="text"
                          as="textarea"
                          name="description"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.description}
                        />
                        <div className="text-red-600">
                          {errors.description &&
                            touched.description &&
                            errors.description}
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
                Add new Category
              </div>
            </Modal.Header>
            <Modal.Body>
              <Formik
                enableReinitialize
                initialValues={{
                  name: "",
                  description: "",
                  status: true,
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
                        <label>Category Name</label>
                        <Field
                          type="text"
                          name="name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.name}
                        />
                        <div className="text-red-600">
                          {errors.name && touched.name && errors.name}
                        </div>
                      </div>
                      <div>
                        <label>Description</label>
                        <Field
                          type="text"
                          as="textarea"
                          name="description"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.description}
                        />
                        <div className="text-red-600">
                          {errors.description &&
                            touched.description &&
                            errors.description}
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

export default CategoryManaPage;
