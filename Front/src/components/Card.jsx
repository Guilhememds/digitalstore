export default function Card({ product }) {
  const {
    name,
    category = "Tênis",
    image,
    price,
    priceDiscount,
    badge,
  } = product;

  const hasDiscount =
    typeof priceDiscount === "number" &&
    typeof price === "number" &&
    priceDiscount < price;

  const discountLabel =
    badge ||
    (hasDiscount
      ? `${Math.round(((price - priceDiscount) / price) * 100)}% OFF`
      : null);

  const formatPrice = (value) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  return (
    <article className="product-card">
      <div className="product-card-media">
        {discountLabel && (
          <span className="product-card-badge">{discountLabel}</span>
        )}
        <img src={image} alt={name} className="product-card-img" />
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-name" title={name}>
          {name}
        </h3>

        <div className="product-card-prices">
          {hasDiscount ? (
            <>
              <span className="product-card-price-old">
                {formatPrice(price)}
              </span>
              <span className="product-card-price-current">
                {formatPrice(priceDiscount)}
              </span>
            </>
          ) : (
            <span className="product-card-price-current">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
