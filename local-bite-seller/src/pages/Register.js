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
              inkBarColor: "#ADDBB1",
              itemActiveColor: "#55B45D",
              itemHoverColor: "#55B45D",
              itemSelectedColor: "#55B45D",
              itemColor: "rgba(0, 0, 0, 0.4)",
            },
          },
        }}
      >
        <Tabs defaultActiveKey="login" centered>
          <TabPane tab="Login" key="login">
            <Login />
          </TabPane>
          <TabPane tab="Signup" key="signup">
            <Signup />
          </TabPane>
        </Tabs>
      </ConfigProvider>
    </div>
  );
}
