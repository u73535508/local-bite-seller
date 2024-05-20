import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { ConfigProvider } from "antd";

const Signup = () => {
  const { login } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/auth/register/", {
        role: 1,
        ...values,
      });
      const res = await axios.post("http://127.0.0.1:8000/auth/login/", {
        email: values.email,
        password: values.password,
      });
      login(res.data.access_token, res.data.refresh_token);
      message.success(`User ${values.first_name} successfully registered.`);
      navigate("/");
    } catch (error) {
      message.error("Tekrar dene");
    }
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
        <h2>Sign Up</h2>
        <Form name="signup" onFinish={onFinish} size="large">
          <Form.Item
            name="first_name"
            rules={[
              {
                required: true,
                message: "Geçerli bir isim giriniz!",
              },
            ]}
          >
            <Input placeholder="İsim" />
          </Form.Item>
          <Form.Item
            name="last_name"
            rules={[
              {
                required: true,
                message: "Geçerli bir soyisim giriniz!",
              },
            ]}
          >
            <Input placeholder="Soyisim" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="password2"
            rules={[
              { required: true, message: "Please input your password again!" },
            ]}
          >
            <Input.Password placeholder="Password again" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default Signup;
