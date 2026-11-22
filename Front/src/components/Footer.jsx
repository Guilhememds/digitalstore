import React from "react";
import Logo from "./Logo";
import faceIcon from "../assets/facebook.svg";
import instaIcon from "../assets/instagram.svg";
import xIcon from "../assets/twitter.svg";

const Footer = () => {
  const linkStyle = {
    color: "#ccccc",
    TextDecoration: "none",
    fontSize: "14px",
  };
  const columnTitleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#FFFFFF",
    margin: "0 0 8px 0",
  };

  return (
    <footer
      className=" py-5 px-4 w-full box-border"
      style={{ backgroundColor: "#1f1f1f", color: "#f5f5f5" }}
    >
      <div
        className="flex flex-wrap justify-content-between align-items-start gap-5 max-w-1200 mx-auto pb-5 border-bottom-1 border-gray-800"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <div
          className="flex flex-column align-items-start gap-3 flex-auto"
          style={{ maxWidth: "320px", flexBasis: "260px" }}
        >
          <Logo footer={true} />

          <p className="text-sm line-height-3 text-300 m-0 text-left">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet a
            harum quaerat ullam suscipit totam cupiditate dolorem, ut vel,
            quisquam in ratione placeat dolor fugiat quibusdam natus, adipisci
            maxime ducimus?
          </p>

          <div className=" flex align-items-center gap-3 mt-2">
            <a href="#facebook" className="inline-block cursor-pointer">
              <img
                src={faceIcon}
                alt="Facebook"
                style={{ width: "20px", height: "20px" }}
              />
            </a>
            <a href="#instagram" className="inline-block cursor-pointer">
              <img
                src={instaIcon}
                alt="Instagram"
                style={{ width: "20px", height: "20px" }}
              />
            </a>
            <a href="#twitter" className="inline-block cursor-pointer">
              <img
                src={xIcon}
                alt="Twitter"
                style={{ width: "20px", height: "20px" }}
              />
            </a>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "14px",
            flex: "1 1 140px",
          }}
        >
          <h4 style={columnTitleStyle}>Informação</h4>
          <a className="inline-block cursor-pointer">Sobre Digital Store</a>
          <a style={linkStyle} className="cursor-pointer">
            Segurança
          </a>
          <a style={linkStyle} className="cursor-pointer">
            Wishlist
          </a>
          <a style={linkStyle} className="cursor-pointer">
            Blog
          </a>
          <a style={linkStyle} className="cursor-pointer">
            Trabalhe conosco
          </a>
          <a style={linkStyle} className="cursor-pointer">
            Meus pedidos
          </a>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "14px",
            flex: "1 1 140px",
          }}
        >
          <h4 style={columnTitleStyle}>Categorias</h4>
          <a style={linkStyle}>
            Camisetas
          </a>
          <a style={linkStyle}>
            Calças
          </a>
          <a style={linkStyle}>
            Bonés
          </a>
          <a style={linkStyle}>
            Headphones
          </a>
          <a style={linkStyle}>
            Tênis
          </a>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "14px",
            maxWidth: "240px",
            flex: "1 1 200px",
          }}
        >
          <h4 style={columnTitleStyle}>Contato</h4>
          <p
            style={{
              color: "#CCCCCC",
              fontSize: "14px",
              margin: 0,
              lineHeight: "1.6",
              textAlign: "left",
            }}
          >
            Av. Santos Dumont, 1510 - 1 andar - Aldeota, Fortaleza - CE,
            60150-161
          </p>
          <p style={{ color: "#CCCCCC", fontSize: "14px", margin: 0 }}>
            (85) 3051-3411
          </p>
        </div>
      </div>
       <div
          style={{
            textAlign: "center",
            paddingTop: "25px",
            fontSize: "13px",
            color: "#FFFFFF",
          }}
        >
          © 2022 Digital College
        </div>
    </footer>
  );
};

export default Footer;
