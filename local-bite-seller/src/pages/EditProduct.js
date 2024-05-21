import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Menu, ConfigProvider, Select } from "antd";
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
  Form,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { WarningContext } from "antd/es/_util/warning";

const { TextArea } = Input;
const { Title, Text } = Typography;
const EditProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { sellerId, id } = useParams();
  console.log(id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [seller, setSeller] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const token = sessionStorage.getItem("accessToken");

  const onFinish = async (values) => {
    let hideLoadingMessage = null;
    setLoading(true);
    console.log(seller);
    try {
      hideLoadingMessage = message.loading("Bilgileriniz güncelleniyor...", 0);
      let res = "";
      if (id != 0) {
        let formData = new FormData();
        Object.keys(values).forEach((key) => formData.append(key, values[key]));
        formData.append("subcategory", 2);
        // formData.append("seller", seller.id);

        res = await axios.put(
          `http://127.0.0.1:8000/seller/profile/products/${product.id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        res = await axios.post(
          `http://127.0.0.1:8000/seller/profile/products/`,
          { ...values, subcategory: 2, seller: seller },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        );
      }

      console.log("res", res);
      hideLoadingMessage();
      message.success("Bilgileriniz başarıyla güncellendi.");
    } catch (error) {
      console.error(error);
      message.error("Bilgileriniz güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  const handleCatChange = (c) => {
    form.setFieldValue("category", c);
  };
  useEffect(() => {
    const fetchProduct = async () => {
      form.setFieldValue("category", "Kahvaltılık");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/seller/product/${id}`
        );
        const data = await response.json();
        form.setFieldsValue(data);
        console.log("product:", data.name);
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
        setSeller(productData.seller);
        console.log(productData);
      } finally {
        setLoading(false);
      }
    };
    if (id != 0) {
      console.log(id);
      console.log(id && id !== 0);

      initializeData();
    } else {
      setLoading(false);
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
          InputNumber: {
            colorBorder: "#E9AA53",
            hoverBorderColor: "#F0CA95",
            activeBorderColor: "#F0CA95",
            colorSuccessBg: "#F0CA95",
            colorSuccessBgHover: "red",
          },
          TextArea: {
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
        key={product?.id}
        style={{
          border: "solid 1px lightGray",
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Title style={{ marginLeft: "24px" }} level={2}>
              <Form.Item
                label="Ürün Adı"
                name="name"
                rules={[
                  { required: true, message: "Lütfen ürün ismini girin." },
                ]}
              >
                <Input />
              </Form.Item>
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
                alt={product?.name}
                style={{
                  width: "160px",
                  height: "160px",
                }}
              />
            </Col>
            <Col span={6}>
              <Form.Item
                label="Birim Satış"
                name="unit"
                rules={[
                  { required: true, message: "Lütfen satış birimi girin." },
                ]}
              >
                <Input />
              </Form.Item>
              <br />
              <Form.Item
                label="Birim Fiyatı"
                name="price_per_unit"
                rules={[
                  { required: true, message: "Lütfen birim fiyatı girin." },
                ]}
              >
                <InputNumber />
              </Form.Item>
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
                      <Form.Item
                        label="Stok Miktarı"
                        name="quantity"
                        rules={[
                          {
                            required: true,
                            message: "Lütfen stok miktarı girin.",
                          },
                        ]}
                      >
                        <InputNumber />
                      </Form.Item>
                    </>
                  )}
                </div>
              </Row>
              <Row>
                <Form.Item
                  label="Kategori"
                  name="category"
                  rules={[
                    { required: true, message: "Lütfen kategori girin." },
                  ]}
                >
                  <Select
                    defaultValue="Kahvaltılık"
                    onChange={handleCatChange}
                    options={[
                      {
                        value: "Sebze",
                        label: "Sebze",
                      },
                      {
                        value: "Meyve",
                        label: "Meyve",
                      },
                      {
                        value: "Kuruyemiş",
                        label: "Kuruyemiş",
                      },
                      {
                        value: "Çay-Kahve",
                        label: "Çay-Kahve",
                      },
                      {
                        value: "Kahvaltılık",
                        label: "Kahvaltılık",
                      },
                      {
                        value: "Bakliyat",
                        label: "Bakliyat",
                      },
                      {
                        value: "Turşu",
                        label: "Turşu",
                      },
                      {
                        value: "Baharat",
                        label: "Baharat",
                      },
                    ]}
                  />
                </Form.Item>
              </Row>

              <br />
            </Col>
          </Row>
          <br />
          <Row style={{ width: "100%" }}>
            <div style={{ width: "100%" }}>
              <Form.Item
                label="Ürün Açıklaması"
                name="description"
                rules={[
                  { required: true, message: "Lütfen ürün açıklaması girin." },
                ]}
              >
                <TextArea autoSize={{ minRows: 4 }} />
              </Form.Item>
            </div>
          </Row>
          {id != 0 ? (
            <Button type="primary" htmlType="submit">
              Güncelle
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Ürün Ekle
            </Button>
          )}
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default EditProduct;
