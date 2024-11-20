import App from "./App.jsx";
import "./css/index.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import AboutPage from "./pages/User/AboutePage.jsx";
import ProfilePage from "./pages/User/ProfilePage.jsx";
import PurchasePage from "./pages/User/PurchasePage.jsx";
import ProductPage from "./pages/User/ProductPage.jsx";
import LoginPage from "./pages/Common/LoginPage.jsx";
import SignupPage from "./pages/Common/SignupPage.jsx";
import CategoryManaPage from "./pages/Admin/CategoryManaPage.jsx";
import SizeManaPage from "./pages/Admin/SizeManaPage.jsx";
import DashboardPageAdmin from "./pages/Admin/DashboardPageAdmin.jsx";
import CustomerManaPageAdmin from "./pages/Admin/CustomerManaPageAdmin.jsx";
import BillManaPageAdmin from "./pages/Admin/BillManaPageAdmin.jsx";
import OrderManaPageAdmin from "./pages/Admin/OrderManaPageAdmin.jsx";
import ProductManaPageAdmin from "./pages/Admin/ProductManaPageAdmin.jsx";

import "react-circular-progressbar/dist/styles.css";
import UserLayoutComponent from "./components/UserLayoutComponent.jsx";
import { ToastContainer } from "react-toastify";
import LayoutManager from "./components/LayoutManager.jsx";
import { useEffect, useState } from "react";
import { readOrderDetailInCartByUserId } from "./services/api.jsx";
import NotFound from "./pages/Common/NotFound.jsx";
function RouteApp() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [countOrder, setCountOrder] = useState([]);
  useEffect(() => {
    if (currentUser?.id)
      readOrderDetailInCartByUserId(currentUser.id).then((res) =>
        setCountOrder((res.data ?? []).length)
      );
    else
      setCountOrder(
        JSON.parse(sessionStorage.getItem("orderDetailInCart"))?.length || 0
      );
  }, [currentUser]);
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Routes for Admin */}
        <Route
          path="/admin/*"
          element={
            currentUser?.role === 1 ? (
              <LayoutManager
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              >
                <Routes>
                  <Route path="dashboard" element={<DashboardPageAdmin />} />
                  <Route path="bill" element={<BillManaPageAdmin />} />
                  <Route path="order" element={<OrderManaPageAdmin />} />
                  <Route path="customer" element={<CustomerManaPageAdmin />} />
                  <Route path="category" element={<CategoryManaPage />} />
                  <Route path="size" element={<SizeManaPage />} />
                  <Route path="product" element={<ProductManaPageAdmin />} />
                </Routes>
              </LayoutManager>
            ) : (
              <>
                <Routes>
                  <NotFound></NotFound>
                </Routes>
              </>
            )
          }
        />

        {/* Routes for User */}
        <Route
          path="/*"
          element={
            <UserLayoutComponent
              countOrder={countOrder || 0}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            >
              <Routes>
                <Route path="/" element={<App />} />
                <Route
                  path="product/:idProduct/:nameProduct"
                  element={
                    <ProductPage
                      setCountOrder={setCountOrder}
                      countOrder={countOrder}
                    />
                  }
                />
                <Route path="about" element={<AboutPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route
                  path="purchase"
                  element={
                    <PurchasePage
                      setCountOrder={setCountOrder}
                      countOrder={countOrder}
                    />
                  }
                />
                <Route
                  path="/login"
                  element={<LoginPage setCurrentUser={setCurrentUser} />}
                />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserLayoutComponent>
          }
        />

        {/* Routes for Login and Signup */}
        {/* <Route
          path="/login"
          element={<LoginPage setCurrentUser={setCurrentUser} />}
        />
        <Route path="/signup" element={<SignupPage />} /> */}
      </Routes>
    </>
  );
}

export default RouteApp;
