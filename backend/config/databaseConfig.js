const sql = require("mssql");

// SQL Server configuration
const config = {
  user: "sa",
  password: "sa",
  server: "DESKTOP-NCTBDBN",
  database: "WatchShop_AN",
  options: {
    encrypt: false, // Tắt SSL
  },
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Connect to SQL Server
sql.connect(config, (err) => {
  if (err) {
    console.error("Error connecting to SQL Server: ", err);
  } else {
    console.log("Connected to SQL Server");
  }
});
module.exports = sql;
