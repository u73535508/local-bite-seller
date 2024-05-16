import React from "react";
import { Card, Button } from "antd";

const { Meta } = Card;

export default function OrderSummary({ basketItems, sellers }) {
  console.log("basketItems", basketItems);

  const getBrandName = (sellerId) => {
    const seller = sellers.find((seller) => seller.sellerId === sellerId);

    return seller ? seller.brandName : "Bilinmiyor";
  };

  const handleShowLocation = (sellerId) => {
    const currentSeller = sellers.find(
      (seller) => seller.sellerId === sellerId
    );

    const url = `https://www.google.com/maps?q=${currentSeller.location[0]},${currentSeller.location[1]}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h3>Sepetinizdeki Ürünler</h3>
      {basketItems.map((item) => (
        <Card key={item.id}>
          <Meta
            title={item.product.name}
            description={
              <div>
                <p>Marka: {getBrandName(item.product.seller)}</p>

                <p>
                  Miktar: {item.quantity} ({item.product.unit}){" "}
                </p>
                <p>Fiyat: {item.product.price_per_unit * item.quantity} ₺</p>
                <Button onClick={() => handleShowLocation(item.product.seller)}>
                  Konumu Gör
                </Button>
              </div>
            }
          />
        </Card>
      ))}
    </div>
  );
}
