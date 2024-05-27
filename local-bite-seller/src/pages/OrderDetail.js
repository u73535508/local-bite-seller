import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Menu, ConfigProvider, Select } from "antd";
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
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { Option } = Select;
export const OrderDetail = () => {
  const { orderId, orderItemId } = useParams();
  const [orderItem, setOrderItem] = useState();
  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("accessToken");

  const handleOrderStatus = (value) => {
    const updateStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/customer/orderitem/${orderItemId}/update/`,
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

        // setOrder((o) => ({ ...o, status: updatedOrderData.status }));
        setOrderItem((o) => ({ ...o, status: updatedOrderData.status }));

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
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/seller/order/${orderId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // const updatedOrderData = response.data;

        // setOrder((o) => ({ ...o, status: updatedOrderData.status }));
        // setOrderItem((o) => ({ ...o, status: updatedOrderData.status }));
        setOrder(response.data);
        console.log("order item id: ", orderItemId);
        const item = response.data.items.filter(
          (item) => item.id == orderItemId.toString()
        );
        console.log("item: ", item);
        setOrderItem(item[0]);

        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/auth/user/${order?.user}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          setUser(response.data);
        } catch (error) {
          console.error("Failed to update order status", error);
        }
      } catch (error) {
        console.error("Failed to update order status", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

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
          <p>Sipariş yükleniyor...</p>
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
  function formatDateString(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Extract the date components
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    // Extract the time components
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Format the date and time as "dd-mm-yyyy hh:mm"
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

    return formattedDate;
  }
  return (
    <Card>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ marginBottom: "0" }}>Ürün Bilgileri</h2>
          <div>
            <h3>Ürün Adı:</h3>
            <p>{orderItem?.cart_item.product.name}</p>

            <Image
              style={{ width: "150px", height: "150px" }}
              src={
                orderItem?.cart_item.product.photos
                  ? orderItem?.cart_item.product.photos
                  : "https://via.placeholder.com/200x150?text=No+Image"
              }
            />
          </div>
          <div>
            <h3>Ürün Adeti:</h3>
            <p>
              {orderItem?.cart_item.quantity} Adet (
              {orderItem?.cart_item.product.unit})
            </p>
          </div>
          <div>
            <h2>Toplam Tutar:</h2>
            <p>{orderItem?.order?.total} TL</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ marginBottom: "0" }}>Teslimat Bilgileri</h2>
          <div>
            <h3>Teslimat Türü:</h3>
            <p>{order?.shipping_method}</p>
          </div>

          <div>
            <h3>Teslimat Adresi:</h3>
            <p>
              {order?.address?.tag}: {order?.address?.address_line1},{" "}
              {order?.address?.address_line2}, {order?.address?.city},{" "}
              {order?.address?.state}, {order?.address?.postal_code}
            </p>
          </div>
          <div>
            <h2>Alıcı Bilgileri:</h2>
            <p>
              {user?.first_name} {user?.last_name}
            </p>
            <p>{user?.email}</p>
            <p>{user?.phone_number}</p>
          </div>
          <div>
            <h2>Sipariş Tarihi:</h2>
            <p>{formatDateString(order?.created_date)}</p>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            alignContent: "center",
            marginBottom: "100px",
          }}
        >
          <h2>Sipariş Durumu:</h2>
          <Select
            size="middle"
            defaultValue={orderItem?.status}
            style={{ width: "150px", marginBottom: "20px" }}
            onChange={(e) => handleOrderStatus(e)}
          >
            <Option value="Onay bekliyor">Onay Bekliyor</Option>
            <Option value="Onaylandı">Onaylandı</Option>
            <Option value="Kargolandı">Kargolandı</Option>
            <Option value="Teslim edildi">Teslim Edildi</Option>
            <Option value="İptal edildi">İptal Edildi</Option>
          </Select>
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  colorBorder: "#E9AA53",
                  hoverBorderColor: "#F0CA95",
                  activeBorderColor: "#F0CA95",
                  colorSuccessBg: "#F0CA95",
                  colorSuccessBgHover: "red",
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
            <Button
              type="primary"
              onClick={() =>
                navigate(`/product/${orderItem?.cart_item.product.id}`)
              }
            >
              Ürünü Görüntüle
            </Button>
          </ConfigProvider>
          {/* <p>{orderItem?.status}</p> */}
        </div>
      </div>
    </Card>
  );
};
