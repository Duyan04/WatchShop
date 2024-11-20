const moment = require("moment/moment");
const sql = require("../config/databaseConfig");
const bcrypt = require("bcryptjs");

const readUser = async (req, res) => {
  const request = new sql.Request();
  request.query(`SELECT * FROM Users`, (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", error: "Database error" });
    } else {
      const users = result.recordset;

      res.status(200).json({
        status: "ok",
        message: "Read All User Success",
        data: users,
      });
    }
  });
};
const readUserById = async (req, res) => {
  const id = req.params.id;
  const request = new sql.Request();
  request.query(`SELECT * FROM Users WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", error: "Database error" });
    } else {
      const user = result.recordset[0];
      if (!user)
        res.status(200).json({
          status: "failed",
          message: "User not found",
          data: null,
        });
      res.status(200).json({
        status: "ok",
        message: "Read User Success",
        data: user,
      });
    }
  });
};
const writeUser = async (req, res) => {
  const user = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Users`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const users = result.recordset;
      if (users.some((u) => u.username === user.username)) {
        return res.status(200).json({ message: "Tên người dùng đã tồn tại" });
      }
      request.query(
        `INSERT INTO Users (firstName, lastName, username, password, email, phoneNumber, address, createdDate, avatar) VALUES (N'${
          user.firstName
        }',N'${user.lastName}','${user.username}','${await bcrypt.hash(
          user.password,
          12
        )}',N'${user.email}',N'${user.phoneNumber}',N'${
          user.address
        }','${moment().format("YYYY-MM-DD HH:mm")}','${
          user.avatar ||
          "https://firebasestorage.googleapis.com/v0/b/shoeshop-e5f23.appspot.com/o/default-avatar.png?alt=media"
        }')`,
        async (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(200)
              .json({ status: "error", message: "Database error2" });
          } else {
            const out = result.rowsAffected[0];
            if (out) {
              return res.status(200).json({
                status: "ok",
                message: "Add new Success",
                data: (
                  await request.query(
                    "SELECT TOP(1) * FROM Users Order by id desc"
                  )
                ).recordset[0],
              });
            } else
              return res
                .status(200)
                .json({ status: "failed", message: "Add new Failed" });
          }
        }
      );
    }
  });
};
const updateUser = async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Users`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const users = result.recordset;
      if (users.length === 0) {
        return res.status(200).json({ message: "User not found" });
      }
      if (users.filter((u) => u.username === user.username).length > 1) {
        return res.status(200).json({ message: "Username Existed" });
      }
      const userCurrent = users[0];
      user.password =
        user.password !== userCurrent.password
          ? await bcrypt.hash(user.password, 12)
          : userCurrent.password;
      user.avatar =
        user.avatar ||
        "https://firebasestorage.googleapis.com/v0/b/shoeshop-e5f23.appspot.com/o/default-avatar.png?alt=media";
      request.query(
        `UPDATE Users SET firstName=N'${user.firstName}', lastName=N'${user.lastName}', username='${user.username}', password='${user.password}', email=N'${user.email}', phoneNumber=N'${user.phoneNumber}', address=N'${user.address}', avatar='${user.avatar}' WHERE id = ${id}`,
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(200)
              .json({ status: "error", message: "Database error2" });
          } else {
            const out = result.rowsAffected[0];

            if (out) {
              return res.status(200).json({
                status: "ok",
                message: "Update Success",
                data: user,
              });
            } else
              return res
                .status(200)
                .json({ status: "failed", message: "Update Failed" });
          }
        }
      );
    }
  });
};
const changeStatusUser = async (req, res) => {
  const id = req.params.id;
  const status = JSON.parse(req.params.status);
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Users`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const users = result.recordset;
      if (users.length === 0) {
        return res.status(200).json({ message: "User not found" });
      }
      request.query(
        `UPDATE Users SET status = '${status}' WHERE id = ${id}`,
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(200)
              .json({ status: "error", message: "Database error2" });
          } else {
            const out = result.rowsAffected[0];
            if (out) {
              return res.status(200).json({
                status: "ok",
                message: "Change status success",
                data: out || null,
              });
            } else
              return res.status(200).json({
                status: "failed",
                message: "Change status failed",
              });
          }
        }
      );
    }
  });
};
module.exports = {
  readUser,
  readUserById,
  writeUser,
  updateUser,
  changeStatusUser,
};
