const moment = require("moment/moment");
const sql = require("../config/databaseConfig");

const readSize = async (req, res) => {
  const request = new sql.Request();
  request.query(`SELECT * FROM Sizes`, (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", error: "Database error" });
    } else {
      const sizes = result.recordset;

      res.status(200).json({
        status: "ok",
        message: "Read all Size Success",
        data: sizes,
      });
    }
  });
};
const readSizeById = async (req, res) => {
  const id = req.params.id;
  const request = new sql.Request();
  request.query(`SELECT * FROM Sizes WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", error: "Database error" });
    } else {
      const size = result.recordset[0] || null;
      if (!size)
        res.status(200).json({
          status: "failed",
          message: "Size not found",
          data: size,
        });
      res.status(200).json({
        status: "ok",
        message: "Read Size success",
        data: size,
      });
    }
  });
};
const writeSize = async (req, res) => {
  const size = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Sizes`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const sizes = result.recordset;
      if (sizes.some((u) => u.size === size.size)) {
        return res.status(200).json({ message: "Size existed" });
      }
      request.query(
        `INSERT INTO Sizes (size, description, createdDate) VALUES ('${
          size.size
        }',N'${size.description}','${moment().format("YYYY-MM-DD HH:mm")}')`,
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
                message: "add new Success",
                data: (
                  await request.query(
                    "SELECT TOP(1) * FROM Sizes Order by id desc"
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
const updateSize = async (req, res) => {
  const id = req.params.id;
  const size = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Sizes`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const sizes = result.recordset;
      if (sizes.length === 0) {
        return res.status(200).json({ message: "Size not found" });
      }
      if (sizes.filter((u) => u.size === size.size).length > 1) {
        return res.status(200).json({ message: "Size existed" });
      }
      const sizeCurrent = sizes[0];
      request.query(
        `UPDATE Sizes SET size='${size.size}', description=N'${size.description}' WHERE id = ${id}`,
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
                data: out || null,
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
const changeStatusSize = async (req, res) => {
  const id = req.params.id;
  const status = JSON.parse(req.params.status);
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Sizes`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const sizes = result.recordset;
      if (sizes.length === 0) {
        return res.status(200).json({ message: "Size not found" });
      }
      request.query(
        `UPDATE Sizes SET status = '${status}' WHERE id = ${id}`,
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
  readSize,
  readSizeById,
  writeSize,
  updateSize,
  changeStatusSize,
};
