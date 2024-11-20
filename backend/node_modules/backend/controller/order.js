const moment = require("moment/moment");
const sql = require("../config/databaseConfig");
const { disableOrderDetailInCart } = require("./orderDetailInCart");

const readOrder = async (req, res) => {
  const request = new sql.Request();
  request.query(`SELECT * FROM Orders`, (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", error: "Database error" });
    } else {
      const orders = result.recordset;
      res.status(200).json({
        status: "ok",
        message: "Read all Order Success",
        data: orders.map((o) => {
          o.orderDetails = JSON.parse(o.orderDetails);
          return o;
        }),
      });
    }
  });
};
const readOrderById = async (req, res) => {
  const id = req.params.id;
  const request = new sql.Request();
  request.query(`SELECT * FROM Orders WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", error: "Database error" });
    } else {
      const order = result.recordset[0] || null;
      if (!order)
        res.status(200).json({
          status: "failed",
          message: "Order not found",
          data: order,
        });
      else {
        order.orderDetails = JSON.parse(order.orderDetails);
        res.status(200).json({
          status: "ok",
          message: "Read Order success",
          data: order,
        });
      }
    }
  });
};
const readOrderByUserId = async (req, res) => {
  const id = req.params.id;
  const request = new sql.Request();
  request.query(
    `SELECT * FROM Orders WHERE customer = ${id}`,
    (err, result) => {
      if (err) {
        res.status(200).json({ status: "error", error: "Database error" });
      } else {
        const orders = result.recordset;

        res.status(200).json({
          status: "ok",
          message: "Read Order Success",
          data: orders.map((o) => {
            o.orderDetails = JSON.parse(o.orderDetails);
            return o;
          }),
        });
      }
    }
  );
};
const writeOrder = async (req, res) => {
  const order = req.body;
  const request = new sql.Request();
  let check = true;
  for (let i = 0; i < order.orderDetails?.length || 0; i++) {
    let od = order.orderDetails[i];
    const currentProductDetail = (
      await request.query(
        `SELECT * FROM ProductDetails WHERE product = ${od.product.id} AND size = ${od.size.id}`
      )
    ).recordset[0];
    if (currentProductDetail?.quantity < od.quantity) {
      res.json({
        status: "failed",
        message: `Product Detail ${od.product.name}-${od.size.size} not enough quantity`,
      });
      check = false;
      break;
    }
  }
  if (check === true) {
    request.input('customer', sql.Numeric, order.customer);
    request.input('fullName', sql.NVarChar, order.fullName);
    request.input('phoneNumber', sql.NVarChar, order.phoneNumber);
    request.input('address', sql.NVarChar, order.address);
    request.input('total', sql.Float, order.total);
    request.input('orderDate', sql.DateTime, moment().format("YYYY-MM-DD HH:mm"));
    request.input('createdDate', sql.DateTime, moment().format("YYYY-MM-DD HH:mm"));
    request.input('orderDetails', sql.NVarChar, JSON.stringify(order.orderDetails));

    request.query(
      `INSERT INTO Orders (customer, fullName, phoneNumber, address, total, orderDate, createdDate, orderDetails)
       VALUES (@customer, @fullName, @phoneNumber, @address, @total, @orderDate, @createdDate, @orderDetails)`,
      async (err, result) => {
        if (err) {
          res.status(200).json({ status: "error", message: "Database error" });
        } else {
          const out = result.rowsAffected[0];
          if (out) {
            await order.orderDetails.forEach(async (od) => {
              await request.query(
                `UPDATE ProductDetails SET quantity = quantity - @quantity WHERE product = @productId AND size = @sizeId`,
                {
                  quantity: od.quantity,
                  productId: od.product.id,
                  sizeId: od.size.id
                }
              );
              await disableOrderDetailInCart(od.id);
            });
            return res.status(200).json({
              status: "ok",
              message: "Checkout Success",
              data: out || null,
            });
          } else {
            return res
              .status(200)
              .json({ status: "failed", message: "Checkout Failed" });
          }
        }
      }
    )
  };
};
const updateOrder = async (req, res) => {
  const id = req.params.id;
  const order = req.body;
  const request = new sql.Request();
  request.query(
    `UPDATE Orders SET customer=N'${order.customer}', fullName=N'${order.fullName
    }', phoneNumber='${order.phoneNumber}', address=N'${order.address
    }', total='${order.total}', orderDetails='${JSON.stringify(
      order.orderDetails
    )}' WHERE id = ${id}`,
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
const changeStatusOrder = async (req, res) => {
  const id = req.params.id;
  const status = parseInt(req.params.status);
  const request = new sql.Request();
  // Execute a SQL query
  if (status >= 0 && status < 3)
    request.query(`SELECT * FROM Orders`, async (err, result) => {
      if (err) {
        res.status(200).json({ error: "Database error1" });
      } else {
        const orders = result.recordset;
        if (orders.length === 0) {
          return res.status(200).json({ message: "Order not found" });
        }
        request.query(
          `UPDATE Orders SET status = '${status}' WHERE id = ${id}`,
          (err, result) => {
            if (err) {
              console.error(err);
              res
                .status(200)
                .json({ status: "error", message: "Database error2" });
            } else {
              const out = result.rowsAffected[0];
              if (out) {
                if (status === 2) {
                  JSON.parse(orders[0].orderDetails).forEach(async (od) => {
                    request.query(
                      `UPDATE ProductDetails SET quantity = quantity + '${od.quantity}' WHERE product = ${od.product} AND size = ${od.size}`
                    );
                  });
                }
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
  else
    return res.status(200).json({
      status: "failed",
      message: "Change status failed",
    });
};
module.exports = {
  readOrder,
  readOrderById,
  readOrderByUserId,
  writeOrder,
  updateOrder,
  changeStatusOrder,
};
