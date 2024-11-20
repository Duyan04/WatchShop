const moment = require("moment/moment");
const sql = require("../config/databaseConfig");

const readProductDetail = async () => {
  const request = new sql.Request();
  request.query(`SELECT * FROM ProductDetails`, (err, result) => {
    if (err) {
      throw new Error("Database error");
    } else {
      return result.recordset;
    }
  });
};
const readProductDetailById = async (id) => {
  const request = new sql.Request();
  request.query(
    `SELECT * FROM ProductDetails WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        throw new Error("Database error");
      } else {
        return result.recordset[0] || null;
      }
    }
  );
};
const readProductDetailByProductId = async (productId) => {
  try {
    const request = new sql.Request();
    const result = await request.query(
      `SELECT * FROM ProductDetails WHERE product = ${productId}`
    );
    return result.recordset || [];
  } catch (err) {
    throw new Error("Database error");
  }
};

const writeProductDetail = async (productDetail) => {
  try {
    const request = new sql.Request();
    await request.query(
      `INSERT INTO ProductDetails (price, quantity, size, product, createdDate) VALUES ('${productDetail.price
      }','${productDetail.quantity}','${productDetail.size}','${productDetail.product}','${moment().format("YYYY-MM-DD HH:mm")}')`
    );
    const result = await request.query(
      "SELECT TOP(1) * FROM ProductDetails ORDER BY id DESC"
    );

    if (result.recordset.length > 0) {
      return result.recordset[0];
    } else {
      throw new Error("No records found");
    }
  } catch (error) {
    throw new Error("Database error");
  }
};
const updateProductDetail = async (productDetail) => {
  const request = new sql.Request();
  // Execute a SQL query
  // request.query(`SELECT * FROM ProductDetails`, async (err, result) => {
  //   if (err) {
  //     res.status(200).json({ error: "Database error1" });
  //   } else {
  //     const productDetails = result.recordset;
  //     if (productDetails.length === 0) {
  //       return res.status(200).json({ message: "ProductDetail not found" });
  //     }
  //     const productDetailExit = productDetails.find(
  //       (u) =>
  //         u.product === productDetail.product &&
  //         u.size === productDetail.size   );
  //     if (productDetailExit) {
  //       request.query(
  //         `UPDATE ProductDetails SET quantity='${
  //           productDetailExit.quantity + productDetail.quantity
  //         }' WHERE id = ${productDetail.id}`
  //       );
  //     } else {
  request.query(
    `UPDATE ProductDetails SET price='${productDetail.price}', quantity='${productDetail.quantity}', size='${productDetail.size}', product='${productDetail.product}' WHERE id = ${productDetail.id}`,
    (err, result) => {
      if (err) {
        throw new Error("Database error2");
      } else {
        return result.rowsAffected[0];
      }
    }
  );
  // }
  //   }
  // });
};
const deleteProductDetailByIds = async (ids) => {
  if (ids.length > 0) {
    const request = new sql.Request();
    return new Promise((resolve, reject) => {
      request.query(
        `DELETE FROM ProductDetails WHERE id IN (${ids.join(",")})`,
        (err, result) => {
          if (err) {
            reject(new Error("Database Error"));
          } else {
            resolve(result.rowsAffected[0]);
          }
        }
      );
    });
  } else {
    return 0;
  }
};

module.exports = {
  readProductDetail,
  readProductDetailById,
  readProductDetailByProductId,
  writeProductDetail,
  updateProductDetail,
  deleteProductDetailByIds,
};
