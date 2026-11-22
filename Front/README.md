# Digital Store — Front-end

Interface web responsiva de e-commerce desenvolvida em **React** com **PrimeReact** e **styled-components**.

## Tecnologias Utilizadas

* **React** & **Vite**
* **PrimeReact** (componentes de interface)
* **styled-components** (estilização)
* **React Router** (gerenciamento de rotas)

## Estrutura de Pastas

```text
Front/
├── public/            # Imagens estáticas, banners e miniaturas de produtos
├── src/
│   ├── assets/        # Ícones e logotipos em SVG
│   ├── components/    # Header, Footer, Gallery, ProductListing, FilterGroup, BuyBox, etc.
│   ├── Layout/        # Estrutura base das páginas (PageLayout)
│   ├── pages/         # HomePage, ProductsListingPage e ProductViewPage
│   ├── Routes/        # Configuração de rotas da aplicação (Approutes)
│   └── services/      # Integração e serviços da aplicação
└── package.json
```

## Funcionalidades

* **Página Inicial (`HomePage`):** Carrossel de banners, coleções em destaque e vitrine de produtos em alta.
* **Listagem de Produtos (`ProductsListingPage`):** Filtro por categorias e atributos (`FilterGroup`) com listagem dinâmica.
* **Detalhes do Produto (`ProductViewPage`):** Galeria de imagens, seleção de opções (`ProductOptions`) e caixa de compra (`BuyBox`).

## Instalação e Execução

1. **Acesse a pasta do front-end e instale as dependências:**
   ```bash
   cd Front
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador** o endereço exibido no terminal (geralmente `http://localhost:5173`).
