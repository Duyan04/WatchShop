/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import LayoutManager from "../../components/LayoutManager";
import {
  readCategory,
  readOrder,
  readProduct,
  readUser,
} from "../../services/api";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faSackDollar,
  faShoePrints,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Doughnut, Line, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

function DashboardPageAdmin() {
  const [products, setProducts] = useState([]);
  const [productSold, setProductSold] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorySold, setCategorySold] = useState([]);
  const [dataUse, setDataUse] = useState({ datasets: [] });
  const [data, setData] = useState({ datasets: [] });
  const [options, setOptions] = useState(null);
  useEffect(() => {
    readProduct().then((res) => setProducts(res.data));
    readOrder().then((res) => setOrders(res.data));
    readUser().then((res) => setUsers(res.data));
    readCategory().then((res) => setCategories(res.data));
  }, []);

  const [orderData, setOrderData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  useEffect(() => {
    let orderObject = {};
    let revenueObject = {};
    let minTime = new Date();
    let maxTime = new Date("2000-01-01T00:00");
    let categoryQuantitySold = categories.map((c) => {
      return {
        id: c.id,
        name: c.name,
        quantitySold: 0,
      };
    });
    let productQuantitySold = products.map((c) => {
      return {
        id: c.id,
        name: c.name,
        quantitySold: 0,
      };
    });
    orders?.forEach((o) => {
      const currentDate = new Date(o.createdDate);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      if (currentDate > maxTime) maxTime = currentDate;
      if (currentDate < minTime) minTime = currentDate;

      if (orderObject[`${month}/${year}`]) {
        orderObject[`${month}/${year}`] =
          parseInt(orderObject[`${month}/${year}`]) + 1;
      } else {
        orderObject[`${month}/${year}`] = 1;
      }
      if (revenueObject[`${month}/${year}`]) {
        revenueObject[`${month}/${year}`] =
          revenueObject[`${month}/${year}`] + o.total;
      } else {
        revenueObject[`${month}/${year}`] = o.total;
      }

      o.orderDetails?.forEach((orderDetail) => {
        categoryQuantitySold = categoryQuantitySold.map((cqs) => {
          if (cqs?.id == orderDetail?.category?.id)
            cqs.quantitySold =
              cqs.quantitySold + parseInt(orderDetail.quantity ?? 0);
          return cqs;
        });
        productQuantitySold = productQuantitySold.map((pqs) => {
          if (pqs?.id == orderDetail?.product?.id)
            pqs.quantitySold += parseInt(orderDetail.quantity ?? 0);
          return pqs;
        });
      });
    });
    setProductSold(productQuantitySold);
    setCategorySold(categoryQuantitySold);
    let productObject = {};
    products.forEach((o) => {
      const currentDate = new Date(o.createdDate);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      if (currentDate > maxTime) maxTime = currentDate;
      if (currentDate < minTime) minTime = currentDate;
      if (productObject[`${month}/${year}`])
        productObject[`${month}/${year}`] =
          parseInt(productObject[`${month}/${year}`]) + 1;
      else productObject[`${month}/${year}`] = 1;
    });
    let userObject = {};
    users.forEach((o) => {
      const currentDate = new Date(o.createdDate);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      if (currentDate > maxTime) maxTime = currentDate;
      if (currentDate < minTime) minTime = currentDate;
      if (userObject[`${month}/${year}`])
        userObject[`${month}/${year}`] =
          parseInt(userObject[`${month}/${year}`]) + 1;
      else userObject[`${month}/${year}`] = 1;
    });
    let orderDataCurrent = [];
    let revenueDataCurrent = [];
    let productDataCurrent = [];
    let userDataCurrent = [];
    let labelCurrent = [];

    for (let i = minTime.getFullYear(); i <= maxTime.getFullYear(); i++) {
      for (
        let j = i === minTime.getFullYear() ? minTime.getMonth() + 1 : 1;
        j <= (i === maxTime.getFullYear() ? maxTime.getMonth() + 1 : 12);
        j++
      ) {
        const prop = `${j}/${i}`;
        if (
          orderObject[prop] ||
          productObject[prop] ||
          userObject[prop] ||
          revenueObject[prop]
        ) {
          orderDataCurrent.push(orderObject[prop] ?? 0);
          revenueDataCurrent.push(revenueObject[prop] ?? 0);
          productDataCurrent.push(
            (productObject[prop] ?? 0) +
              (productDataCurrent[productDataCurrent.length - 1] ?? 0)
          );

          userDataCurrent.push(
            (userObject[prop] ?? 0) +
              (userDataCurrent[userDataCurrent.length - 1] ?? 0)
          );

          labelCurrent.push(`Month ${prop}`);
        }
      }
    }
    const length = labelCurrent.length;
    const nowDate = new Date();
    const prop = `Month ${nowDate.getMonth() + 1}/${nowDate.getFullYear()}`;
    if (!labelCurrent.includes(prop)) {
      userDataCurrent.push(0);
      productDataCurrent.push(0);
      revenueDataCurrent.push(0);
      orderDataCurrent.push(0);
      labelCurrent.push(prop);
    }

    setData({
      labels: labelCurrent,
      datasets: [
        {
          label: "Revenue",
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(14, 159, 110,0.4)",
          borderColor: "rgba(14, 159, 110,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(14, 159, 110,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(14, 159, 110,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: revenueDataCurrent,
          hidden: false,
        },
        {
          label: "Order",
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(240,82,82,0.4)",
          borderColor: "rgba(240,82,82,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(240,82,82,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(240,82,82,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: orderDataCurrent,
          hidden: false,
        },
        {
          label: "User",
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(194,120,3,0.4)",
          borderColor: "rgba(194,120,3,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(194,120,3,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(194,120,3,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: userDataCurrent,
          hidden: false,
        },

        {
          label: "Product",
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(63,131,248,0.4)",
          borderColor: "rgba(63,131,248,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(63,131,248,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(63,131,248,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: productDataCurrent,
          hidden: false,
        },
      ],
    });
    setOptions({
      scales: {
        x: {
          type: "category",
          labels: labelCurrent,
          grid: {
            display: true,
          },
          display: false,
        },
        y: {
          grid: {
            display: true,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
          position: "top",
          labels: {
            generateLabels: (chart) => {
              const labels = [];
              const datasets = chart.data.datasets;
              for (let i = 0; i < datasets.length; i++) {
                labels.push({
                  text: datasets[i].label,
                  fillStyle: datasets[i].backgroundColor,
                  strokeStyle: datasets[i].borderColor,
                });
              }
              return labels;
            },
          },
        },
      },
    });
    setUserData(userDataCurrent);
    setOrderData(orderDataCurrent);
    setProductData(productDataCurrent);
    setRevenueData(revenueDataCurrent);
  }, [orders, products, users]);
  const calculatorOrder = () => {
    return parseInt(
      ((orderData[orderData.length - 1] ?? 0) /
        (orderData[orderData.length - 2] === 0
          ? 1
          : orderData[orderData.length - 2] ?? 1)) *
        100 ?? 0
    );
  };
  const calculatorProduct = () => {
    return parseInt(
      (((productData[productData.length - 1] ?? 0) -
        (productData[productData.length - 2] ?? 0)) /
        (productData[productData.length - 2] === 0
          ? 1
          : productData[productData.length - 2] ?? 1)) *
        100 ?? 0
    );
  };
  const calculatorUser = () => {
    return parseInt(
      (((userData[userData.length - 1] ?? 0) -
        (userData[userData.length - 2] ?? 0)) /
        (userData[userData.length - 2] === 0
          ? 1
          : userData[userData.length - 2] ?? 1)) *
        100 ?? 0
    );
  };
  const calculatorRevenue = () => {
    return (
      ((revenueData[revenueData.length - 1] ?? 0) /
        (revenueData[revenueData.length - 2] === 0
          ? 1
          : revenueData[revenueData.length - 2] ?? 1)) *
        100 ?? 0
    );
  };
  const [orderVisible, setOrderVisible] = useState(true);
  const [productVisible, setProductVisible] = useState(true);
  const [userVisible, setUserVisible] = useState(true);
  const [revenueVisible, setRevenueVisible] = useState(true);
  useEffect(() => {
    let filter = [];
    if (orderVisible) filter = [...filter, "Order"];
    if (productVisible) filter = [...filter, "Product"];
    if (userVisible) filter = [...filter, "User"];
    if (revenueVisible) filter = [...filter, "Revenue"];
    setDataUse({
      ...data,
      datasets: data?.datasets.filter((dataset) =>
        filter.includes(dataset.label)
      ),
    });
  }, [orderVisible, productVisible, userVisible, revenueVisible, data]);

  const generateRandomColorArray = (length) => {
    let arr = [];
    for (let i = 0; i < length; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const alpha = 0.4; // Có thể điều chỉnh độ trong suốt ở đây

      arr.push(
        // [
        `rgba(${r}, ${g}, ${b}, ${alpha})`
        //   `rgba(${r}, ${g}, ${b}, ${alpha})`,
        // ]
      );
    }
    return arr;
  };
  return (
    <>
      <div className="font-bold">Dashboard Page</div>

      <div className="col-start-2 col-end-4 p-4">
        {/* <p className="pb-4">Tổng quan số liệu</p> */}
        <div className="grid grid-cols-4 gap-5 pb-5">
          <div className="border rounded-md px-6 py-3 h-28 flex justify-around bg-gray-300">
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center items-center  text-xl text-green-500">
                <FontAwesomeIcon icon={faSackDollar} />
              </div>
              <div className="flex justify-center items-center text-xl text-green-500">
                {orders?.length?.toLocaleString()}
              </div>
              <div className="flex justify-center items-center text-2xl font-bold text-green-500">
                Revenue
              </div>
            </div>
            <div className="flex flex-col justify-between items-center text-2xl font-bold text-green-500">
              <div className="h-10 w-10">
                <CircularProgressbar
                  value={calculatorRevenue()}
                  styles={buildStyles({
                    pathColor: "#0e9f6e",
                    trailColor: "#a9a4a8",
                    strokeLinecap: "butt",
                    pathTransitionDuration: 1,
                    pathTransitionTimingFunction: "linear",
                  })}
                  strokeWidth={15}
                />
              </div>
              <div className="text-xl italic text-green-500">
                +
                {((revenueData[revenueData.length - 1] ?? 0) -
                  (revenueData[revenueData.length - 2] ?? 0) <
                0
                  ? 0
                  : (revenueData[revenueData.length - 1] ?? 0) -
                    (revenueData[revenueData.length - 2] ?? 0)
                ).toLocaleString()}
                $
              </div>
            </div>
          </div>
          <div className="border rounded-md px-6 py-3 h-28 flex justify-around align-center bg-gray-300">
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center items-center  text-xl text-red-500">
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
              <div className="flex justify-center items-center text-xl text-red-500">
                {orders?.length?.toLocaleString()}
              </div>
              <div className="flex justify-center items-center text-2xl font-bold text-red-500">
                Order
              </div>
            </div>

            <div className="flex flex-col justify-between items-center text-2xl font-bold text-red-500">
              <div className="h-10 w-10">
                <CircularProgressbar
                  value={calculatorOrder()}
                  styles={buildStyles({
                    pathColor: "#f05252",
                    trailColor: "#a9a4a8",
                    strokeLinecap: "butt",
                    pathTransitionDuration: 1,
                    pathTransitionTimingFunction: "linear",
                  })}
                  strokeWidth={15}
                />
              </div>
              <div className="text-xl text-red-500 italic">
                +
                {(orderData[orderData.length - 1] ?? 0) -
                  (orderData[orderData.length - 2] ?? 0) <
                0
                  ? 0
                  : (orderData[orderData.length - 1] ?? 0) -
                    (orderData[orderData.length - 2] ?? 0)}{" "}
                order
              </div>
            </div>
          </div>
          <div className="border rounded-md px-6 py-3 h-28 flex justify-around  bg-gray-300">
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center items-center  text-xl text-blue-500">
                <FontAwesomeIcon icon={faShoePrints} />
              </div>
              <div className="flex justify-center items-center text-xl text-blue-500">
                {orders?.length?.toLocaleString()}
              </div>
              <div className="flex justify-center items-center text-2xl font-bold text-blue-500">
                Product
              </div>
            </div>
            <div className="flex flex-col justify-between items-center text-2xl font-bold text-blue-500">
              <div className="h-10 w-10">
                <CircularProgressbar
                  value={calculatorProduct()}
                  styles={buildStyles({
                    pathColor: "#3f83f8",
                    trailColor: "#a9a4a8",
                    strokeLinecap: "butt",
                    pathTransitionDuration: 1,
                    pathTransitionTimingFunction: "linear",
                  })}
                  strokeWidth={15}
                />
              </div>
              <div className="text-xl text-blue-500 italic">
                +{calculatorProduct()}%
              </div>
            </div>
          </div>
          <div className="border rounded-md px-6 py-3 h-28 flex justify-around  bg-gray-300">
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center items-center  text-xl text-yellow-500">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="flex justify-center items-center text-xl text-yellow-500">
                {users?.length?.toLocaleString()}
              </div>
              <div className="flex justify-center items-center text-2xl font-bold text-yellow-500">
                User
              </div>
            </div>
            <div className="flex flex-col justify-between items-center text-2xl font-bold text-yellow-500">
              <div className="h-10 w-10">
                <CircularProgressbar
                  value={calculatorUser()}
                  styles={buildStyles({
                    pathColor: "#f2ad41",
                    trailColor: "#a9a4a8",
                    strokeLinecap: "butt",
                    pathTransitionDuration: 1,
                    pathTransitionTimingFunction: "linear",
                  })}
                  strokeWidth={15}
                />
              </div>
              <div className="text-xl text-yellow-500 italic">
                +{calculatorUser()}%
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 border rounded-md px-6 py-3 h-200 flex justify-around bg-gray-300">
            <div
              style={{
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "600px",
                  margin: "0 auto",
                  justifyContent: "space-between",
                }}
              >
                <div
                  onClick={() => setRevenueVisible(!revenueVisible)}
                  onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "15px",
                      backgroundColor: "rgba(14, 159, 110,0.4)",
                      border: "1px solid rgba(14, 159, 110,1)",
                      marginRight: 5,
                    }}
                  ></div>
                  <span
                    style={{
                      textDecoration: !revenueVisible
                        ? "line-through"
                        : "unset",
                    }}
                  >
                    Revenue
                  </span>
                </div>
                <div
                  onClick={() => setOrderVisible(!orderVisible)}
                  onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "15px",
                      backgroundColor: "rgba(240,82,82,0.4)",
                      border: "1px solid rgba(240,82,82,1)",
                      marginRight: 5,
                    }}
                  ></div>
                  <span
                    style={{
                      textDecoration: !orderVisible ? "line-through" : "unset",
                    }}
                  >
                    Order
                  </span>
                </div>
                <div
                  onClick={() => setProductVisible(!productVisible)}
                  onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "15px",
                      backgroundColor: "rgba(63,131,248,0.4)",
                      border: "1px solid rgba(63,131,248,1)",
                      marginRight: 5,
                    }}
                  ></div>
                  <span
                    style={{
                      textDecoration: !productVisible
                        ? "line-through"
                        : "unset",
                    }}
                  >
                    Product
                  </span>
                </div>
                <div
                  onClick={() => setUserVisible(!userVisible)}
                  onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "15px",
                      backgroundColor: "rgba(194,120,3,0.4)",
                      border: "1px solid rgba(194,120,3,1)",
                      marginRight: 5,
                    }}
                  ></div>
                  <span
                    style={{
                      textDecoration: !userVisible ? "line-through" : "unset",
                    }}
                  >
                    User
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  margin: "10px 0px",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "60%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {dataUse && options && (
                    <Line data={dataUse} options={options} />
                  )}
                </div>
                <div
                  style={{
                    width: "30%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {dataUse && options && (
                    <Doughnut data={dataUse} options={options} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded-md px-6 py-3 h-200 flex justify-around bg-gray-300">
            <div style={{ width: "100%" }}>
              <div>
                <Pie
                  data={{
                    labels: categorySold.map((cs) => cs.name),
                    datasets: [
                      {
                        label: "Category Quantity Sold",
                        // backgroundColor: "rgba(14, 159, 110,0.4)",
                        backgroundColor: generateRandomColorArray(
                          categories.length
                        ),
                        // ["rgba(14, 159, 110,0.4)"],
                        borderColor: "rgba(14, 159, 110,1)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgba(14, 159, 110,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 3,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(14, 159, 110,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 3,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: categorySold.map((cs) => cs.quantitySold),
                        // hidden: false,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      x: {
                        type: "category",
                        labels: categorySold.map((cs) => cs.name),
                        grid: {
                          display: true,
                        },
                        display: false,
                      },
                      y: {
                        grid: {
                          display: true,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                        labels: {
                          generateLabels: (chart) => {
                            const labels = [];
                            const datasets = chart.data;
                            for (let i = 0; i < datasets.labels.length; i++) {
                              if (datasets.labels[i]) {
                                labels.push({
                                  text: datasets.labels[i],
                                  fillStyle:
                                    datasets.datasets[0].backgroundColor[i],
                                  strokeStyle:
                                    datasets.datasets[0].borderColor[i],
                                });
                              }
                            }
                            return labels;
                          },
                        },
                      },
                    },
                  }}
                  style={{ maxHeight: 350 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border bottom-2 rounded-md col-start-1 col-end-5">
        <div className="py-2 font-bold">Product sales status</div>
        <div className="relative overflow-x-auto overflow-y-auto h-80 shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Product
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity Sold
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity Remaining
                </th>
              </tr>
            </thead>
            <tbody>
              {products
                ?.filter((x) => x)
                .sort((a, b) => b.id - a.id)
                .map((x) => {
                  let quantity = 0;
                  const xPrice = x?.productDetails
                    ?.map((pd) => {
                      quantity += pd.quantity;
                      return pd.price;
                    })
                    ?.sort((a, b) => a - b);
                  return (
                    <tr
                      key={x?.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4">{x?.id}</td>
                      <td className="px-6 py-4">{x?.name}</td>
                      <td className="px-6 py-4">
                        {categories?.find((c) => c?.id == x?.category)?.name}
                      </td>
                      <td className="px-6 py-4">
                        {xPrice?.length > 0 &&
                        xPrice[0] !== xPrice[xPrice.length - 1].toLocaleString()
                          ? xPrice[0].toLocaleString() +
                            "$ - " +
                            xPrice[xPrice.length - 1].toLocaleString() +
                            "$"
                          : (xPrice?.length > 0
                              ? xPrice[0]
                              : 0
                            ).toLocaleString() + "$"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {
                          productSold.find((pqs) => pqs?.id === x?.id)
                            ?.quantitySold
                        }
                      </td>
                      <td className="px-6 py-4 text-center">{quantity}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default DashboardPageAdmin;
