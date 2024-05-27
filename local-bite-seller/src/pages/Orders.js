import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ConfigProvider, Select } from "antd";

import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  UserOutlined,
  DeleteOutlined,
  FileImageOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import { Card, Spin, Button, InputNumber, Input, Image, message } from "antd";

const { Option } = Select;

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();
  //customer/order/update/1/

  const handleOrderStatus = (value, order) => {
    const updateStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/customer/orderitem/${order.id}/update/`,
          {
            status: value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedOrderData = response.data;

        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.order === order.order
              ? { ...o, status: updatedOrderData.status }
              : o
          )
        );
        console.log(updatedOrderData);
      } catch (error) {
        console.error("Failed to fetch order data", error);
      } finally {
        setLoading(false);
      }
    };

    updateStatus(order);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/seller/orderitems/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch order data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div>
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
            <p>Siparişler yükleniyor...</p>
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
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card
                key={order.id}
                style={{
                  width: "55vw",
                  margin: 16,
                  border: "0.5px solid lightGray",
                }}
              >
                <div
                  style={{
                    display: "grid",
                  }}
                >
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "row",
                      justifySelf: "end",
                      alignContent: "center",
                    }}
                    onClick={() =>
                      navigate(`/orderDetail/${order.order}/${order.id}`)
                    }
                  >
                    <InfoCircleOutlined
                      style={{ color: "#E9AA53", marginTop: "2.5px" }}
                    />
                    <label
                      style={{
                        cursor: "pointer",
                        marginLeft: "5px",
                        color: "#E9AA53",
                      }}
                    >
                      Sipariş Detayını Görüntüle
                    </label>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <h2>{order.cart_item_product.name}</h2>

                    <Image
                      src={
                        order.cart_item_product.photos
                          ? order.cart_item_product.photos
                          : "https://via.placeholder.com/200x150?text=No+Image"
                      }
                      alt={order.cart_item_product.name}
                      style={{
                        cursor: "pointer",
                        width: "150px",
                        height: "150px",
                      }}
                      onClick={() =>
                        navigate(`/product/${order.cart_item_product.id}`)
                      }
                    />
                  </div>
                  <div>
                    <h3>Adet:</h3>
                    <p>
                      {order.cart_item_quantity} adet (
                      {order.cart_item_product.unit})
                    </p>
                  </div>
                  <div>
                    <h3>Tutar:</h3>
                    <p>
                      {order.cart_item_product.price_per_unit *
                        order.cart_item_quantity}
                      TL
                    </p>
                  </div>
                  <div>
                    <h2>Sipariş Durumu:</h2>

                    <Select
                      size="middle"
                      defaultValue={order.status}
                      style={{ width: "150px" }}
                      onChange={(e) => handleOrderStatus(e, order)}
                    >
                      <Option value="Onay bekliyor">Onay Bekliyor</Option>
                      <Option value="Onaylandı">Onaylandı</Option>
                      <Option value="Kargolandı">Kargolandı</Option>
                      <Option value="Teslim edildi">Teslim Edildi</Option>
                      <Option value="İptal edildi">İptal Edildi</Option>
                    </Select>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p>Henüz hiç siparişiniz bulunmamaktadır.</p>
          )}
        </>
      )}
    </div>
  );
};
