import { Navigate, NavLink, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Logo from "./Logo";
import { Menubar } from "primereact/menubar";
import { Sidebar } from "primereact/sidebar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Carr from "../assets/mini-cart.svg";

const Header = () => {
  const navigate = useNavigate();
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [pesquisaAberta, setPesquisaAberta] = useState(false);
  const Pesquisa = () => (
    <IconField iconPosition="left" style={{ width: "100%" }}>
      <InputIcon className="pi pi-search" />
      <InputText placeholder="Pesquisar produto..." style={{ width: "100%" }} />
    </IconField>
  );

  const Acoes = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <NavLink
        to="/cadastro"
        style={{
          color: "#474747",
          textDecoration: "underline",
          fontSize: "16px",
          fontWeight: "400",
        }}
      >
        Cadastre-se
      </NavLink>
      <Button
        style={{ background: "#C92071", borderColor: "#C92071" }}
        label="Entrar"
        onClick={() => navigate("/login")}
      />
    </div>
  );

  const Carrinho = () => (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        marginLeft: "15px",
      }}
    >
      <img
        src={Carr}
        alt="Carrinho"
        style={{ width: "24px", height: "24px" }}
      />
    </div>
  );

  const renderNavLink = (to, label, isEnd = false) => (
    <NavLink
      to={to}
      end={isEnd}
      className="p-menuitem-link flex align-items-center gap-2"
      style={({ isActive }) => ({
        fontSize: "16px",
        textDecoration: isActive ? "underline" : "none",
        textUnderlineOffset: "6px",
        color: isActive ? "#C92071" : "#474747",
        fontWeight: isActive ? "700" : "400",
      })}
    >
      <span>{label}</span>
    </NavLink>
  );

  const renderMobileLink = (to, label, isEnd = false) => (
    <NavLink
      to={to}
      end={isEnd}
      onClick={() => setMenuMobileAberto(false)}
      style={({ isActive }) => ({
        display: "block",
        fontSize: "16px",
        textDecoration: isActive ? "underline" : "none",
        textUnderlineOffset: "6px",
        color: isActive ? "#C92071" : "#474747",
        fontWeight: isActive ? "700" : "400",
        padding: "10px 0",
      })}
    >
      {label}
    </NavLink>
  );

  const options = [
    { label: "Home", template: () => renderNavLink("/", "Home", true) },
    {
      label: "Produtos",
      template: () => renderNavLink("/produtos", "Produtos"),
    },
    {
      label: "Categorias",
      template: () => renderNavLink(),
    },
    {
      label: "Meus pedidos",
      template: () => renderNavLink(),
    },
  ];

  return (
    <header className="mb-4 shadow-sm" style={{ background: "#fff" }}>
      {/* Mobile */}
      <div
        className="flex md:hidden p-3"
        style={{
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <button
          onClick={() => setMenuMobileAberto(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <i
            className="pi pi-bars"
            style={{ fontSize: "1.5rem", color: "#474747" }}
          ></i>
        </button>
        <div
          style={{
            maxWidth: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Logo />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setPesquisaAberta(!pesquisaAberta)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <i
                className="pi pi-search"
                style={{
                  fontSize: "1.2rem",
                  color: pesquisaAberta ? "#C92071" : "#474747",
                }}
              ></i>
            </button>
            <Carrinho />
        </div>
        </div>
        </div>
        {pesquisaAberta && (
          <div style={{ width: "100%", display: "block" }}>
            <Pesquisa />
          </div>
        )}
        </div>


      <Sidebar
        visible={menuMobileAberto}
        onHide={() => setMenuMobileAberto(false)}
        style={{ width: "80%", maxWidth: "300px" }}
        content={({ hide }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              padding: "1.5rem 1rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    color: "#474747",
                    fontSize: "16px",
                    fontWeight: "700",
                    margin: 0,
                  }}
                >
                  Páginas
                </h3>
                <Button
                  icon="pi pi-times"
                  className="p-button-text p-button-plain"
                  style={{ color: "#474747" }}
                  onClick={hide}
                />
              </div>

              <nav
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {renderMobileLink("/", "Home", true)}
                {renderMobileLink("/produtos", "Produtos")}
                {renderMobileLink("/categorias", "Categorias")}
                {renderMobileLink("/pedidos", "Meus Pedidos")}
              </nav>
            </div>

            <div
              style={{
                borderTop: "1px solid #E2E8F0",
                paddingTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Button
                label="Entrar"
                style={{
                  backgroundColor: "#C92071",
                  borderColor: "#C92071",
                  width: "100%",
                  fontWeight: "700",
                  borderRadius: "8px",
                  padding: "0.75rem",
                }}
                onClick={() => {
                  hide();
                  navigate("/login");
                }}
              />
              <NavLink
                to="/cadastro"
                onClick={hide}
                style={{
                  color: "#474747",
                  textDecoration: "underline",
                  fontSize: "16px",
                }}
              >
                Cadastre-se
              </NavLink>
            </div>
          </div>
        )}
      ></Sidebar>

      {/*Desktop*/}
      <div className="hidden md:block">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 2rem",
          }}
        >
          <Logo />

          <div style={{ flex: 1, maxWidth: "400px", margin: "0 2rem" }}>
            <Pesquisa />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Acoes />
            <Carrinho />
          </div>
        </div>

        <div style={{ padding: "0 1rem" }}>
          <Menubar
            model={options}
            breakpoint="960px"
            style={{ border: "none", background: "transparent" }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
