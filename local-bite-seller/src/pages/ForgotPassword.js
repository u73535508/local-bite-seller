// src/pages/ForgotPassword.js
import React, { useState } from "react";
import { Form, Input, Button, message, ConfigProvider } from "antd";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Burada normalde backend ile iletişim kurulacak, ancak şu aşamada sadece mesaj gösterilecek.
    message.success(
      `${values.email} adresine şifre yenileme maili gönderildi.`
    );
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              colorBorder: "#E9AA53",
              hoverBorderColor: "#F0CA95",
              activeBorderColor: "#F0CA95",
              colorSuccessBg: "##F0CA95",
              colorSuccessBgHover: "red",
            },
            Button: {
              colorPrimary: "#E9AA53",
              colorPrimaryHover: "#ECB76C",
            },
          },
        }}
      >
        <h2>Şifremi Unuttum</h2>
        <Form name="forgotPassword" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Lütfen email giriniz!" }]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Şifremi Yenile
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
}
