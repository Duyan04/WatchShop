// const router = .Router();

const router = require("express").Router({
  caseSensitive: false,
});
const AuthController = require("../controller/auth");
const UserController = require("../controller/user");
const SizeController = require("../controller/size");
const CategoryController = require("../controller/category");
const ProductController = require("../controller/product");
const OrderDetailInCartController = require("../controller/orderDetailInCart");
const OrderController = require("../controller/order");
/////////////////AUTH
router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register);
/////////////////USER
router.get("/user/readUser", UserController.readUser);
router.get("/user/readUserById/:id", UserController.readUserById);
router.post("/user/writeUser", UserController.writeUser);
router.put("/user/updateUser/:id", UserController.updateUser);
router.put(
  "/user/changeStatusUser/:id/:status",
  UserController.changeStatusUser
);
/////////////////Size
router.get("/size/readSize", SizeController.readSize);
router.get("/size/readSizeById/:id", SizeController.readSizeById);
router.post("/size/writeSize", SizeController.writeSize);
router.put("/size/updateSize/:id", SizeController.updateSize);
router.put(
  "/size/changeStatusSize/:id/:status",
  SizeController.changeStatusSize
);
/////////////////Category
router.get("/category/readCategory", CategoryController.readCategory);
router.get(
  "/category/readCategoryById/:id",
  CategoryController.readCategoryById
);
router.post("/category/writeCategory", CategoryController.writeCategory);
router.put("/category/updateCategory/:id", CategoryController.updateCategory);
router.put(
  "/category/changeStatusCategory/:id/:status",
  CategoryController.changeStatusCategory
);
/////////////////Product
router.get("/product/readProduct", ProductController.readProduct);
router.get("/product/readProductById/:id", ProductController.readProductById);
router.post("/product/writeProduct", ProductController.writeProduct);
router.put("/product/updateProduct/:id", ProductController.updateProduct);
router.put(
  "/product/changeStatusProduct/:id/:status",
  ProductController.changeStatusProduct
);
/////////////////OrderDetailInCart
router.get(
  "/orderDetailInCart/readOrderDetailInCart",
  OrderDetailInCartController.readOrderDetailInCart
);
router.get(
  "/orderDetailInCart/readOrderDetailInCartById/:id",
  OrderDetailInCartController.readOrderDetailInCartById
);
router.get(
  "/orderDetailInCart/readOrderDetailInCartByUserId/:id",
  OrderDetailInCartController.readOrderDetailInCartByUserId
);
router.post(
  "/orderDetailInCart/writeOrderDetailInCart",
  OrderDetailInCartController.writeOrderDetailInCart
);
router.put(
  "/orderDetailInCart/updateOrderDetailInCart/:id",
  OrderDetailInCartController.updateOrderDetailInCart
);
router.put(
  "/orderDetailInCart/changeStatusOrderDetailInCart/:id/:status",
  OrderDetailInCartController.changeStatusOrderDetailInCart
);
/////////////////Order
router.get("/order/readOrder", OrderController.readOrder);
router.get("/order/readOrderById/:id", OrderController.readOrderById);
router.get("/order/readOrderByUserId/:id", OrderController.readOrderByUserId);
router.post("/order/writeOrder", OrderController.writeOrder);
router.put("/order/updateOrder/:id", OrderController.updateOrder);
router.put(
  "/order/changeStatusOrder/:id/:status",
  OrderController.changeStatusOrder
);
module.exports = router;
