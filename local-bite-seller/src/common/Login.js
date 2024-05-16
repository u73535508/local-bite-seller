// src/pages/Login.js
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Space, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { ConfigProvider } from "antd";
import classes from "./Login.module.css";
import { useUser } from "../contexts/UserContext";
const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login/", values);
      console.log("res", res.data);
      login(res.data.access_token, res.data.refresh_token);
      message.success(`Successfully logged in ${res.data.full_name}`);
      navigate("/");
    } catch (error) {
      message.error("Tekrar dene");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              colorBorder: "#ADDBB1",
              hoverBorderColor: "#55B45D",
              activeBorderColor: "#55B45D",
              colorSuccessBg: "#55B45D",
              colorSuccessBgHover: "red",
            },
            Button: {
              colorPrimary: "#55B45D",
              colorPrimaryHover: "#71C178",
            },
            Checkbox: {
              colorPrimary: "#55B45D",
              colorPrimaryHover: "#71C178",
            },
          },
        }}
      >
        <h2>Login</h2>
        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          size="large"
        >
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

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Space>
              <Link className={classes.link} to="/forgot-password">
                Forgot Password
              </Link>
            </Space>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default Login;
