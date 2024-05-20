import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, Layout } from "antd";
import Sidebar from "./common/SideBar/Sidebar";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserProvider } from "./contexts/UserContext";
import Product from "./pages/Product";
import { SearchBox } from "./common/SearchBox/SearchBox";
import ProfilePage from "./pages/Profile";
import Navbar from "./common/NavBar/Navbar";
import UpdateProfile from "./pages/UpdateProfile";
import Seller from "./pages/Seller";
import EditProduct from "./pages/EditProduct";
import UpdateShopProfile from "./pages/UpdateShopProfile";
import { ProfileEdit } from "./pages/ProfileEdit";

const { Content, Sider } = Layout;

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [accessToken, setAccessToken] = useState(
    sessionStorage.getItem("accessToken")
  );
  const handleSearch = (text) => {
    setSearchText(text);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAccessToken(sessionStorage.getItem("accessToken"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <UserProvider>
      <Router>
        <ConfigProvider
          theme={{
            components: {
              Layout: {
                bodyBg: "white",
              },
            },
          }}
        >
          <div style={{ margin: "0 100px" }}>
            <Navbar onSearch={(text) => handleSearch(text)} />
            <Layout style={{ minHeight: "100vh" }}>
              <Sider
                style={{
                  backgroundColor: "white",
                }}
                width={200}
              >
                <Sidebar />
              </Sider>

              <Content style={{ padding: "0 50px", marginRight: "5%" }}>
                <Routes>
                  {/* <Categories /> */}
                  <Route path="/" element={<Home searchText={searchText} />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/editProduct/:id" element={<EditProduct />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/seller/:id" element={<Seller />} />
                  <Route path="/updateProfile" element={<UpdateProfile />} />
                  <Route
                    path="/updateShopProfile"
                    element={<UpdateShopProfile />}
                  />
                  <Route path="/editProfile" element={<ProfileEdit />} />

                  {/* <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                  <Route
                    path="/seller/dashboard"
                    element={<SellerDashboard />}
                  />*/}
                </Routes>
              </Content>
            </Layout>
          </div>
        </ConfigProvider>
      </Router>
    </UserProvider>
  );
};

export default App;
