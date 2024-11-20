const URL_BACKEND = "http://localhost:3001/api/";
import axios from "axios";
// import { child, get, ref, set, update } from "firebase/database";

////////////////AUTH////////////////
const login = async (username, password) => {
  return (
    await axios.post(`${URL_BACKEND}auth/login`, {
      username: username,
      password: password,
    })
  ).data;
};
const register = async (user) => {
  return (await axios.post(`${URL_BACKEND}auth/register`, user)).data;
};
////////////////USER////////////////
const readUser = async () => {
  return (await axios.get(`${URL_BACKEND}user/readUser`)).data;
};
const readUserById = async (id) => {
  return (await axios.get(`${URL_BACKEND}user/readUserById/${id}`)).data;
};
const writeUser = async (object) => {
  return (await axios.post(`${URL_BACKEND}user/writeUser`, object)).data;
};
const updateUser = async (id, object) => {
  return (await axios.put(`${URL_BACKEND}user/updateUser/${id}`, object)).data;
};
const changeStatusUser = async (id, status) => {
  return (
    await axios.put(`${URL_BACKEND}user/changeStatusUser/${id}/${status}`)
  ).data;
};
////////////////CATEGORY////////////////
const readCategory = async () => {
  return (await axios.get(`${URL_BACKEND}category/readCategory`)).data;
};
const readCategoryById = async (id) => {
  return (await axios.get(`${URL_BACKEND}category/readCategoryById/${id}`))
    .data;
};
const writeCategory = async (object) => {
  return (await axios.post(`${URL_BACKEND}category/writeCategory`, object))
    .data;
};
const updateCategory = async (id, object) => {
  return (
    await axios.put(`${URL_BACKEND}category/updateCategory/${id}`, object)
  ).data;
};
const changeStatusCategory = async (id, status) => {
  return (
    await axios.put(
      `${URL_BACKEND}category/changeStatusCategory/${id}/${status}`
    )
  ).data;
};
////////////////SIZE////////////////
const readSize = async () => {
  return (await axios.get(`${URL_BACKEND}size/readSize`)).data;
};
const readSizeById = async (id) => {
  return (await axios.get(`${URL_BACKEND}size/readSizeById/${id}`)).data;
};
const writeSize = async (object) => {
  return (await axios.post(`${URL_BACKEND}size/writeSize`, object)).data;
};
const updateSize = async (id, object) => {
  return (await axios.put(`${URL_BACKEND}size/updateSize/${id}`, object)).data;
};
const changeStatusSize = async (id, status) => {
  return (
    await axios.put(`${URL_BACKEND}size/changeStatusSize/${id}/${status}`)
  ).data;
};
////////////////PRODUCT////////////////
const readProduct = async () => {
  return (await axios.get(`${URL_BACKEND}product/readProduct`)).data;
};
const readProductById = async (id) => {
  return (await axios.get(`${URL_BACKEND}product/readProductById/${id}`)).data;
};
const writeProduct = async (object) => {
  return (await axios.post(`${URL_BACKEND}product/writeProduct`, object)).data;
};
const updateProduct = async (id, object) => {
  return (await axios.put(`${URL_BACKEND}product/updateProduct/${id}`, object))
    .data;
};
const changeStatusProduct = async (id, status) => {
  return (
    await axios.put(`${URL_BACKEND}product/changeStatusProduct/${id}/${status}`)
  ).data;
};
////////////////ORDER////////////////
const readOrder = async () => {
  return (await axios.get(`${URL_BACKEND}order/readOrder`)).data;
};
const readOrderById = async (id) => {
  return (await axios.get(`${URL_BACKEND}order/readOrderById/${id}`)).data;
};
const readOrderByUserId = async (userId) => {
  return (await axios.get(`${URL_BACKEND}order/readOrderByUserId/${userId}`))
    .data;
};
const writeOrder = async (object) => {
  return (await axios.post(`${URL_BACKEND}order/writeOrder`, object)).data;
};
const changeStatusOrder = async (id, status) => {
  return (
    await axios.put(`${URL_BACKEND}order/changeStatusOrder/${id}/${status}`)
  ).data;
};
////////////////ORDER DETAIL IN CART////////////////
const readOrderDetailInCartByUserId = async (userId) => {
  return (
    await axios.get(
      `${URL_BACKEND}orderDetailInCart/readOrderDetailInCartByUserId/${userId}`
    )
  ).data;
};
const writeOrderDetailInCart = async (object) => {
  return (
    await axios.post(
      `${URL_BACKEND}orderDetailInCart/writeOrderDetailInCart`,
      object
    )
  ).data;
};
const updateOrderDetailInCart = async (id, object) => {
  return (
    await axios.put(
      `${URL_BACKEND}orderDetailInCart/updateOrderDetailInCart/${id}`,
      object
    )
  ).data;
};
const changeStatusOrderDetailInCart = async (id, status) => {
  return (
    await axios.put(
      `${URL_BACKEND}orderDetailInCart/changeStatusOrderDetailInCart/${id}/${status}`
    )
  ).data;
};
export {
  login,
  register,
  readUser,
  readUserById,
  writeUser,
  updateUser,
  changeStatusUser,
  readCategory,
  readCategoryById,
  writeCategory,
  updateCategory,
  changeStatusCategory,
  readSize,
  readSizeById,
  writeSize,
  updateSize,
  changeStatusSize,
  readProduct,
  readProductById,
  writeProduct,
  updateProduct,
  changeStatusProduct,
  readOrder,
  readOrderById,
  readOrderByUserId,
  writeOrder,
  changeStatusOrder,
  readOrderDetailInCartByUserId,
  writeOrderDetailInCart,
  updateOrderDetailInCart,
  changeStatusOrderDetailInCart,
};
