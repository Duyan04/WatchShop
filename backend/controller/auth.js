const moment = require("moment/moment");
const sql = require("../config/databaseConfig");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { username, password } = req.body;
  const request = new sql.Request();

  // Execute a SQL query
  request.query(
    `SELECT * FROM Users WHERE username = '${username}'`,
    (err, result) => {
      if (err) {
        res.status(200).json({ status: "error", error: "Database error" });
      } else {
        const user = result.recordset[0] || null;
        if (!user) {
          return res.status(200).json({
            status: "failed",
            message: "Username not found",
          });
        }
        if (!user.status)
          return res
            .status(200)
            .json({ status: "failed", message: "User is Disabled" });
        if (!bcrypt.compareSync(password, user.password)) {
          return res
            .status(200)
            .json({ status: "failed", message: "Password Incorrect" });
        }

        res
          .status(200)
          .json({ status: "ok", message: "Login Success", data: user });
      }
    }
  );
};
const register = async (req, res) => {
  const user = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Users`, async (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", message: "Database error1" });
    } else {
      user.role = 2;
      const users = result.recordset;
      if (users.length === 0) user.role = 1;
      else if (users.some((u) => u.username === user.username)) {
        return res
          .status(200)
          .json({ status: "failed", message: "Username existed" });
      }
      request.query(
        `INSERT INTO Users (firstName, lastName, username, password, createdDate, role) VALUES (N'${
          user.firstName
        }',N'${user.lastName}','${user.username}','${await bcrypt.hash(
          user.password,
          12
        )}','${moment().format("YYYY-MM-DD HH:mm")}','${user.role}')`,
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(200)
              .json({ status: "error", message: "Database error 2" });
          } else {
            const out = result.rowsAffected[0];
            if (out) {
              return res.status(200).json({
                status: "ok",
                message: "Register Success",
                data: out || null,
              });
            } else
              return res.status(200).json({
                status: "failed",
                message: "Register Failed",
              });
          }
        }
      );
    }
  });
};
module.exports = { login, register };
