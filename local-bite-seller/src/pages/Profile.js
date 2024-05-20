import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, Tabs } from "antd";
import { useUser } from "../contexts/UserContext";
import { Rate } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";

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

import { EditOutlined } from "@ant-design/icons";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const token = sessionStorage.getItem("accessToken");
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [favProductIds, setFavProductIds] = useState([]);
  const [user, setUser] = useState(null);

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

    const fetchSeller = async (userId) => {
      // setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/seller/user/${userId}/`
        );
        console.log(response.data);
        setSeller(response.data);
        return response.data.id;
      } catch (error) {
        console.error(error);
        message.error("Satıcı bilgileri getirilirken bir hata oluştu.");
      } finally {
        setLoadingInfo(false);
      }
    };

    const fetchSellerProducts = async (sellerId) => {
      setLoadingProducts(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/seller/${sellerId}/products/`
        );
        console.log(response.data);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        message.error("Ürün bilgileri getirilirken bir hata oluştu.");
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchSellerReviews = async (sellerId) => {
      setLoadingReviews(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/customer/seller/${sellerId}/product-reviews/`
        );
        console.log(response.data);
        setReviews(response.data);
      } catch (error) {
        console.error(error);
        message.error("Yorum bilgileri getirilirken bir hata oluştu.");
      } finally {
        setLoadingReviews(false);
      }
    };

    const initializeData = async () => {
      const user = await fetchCurrentUser();
      if (user) {
        const sellerId = await fetchSeller(user.id);
        if (sellerId) {
          await fetchSellerProducts(sellerId);
          await fetchSellerReviews(sellerId);
        }
      }
    };

    initializeData();
  }, []);

  const handleUpdateProfile = () => {
    navigate("/editProfile");
  };

  const handleNewProduct = () => {
    navigate("/editProduct/0");
  };
  const { TabPane } = Tabs;
  if (loadingInfo) {
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
          <p>Profiliniz yükleniyor...</p>
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
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                inkBarColor: "#E9AA53",
                itemActiveColor: "#E9AA53",
                itemHoverColor: "#ECB76C",
                itemSelectedColor: "#E9AA53",
                itemColor: "rgba(0, 0, 0, 0.4)",
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
          <Card style={{ border: "solid 1px lightGray" }}>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button onClick={handleUpdateProfile}>
                <EditOutlined />
                Profili Düzenle
              </Button>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginLeft: "20px",
                }}
              >
                <div style={{ width: "160px", height: "160px" }}>
                  <img
                    src="https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/39f72400ec0e6d36c17c5a807b148146.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp" // replace with your image path
                    // alt={seller.brand_name}
                    style={{
                      cursor: "pointer",
                      width: "100%",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "150px",
                  }}
                >
                  <h1 style={{ marginBottom: "0", fontWeight: "700" }}>
                    {seller?.brand_name}
                  </h1>
                  <p style={{ marginBottom: "0", fontWeight: "400" }}>
                    {seller?.brand_email}
                  </p>
                  <p style={{ marginBottom: "0", fontWeight: "400" }}>
                    {seller?.brand_contact_no}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ marginTop: "20px" }}>
            <div>
              <div>
                <ConfigProvider
                  theme={{
                    components: {
                      TabPane: {
                        marginLeft: "50px",
                      },
                    },
                  }}
                >
                  <div>
                    <Tabs
                      defaultActiveKey="seller"
                      tabBarStyle={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <TabPane tab="Hakkımızda" key="hakkımızda">
                        {loadingInfo ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              height: "40vh",
                              alignItems: "flex-end",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <p>Profiliniz yükleniyor...</p>
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
                          <p style={{ marginBottom: "0" }}>
                            {seller?.description}
                          </p>
                        )}
                      </TabPane>
                      <TabPane tab="Ürünler" key="ürünler">
                        <div
                          style={{
                            dislay: "flex",
                            flexDirection: "column",
                            textAlign: "end",
                          }}
                        >
                          <div>
                            <Button
                              style={{ textAlign: "end", justifySelf: "end" }}
                              onClick={handleNewProduct}
                            >
                              <PlusOutlined />
                              Yeni Ürün
                            </Button>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {loadingProducts ? (
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
                            ) : (
                              products?.map((product) => (
                                <Card
                                  key={product.id}
                                  style={{
                                    width: 200,
                                    height: 311,
                                    margin: 16,
                                    border: "solid 1px lightGray",
                                  }}
                                >
                                  <img
                                    src="https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/39f72400ec0e6d36c17c5a807b148146.jpg" // replace with your image path
                                    alt={product.name}
                                    style={{
                                      width: "100%",
                                      height: "150px",
                                    }}
                                  />
                                  <p>{product.name}</p>
                                  <p>
                                    {product.unit} - {product.price_per_unit} TL
                                  </p>
                                </Card>
                              ))
                            )}
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tab="Değerlendirmeler" key="değerlendirmeler">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: "wrap",
                          }}
                        >
                          {loadingReviews ? (
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
                            reviews?.map((review) => (
                              <Card
                                key={review.id}
                                style={{
                                  border: "solid 1px lightGray",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div>
                                    <Rate
                                      disabled
                                      defaultValue={review.rating}
                                    />
                                  </div>
                                  <div>{review.customer}</div>
                                  <div style={{ marginTop: "10px" }}>
                                    {review.comment}
                                  </div>
                                </div>
                              </Card>
                            ))
                          )}
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </ConfigProvider>
              </div>
              <div></div>
            </div>
          </Card>
        </ConfigProvider>
      </div>
    );
  }
}
