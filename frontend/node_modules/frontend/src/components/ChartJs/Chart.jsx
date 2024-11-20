/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import Chart from "chart.js/auto";
import { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
const CustomChart = ({ transactions = [], currentAccount = {} }) => {
  const [data, setData] = useState({ datasets: [] });
  const [dataUse, setDataUse] = useState({ datasets: [] });
  const [options, setOptions] = useState(null);
  const timeOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  };
  useEffect(() => {
    let dataInDatasets = [currentAccount.balance];
    let dataDepositInDatasets = [0];
    let dataWithdrawInDatasets = [0];
    let dataTransferInDatasets = [0];
    const sortTransactions = transactions.sort(
      (a, b) => new Date(b.transactionTime) - new Date(a.transactionTime)
    );
    sortTransactions.map((transaction) => {
      dataDepositInDatasets = [
        transaction.transactionType === "DEPOSIT" ? transaction.amount : 0,
        ...dataDepositInDatasets,
      ];
      dataWithdrawInDatasets = [
        transaction.transactionType === "WITHDRAW" ? transaction.amount : 0,
        ...dataWithdrawInDatasets,
      ];
      dataTransferInDatasets = [
        transaction.transactionType === "TRANSFER" ? transaction.amount : 0,
        ...dataTransferInDatasets,
      ];
      if (
        transaction.transactionType === "DEPOSIT" ||
        (transaction.transactionType === "TRANSFER" &&
          transaction.senderAccountNumber !== currentAccount.accountNumber)
      ) {
        dataInDatasets = [
          dataInDatasets[0] - transaction.amount,
          ...dataInDatasets,
        ];
      } else if (
        transaction.transactionType === "WITHDRAW" ||
        (transaction.transactionType === "TRANSFER" &&
          transaction.senderAccountNumber === currentAccount.accountNumber)
      )
        dataInDatasets = [
          dataInDatasets[0] + transaction.amount,
          ...dataInDatasets,
        ];
    });
    const labels = [
      0,
      ...sortTransactions
        .sort((a, b) => b - a)
        .map((transaction) =>
          new Date(transaction.transactionTime).toLocaleString(
            "vi-VN",
            timeOptions
          )
        ),
    ];
    setData({
      labels: labels,
      datasets: [
        {
          label: "Balance",
          fill: true,
          lineTension: 0.2,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [5, 1],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataInDatasets,
          hidden: false,
        },
        {
          label: "Deposit",
          fill: true,
          lineTension: 0.2,
          backgroundColor: "rgba(120,120,255,0.4)",
          borderColor: "rgba(120,120,255,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(120,120,255,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(120,120,255,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataDepositInDatasets,
          hidden: false,
        },
        {
          label: "Withdraw",
          fill: true,
          lineTension: 0.2,
          backgroundColor: "rgba(255,120,120,0.4)",
          borderColor: "rgba(255,120,120,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(255,120,120,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(255,120,120,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataWithdrawInDatasets,
          hidden: false,
        },
        {
          label: "Transfer/Credited",
          fill: true,
          lineTension: 0.2,
          backgroundColor: "rgba(255,255,120,0.4)",
          borderColor: "rgba(255,255,120,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(255,255,120,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(255,255,120,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 3,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataTransferInDatasets,
          hidden: false,
        },
      ],
    });
    setOptions({
      scales: {
        x: {
          type: "category",
          labels: labels,
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
  }, [transactions]);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [depositVisible, setDepositVisible] = useState(true);
  const [withdrawVisible, setWithdrawVisible] = useState(true);
  const [transferVisible, setTransferVisible] = useState(true);
  useEffect(() => {
    let filter = [];
    if (balanceVisible) filter = [...filter, "Balance"];
    if (depositVisible) filter = [...filter, "Deposit"];
    if (withdrawVisible) filter = [...filter, "Withdraw"];
    if (transferVisible) filter = [...filter, "Transfer/Credited"];
    setDataUse({
      ...data,
      datasets: data?.datasets.filter((dataset) =>
        filter.includes(dataset.label)
      ),
    });
  }, [balanceVisible, depositVisible, withdrawVisible, transferVisible, data]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "600px",
          margin: "0 auto",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={() => setBalanceVisible(!balanceVisible)}
          onMouseOver={(e) => (e.target.style.cursor = "pointer")}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: "50px",
              height: "15px",
              backgroundColor: "rgba(75,192,192,0.4)",
              border: "1px solid rgba(75,120,120,1)",
              marginRight: 5,
            }}
          ></div>
          <span
            style={{
              textDecoration: !balanceVisible ? "line-through" : "unset",
            }}
          >
            Balance
          </span>
        </div>
        <div
          onClick={() => setDepositVisible(!depositVisible)}
          onMouseOver={(e) => (e.target.style.cursor = "pointer")}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: "50px",
              height: "15px",
              backgroundColor: "rgba(120,120,255,0.4)",
              border: "1px solid rgba(120,120,255,1)",
              marginRight: 5,
            }}
          ></div>
          <span
            style={{
              textDecoration: !depositVisible ? "line-through" : "unset",
            }}
          >
            Deposit
          </span>
        </div>
        <div
          onClick={() => setWithdrawVisible(!withdrawVisible)}
          onMouseOver={(e) => (e.target.style.cursor = "pointer")}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: "50px",
              height: "15px",
              backgroundColor: "rgba(255,120,120,0.4)",
              border: "1px solid rgba(255,120,120,1)",
              marginRight: 5,
            }}
          ></div>
          <span
            style={{
              textDecoration: !withdrawVisible ? "line-through" : "unset",
            }}
          >
            Withdraw
          </span>
        </div>
        <div
          onClick={() => setTransferVisible(!transferVisible)}
          onMouseOver={(e) => (e.target.style.cursor = "pointer")}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: "50px",
              height: "15px",
              backgroundColor: "rgba(255,255,120,0.4)",
              border: "1px solid rgba(255,255,120,1)",
              marginRight: 5,
            }}
          ></div>
          <span
            style={{
              textDecoration: !transferVisible ? "line-through" : "unset",
            }}
          >
            Transfer/Credited
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          margin: "10px 0px",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <div
          style={{ width: "55%", display: "flex", justifyContent: "center" }}
        >
          {dataUse && options && <Line data={dataUse} options={options} />}
        </div>
        <div
          style={{ width: "27%", display: "flex", justifyContent: "center" }}
        >
          {dataUse && options && <Doughnut data={dataUse} options={options} />}
        </div>
      </div>
      <h4>
        The chart shows the account balance according to the currently queried
        transactions
      </h4>
    </div>
  );
};

export default CustomChart;
