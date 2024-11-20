/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import "./css/productManager.scss";
import {
  changeStatusProduct,
  readCategory,
  readProduct,
  readSize,
  updateProduct,
  writeProduct,
} from "../../services/api";
function ProductManaPageAdmin() {
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleRestore, setVisibleRestore] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [itemOffset, setItemOffset] = useState(0);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [product, setProduct] = useState({});
  const [productDetails, setProductDetails] = useState([
    {
      size: sizes.length === 0 ? null : sizes[0]?.id,
      price: "",
      quantity: "",
    },
  ]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    readSize().then((res) => setSizes(res.data));
    readCategory().then((res) => setCategories(res.data));
    readProduct().then((res) => setProducts(res.data));
  }, [visibleAdd, visibleDetail, visibleDelete, visibleRestore, visibleUpdate]);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const arrFilter = products?.filter(
    (x) =>
      x.name.toLowerCase().includes(valueSearch.toLowerCase()) ||
      x.id.toString().includes(valueSearch)
  );
  const currentItems = arrFilter?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(arrFilter?.length / itemsPerPage) || 1;

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % arrFilter?.length;
    setItemOffset(newOffset);
  };

  function showAdd() {
    setProductDetails([
      {
        size: sizes.length === 0 ? null : sizes[0]?.id,
        price: "",
        quantity: "",
      },
    ]);
    setProduct({});
    setVisibleAdd(true);
  }

  function showDetail(x) {
    setVisibleDetail(true);
    setProduct(x);
  }

  function showDelete(x) {
    setVisibleDelete(true);
    setProduct(x);
  }

  function showRestore(x) {
    setVisibleRestore(true);
    setProduct(x);
  }

  function showUpdate(x) {
    setProductDetails(x.productDetails);
    setProduct(x);
    setVisibleUpdate(true);
  }

  function validateForm(values) {
    const errors = {};
    if (values.name.length === 0) {
      errors.name = "Required";
    }
    productDetails.forEach((productDetail, index) => {
      if (productDetail.price.length === 0)
        errors[`price${index}`] = "Required";
      else if (parseFloat(productDetail.price) < 0)
        errors[`price${index}`] = "Price Invalid";
      if (productDetail.quantity.length === 0)
        errors[`quantity${index}`] = "Required";
      else if (parseInt(productDetail.quantity) < 0)
        errors[`quantity${index}`] = "Quantity Invalid";
    });
    return errors;
  }

  function handleAdd(values) {
    if (
      values.name.length === 0 ||
      productDetails?.some(
        (productDetail) =>
          !productDetail.price ||
          parseFloat(productDetail.price) < 0 ||
          productDetail.quantity?.length == 0 ||
          parseInt(productDetail.quantity) < 0
      )
    ) {
      toast.error("Data Input Invalid", { autoClose: 1000 });
    } else {
      values.category = values.category
        ? parseInt(values.category)
        : parseInt(categories[0]?.id);

      values.productDetails = productDetails.map((productDetail) => {
        return {
          ...productDetail,
          size: productDetail.size ? productDetail.size : sizes[0]?.id,
        };
      });
      writeProduct(values).then((result) => {
        if (result.status === "ok") {
          setProducts([...products, result.data]);
          setVisibleAdd(false);
          toast.success("Add Product Success", {
            autoClose: 1000,
          });
        } else
          toast.error("Add Product Failed." + result, {
            autoClose: 1000,
          });
      });
    }
  }

  function handleDelete() {
    changeStatusProduct(product.id, 0).then((result) => {
      if (result.status === "ok") {
        setProducts(
          products.map((p) => {
            if (p.id === product.id) p.status = 0;
            return p;
          })
        );
        setVisibleDelete(false);
        toast.success("Delete Product Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Delete Product Failed", {
          autoClose: 1000,
        });
    });
  }

  function handleRestore() {
    changeStatusProduct(product.id, 1).then((result) => {
      if (result.status === "ok") {
        setProducts(
          products.map((p) => {
            if (p.id === product.id) p.status = 1;
            return p;
          })
        );
        setVisibleRestore(false);
        toast.success("Restore Product Success", {
          autoClose: 1000,
        });
      } else
        toast.error("Restore Product Failed", {
          autoClose: 1000,
        });
    });
  }

  function handleUpdate(values) {
    if (
      values.name.length === 0 ||
      productDetails?.some(
        (productDetail) =>
          !productDetail.price ||
          parseFloat(productDetail.price) < 0 ||
          productDetail.quantity?.length == 0 ||
          parseInt(productDetail.quantity) < 0
      )
    ) {
      toast.error("Data Input Invalid", { autoClose: 1000 });
    } else {
      values.category = parseInt(
        values.category ? values.category : categories[0]?.id
      );
      values.productDetails = productDetails.map((productDetail) => {
        return {
          ...productDetail,
          size: productDetail.size ? productDetail.size : sizes[0]?.id,
        };
      });
      updateProduct(product.id, values).then((result) => {
        if (result.status === "ok") {
          setProducts(
            products.map((p) => {
              if (p.id === product.id) return values;
              return p;
            })
          );
          setVisibleUpdate(false);
          toast.success("Update Product Success", {
            autoClose: 1000,
          });
        } else
          toast.error("Update Product Failed." + result, {
            autoClose: 1000,
          });
      });
    }
  }

  const handleAddProductDetail = () => {
    setProductDetails([
      ...productDetails,
      {
        size: sizes.length === 0 ? null : sizes[0]?.id,
        price: "",
        quantity: "",
      },
    ]);
  };
  const handleDeleteProductDetail = (indexInList) => {
    setProductDetails(
      productDetails.filter((c, index) => index !== indexInList)
    );
  };

  // useEffect(() => {
  //   if (
  //     listColorSizeForNewProduct.length === 0 ||
  //     !setListColorSizeForNewProduct[0]?.color.id
  //   )
  //     setListColorSizeForNewProduct([
  //       { color: colors[0]?.ìd ?? -1, images: [] },
  //     ]);
  // }, [colors]);

  return (
    <>
      <ToastContainer />
      <div className="font-bold">Product Management Page</div>
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
            onClick={(e) => {
              e.preventDefault();
              showAdd();
            }}
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
                  Image
                </th>{" "}
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" colSpan={3} className="px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((x) => (
                <tr
                  key={x.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">{x.id}</td>
                  <td className="px-6 py-4">
                    <img
                      src={`${x.image}`}
                      alt={x.name}
                      className="h-12 w-12 rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4">{x.name}</td>
                  <td className="px-6 py-4">{x.description}</td>
                  <td className="px-6 py-4">
                    {categories?.find((c) => c?.id == x.category)?.name}
                  </td>
                  <td className="px-6 py-4">
                    {x.status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        showDetail(x);
                      }}
                      style={{
                        width: 90,
                        height: 34,
                        backgroundColor: "#395638cc",
                        color: "white",
                        borderRadius: "5px",
                        margin: "0 5px",
                        padding: "8px",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#395638e5";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#395638cc";
                      }}
                    >
                      Details
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setProductDetails(x.productDetails);
                        showUpdate(x);
                      }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          showDelete(x);
                        }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          showRestore(x);
                        }}
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
          {/* Modal detail */}
          <Modal
            show={visibleDetail}
            size="4xl"
            popup={true}
            onClose={(e) => {
              e.preventDefault();
              setVisibleDetail(false);
            }}
          >
            <Modal.Header>
              <div className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Product Details
              </div>
            </Modal.Header>
            <Modal.Body>
              <Formik enableReinitialize initialValues={product}>
                <Form>
                  {" "}
                  <div style={{ textAlign: "center" }}>
                    <label>Image</label>
                    <img
                      style={{ width: 250, margin: "0 auto" }}
                      src={product.image}
                    ></img>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label>Product Name: {product.name}</label>
                    </div>{" "}
                    <div>
                      <label>
                        Category:{" "}
                        {/* {categories.find(
                          (category) => category?.id == values.category
                        )} */}
                        {
                          categories?.find((c) => c?.id == product.category)
                            ?.name
                        }
                      </label>
                    </div>
                  </div>
                  {product.description && (
                    <div>
                      <label>Description</label>
                      <Field
                        type="text"
                        as="textarea"
                        name="description"
                        disabled
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                        value={product.description}
                      />
                    </div>
                  )}
                  <div
                    className="grid grid-cols-2 gap-2"
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          textDecoration: "underline",
                          fontStyle: "italic",
                        }}
                      >
                        Details:
                      </span>
                    </div>{" "}
                  </div>
                  <div
                    style={{
                      maxHeight: "300px",
                      overflowY: "scroll",
                      display: "grid",
                    }}
                  >
                    {product.productDetails?.map((detail, indexInList) => {
                      const size = sizes?.find(
                        (size) => size?.id == detail.size
                      )?.size;
                      return (
                        <>
                          <div>Product Detail {indexInList + 1}</div>
                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <label>Size: {size}</label>
                            </div>
                            <div>
                              <label>Quantity: {detail.quantity}</label>
                            </div>
                            <div>
                              <label>Price: {detail.price}</label>
                            </div>
                          </div>

                          {detail.description && (
                            <div>
                              <label>Description</label>
                              <Field
                                type="text"
                                as="textarea"
                                name={"description" + indexInList}
                                disabled
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                defaultValue={detail.description}
                              />
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                </Form>
              </Formik>
            </Modal.Body>
          </Modal>
          {/* Modal delete */}
          <Modal
            show={visibleDelete}
            size="xl"
            popup={true}
            onClose={(e) => {
              e.preventDefault();
              setVisibleDelete(false);
            }}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Confirm Product deletion?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    style={{ backgroundColor: "gray" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    color="gray"
                    onClick={(e) => {
                      e.preventDefault();
                      setVisibleDelete(false);
                    }}
                  >
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
            onClose={(e) => {
              e.preventDefault();
              setVisibleRestore(false);
            }}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Confirm Product Restore?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="success"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRestore();
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    color="gray"
                    onClick={(e) => {
                      e.preventDefault();
                      setVisibleRestore(false);
                    }}
                  >
                    No, quit
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          {/* Modal update */}
          <Modal
            show={visibleUpdate}
            size="7xl"
            popup={true}
            onClose={(e) => {
              e.preventDefault();
              setVisibleUpdate(false);
            }}
          >
            <Modal.Header>
              <div className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Update Product
              </div>
            </Modal.Header>
            <Modal.Body>
              <Formik
                enableReinitialize
                initialValues={{
                  ...product,
                  name: product.name || "",
                  category: product.category || categories[0]?.id,
                  description: product.description || "",
                  image: product.image || null,
                  productDetails: Array.isArray(product.productDetails)
                    ? product.productDetails
                    : [],
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
                        <label>Image</label>
                        <Field
                          type="text"
                          name={"image"}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.image}
                        ></Field>
                        <div className="text-red-600">
                          {errors.image && touched.image}
                        </div>
                      </div>
                      <div>
                        <label>Product Name</label>
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
                      <div>
                        <label>Category</label>
                        <Field
                          as="select"
                          type="text"
                          name="category"
                          defaultValue={values.category}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 "
                          value={values.category}
                        >
                          {categories.map((x) => (
                            <option key={x.id} value={x.id}>
                              {x.name}
                            </option>
                          ))}
                        </Field>
                        <div className="text-red-600">
                          {errors.category &&
                            touched.category &&
                            errors.category}
                        </div>
                      </div>
                    </div>
                    <div
                      className="grid grid-cols-2 gap-2"
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            textDecoration: "underline",
                            fontStyle: "italic",
                          }}
                        >
                          Choose Size and Color:
                        </span>
                      </div>{" "}
                      <div style={{ textAlign: "right" }}>
                        <button
                          style={{
                            backgroundColor: "#30443870",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.cursor = "pointer";
                            e.currentTarget.style.backgroundColor = "#304438a5";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#30443870";
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddProductDetail();
                          }}
                        >
                          Add Detail +
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "scroll",
                        display: "grid",
                      }}
                    >
                      {productDetails.map((detail, indexInList) => (
                        <>
                          <div>Product Detail {indexInList + 1}</div>
                          <div className="grid grid-cols-5 gap-2">
                            <div>
                              {/* <label>Size {indexInList + 1}</label> */}
                              <Field
                                id="select-size"
                                as="select"
                                type="text"
                                name={`size` + (indexInList + 1)}
                                defaultValue={detail.size}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 custom-select select"
                                onChange={(e) => {
                                  productDetails[indexInList].size = parseInt(
                                    e.target.value
                                  );
                                  setProductDetails(productDetails);
                                }}
                              >
                                {sizes
                                  .filter((c) => c.status)
                                  .map((x) => {
                                    return (
                                      <option
                                        onMouseEnter={() => {
                                          document.getElementById(
                                            "select-size"
                                          ).style.borderLeft = `100px solid ${"black !important"}`;
                                        }}
                                        className="select-items"
                                        key={x.id}
                                        value={x.id}
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          height: "100%",
                                          backgroundColor: "white",
                                          padding: "15px !important",
                                          margin: "5px",
                                          border: "100px solid white",
                                          lineHeight: "50px",
                                          fontSize: "18px",
                                          borderRadius: "5px",
                                        }}
                                      >
                                        <div style={{}}>{x.size}</div>
                                      </option>
                                    );
                                  })}
                              </Field>
                            </div>
                            <div className="flex items-center">
                              <label>Quantity</label>
                              <Field
                                type="number"
                                min={0}
                                name={"quantity" + indexInList}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                style={{ height: 40, padding: 10 }}
                                defaultValue={
                                  productDetails[indexInList]?.quantity
                                }
                                onChange={(e) => {
                                  productDetails[indexInList].quantity =
                                    e.target.value;
                                  setProductDetails(productDetails);
                                }}
                              />
                              <div className="text-red-600">
                                {touched[`quantity${indexInList}`] &&
                                  errors[`quantity${indexInList}`]}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <label>Price</label>
                              <Field
                                type="number"
                                min={0}
                                name={"price" + indexInList}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                style={{ height: 40, padding: 10 }}
                                defaultValue={
                                  productDetails[indexInList]?.price
                                }
                                onChange={(e) => {
                                  productDetails[indexInList].price =
                                    e.target.value;
                                  setProductDetails(productDetails);
                                }}
                              />
                              <div className="text-red-600">
                                {touched[`price${indexInList}`] &&
                                  errors[`price${indexInList}`]}
                              </div>
                            </div>
                            <div>
                              {/* <label>Images:</label> */}
                              <form style={{ display: "flex" }}>
                                <button
                                  style={{
                                    backgroundColor: "#733939ab",
                                    borderRadius: "5px",
                                    marginLeft: "15px",
                                    height: 40,
                                    width: 70,
                                    padding: "10px",
                                    visibility:
                                      productDetails.length > 1
                                        ? "none"
                                        : "hidden",
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.cursor = "pointer";
                                    e.currentTarget.style.backgroundColor =
                                      "#7339395c";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#733939ab";
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteProductDetail(indexInList);
                                  }}
                                >
                                  Cancel
                                </button>
                              </form>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdate(values);
                        }}
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
            size="7xl"
            popup={true}
            onClose={(e) => {
              e.preventDefault();
              setVisibleAdd(false);
            }}
          >
            <Modal.Header>
              <div className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Add new Product
              </div>
            </Modal.Header>
            <Modal.Body>
              <Formik
                enableReinitialize
                initialValues={{
                  ...product,
                  name: "",
                  category: categories[0]?.id,
                  description: "",
                  image: "",
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
                        <label>Image</label>
                        <Field
                          type="text"
                          name={"image"}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          value={values.image}
                        ></Field>
                        <div className="text-red-600">
                          {errors.image && touched.image}
                        </div>
                      </div>
                      <div>
                        <label>Product Name</label>
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
                      <div>
                        <label>Category</label>
                        <Field
                          as="select"
                          type="text"
                          name="category"
                          defaultValue={values.category}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 "
                          value={values.category}
                        >
                          {categories.map((x) => (
                            <option key={x.id} value={x.id}>
                              {x.name}
                            </option>
                          ))}
                        </Field>
                        <div className="text-red-600">
                          {errors.category &&
                            touched.category &&
                            errors.category}
                        </div>
                      </div>
                    </div>
                    <div
                      className="grid grid-cols-2 gap-2"
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            textDecoration: "underline",
                            fontStyle: "italic",
                          }}
                        >
                          Choose Size and Color:
                        </span>
                      </div>{" "}
                      <div style={{ textAlign: "right" }}>
                        <button
                          style={{
                            backgroundColor: "#30443870",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.cursor = "pointer";
                            e.currentTarget.style.backgroundColor = "#304438a5";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#30443870";
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddProductDetail();
                          }}
                        >
                          Add Detail +
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "scroll",
                        display: "grid",
                      }}
                    >
                      {productDetails.map((detail, indexInList) => (
                        <>
                          <div>Product Detail {indexInList + 1}</div>
                          <div className="grid grid-cols-5 gap-2">
                            <div>
                              {/* <label>Size {indexInList + 1}</label> */}
                              <Field
                                id="select-size"
                                as="select"
                                type="text"
                                name={`size` + (indexInList + 1)}
                                defaultValue={detail.size}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 custom-select select"
                                onChange={(e) => {
                                  productDetails[indexInList].size = parseInt(
                                    e.target.value
                                  );
                                  setProductDetails(productDetails);
                                }}
                              >
                                {sizes
                                  .filter((c) => c.status)
                                  .map((x) => {
                                    return (
                                      <option
                                        onMouseEnter={() => {
                                          document.getElementById(
                                            "select-size"
                                          ).style.borderLeft = `100px solid ${"black !important"}`;
                                        }}
                                        className="select-items"
                                        key={x.id}
                                        value={x.id}
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          height: "100%",
                                          backgroundColor: "white",
                                          padding: "15px !important",
                                          margin: "5px",
                                          border: "100px solid white",
                                          lineHeight: "50px",
                                          fontSize: "18px",
                                          borderRadius: "5px",
                                        }}
                                      >
                                        <div style={{}}>{x.size}</div>
                                      </option>
                                    );
                                  })}
                              </Field>
                            </div>
                            <div className="flex items-center">
                              <label>Quantity</label>
                              <Field
                                type="number"
                                min={0}
                                name={"quantity" + indexInList}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                style={{ height: 40, padding: 10 }}
                                defaultValue={
                                  productDetails[indexInList]?.quantity
                                }
                                onChange={(e) => {
                                  productDetails[indexInList].quantity =
                                    e.target.value;
                                  setProductDetails(productDetails);
                                }}
                              />
                              <div className="text-red-600">
                                {touched[`quantity${indexInList}`] &&
                                  errors[`quantity${indexInList}`]}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <label>Price</label>
                              <Field
                                type="number"
                                min={0}
                                name={"price" + indexInList}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                style={{ height: 40, padding: 10 }}
                                defaultValue={
                                  productDetails[indexInList]?.price
                                }
                                onChange={(e) => {
                                  productDetails[indexInList].price =
                                    e.target.value;
                                  setProductDetails(productDetails);
                                }}
                              />
                              <div className="text-red-600">
                                {touched[`price${indexInList}`] &&
                                  errors[`price${indexInList}`]}
                              </div>
                            </div>
                            <div>
                              {/* <label>Images:</label> */}
                              <form style={{ display: "flex" }}>
                                <button
                                  style={{
                                    backgroundColor: "#733939ab",
                                    borderRadius: "5px",
                                    marginLeft: "15px",
                                    height: 40,
                                    width: 70,
                                    padding: "10px",
                                    visibility:
                                      productDetails.length > 1
                                        ? "none"
                                        : "hidden",
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.cursor = "pointer";
                                    e.currentTarget.style.backgroundColor =
                                      "#7339395c";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#733939ab";
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteProductDetail(indexInList);
                                  }}
                                >
                                  Cancel
                                </button>
                              </form>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAdd(values);
                        }}
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

export default ProductManaPageAdmin;
