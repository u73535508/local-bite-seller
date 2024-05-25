// src/pages/Home.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Card, Spin, message } from "antd";
import { useSelector } from "react-redux";
import { Menu, ConfigProvider } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  FileImageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ChatBox from "../common/Chatbox";
import { useUser } from "../contexts/UserContext";
const Home = ({ searchText }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("accessToken");
  const location = useLocation();
  const filteredCategory = useSelector((state) => state.category);
  const [favProductIds, setFavProductIds] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);

  const fetchAllProducts = async () => {
    const response = await axios.get("http://127.0.0.1:8000/seller/products/");
    return response.data;
  };
  // it returns favorite product ids
  const fetchFavoriteProductIds = async (token) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/customer/favitems/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response.data);
      return response.data.map((product) => product.product.id);
    } catch (e) {
      if (e.response.data.status === "403");
      sessionStorage.clear();
      console.log("e", e);
    }
  };

  const filterProductsByCategory = (products, category) => {
    return products.filter((product) => product.category === category);
  };
  const filterProductsByName = (products, name) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase())
    );
  };
  useEffect(() => {
    // it calls when text changes
    if (searchText) {
      const filtered = filterProductsByName(products, searchText);
      console.log("filtered", filtered);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchText]);
  useEffect(() => {
    console.log("triggered");
    // it calls when category changes
    if (filteredCategory) {
      const filtered = filterProductsByCategory(products, filteredCategory);
      console.log("filtered", filtered);
      setFilteredProducts(filtered);
    }
  }, [filteredCategory]);
  useEffect(() => {
    // it calls if showFavorites changes
    setLoading(true);
    if (location.state) {
      console.log("state: ", location.state);
      const filtered = products.filter((product) =>
        favProductIds.includes(product.id)
      );
      setFilteredProducts(filtered);
    } else if (!filteredCategory) {
      setFilteredProducts(products);
    }
    setLoading(false);
  }, [location.state]);
  useEffect(() => {
    // it fetchs all products and favorite products calls only first render
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const products = await fetchAllProducts();
        if (token) {
          const favProductIds = await fetchFavoriteProductIds(token);

          setFavProductIds(favProductIds);
        }
        setProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Error:", error);
        message.error("Ürünler getirilirken bir hata oluştu");
      }
      setLoading(false);
    };

    fetchProducts();
  }, [token]);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "40vh",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Ürünler yükleniyor...</p>
          <ConfigProvider
            theme={{
              components: {
                Spin: {
                  colorPrimary: "#F0CA95",
                },
              },
            }}
          >
            <Spin size="large" />
          </ConfigProvider>
        </div>
      </div>
    );
  }

  const toggleChatBox = () => {
    setIsChatBoxVisible(!isChatBoxVisible);
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredProducts?.length > 0 ? (
          filteredProducts.map((product) => (
            <Card
              key={product.id}
              style={{
                width: 200,
                margin: 16,
                border: "0.5px solid lightGray",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product?.photos ? (
                <img
                  src={product.photos}
                  alt={product.name}
                  style={{ cursor: "pointer", width: "100%", height: "150px" }}
                />
              ) : (
                <FileImageOutlined style={{ fontSize: "150px" }} />
              )}

              <p>{product.name}</p>
              <p>
                {product.unit} - {product.price_per_unit} TL
              </p>
            </Card>
          ))
        ) : (
          <p>Ürün bulunamadı</p>
        )}
      </div>
      <div style={{ position: "fixed", right: 16, bottom: 16 }}>
        {!isChatBoxVisible && (
          <img
            onClick={() => toggleChatBox()}
            style={{ cursor: "pointer", borderRadius: "50%" }}
            width="150"
            src="https://png.pngtree.com/png-vector/20240130/ourlarge/pngtree-cute-cartoon-farmer-character-generative-ai-png-image_11568944.png"
          />
        )}
      </div>
      <ChatBox visible={isChatBoxVisible} onClose={toggleChatBox} />
    </div>
  );
};

export default Home;
