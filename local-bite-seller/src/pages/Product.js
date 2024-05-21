import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Menu, ConfigProvider } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";

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

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useUser();
  const [reviews, setReviews] = useState([]);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState({});
  const [currentSeller, setCurrentSeller] = useState({});
  const token = sessionStorage.getItem("accessToken");
  const [user, setUser] = useState(null);

  const navigateToSellerPage = () => {
    navigate(`/seller/${product.seller}`);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoadingInfo(true);
      try {
        const user = await currentUser();
        console.log(user);
        setUser(user);
        return user;
      } catch (error) {
        console.error(error);
        message.error("Kullanıcı bilgileri getirilirken bir hata oluştu.");
      }
      // finally {
      //   setLoadingInfo(false);
      // }
    };

    const fetchCurrentSeller = async (userId) => {
      // setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/seller/user/${userId}/`
        );
        console.log(response.data);
        setCurrentSeller(response.data);
        return response.data.id;
      } catch (error) {
        console.error(error);
        message.error("Satıcı bilgileri getirilirken bir hata oluştu.");
      } finally {
        setLoadingInfo(false);
      }
    };

    const initializeData = async () => {
      const user = await fetchCurrentUser();
      if (user) {
        const sellerId = await fetchCurrentSeller(user.id);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    // console.log(loadingReviews);
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
        const response = await fetch(
          `http://127.0.0.1:8000/seller/${sellerId}`
        );
        const data = await response.json();
        console.log("sellerData:", data);
        console.log("seller:", response.data);
        setSeller(data);
      } catch (error) {
        console.error("Error fetching seller data:", error);
        message.error("Error fetching seller data. Please try again.");
      }
    };

    const fetchReviews = async () => {
      try {
        // setLoadingReviews(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/customer/product/${id}/reviews/`
        );
        const reviewsData = response.data;
        console.log("reviews:", reviewsData);
        setReviews(reviewsData);
        // setLoadingReviews(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // setLoadingReviews(false);
        message.error("Error fetching reviews. Please try again.");
      }
    };

    const initializeData = async () => {
      // setLoadingReviews(true);
      setLoading(true);

      try {
        const productData = await fetchProduct();
        console.log(productData);
        await fetchSellerData(productData.seller);
        // await fetchFavoriteProducts();
        // setSeller(productData.seller);
        await fetchReviews();
      } finally {
        setLoading(false);
        // setLoadingReviews(false);
      }
    };

    initializeData();
  }, [id, token]);

  const handleEditProduct = (id) => {
    navigate(`/editProduct/${seller.id}/${id}`);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    console.log(totalRating);
    console.log(Math.round(totalRating / reviews.length));
    console.log(reviews.length);

    return Math.round(totalRating / reviews.length);
  };

  // Render average star rating
  const renderAverageRating = () => {
    if (reviews.length > 0) {
      const averageRating = calculateAverageRating();
      const stars = [];

      for (let i = 0; i < averageRating; i++) {
        stars.push(<StarFilled key={i} style={{ color: "#FFD700" }} />);
      }
      for (let i = 0; i < 5 - averageRating; i++) {
        stars.push(<StarOutlined key={i} style={{ color: "#FFD700" }} />);
      }

      return (
        <div>
          {stars} <span>({averageRating})</span>
        </div>
      );
    }
    return null;
  };
  const renderReviews = () => {
    return reviews.map((review, index) => (
      <div key={index} style={{ marginBottom: "10px" }}>
        <Row align="middle">
          <Col flex="auto">
            <Text strong>
              {review.user.first_name.slice(0, 2) +
                "*".repeat(review.user.first_name.length - 2) +
                " " +
                review.user.last_name.slice(0, 2) +
                "*".repeat(review.user.last_name.length - 2)}
            </Text>
          </Col>
          <Col>
            {Array.from({ length: review.rating }).map((_, i) => (
              <StarFilled key={i} style={{ color: "#FFD700" }} />
            ))}
            {Array.from({ length: 5 - review.rating }).map((_, i) => (
              <StarOutlined key={i} style={{ color: "#FFD700" }} />
            ))}
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <Text>{new Date(review.created_date).toLocaleDateString()}</Text>
          </Col>
        </Row>
        <Text>{review.comment}</Text>
        <hr />
      </div>
    ));
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
  console.log("data", product);
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
            {product.name}
            {renderAverageRating()}
          </Title>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "65px",
            }}
          >
            <Avatar
              size={40}
              style={{
                backgroundColor: "#E9AA53",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={navigateToSellerPage}
            >
              {product.seller.id}
            </Avatar>
            <Title
              style={{ margin: "0", fontSize: "20px", fontWeight: "500" }}
              level={2}
            >
              {seller?.brand_name}
            </Title>
          </div>
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
              display: "grid",
              alignSelf: "end",
            }}
            span={6}
          >
            <br />

            {currentSeller?.id === product?.seller && (
              <div
                style={{
                  display: "flex",
                  justifySelf: "end",
                  marginBottom: "14px",
                }}
              >
                <Button
                  style={{}}
                  onClick={() => handleEditProduct(product.id)}
                >
                  <EditOutlined />
                  Düzenle
                </Button>
              </div>
            )}
            {/* <br />
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
            <br /> */}
            {/* {sessionStorage.getItem("accessToken") && (
              <Button
                loading={buttonLoading}
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={addToCart}
                disabled={quantity >= product.quantity}
              >
                Sepete Ekle
              </Button>
            )}
            <br />
            {sessionStorage.getItem("accessToken") && (
              <Button
                loading={favLoading}
                type="primary"
                icon={<HeartOutlined />}
                onClick={isFav ? removeFromFavorite : addToFavorite}
              >
                {isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              </Button>
            )}
            {quantity >= product.quantity && (
              <>
                {product.quantity === 0 ? (
                  <Typography.Text type="danger">
                    Stokta ürün bulunmamaktadır!
                  </Typography.Text>
                ) : (
                  <Typography.Text type="danger">
                    Stok üzerinde miktar girdiniz!
                  </Typography.Text>
                )}
              </>
            )} */}
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
        <Title level={4}>Yorumlar</Title>
        {reviews.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "20vh",
                  width: "100%",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p>Değerlendirmeler yükleniyor...</p>
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
            ) : (
              renderReviews()
            )}
          </div>
        )}
        {reviews.length === 0 && <p>Henüz yorum yapılmamıştır.</p>}
      </Card>
    </ConfigProvider>
  );
};

export default Product;
