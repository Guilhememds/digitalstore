import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/HomePage';
import Products from '../pages/ProductsListingPage';
import PageLayout from '../Layout/PageLayout';
import Produto from '../pages/ProductViewPage';


const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            {/* Layout comum usado pelas páginas principais. */}
            <Route path='/' element={<PageLayout/>}>
            {/* Página inicial. */}
            <Route index element={<Home />}/>
            {/* Lista e filtros de produtos. */}
            <Route path="produtos" element={<Products />} />
            {/* Detalhes de um produto pelo id da URL. */}
            <Route path="/produto/:id" element={<Produto/>} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;