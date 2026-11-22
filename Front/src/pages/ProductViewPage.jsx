import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Gallery from "../components/Gallery";
import BuyBox from "../components/BuyBox";
import ProductOptions from "../components/ProductOptions";
import Section from "../components/Section";
import ProductListing from "../components/ProductListing";

// Fotos exibidas na galeria do produto.
const GALLERY_IMAGES = [
  { src: "/produc-image-1.jpeg" },
  { src: "/produc-image-5.jpeg" },
  { src: "/produc-image-1.jpeg" },
  { src: "/produc-image-5.jpeg" },
  { src: "/produc-image-1.jpeg" },
];

// Produtos apresentados na seção de recomendações.
const RECOMMENDED_PRODUCTS = [
  {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    priceDiscount: 100,
    badge: "30% OFF",
  },
  {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    priceDiscount: 100,
    badge: "30% OFF",
  },
  {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-5.jpeg",
    price: 200,
  },
  {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-5.jpeg",
    price: 149.9,
  },
];

export default function Produto() {
  // O id identifica o produto acessado pela rota.
  const { id } = useParams();
  // Opções escolhidas pelo usuário antes da compra.
  const [selectedSize, setSelectedSize] = useState("41");
  const [selectedColor, setSelectedColor] = useState("#6FEEFF");

  // Simula a ação de compra com as opções selecionadas.
  const handleBuy = () => {
    alert(
      `Produto #${id || "1"} adicionado — Tamanho: ${selectedSize}, Cor: ${selectedColor}`
    );
  };

  return (
    <div className="product-view-page">
      <div className="product-view-container">
        <div className="product-view-top">
          {/* Galeria de imagens do produto. */}
          <div className="product-view-gallery">
            <Gallery
              images={GALLERY_IMAGES}
              showThumbs
              width="700px"
              height="570px"
              radius="4px"
            />
          </div>

          {/* Caixa com informações e opções de compra. */}
          <div className="product-view-buybox">
            <BuyBox
              name="Tênis Nike Revolution 6 Next Nature Masculino"
              reference="REF:38416711"
              stars={4.7}
              rating={90}
              price={219}
              priceDiscount={149.9}
              description="Modelo versátil e confortável para o dia a dia e treinos leves, com cabedal respirável e solado aderente."
              onBuy={handleBuy}
            >
              {/* Seleção de tamanho. */}
              <div className="buy-box-option-group">
                <span className="buy-box-option-label">Tamanho</span>
                <ProductOptions
                  options={["39", "40", "41", "42", "43"]}
                  defaultValue="41"
                  radius="4px"
                  shape="square"
                  type="text"
                  onChange={setSelectedSize}
                />
              </div>

              {/* Seleção de cor. */}
              <div className="buy-box-option-group">
                <span className="buy-box-option-label">Cor</span>
                <ProductOptions
                  options={["#6FEEFF", "#FF6969", "#5E5E5E", "#6D70B7"]}
                  defaultValue="#6FEEFF"
                  shape="circle"
                  type="color"
                  onChange={setSelectedColor}
                />
              </div>
            </BuyBox>
          </div>
        </div>

        {/* Lista de produtos relacionados. */}
        <div className="product-view-recommended">
          <Section
            title="Produtos recomendados"
            titleAlign="left"
            link={{ text: "Ver todos", href: "/produtos" }}
          >
            <ProductListing products={RECOMMENDED_PRODUCTS} />
          </Section>
        </div>
      </div>
    </div>
  );
}