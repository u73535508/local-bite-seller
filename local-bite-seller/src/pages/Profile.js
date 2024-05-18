import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, Tabs } from "antd";
import { useUser } from "../contexts/UserContext";
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

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const token = sessionStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [favProductIds, setFavProductIds] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(async () => {
    setLoading(true);
    const fetchCurrentUser = async () => {
      try {
        const user = await currentUser();
        console.log(user);
        setUser(user);
      } catch (error) {
        console.error(error);
        message.error("Kullanıcı bilgileri getirilirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    const fetchSeller = async () => {
      console.log(user);
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/seller/user/${user.id}/`
      );
      console.log(response.data);
      setLoading(false);
      setSeller(response.data);
      return response.data.id;
    };
    const fetchSellerProducts = async (id) => {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/seller/${id}/products/`
      );
      console.log(response.data);
      setLoading(false);
      setProducts(response.data);
      return response.data;
    };
    const fetchSellerReviews = async (id) => {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/customer/seller/${id}/product-reviews/`
      );
      setLoading(false);
      setReviews(response.data);
      return response.data;
    };
    await fetchCurrentUser();
    const sellerId = await fetchSeller();
    await fetchSellerProducts(sellerId);
    await fetchSellerReviews(sellerId);
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
                          {products?.map((product) => (
                            <div>
                              {
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
                              }
                            </div>
                          ))}
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
                          {reviews?.map((review) => (
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
                                  <Rate disabled defaultValue={review.rating} />
                                </div>
                                <div>{review.customer}</div>
                                <div style={{ marginTop: "10px" }}>
                                  {review.comment}
                                </div>
                              </div>
                            </Card>
                          ))}
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
