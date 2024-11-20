const moment = require("moment/moment");
const sql = require("../config/databaseConfig");
const {
  readProductDetail,
  writeProductDetail,
  updateProductDetail,
  deleteProductDetailByIds,
  readProductDetailByProductId,
} = require("./productDetail");

const readProduct = async (req, res) => {
  const request = new sql.Request();
  request.query(`SELECT * FROM Products`, async (err, result) => {
    if (err) {
      res.status(200).json({ status: "error", error: "Database error" });
    } else {
      res.status(200).json({
        status: "ok",
        message: "Read all Product Success",
        data: await Promise.all(
          (result.recordset || [])?.map(async (p) => {
            p.productDetails = await readProductDetailByProductId(p.id);
            return p;
          })
        ),
      });
    }
  });
};
const readProductById = async (req, res) => {
  const id = req.params.id;
  const request = new sql.Request();
  request.query(
    `SELECT * FROM Products WHERE id = ${id}`,
    async (err, result) => {
      if (err) {
        res.status(200).json({ status: "error", error: "Database error" });
      } else {
        const product = result.recordset[0] || null;
        if (!product)
          res.status(200).json({
            status: "failed",
            message: "Product not found",
            data: product,
          });
        product.productDetails = await readProductDetailByProductId(product.id);
        res.status(200).json({
          status: "ok",
          message: "Read Product success",
          data: product,
        });
      }
    }
  );
};
const writeProduct = async (req, res) => {
  const product = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Products`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const products = result.recordset;
      if (products.some((u) => u.name === product.name)) {
        return res.status(200).json({ message: "Product existed" });
      }
      request.query(
        `INSERT INTO Products (name, image, category, material, description, createdDate) VALUES (N'${product.name
        }','${product.image ||
        "https://firebasestorage.googleapis.com/v0/b/shoeshop-e5f23.appspot.com/o/default-product.jpg?alt=media"
        }','${product.category}',N'${product.material}',N'${product.description}','${moment().format(
          "YYYY-MM-DD HH:mm"
        )}')`,
        (err, result) => {
          if (err) {
            res
              .status(200)
              .json({ status: "error", message: "Database error2" });
          } else {
            if (result.rowsAffected[0]) {
              const selectQuery =
                "SELECT TOP(1) * FROM Products Order by id desc";

              request.query(selectQuery, async (selectErr, selectResult) => {
                if (selectErr) {
                  res
                    .status(200)
                    .json({ status: "error", message: "Database error3" });
                } else {
                  let newProduct = selectResult.recordset[0];
                  product.productDetails = product.productDetails.reduce(
                    (accumulator, currentItem) => {
                      const existingItem = accumulator.find((item) => item.size === currentItem.size);
                      if (existingItem) {
                        existingItem.quantity =
                          parseInt(existingItem.quantity, 10) +
                          parseInt(currentItem.quantity, 10);
                      } else {
                        accumulator.push({ ...currentItem });
                      }
                      return accumulator;
                    },
                    []
                  );
                  newProduct.productDetails = await Promise.all(
                    product.productDetails.map(async (pd) => {
                      pd.product = newProduct.id;
                      return await writeProductDetail(pd);
                    })
                  );
                  return res.status(200).json({
                    status: "ok",
                    message: "Add new Success",
                    data: newProduct,
                  });
                }
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
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const product = req.body;
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Products`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const products = result.recordset;
      if (products.length === 0) {
        return res.status(200).json({ message: "Product not found" });
      }
      // if (products.find((u) => u.name === product.name && u.id !== id)) {
      //   return res.status(200).json({ message: "Product existed" });
      // }
      const productCurrent = products[0];
      request.query(
        `UPDATE Products SET name=N'${product.name}', image=N'${product.image || productCurrent.image
        }', category='${product.category}', material=N'${product.material
        }', description=N'${product.description
        }' WHERE id = ${id}`,
        async (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(200)
              .json({ status: "error", message: "Database error2" });
          } else {
            if (result.rowsAffected[0]) {
              product.productDetails = product.productDetails.reduce(
                (accumulator, currentItem) => {
                  const existingItem = accumulator.find((item) => item.size === currentItem.size);
                  if (existingItem) {
                    if (currentItem.id) existingItem.id = currentItem.id;
                    existingItem.quantity =
                      parseInt(existingItem.quantity, 10) +
                      parseInt(currentItem.quantity, 10);
                  } else {
                    accumulator.push({ ...currentItem });
                  }
                  return accumulator;
                },
                []
              );

              await deleteProductDetailByIds(
                ((await readProductDetailByProductId(id)) ?? [])
                  .filter(
                    (pd) =>
                      !Array.from(product.productDetails).some(
                        (ppd) => pd.id === ppd.id
                      )
                  )
                  .map((pd) => pd.id)
              );
              product.productDetails.forEach((pd) => {
                if (pd.id) updateProductDetail(pd);
                else {
                  pd.product = id;
                  writeProductDetail(pd);
                }
              });
              return res.status(200).json({
                status: "ok",
                message: "Update Success",
                data: product,
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
const changeStatusProduct = async (req, res) => {
  const id = req.params.id;
  const status = JSON.parse(req.params.status);
  const request = new sql.Request();
  // Execute a SQL query
  request.query(`SELECT * FROM Products`, async (err, result) => {
    if (err) {
      res.status(200).json({ error: "Database error1" });
    } else {
      const products = result.recordset;
      if (products.length === 0) {
        return res.status(200).json({ message: "Product not found" });
      }
      request.query(
        `UPDATE Products SET status = '${status}' WHERE id = ${id}`,
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
  readProduct,
  readProductById,
  writeProduct,
  updateProduct,
  changeStatusProduct,
};
