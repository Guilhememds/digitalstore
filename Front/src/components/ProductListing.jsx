import React from "react";
import Card from "./Card";

export default function ProductListing({ products = [] }) {
  return (
    <div className="product-listing-grid">
      {products.map((product, index) => (
        <Card
          key={product.id ?? `${product.name}-${index}`}
          product={product}
        />
      ))}
    </div>
  );
}
