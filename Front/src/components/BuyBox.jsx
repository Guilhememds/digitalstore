import React from "react";
import starIcon from "../assets/star-icon.svg";

export default function BuyBox({
  name,
  reference,
  stars,
  rating,
  price,
  priceDiscount,
  description,
  children,
  onBuy,
}) {
  const hasDiscount =
    typeof priceDiscount === "number" &&
    typeof price === "number" &&
    priceDiscount < price;

  const formatNumber = (value) =>
    Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="buy-box">
      <h1 className="buy-box-title">{name}</h1>

      {reference && <span className="buy-box-reference">{reference}</span>}

      {(stars !== undefined || rating !== undefined) && (
        <div className="buy-box-rating-row">
          {stars !== undefined && (
            <span className="buy-box-stars-badge">
              <span>{stars}</span>
              <img src={starIcon} alt="Estrela" className="buy-box-star-icon" />
            </span>
          )}
          {rating !== undefined && (
            <span className="buy-box-rating-count">({rating} avaliações)</span>
          )}
        </div>
      )}

      <div className="buy-box-price-row">
        {hasDiscount ? (
          <>
            <span className="buy-box-price-discount">
              <small>R$</small> {formatNumber(priceDiscount)}
            </span>
            <span className="buy-box-price-original--striked">
              R$ {formatNumber(price)}
            </span>
          </>
        ) : (
          <span className="buy-box-price-original">
            <small>R$</small> {formatNumber(price)}
          </span>
        )}
      </div>

      {description && (
        <div className="buy-box-description-block">
          <span className="buy-box-description-label">
            Descrição do produto
          </span>
          <p className="buy-box-description">{description}</p>
        </div>
      )}

      {children && <div className="buy-box-children">{children}</div>}

      <button type="button" className="buy-box-cta-btn" onClick={onBuy}>
        COMPRAR
      </button>
    </div>
  );
}
