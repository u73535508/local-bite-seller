import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { ConfigProvider, Tabs } from "antd";
import { Rate } from "antd";
import axios from "axios";

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
export default function Seller() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState(null);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/seller/${id}/`);
      console.log(response.data);
      setLoading(false);
      setSeller(response.data);
      return response.data;
    };
    const fetchSellerProducts = async () => {
      setLoadingProducts(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/seller/${id}/products/`
      );
      setLoadingProducts(false);
      setProducts(response.data);
      return response.data;
    };
    const fetchSellerReviews = async () => {
      setLoadingReviews(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/customer/seller/${id}/product-reviews/`
      );
      setLoadingReviews(false);
      setReviews(response.data);
      return response.data;
    };
    const initializeData = async () => {
      await fetchSellerProducts();
      await fetchSellerReviews();
    };
    fetchSeller();
    initializeData();
  }, []);

  const { TabPane } = Tabs;
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
          <p>Satıcı yükleniyor...</p>
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
            },
          }}
        >
          <Card style={{ border: "solid 1px lightGray" }}>
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
                        <p style={{ marginBottom: "0" }}>
                          {seller?.description}
                        </p>
                      </TabPane>
                      <TabPane tab="Ürünler" key="ürünler">
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
                            <>
                              {!products || products.length === 0 ? (
                                <p>Henüz ürün bulunmamaktadır.</p>
                              ) : (
                                <>
                                  {products.map((product) => (
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
                                        src="https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/39f72400ec0e6d36c17c5a807b148146.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp" // replace with your image path
                                        alt={product.name}
                                        onClick={() =>
                                          navigate(`/product/${product.id}`)
                                        }
                                        style={{
                                          width: "100%",
                                          height: "150px",
                                          cursor: "pointer",
                                        }}
                                      />
                                      <p>{product.name}</p>
                                      <p>
                                        {product.unit} -{" "}
                                        {product.price_per_unit} TL
                                      </p>
                                    </Card>
                                  ))}
                                </>
                              )}
                            </>
                          )}
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
                                    justifyContent: "space-between",
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
                                    <div style={{ fontWeight: "600" }}>
                                      {review.user.first_name.slice(0, 2) +
                                        "*".repeat(
                                          review.user.first_name.length - 2
                                        ) +
                                        " " +
                                        review.user.last_name.slice(0, 2) +
                                        "*".repeat(
                                          review.user.last_name.length - 2
                                        )}
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                      {review.comment}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginLeft: "24px",
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <img
                                      src="https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/39f72400ec0e6d36c17c5a807b148146.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp" // replace with your image path
                                      alt={review.product.name}
                                      onClick={() =>
                                        navigate(
                                          `/product/${review.product.id}`
                                        )
                                      }
                                      style={{
                                        width: "70px",
                                        height: "70px",
                                        cursor: "pointer",
                                      }}
                                    />
                                    {review.product.name}
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
