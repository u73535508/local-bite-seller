// src/pages/ForgotPassword.js
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Burada normalde backend ile iletişim kurulacak, ancak şu aşamada sadece mesaj gösterilecek.
    message.success(`Email sent to ${values.email} for password reset.`);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Forgot Password</h2>
      <Form name="forgotPassword" onFinish={onFinish} size="large">
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Send Reset Email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
