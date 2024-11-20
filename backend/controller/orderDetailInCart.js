const moment = require("moment/moment");
const sql = require("../config/databaseConfig");

const readOrderDetailInCart = async (req, res) => {
  const request = new sql.Request();
  request.query(
    `SELECT * FROM OrderDetailInCarts WHERE status = 1`,
    (err, result) => {
      if (err) {
        res.status(200).json({ status: "error", error: "Database error" });
      } else {
        const orderDetailInCarts = result.recordset;

        res.status(200).json({
          status: "ok",
          message: "Read all OrderDetailInCart Success",
          data: orderDetailInCarts,
        });
      }
    }
  );
};
const readOrderDetailInCartById = async (req, res) => {
  const id = req.params.id;
  const request = new sql.Request();
  request.query(
    `SELECT * FROM OrderDetailInCarts WHERE id = ${id} AND status = 1`,
    (err, result) => {
      if (err) {
        res.status(200).json({ status: "error", error: "Database error" });
      } else {
        const orderDetailInCart = result.recordset[0] || null;
        if (!orderDetailInCart)
          res.status(200).json({
            status: "failed",
            message: "OrderDetailInCart not found",
            data: orderDetailInCart,
          });
        res.status(200).json({
          status: "ok",
          message: "Read OrderDetailInCart success",
          data: orderDetailInCart,
        });
      }
    }
  );
};
const readOrderDetailInCartByUserId = async (req, res) => {
  const id = req.params.id;
  const request = new sql.Request();
  request.query(
    `SELECT * FROM OrderDetailInCarts WHERE customer = ${id} AND status = '1'`,
    (err, result) => {
      if (err) {
        res.status(200).json({ status: "error", error: "Database error" });
      } else {
        const orderDetailInCart = result.recordset || [];
        res.status(200).json({
          status: "ok",
          message: "Read OrderDetailInCart success",
          data: orderDetailInCart,
        });
      }
    }
  );
};
const writeOrderDetailInCart = async (req, res) => {
  const orderDetailInCart = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM OrderDetailInCarts`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const orderDetailInCarts = result.recordset;
      const orderDetailInCartExist = orderDetailInCarts.find(
        (u) =>
          u.product === orderDetailInCart.product &&
          u.size === orderDetailInCart.size &&
          u.customer === orderDetailInCart.customer &&
          u.status
      );
      if (orderDetailInCartExist) {
        request.query(
          `UPDATE OrderDetailInCarts SET quantity = '${orderDetailInCartExist.quantity + orderDetailInCart.quantity
          }' WHERE id = ${orderDetailInCartExist.id}`,
          (err, result) => {
            if (err) {
              console.error(err);
              res
                .status(200)
                .json({ status: "error", message: "Database error" });
            } else {
              const out = result.rowsAffected[0];
              if (out) {
                return res.status(200).json({
                  status: "ok",
                  message: "Add new Success",
                  data: 1,
                });
              } else
                return res.status(200).json({
                  status: "failed",
                  message: "Add new Failed",
                });
            }
          }
        );
      } else {
        request.query(
          `INSERT INTO OrderDetailInCarts (product, size, quantity, customer, [check], createdDate) VALUES ('${orderDetailInCart.product
          }','${orderDetailInCart.size}','${orderDetailInCart.quantity
          }','${orderDetailInCart.customer}','${orderDetailInCart.check
          }','${moment().format("YYYY-MM-DD HH:mm")}')`,
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
                  message: "add new Success",
                  data: 2,
                });
              } else
                return res.status(200).json({
                  status: "failed",
                  message: "Add new Failed",
                });
            }
          }
        );
      }
    }
  });
};
const updateOrderDetailInCart = async (req, res) => {
  const id = req.params.id;
  const orderDetailInCart = req.body;
  const request = new sql.Request();
  request.query(
    `UPDATE OrderDetailInCarts SET quantity='${orderDetailInCart.quantity}', [check]='${orderDetailInCart.check}' WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(200).json({ status: "error", message: "Database error" });
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
};
const changeStatusOrderDetailInCart = async (req, res) => {
  try {
    const id = req.params.id;
    const status = JSON.parse(req.params.status);

    // Tạo một Request mới
    const request = new sql.Request();

    // Thực hiện truy vấn SQL sử dụng Promise
    const queryResult = await request.query(
      `UPDATE OrderDetailInCarts SET status = '${status}' WHERE id = ${id}`
    );

    const rowsAffected = queryResult.rowsAffected[0];

    if (rowsAffected > 0) {
      res.status(200).json({
        status: "ok",
        message: "Change status success",
        data: rowsAffected,
      });
    } else {
      res.status(200).json({
        status: "failed",
        message: "Change status failed",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(200).json({ status: "error", message: "Database error" });
  }
};
const disableOrderDetailInCart = async (id) => {
  try {
    const request = new sql.Request();
    const queryResult = await request.query(
      `UPDATE OrderDetailInCarts SET status = '0' WHERE id = ${id}`
    );
    return queryResult.rowsAffected[0];
  } catch (err) {
    throw new Error("Database error");
  }
};
module.exports = {
  readOrderDetailInCart,
  readOrderDetailInCartById,
  readOrderDetailInCartByUserId,
  writeOrderDetailInCart,
  updateOrderDetailInCart,
  changeStatusOrderDetailInCart,
  disableOrderDetailInCart,
};
