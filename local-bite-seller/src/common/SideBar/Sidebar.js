import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "antd";
import React, { useState } from "react";
import { setCategory } from "../../store/actions/categoryActions";
import SubMenu from "antd/es/menu/SubMenu";
import classes from "./Sidebar.module.css";
import ConfigProvider from "antd/es/config-provider";
const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [displayCats, setDisplayCats] = useState(true);
  const selectedCategory = useSelector((state) => state.category);
  const handleCategoryClick = (category) => {
    navigate("/");
    console.log("category", category);
    dispatch(setCategory(category));
  };
  const toggleCats = () => {
    setDisplayCats((prev) => !prev);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: "red",
            itemHoverBg: "#c8f7cc",
            itemActiveBg: "#c8f7cc",
            itemSelectedBg: "#c8f7cc",
            itemSelectedColor: "black",
            subMenuItemBorderRadius: "100px",
            horizontalItemHoverBg: "yellow",
          },
          SubMenu: {
            itemSelectedBg: "yellow",
            itemActiveBg: "red",
          },
        },
      }}
    >
      <Menu
        mode="inline"
        title="kategoriler"
        className={classes.Menu}
        selectedKeys={[selectedCategory]}
        defaultSelectedKeys={[""]}
      >
        <SubMenu
          title="Kategoriler"
          style={{
            borderBottom: "0.1px solid lightgray",
            borderRadius: "0",
          }}
        >
          {displayCats && (
            <>
              <Menu.Item
                key="sebze"
                onClick={() => handleCategoryClick("Sebze")}
              >
                Sebze
              </Menu.Item>
              <Menu.Item
                key="meyve"
                onClick={() => handleCategoryClick("Meyve")}
              >
                Meyve
              </Menu.Item>
              <Menu.Item
                key="kuruyemis"
                onClick={() => handleCategoryClick("Kuruyemiş")}
              >
                Kuruyemiş
              </Menu.Item>
              <Menu.Item
                key="cay-kahve"
                onClick={() => handleCategoryClick("Çay-Kahve")}
              >
                Çay-Kahve
              </Menu.Item>
              <Menu.Item
                key="kahvaltilik"
                onClick={() => handleCategoryClick("Kahvaltılık")}
              >
                Kahvaltılık
              </Menu.Item>
              <Menu.Item
                key="bakliyat"
                onClick={() => handleCategoryClick("Bakliyat")}
              >
                Bakliyat
              </Menu.Item>
              <Menu.Item
                key="turşu"
                onClick={() => handleCategoryClick("Turşu")}
              >
                Turşu
              </Menu.Item>
              <Menu.Item
                key="baharat"
                onClick={() => handleCategoryClick("Baharat")}
              >
                Baharat
              </Menu.Item>
            </>
          )}
        </SubMenu>
      </Menu>
    </ConfigProvider>
  );
};

export default Sidebar;
