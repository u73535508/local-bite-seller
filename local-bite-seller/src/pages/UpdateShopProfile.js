import React from "react";
import { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { Spin, ConfigProvider } from "antd";
import { useParams } from "react-router-dom";

const { TextArea } = Input;
const UpdateShopProfile = ({ sellerId }) => {
  const { currentUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingInfos, setFetchingInfos] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/seller/${sellerId}/`
      );
      console.log(response.data);
      setUser(response.data);
      form.setFieldsValue(response.data);
      setLoading(false);
      return response.data;
    };

    fetchSeller();
  }, []);
  if (fetchingInfos) {
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
          <p>Bilgileriniz yükleniyor...</p>
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
  const onFinish = async (values) => {
    let hideLoadingMessage = null;
    setLoading(true);
    try {
      hideLoadingMessage = message.loading("Bilgileriniz güncelleniyor...", 0);
      const res = await axios.put(
        "http://127.0.0.1:8000/seller/profile/",
        values,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
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
          <p>Bilgileriniz yükleniyor...</p>
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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        textAlign: "center",
      }}
    >
      <h2>Mağaza Bilgileriniz</h2>
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
            },
            Checkbox: {
              colorPrimary: "#E9AA53",
              colorPrimaryHover: "#F0CA95",
            },
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            columnGap: "120px",
          }}
        >
          <div
            style={{
              height: "600px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              marginLeft: "20px",
            }}
          >
            <div
              style={{
                width: "250px",
                height: "250px",
                border: "0.5px lightGray solid",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "15px",
              }}
            >
              <p>Kapak Fotoğrafı ekleyin</p>
            </div>
            <div
              style={{
                width: "250px",
                height: "250px",
                border: "0.5px lightGray solid",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "15px",
              }}
            >
              <p>Profil Fotoğrafı ekleyin</p>
            </div>
          </div>

          <div style={{ width: "500px", marginTop: "20px" }}>
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Form.Item
                label="Mağaza İsmi"
                name="brand_name"
                rules={[
                  { required: true, message: "Lütfen mağaza ismini girin." },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Hakkımızda"
                name="description"
                rules={[
                  { required: true, message: "Lütfen soyisminizi girin." },
                ]}
              >
                <TextArea />
              </Form.Item>
              <Form.Item
                label="E-posta"
                name="brand_email"
                rules={[
                  {
                    required: true,
                    message: "Lütfen bir e-posta adresi girin.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Telefon Numarası"
                name="brand_contact_no"
                rules={[
                  {
                    required: true,
                    message: "Lütfen telefon numaranızı girin.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="latitude"
                name="latitude"
                rules={[
                  {
                    required: true,
                    message: "Lütfen telefon numaranızı girin.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="longitude"
                name="longitude"
                rules={[
                  {
                    required: true,
                    message: "Lütfen telefon numaranızı girin.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Güncelle
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default UpdateShopProfile;
