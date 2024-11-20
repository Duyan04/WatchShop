/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";
import { Carousel } from "flowbite-react";

import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { Radio } from "flowbite-react";
import "./css/productPage.scss";
import {
  readCategoryById,
  readProductById,
  readSize,
  writeOrderDetailInCart,
} from "../../services/api";

// eslint-disable-next-line react/prop-types
function ProductPage({ setCountOrder, countOrder }) {
  window.scrollTo(0, 0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { idProduct, nameProduct } = useParams();
  const [product, setProduct] = useState({});
  // const orders = useSelector((state) => state.order.orders);
  // const [orderDetailsInCart, setOrderDetailsInCart] = useState([]);

  const [change, setChange] = useState(0);
  // const desc = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];
  const [productDetail, setProductDetail] = useState({});
  const [category, setCategory] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [currentSizes, setCurrentSizes] = useState([]);
  useEffect(() => {
    readProductById(idProduct).then((res) => setProduct(res.data));
    readSize().then((res) => setSizes(res.data));
  }, []);
  useEffect(() => {
    if (product?.category)
      readCategoryById(product?.category).then((res) => setCategory(res.data));
  }, [product]);
  useEffect(() => {
    setProductDetail(
      product?.productDetails?.find(
        (pd) => pd.size == size
      )
    );
    setCurrentSizes(
      Array.from(
        new Set(
          product?.productDetails
            ?.map((pd) => sizes?.find((s) => s?.id == pd?.size && s.status)) ||
          []
        )
      )
    );
  }, [size, sizes, product]);
  function handleAddToCard() {
    if (size === "") {
      toast.error("Please select product size!", {
        autoClose: 1000,
      });
    } else if (productDetail.quantity === 0) {
      toast.error("Product out of stock!", {
        autoClose: 1000,
      });
    } else if (quantity > parseInt(productDetail.quantity)) {
      toast.error("Product is not enough!", {
        autoClose: 1000,
      });
    } else {
      if (currentUser) {
        writeOrderDetailInCart({
          customer: parseInt(currentUser.id),
          product: parseInt(idProduct),
          size: parseInt(size),
          quantity: parseInt(quantity),
          status: true,
          check: currentUser.checkAll,
        }).then((result) => {
          if (result.data === 2) setCountOrder(countOrder + 1);
          if (result.status === "ok") {
            toast.success("Add to cart successfully", {
              autoClose: 1000,
            });
          } else
            toast.error("Add to cart failed. " + result, {
              autoClose: 1000,
            });
        });
      } else {
        if (!sessionStorage.getItem("checkAll"))
          sessionStorage.setItem("checkAll", true);
        const orderDetailInCart =
          JSON.parse(sessionStorage.getItem("orderDetailInCart")) ?? [];
        const orderDetail = orderDetailInCart.find(
          (x) => x.product == idProduct && x.size == size
        );
        if (orderDetail) {
          sessionStorage.setItem(
            "orderDetailInCart",
            JSON.stringify(
              orderDetailInCart.map((x) => {
                if (
                  x.product == idProduct &&
                  x.size == size
                )
                  x.quantity = parseInt(x.quantity) + parseInt(quantity);
                return x;
              })
            )
          );
          toast.success("Add to cart successfully", {
            autoClose: 1000,
          });
        } else {
          sessionStorage.setItem(
            "orderDetailInCart",
            JSON.stringify([
              {
                customer: 0,
                product: parseInt(idProduct),
                size: parseInt(size),
                quantity: parseInt(quantity),
                status: true,
                check: JSON.parse(sessionStorage.getItem("checkAll") ?? false),
              },
              ...orderDetailInCart,
            ])
          );
          setCountOrder(countOrder + 1);
          toast.success("Add to cart successfully", {
            autoClose: 1000,
          });
        }
        setChange(change + 1);
      }
    }
  }

  return (
    <div className="text-slate-800 ">
      <div>
        <div
          className="bg-slate-100"
          style={{
            padding: "10px 20px",
            textAlign: "center",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
                  <Link
                    to={false}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    {nameProduct}
                  </Link>
                </div>
              </li>
            </ol>
          </nav>
          <div className="product-detail">
            {
              <div
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "50vw",
                  // maxHeight: "800px"
                  background: "#67666673",
                }}
              >
                <Carousel style={{ width: "100%", height: "600px" }}>
                  {product?.image && (
                    <img
                      style={{ objectFit: "cover" }}
                      src={product?.image}
                      alt={product?.name}
                    />
                  )}
                </Carousel>
              </div>
            }

            <div
              className="col-start-3 col-end-6 px-6 pt-6"
              style={{ textAlign: "left" }}
            >
              <div
                className="font-bold mt-2"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div style={{ marginRight: 15 }}>Price:</div>
                {size ? (
                  productDetail?.discount > 0 ? (
                    <p>
                      US${" "}
                      <strike className="text-slate-400">
                        {productDetail.price?.toLocaleString()}
                      </strike>
                      <span className="px-2 text-red-600 ">
                        {(
                          productDetail.price -
                          (productDetail.price * productDetail.discount) / 100
                        ).toLocaleString()}
                      </span>
                    </p>
                  ) : (
                    <div>
                      US${" "}
                      <span className="text-red-600">
                        {productDetail?.price?.toLocaleString()}
                      </span>
                    </div>
                  )
                ) : (
                  <div>
                    <span className="text-red-600">
                      Please choose Size to Show Price
                    </span>
                  </div>
                )}
              </div>
              <div className="my-3">{product?.description}</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginRight: 15 }}>
                  <span className="font-bold">Category:</span>
                </div>

                <div> {category?.name}</div>
              </div>
              <div className="my-4 h-8">
                <span className="font-bold">
                  Size :{" "}
                  <div
                    style={{
                      display: "inline-block",
                      overflowX: "scrollX",
                      maxWidth: "100%",
                      height: "50px",
                    }}
                  >
                    {currentSizes
                      ?.sort((a, b) => a.size - b.size)
                      .map((x) => (
                        <span key={"size-" + x?.id} className="px-2">
                          <Radio
                            id={"size-" + x?.id}
                            onChange={(e) => setSize(e.target.value)}
                            name="size"
                            className="hidden peer"
                            value={x?.id}
                          />
                          <label
                            htmlFor={"size-" + x?.id}
                            className="w-1/2 p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-gray-500 peer-checked:bg-black peer-checked:text-white hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                          >
                            {x?.size}
                          </label>
                        </span>
                      ))}
                  </div>
                </span>
              </div>
              {/* <div>
              <span className="font-bold">Status</span> :{" "}
              {product.status === 1 ? "Stocking" : "Sold out"}
            </div> */}
              <div
                className="mt-3 grid grid-cols-2"
                style={{ alignItems: "center" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <span className="font-bold">Quantity:</span>
                  </div>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="flex justify-left items-center">
                  {productDetail?.quantity !== 0
                    ? `${productDetail?.quantity || ""} pieces available`
                    : "Out of stock"}
                </div>
              </div>
              <div className="mt-6">
                <button
                  className={`${"text-white w-full bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"} `}
                  onClick={() => handleAddToCard()}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
