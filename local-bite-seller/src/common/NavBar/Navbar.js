// src/components/common/Navbar.js
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, ConfigProvider } from "antd";
import {
  LockOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  UserOutlined,
  HeartOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../store/actions/categoryActions";
import { useUser } from "../../contexts/UserContext";
import classes from "./NavBar.module.css";
import { SearchBox } from "../SearchBox/SearchBox";
const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { logout, currentUser } = useUser();
  // const selectedCategory = useSelector((state) => state.category);
  const selectedCategory = "";
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      const user = await currentUser();
      console.log(user);
      setUser(user);
      setLoading(false);
    };

    fetchCurrentUser();
  }, [currentUser]);

  const handleLogoClick = () => {
    // dispatch(setCategory(""));
    window.location.href = "/";
  };
  const handleFavProductsClick = () => {
    console.log("user", user);
    // dispatch(setCategory(""));
    navigate("/", { state: { showFavorites: true } });
  };
  const handleCategoryClick = (category) => {
    navigate("/");
    // dispatch(setCategory(category));
  };
  const handleLogout = async () => {
    // dispatch(setCategory(""));
    await logout();
    window.location.href = "/";
  };
  const handleSearch = (text) => {
    onSearch(text);
  };
  const goToBasketPage = () => {
    if (!sessionStorage.getItem("accessToken")) {
      navigate("/register");
    }
    navigate(`/basket/${user.id}`);
  };
  const handleLogin = () => {
    // dispatch(setCategory(""));
    navigate("/register");
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              horizontalItemSelectedColor: "#ADDBB1",
            },
            Input: {
              colorBorder: "#ADDBB1",
              hoverBorderColor: "#55B45D",
              activeBorderColor: "#55B45D",
            },
            Button: {
              colorPrimary: "#55B45D",
              colorPrimaryHover: "#71C178",
            },
          },
        }}
      >
        <div
          mode="horizontal"
          selectedKeys={[selectedCategory]}
          defaultSelectedKeys={[""]}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            fontSize: "11px",
          }}
        >
          <a
            key="map"
            onClick={() => navigate("/map")}
            style={{
              background: "#55B45D",
              color: "white",
              width: "80px",
              height: "40px",
              fontSize: "16px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
              marginRight: "1rem",
            }}
          >
            Harita
          </a>
          <a key="hakkımızda" onClick={() => handleCategoryClick("hakkımızda")}>
            HAKKIMIZDA
          </a>
          <a
            key="iletişim"
            onClick={() => handleCategoryClick("iletişim")}
            style={{ marginLeft: "1rem", marginRight: "16px" }}
          >
            İLETİŞİM
          </a>
        </div>

        <Menu
          // theme="dark"
          mode="horizontal"
          selectedKeys={[selectedCategory]}
          defaultSelectedKeys={[""]}
          style={{
            alignItems: "center",
            marginBottom: "2rem",
            marginTop: "10px",
            justifyContent: "space-between",
          }}
        >
          <label
            className={classes.logo}
            style={{}}
            onClick={() => handleLogoClick()}
          >
            LOCALBITE
          </label>
          <SearchBox onSearch={(searchText) => handleSearch(searchText)} />

          {!sessionStorage.getItem("accessToken") && (
            <Menu.Item
              key="login"
              icon={<LockOutlined />}
              onClick={handleLogin}
            >
              Giriş Yap
            </Menu.Item>
          )}
          {sessionStorage.getItem("accessToken") && (
            <Menu
              mode="horizontal"
              selectedKeys={[selectedCategory]}
              defaultSelectedKeys={[""]}
              itemHoverColor="green"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Menu.Item
                key="basket"
                icon={<ShoppingCartOutlined />}
                onClick={goToBasketPage}
              >
                Sepetim
              </Menu.Item>
              <Menu.Item
                key="info"
                icon={<InfoCircleOutlined />}
                onClick={() => navigate(`/info`)}
              >
                Profilim
              </Menu.Item>
              <Menu.Item
                key="addresses"
                icon={<HomeOutlined />}
                onClick={() => navigate(`/addresses`)}
              >
                Adreslerim
              </Menu.Item>
              <Menu.Item
                key="favorites"
                icon={<HeartOutlined />}
                onClick={handleFavProductsClick}
              >
                Favori Ürünlerim
              </Menu.Item>
              {/* <Menu.Item
                key="vendors"
                icon={<UserOutlined />}
                onClick={() => navigate(`/favoriteVendors/${user.id}`)}
              >
                Favori Satıcılarım
              </Menu.Item> */}
              <Menu.Item
                key="orders"
                icon={<ShoppingOutlined />}
                onClick={() => navigate(`/orders/${user.id}`)}
              >
                Siparişlerim
              </Menu.Item>
              <Menu.Item
                key="logout"
                icon={<LockOutlined />}
                onClick={handleLogout}
              >
                Çıkış Yap
              </Menu.Item>
            </Menu>
          )}
        </Menu>
      </ConfigProvider>
    </>
  );
};

export default Navbar;
