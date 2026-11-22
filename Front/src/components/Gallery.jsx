import React, { useState } from "react";
import { Galleria } from "primereact/galleria";
import { Button } from "primereact/button";
import arrowLeft from "../assets/arrow-left.svg";
import arrowRight from "../assets/arrow-right.svg";

export default function Gallery({
  images = [],
  width = "1440px",
  height = "681px",
  radius = "0px",
  showThumbs = false,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const productItemTemplate = (item) => {
    return (
      <div
        className="product-gallery-slide"
        style={{
          width: "100%",
          height: height,
          borderRadius: radius,
          overflow: "hidden",
        }}
      >
        <img
          src={item.src}
          alt={item.alt || "Imagem do produto"}
          className="product-gallery-image"
        />
      </div>
    );
  };

  const bannerItemTemplate = (item) => {
    return (
      <div
        className="banner-slide"
        style={{
          width: "100%",
          maxWidth: width,
          height: height,
          borderRadius: radius,
        }}
      >
        <div className="banner-content">
          <span className="banner-subtitle">
            {item.subtitle || "Melhores ofertas personalizadas"}
          </span>

          <h1 className="banner-title">
            {item.title || "Queima de estoque Nike 🔥"}
          </h1>

          <p className="banner-description">
            {item.description ||
              "Consequat culpa exercitation mollit nisi excepteur do do tempor laboris eiusmod irure consectetur."}
          </p>

          <div className="banner-btn-wrapper">
            <Button
              label="Ver Ofertas"
              onClick={() => alert("Redirecionando para ofertas!")}
              className="banner-btn"
            />
          </div>
        </div>

        <div className="banner-image-wrapper">
          <img
            src={item.src}
            alt={item.alt || "Slide da Home"}
            className="banner-image"
          />
        </div>
      </div>
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <div
        className="product-gallery-thumb"
        style={{ borderRadius: radius, overflow: "hidden" }}
      >
        <img
          src={item.src}
          alt={item.alt || "Miniatura do produto"}
          className="product-gallery-thumb-img"
        />
      </div>
    );
  };

  return (
    <div
      className={`gallery-root ${showThumbs ? "gallery-root--product" : "gallery-root--banner"}`}
      style={{
        width: "100%",
        maxWidth: width,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Galleria
        value={images}
        activeIndex={activeIndex}
        onItemChange={(e) => setActiveIndex(e.index)}
        className="custom-galleria w-full"
        style={{ width: "100%", maxWidth: width }}
        numVisible={5}
        showThumbnails={showThumbs}
        thumbnailsPosition="bottom"
        showIndicators={!showThumbs}
        indicatorsPosition="bottom"
        showIndicatorsOnItem={!showThumbs}
        item={showThumbs ? productItemTemplate : bannerItemTemplate}
        thumbnail={thumbnailTemplate}
      />

      {showThumbs && images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Imagem anterior"
            className="product-gallery-arrow product-gallery-arrow--prev"
          >
            <img src={arrowLeft} alt="Anterior" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Próxima imagem"
            className="product-gallery-arrow product-gallery-arrow--next"
          >
            <img src={arrowRight} alt="Próxima" />
          </button>
        </>
      )}
    </div>
  );
}