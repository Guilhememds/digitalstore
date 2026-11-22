import React from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

export default function ProductListing({ products = [] }) {
  return (
    <div className="product-listing-grid">
      {products.map((product, index) => {
        const productId = product.id ?? index + 1;

        return (
          <Link
            key={product.id ?? `${product.name}-${index}`}
            to={`/produto/${productId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card product={product} />
          </Link>
        );
      })}
    </div>
  );
}