import React from "react";
import { Tabs, ConfigProvider } from "antd";
import UpdateProfile from "./UpdateProfile";
import UpdateShopProfile from "./UpdateShopProfile";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;
export const ProfileEdit = () => {
  const { id } = useParams();

  return (
    <div style={{ margin: "auto" }}>
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
        <Tabs defaultActiveKey="personal" centered>
          <TabPane tab="Kişisel Bilgilerinizi Güncelleyin" key="personal">
            <UpdateProfile />
          </TabPane>
          <TabPane tab="Mağaza Bilgilerini Güncelleyin" key="shop">
            <UpdateShopProfile sellerId={id} />
          </TabPane>
        </Tabs>
      </ConfigProvider>
    </div>
  );
};
