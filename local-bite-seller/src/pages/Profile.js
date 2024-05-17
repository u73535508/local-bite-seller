import { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { Spin, ConfigProvider } from "antd";

export default function ProfilePage() {
  const { currentUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingInfos, setFetchingInfos] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setFetchingInfos(true);
    const fetchCurrentUser = async () => {
      try {
        const user = await currentUser();
        setUser(user);
        form.setFieldsValue(user);
      } catch (error) {
        console.error(error);
        message.error("Kullanıcı bilgileri getirilirken bir hata oluştu.");
      } finally {
        setFetchingInfos(false);
      }
    };

    fetchCurrentUser();
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
        "http://127.0.0.1:8000/auth/update-profile/",
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

  return (
    <div>
      <h2>Bilgilerim</h2>
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
            },
            Checkbox: {
              colorPrimary: "#E9AA53",
              colorPrimaryHover: "#F0CA95",
            },
          },
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="İsim"
            name="first_name"
            rules={[{ required: true, message: "Lütfen isminizi girin." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Soyisim"
            name="last_name"
            rules={[{ required: true, message: "Lütfen soyisminizi girin." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="E-posta"
            name="email"
            rules={[
              { required: true, message: "Lütfen e-posta adresinizi girin." },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Telefon Numarası"
            name="phone_number"
            rules={[
              { required: true, message: "Lütfen telefon numaranızı girin." },
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
      </ConfigProvider>
    </div>
  );
}
