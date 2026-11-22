import React from "react";

export default function Section({ title, titleAlign = "left", children }) {
  return (
    <section className="section-wrapper">
      <div className="section-container">
        {title && (
          <h2 className="section-title" style={{ textAlign: titleAlign }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
