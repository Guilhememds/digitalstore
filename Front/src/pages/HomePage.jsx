import React from "react";
import Gallery from "../components/Gallery";
import Section from "../components/Section";
import ProductListing from "../components/ProductListing";

export default function HomePage() {
  // Imagens exibidas no carrossel da página inicial.
  const slideImages = [
    {
      src: "/home-slide-2.jpeg",
      subtitle: "Melhores ofertas personalizadas",
      title: "Queima de estoque Nike 🔥",
      description:
        "Encontre os modelos mais desejados com preços imperdíveis para o seu dia a dia.",
    },
    {
      src: "/home-slide-5.jpeg",
      subtitle: "Coleção Exclusiva",
      title: "Queima de estoque Nike 🔥",
      description:
        "Encontre os modelos mais desejados com preços imperdíveis para o seu dia a dia.",
    },
    {
      src: "/home-slide-4.jpeg",
      subtitle: "Descontos Especiais",
      title: "Queima de estoque Nike 🔥",
      description:
        "Encontre os modelos mais desejados com preços imperdíveis para o seu dia a dia.",
    },
    {
      src: "/home-slide-6.jpeg",
      subtitle: "Descontos Especiais",
      title: "Queima de estoque Nike 🔥",
      description:
        "Encontre os modelos mais desejados com preços imperdíveis para o seu dia a dia.",
    },
  ];
  // Categorias exibidas nos destaques.
  const categories = [
    { label: "Camisetas", icon: "/tshirt-destaque.png", active: true },
    { label: "Calças", icon: "/pants-destaque.png", active: false },
    { label: "Bonés", icon: "/pants-destaque.png", active: false },
    { label: "Headphones", icon: "/headset-destaque.png", active: false },
    { label: "Tênis", icon: "/tenis-destaque.png", active: false },
  ];

  // Produtos exibidos na seção "Produtos em alta".
  const highProducts = [
    {
      name: "K-Swiss V8 - Masculino",
      image: "/produc-image-1.jpeg",
      price: 200,
      priceDiscount: 149.9,
      badge: "30% OFF",
      category: "Tênis",
    },
    {
      name: "K-Swiss V8 - Masculino",
      image: "/produc-image-1.jpeg",
      price: 200,
      priceDiscount: 149.9,
      badge: "30% OFF",
      category: "Tênis",
    },
    {
      name: "K-Swiss V8 - Masculino",
      image: "/produc-image-1.jpeg",
      price: 200,
      category: "Tênis",
    },
    {
      name: "K-Swiss V8 - Masculino",
      image: "/produc-image-1.jpeg",
      price: 149.9,
      category: "Tênis",
    },
    {
      name: "K-Swiss V8 - Masculino",
      image: "/produc-image-5.jpeg",
      price: 200,
      category: "Tênis",
    },
    {
      name: "K-Swiss V8 - Masculino",
      image: "/produc-image-5.jpeg",
      price: 189.9,
      category: "Tênis",
    },
    {
      name: "K-Swiss V8 - Masculino",
      image: "/produc-image-5.jpeg",
      price: 219.9,
      category: "Tênis",
    },
    {
      name: "K-Swiss V8 - Masculino",
      image: "/produc-image-5.jpeg",
      price: 159.9,
      category: "Tênis",
    },
  ];

  return (
    <main>
      {/* Banner principal com carrossel. */}
      <Gallery images={slideImages} width="1440px" height="681px" />
      {/* Destaques de coleções. */}
      <Section title="Coleções em destaque" titleAlign="center">
        <div className="collections-grid">
          <div className="collection-item">
            <span className="collection-badge">30% OFF</span>
            <img
              src="/collection-1.png"
              alt="Novo drop Supreme"
              className="collection-banner-img"
            />
            <button type="button" className="collection-buy-btn">
              Comprar
            </button>
          </div>

          <div className="collection-item">
            <span className="collection-badge">30% OFF</span>
            <img
              src="/collection-2.png"
              alt="Coleção Adidas"
              className="collection-banner-img"
            />
            <button type="button" className="collection-buy-btn">
              Comprar
            </button>
          </div>

          <div className="collection-item">
            <span className="collection-badge">30% OFF</span>
            <img
              src="/collection-3.png"
              alt="Novo Beats Bass"
              className="collection-banner-img"
            />
            <button type="button" className="collection-buy-btn">
              Comprar
            </button>
          </div>
        </div>
      </Section>
      {/* Lista de categorias disponíveis. */}
      <Section title="Coleções em destaque" titleAlign="center">
        <div className="categories-row">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`category-item ${cat.active ? "is-active" : ""}`}
            >
              <div className="category-circle">
                <img
                  src={cat.icon}
                  alt={cat.label}
                  className="category-icon-img"
                />
              </div>
              <span className="category-label">{cat.label}</span>
            </div>
          ))}
        </div>
      </Section>
      {/* Lista dos produtos mais vendidos ou populares. */}
      <Section title="Produtos em alta" titleAlign="left">
        <ProductListing products={highProducts} />
      </Section>
      {/* Oferta especial em destaque. */}
      <section className="special-offer-section">
        <div className="special-offer-container">
          <div className="special-offer-media">
            <img
              src="/Laye 1.png"
              alt="Tênis especial de edição limitada"
              className="special-offer-img"
            />
          </div>

          <div className="special-offer-content">
            <span className="special-offer-tag">Oferta especial</span>
            <h2 className="special-offer-title">
              Edição limitada de colecionador
            </h2>
            <p className="special-offer-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum ullam dolor cum! At obcaecati excepturi debitis sed aspernatur quam id. Qui non eaque quidem, excepturi at fugiat consequuntur rem est.
            </p>
            <button
              type="button"
              className="special-offer-btn"
              onClick={() => alert("Redirecionando para a oferta especial!")}
            >
              Ver Oferta
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
