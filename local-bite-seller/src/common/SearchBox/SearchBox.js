import { Input, Space } from "antd";
import classes from "./SearchBox.module.css";
import { useState } from "react";

export const SearchBox = ({ onSearch }) => {
  const { Search } = Input;
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <div className={classes.container}>
      <Search
        className={classes.searchBox}
        placeholder="Aradığınız ürünü yazın"
        allowClear
        enterButton="Search"
        size="large"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={handleSearch}
      />
    </div>
  );
};
