import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Menu, ConfigProvider } from "antd";
import { HeartOutlined, HeartFilled, StarFilled } from "@ant-design/icons";

import {
  Card,
  Spin,
  Button,
  InputNumber,
  Typography,
  Row,
  Col,
  Input,
  Avatar,
  Image,
  message,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { WarningContext } from "antd/es/_util/warning";

const { Title, Text } = Typography;
const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [seller, setSeller] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const token = sessionStorage.getItem("accessToken");

  const navigateToSellerPage = () => {
    navigate(`/seller/${product.seller}`);
  };

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity((prevState) => Number(prevState) + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevState) => Number(prevState) - 1);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/seller/product/${id}`
        );
        const data = await response.json();
        console.log("product:", data);
        setProduct(data);
        return data;
      } catch (error) {
        console.error("Error fetching product:", error);
        message.error("Error fetching product. Please try again.");
      }
    };

    const fetchSellerData = async (sellerId) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/seller`);
        const data = await response.json();
        console.log("sellerData:", data);
        const seller = data.find((seller) => seller.id === sellerId);
        console.log("seller:", seller);
        setSeller(seller);
      } catch (error) {
        console.error("Error fetching seller data:", error);
        message.error("Error fetching seller data. Please try again.");
      }
    };

    const initializeData = async () => {
      setLoading(true);

      try {
        const productData = await fetchProduct();
        await fetchSellerData(productData.seller);
      } finally {
        setLoading(false);
      }
    };
    if (id && id !== 0) {
      initializeData();
    }
  }, [id, token]);

  const handleAddToCart = async (productId) => {
    let hideLoadingMessage = null;
    try {
      hideLoadingMessage = message.loading("Sepete ekleniyor...", 0);
      await axios.post(
        "http://127.0.0.1:8000/customer/cartitems/",
        { product_id: id, quantity: quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      hideLoadingMessage();
      message.success("Sepete eklendi!!!");
    } catch (error) {
      console.error("Error:", error);
      if (hideLoadingMessage) hideLoadingMessage();
      message.error("Tekrar dene");
    }
  };

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
          <p>Ürün yükleniyor...</p>
          <ConfigProvider
            theme={{
              components: {
                Spin: {
                  colorPrimary: "#E9AA53",
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

  if (!product) {
    return <p>Ürün bulunamadı!</p>;
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBorder: "#E9AA53",
            hoverBorderColor: "#F0CA95",
            activeBorderColor: "#F0CA95",
            colorSuccessBg: "#F0CA95",
            colorSuccessBgHover: "red",
          },
          Button: {
            colorPrimary: "#E9AA53",
            colorPrimaryHover: "#ECB76C",
            colorPrimaryActive: "#E9AA53",
          },
          Checkbox: {
            colorPrimary: "#E9AA53",
            colorPrimaryHover: "#F0CA95",
          },
        },
      }}
    >
      <Card
        key={product.id}
        style={{
          border: "solid 1px lightGray",
        }}
      >
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Title style={{ marginLeft: "24px" }} level={2}>
            {id !== 0 ? (
              <p>{product.name}</p>
            ) : (
              <div>
                <label>Ürün Adı: </label>
                <Input name="name" />
              </div>
            )}
          </Title>
        </Row>
        <Row
          style={{
            padding: "24px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Col span={6}>
            <img
              src="https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/39f72400ec0e6d36c17c5a807b148146.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp" // replace with your image path
              alt={product.name}
              style={{
                width: "160px",
                height: "160px",
              }}
            />
          </Col>
          <Col span={6}>
            <Text style={{ fontSize: "16px" }}>
              <p style={{ fontWeight: "500", marginBottom: "0" }}>
                Birim Satış:
              </p>
              {product.unit}
            </Text>
            <br />
            <Text style={{ fontSize: "16px", fontWeight: "400" }}>
              <p style={{ fontWeight: "500", marginBottom: "0" }}>Price:</p>{" "}
              {product.price_per_unit}
            </Text>
          </Col>

          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            span={6}
          >
            <br />
            <br />
            <Row>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {sessionStorage.getItem("accessToken") && (
                  <>
                    <Button
                      icon={<MinusOutlined />}
                      onClick={decreaseQuantity}
                      disabled={quantity == 1}
                    />
                    <Input
                      style={{ width: "50px" }}
                      onChange={(e) => setQuantity(e.target.value)}
                      value={quantity}
                    />
                    <Button
                      icon={<PlusOutlined />}
                      onClick={increaseQuantity}
                      disabled={quantity >= product.quantity}
                    />
                  </>
                )}
              </div>
            </Row>

            <br />
            {quantity >= product.quantity && (
              <Typography.Text type="danger">
                Stok üzerinde miktar girdiniz!
              </Typography.Text>
            )}
          </Col>
        </Row>
        <br />
        <Row>
          <Title style={{ fontSize: "20px", marginLeft: "24px" }}>
            Description:
          </Title>
        </Row>
        <Row>
          <Text style={{ marginLeft: "24px" }}>{product.description}</Text>
        </Row>
      </Card>
    </ConfigProvider>
  );
};

export default EditProduct;
