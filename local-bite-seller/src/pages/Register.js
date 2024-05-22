import React from "react";
import { Tabs, ConfigProvider } from "antd";
import Signup from "../common/Signup";
import Login from "../common/Login";

const { TabPane } = Tabs;
export default function Register() {
  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              inkBarColor: "#E9AA53",
              itemActiveColor: "#E9AA53",
              itemHoverColor: "#ECB76C",
              itemSelectedColor: "#E9AA53",
              itemColor: "rgba(0, 0, 0, 0.4)",
            },
          },
        }}
      >
        <Tabs defaultActiveKey="login" centered>
          <TabPane tab="Giriş Yap" key="login">
            <Login />
          </TabPane>
          <TabPane tab="Üye Ol" key="signup">
            <Signup />
          </TabPane>
        </Tabs>
      </ConfigProvider>
    </div>
  );
}
