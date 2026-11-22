import React, { useState, useMemo } from "react";
import FilterGroup from "../components/FilterGroup";
import Section from "../components/Section";
import ProductListing from "../components/ProductListing";

// Lista base usada na filtragem e ordenação dos produtos.
const IProduct = [
  {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    priceDiscount: 100,
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
    {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    priceDiscount: 100,
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
    {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    priceDiscount: 100,
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
    {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
    {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
    {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
    {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
  
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
    {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
    {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
    {
    name: "K-Swiss V8 - Masculino",
    image: "/produc-image-1.jpeg",
    price: 200,
    brand: "K-Swiss",
    category: "Esporte e lazer",
    gender: "Masculino",
    condition: "Novo",
  },
];
export default function Products() {
  // Estados dos critérios escolhidos pelo usuário.
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState("");

  // Adiciona ou remove um valor em filtros do tipo lista.
  const toggleCheckbox = (value, list, setter) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  // Filtra e ordena os produtos sempre que algum filtro mudar.
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = IProduct.filter((product) => {
      const matchBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchGender =
        selectedGenders.length === 0 ||
        selectedGenders.includes(product.gender);
      const matchCondition =
        !selectedCondition || product.condition === selectedCondition;

      return matchBrand && matchCategory && matchGender && matchCondition;
    });

    return [...filtered].sort((a, b) => {
      const effectivePriceA = a.priceDiscount ?? a.price;
      const effectivePriceB = b.priceDiscount ?? b.price;
      return sortOrder === "asc"
        ? effectivePriceA - effectivePriceB
        : effectivePriceB - effectivePriceA;
    });
  }, [
    sortOrder,
    selectedBrands,
    selectedCategories,
    selectedGenders,
    selectedCondition,
  ]);

  const sectionTitle =
    filteredAndSortedProducts.length === 1
      ? "Resultados para “Tênis” - 1 produto"
      : `Resultados para “Tênis” - ${filteredAndSortedProducts.length} produtos`;

  return (
    <>
      {/* Layout com filtros à esquerda e produtos à direita. */}
      <div className="products-page-wrapper">
        <div className="products-page-container">
          <aside className="products-sidebar">
            {/* Escolha da ordem dos resultados. */}
            <div className="sort-box">
              <label htmlFor="sort-select" className="sort-label">
                Ordenar por:
              </label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="sort-select"
              >
                <option value="asc">Menor preço</option>
                <option value="desc">Maior preço</option>
              </select>
            </div>
            {/* Filtros por marca, categoria, gênero e estado. */}
            <div className="filters-box">
              <h3 className="filters-box-title">Filtrar por</h3>
              <hr className="filters-divider" />

              <FilterGroup
                title="Marka"
                inputType="checkbox"
                options={[
                  { text: "Adidas", value: "Adidas" },
                  { text: "Calenciaga", value: "Calenciaga" },
                  { text: "K-Swiss", value: "K-Swiss" },
                  { text: "Nike", value: "Nike" },
                  { text: "Puma", value: "Puma" },
                ]}
                selectedValues={selectedBrands}
                onChange={(val) =>
                  toggleCheckbox(val, selectedBrands, setSelectedBrands)
                }
              />

              <FilterGroup
                title="Categoria"
                inputType="checkbox"
                options={[
                  { text: "Esporte e lazer", value: "Esporte e lazer" },
                  { text: "Casual", value: "Casual" },
                  { text: "Utilitário", value: "Utilitário" },
                  { text: "Corrida", value: "Corrida" },
                ]}
                selectedValues={selectedCategories}
                onChange={(val) =>
                  toggleCheckbox(val, selectedCategories, setSelectedCategories)
                }
              />

              <FilterGroup
                title="Gênero"
                inputType="checkbox"
                options={[
                  { text: "Masculino", value: "Masculino" },
                  { text: "Feminino", value: "Feminino" },
                  { text: "Unisex", value: "Unisex" },
                ]}
                selectedValues={selectedGenders}
                onChange={(val) =>
                  toggleCheckbox(val, selectedGenders, setSelectedGenders)
                }
              />

              <FilterGroup
                title="Estado"
                inputType="radio"
                options={[
                  { text: "Novo", value: "Novo" },
                  { text: "Usado", value: "Usado" },
                ]}
                selectedValues={selectedCondition}
                onChange={(val) => setSelectedCondition(val)}
              />
            </div>
          </aside>
          {/* Lista atualizada conforme os filtros selecionados. */}
          <div className="products-content">
            <Section title={sectionTitle} titleAlign="left">
              <ProductListing products={filteredAndSortedProducts} />
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}
