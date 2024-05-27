import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Spin,
  ConfigProvider,
  Upload,
} from "antd";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { UploadOutlined } from "@ant-design/icons";
import TomTomMap from "./TomTomMap";

const { TextArea } = Input;

const UpdateShopProfile = ({ sellerId }) => {
  const { currentUser } = useUser();
  const fileInputRef = useRef();
  const fileInputRef2 = useRef();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingInfos, setFetchingInfos] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [photoUpdated, setPhotoUpdated] = useState(false);

  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/seller/${sellerId}/`
        );
        setUser(response.data);
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error("Failed to fetch seller data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [sellerId, form]);

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
            theme={{ components: { Spin: { colorPrimary: "#F0CA95" } } }}
          >
            <Spin size="large" />
          </ConfigProvider>
        </div>
      </div>
    );
  }

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    if (photoUpdated && file) {
      formData.append("photo", file);
      // formData.append("cover_photo", file2);
    }
    for (const key in values) {
      if (values[key] instanceof FileList) {
        if (!photoUpdated) {
          if (key !== "photo") {
            formData.append(key, values[key][0]);
          }
        }
      } else {
        if (!photoUpdated) {
          if (key !== "photo") {
            formData.append(key, values[key]);
          }
        } else {
          formData.append(key, values[key]);
        }
      }
    }

    // Log formData entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const hideLoadingMessage = message.loading(
        "Bilgileriniz güncelleniyor...",
        0
      );
      await axios.put("http://127.0.0.1:8000/seller/profile/", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      });
      hideLoadingMessage();
      message.success("Bilgileriniz başarıyla güncellendi.");
    } catch (error) {
      console.error("Error updating seller profile", error);
      message.error("Bilgileriniz güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
      // window.location.reload();
    }
  };

  const onFileChange = (event) => {
    setPhotoUpdated(true);
    setFile(event.target.files[0]);
  };
  const onFileChange2 = (event) => {
    setFile2(event.target.files[0]);
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
            theme={{ components: { Spin: { colorPrimary: "#F0CA95" } } }}
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
            },
            TextArea: {
              colorBorder: "#E9AA53",
              hoverBorderColor: "#F0CA95",
              activeBorderColor: "#F0CA95",
            },
            Button: { colorPrimary: "#E9AA53", colorPrimaryHover: "#ECB76C" },
            Checkbox: { colorPrimary: "#E9AA53", colorPrimaryHover: "#F0CA95" },
          },
        }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          encType="multipart/form-data" // Ensure form uses multipart/form-data encoding
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              columnGap: "120px",
            }}
          >
            {/* <div
              style={{
                height: "600px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                marginLeft: "20px",
              }}
            > */}
            {/* <div
                style={{
                  width: "250px",
                  height: "250px",
                  border: "0.5px lightGray solid",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "15px",
                  padding: "0 10px",
                }}
              >
                <label>Kapak Fotoğrafı:</label>
                <img
                  style={{ marginTop: "20px" }}
                  src={user?.cover_photo}
                  width="160px"
                  height="160px"
                />
                <Form.Item
                  name="cover_photo"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    // Ensure the file is handled correctly
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e && e.fileList;
                  }}
                >
                  <Input
                    type="file"
                    accept="image/*;capture=camera"
                    onChange={onFileChange2}
                    ref={fileInputRef2}
                  />
                </Form.Item>
              </div> */}
            <div
              style={{
                marginTop: "50px",
                width: "250px",
                height: "250px",
                border: "0.5px lightGray solid",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "15px",
                padding: "0 10px",
              }}
            >
              <label>Profil Fotoğrafı:</label>
              <img
                style={{ marginTop: "20px" }}
                src={user?.photo}
                width="160px"
                height="160px"
              />
              <Form.Item
                name="photo"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  // Ensure the file is handled correctly
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
              >
                <Input
                  type="file"
                  accept="image/*;capture=camera"
                  onChange={onFileChange}
                  ref={fileInputRef}
                />
              </Form.Item>
            </div>

            <div style={{ width: "500px", marginTop: "20px" }}>
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
                rules={[{ required: true, message: "Lütfen açıklama girin." }]}
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
                label="Enlem"
                name="latitude"
                rules={[{ required: true, message: "Lütfen enlem girin." }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Boylam"
                name="longitude"
                rules={[{ required: true, message: "Lütfen boylam girin." }]}
              >
                <Input />
              </Form.Item>
              <TomTomMap
                latitude={latitude}
                longitude={longitude}
                onLocationChange={({ latitude, longitude }) => {
                  setLatitude(latitude);
                  setLongitude(longitude);
                  form.setFieldsValue({ latitude, longitude });
                }}
              />
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Güncelle
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default UpdateShopProfile;
