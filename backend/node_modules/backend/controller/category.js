const moment = require("moment/moment");
const sql = require("../config/databaseConfig");

const readCategory = async (req, res) => {
  const request = new sql.Request();
  request.query(`SELECT * FROM Categories`, (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", error: "Database error" });
    } else {
      const categories = result.recordset;

      res.status(200).json({
        status: "ok",
        message: "Read all Category Success",
        data: categories,
      });
    }
  });
};
const readCategoryById = async (req, res) => {
  const id = req.params.id;
  const request = new sql.Request();
  request.query(`SELECT * FROM Categories WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", error: "Database error" });
    } else {
      const category = result.recordset[0] || null;
      if (!category)
        res.status(200).json({
          status: "failed",
          message: "Category not found",
          data: category,
        });
      res.status(200).json({
        status: "ok",
        message: "Read Category success",
        data: category,
      });
    }
  });
};
const writeCategory = async (req, res) => {
  const category = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Categories`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const categories = result.recordset;
      if (categories.some((u) => u.name === category.name)) {
        return res.status(200).json({ message: "Category existed" });
      }
      request.query(
        `INSERT INTO Categories (name, description, createdDate) VALUES (N'${category.name
        }',N'${category.description}','${moment().format(
          "YYYY-MM-DD HH:mm"
        )}')`,
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
                    "SELECT TOP(1) * FROM Categories Order by id desc"
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
const updateCategory = async (req, res) => {
  const id = req.params.id;
  const category = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Categories`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const categories = result.recordset;
      if (categories.length === 0) {
        return res.status(200).json({ message: "Category not found" });
      }
      if (categories.filter((u) => u.name === category.name).length > 1) {
        return res.status(200).json({ message: "Category existed" });
      }
      const categoryCurrent = categories[0];
      request.query(
        `UPDATE Categories SET name=N'${category.name}', description=N'${category.description}' WHERE id = ${id}`,
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
const changeStatusCategory = async (req, res) => {
  const id = req.params.id;
  const status = JSON.parse(req.params.status);
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Categories`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const categories = result.recordset;
      if (categories.length === 0) {
        return res.status(200).json({ message: "Category not found" });
      }
      request.query(
        `UPDATE Categories SET status = '${status}' WHERE id = ${id}`,
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
  readCategory,
  readCategoryById,
  writeCategory,
  updateCategory,
  changeStatusCategory,
};
