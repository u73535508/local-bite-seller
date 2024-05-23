// src/components/common/Navbar.js
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, ConfigProvider, message } from "antd";
import axios from "axios";
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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const { logout, currentUser } = useUser();
  const selectedCategory = useSelector((state) => state.category);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      try {
        const user = await currentUser();
        console.log(user);
        setUser(user);
        await fetchSeller(user.id); // Wait for fetchSeller to complete
      } catch (error) {
        console.error("Kullanıcı bilgisi alınamadı.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [currentUser]);

  const fetchSeller = async (userId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/seller/user/${userId}/`
      );
      console.log(response.data);
      setSeller(response.data);
    } catch (error) {
      console.error("Satıcı bilgisi alınamadı.", error);
      message.error("Satıcı bilgileri getirilirken bir hata oluştu.");
    }
  };
  const handleLogoClick = () => {
    dispatch(setCategory(""));
    window.location.href = "/";
  };
  const handleFavProductsClick = () => {
    console.log("user", user);
    dispatch(setCategory(""));
    navigate("/", { state: { showFavorites: true } });
  };
  const handleCategoryClick = (category) => {
    navigate("/");
    dispatch(setCategory(category));
  };
  const handleLogout = async () => {
    dispatch(setCategory(""));
    await logout();
    window.location.href = "/";
  };
  const handleSearch = (text) => {
    onSearch(text);
  };
  const handleLogin = () => {
    dispatch(setCategory(""));
    navigate("/register");
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              horizontalItemSelectedColor: "#E9AA53",
            },
            Input: {
              colorBorder: "#E9AA53",
              hoverBorderColor: "#F0CA95",
              activeBorderColor: "#F0CA95",
              colorSuccessBg: "#F0CA95",
              colorSuccessBgHover: "red",
            },
            Button: {
              colorPrimary: "#E9AA53",
              colorPrimaryActive: "#E9AA53",
              colorPrimaryHover: "#ECB76C",
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
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
          <a
            key="map"
            onClick={() => navigate("/map")}
            style={{
              background: "#E9AA53",
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
        </div>

        <Menu
          // theme="dark"
          mode="horizontal"
          selectedKeys={[selectedCategory]}
          defaultSelectedKeys={[""]}
          overflowedIndicator={false}
          style={{
            alignItems: "center",
            marginBottom: "2rem",
            marginTop: "10px",
            justifyContent: "flex-end",
            width: "75vw",
          }}
        >
          {/* <label
            className={classes.logo}
            style={{}}
            onClick={() => handleLogoClick()}
          >
            LOCALBITE
          </label>
          <SearchBox onSearch={(searchText) => handleSearch(searchText)} /> */}

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
                key="info"
                icon={<InfoCircleOutlined />}
                onClick={() => navigate(`/profile`)}
              >
                Profilim
              </Menu.Item>
              {/* <Menu.Item
                key="addresses"
                icon={<HomeOutlined />}
                onClick={() => navigate(`/addresses`)}
              >
                Adreslerim
              </Menu.Item> */}

              <Menu.Item
                key="orders"
                icon={<ShoppingOutlined />}
                onClick={() => navigate(`/orders/${seller.id}`)}
              >
                Siparişler
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
