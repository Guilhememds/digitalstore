import React, { useState } from "react";

export default function ProductOptions({
  options = [],
  radius = "4px",
  shape = "square",
  type = "text",
  defaultValue,
  onChange,
}) {
  const [selected, setSelected] = useState(
    defaultValue ?? (options.length > 0 ? options[0] : null),
  );

  const handleSelect = (option) => {
    setSelected(option);
    if (onChange) {
      onChange(option);
    }
  };

  const isCircle = shape === "circle";

  return (
    <div className="product-options">
      {options.map((option, index) => {
        const isSelected = selected === option;

        const itemStyle = {
          width: isCircle ? "31px" : "auto",
          minWidth: isCircle ? "31px" : "46px",
          height: isCircle ? "31px" : "46px",
          borderRadius: isCircle ? "50%" : radius,
          borderWidth: isSelected ? "2px" : "1px",
          borderStyle: "solid",
          borderColor: isSelected ? "#C92071" : "#CCCCCC",
          backgroundColor: type === "color" ? option : "#FFFFFF",
        };

        return (
          <button
            key={`${option}-${index}`}
            type="button"
            onClick={() => handleSelect(option)}
            aria-pressed={isSelected}
            className={`product-option-item ${isSelected ? "is-selected" : ""}`}
            style={itemStyle}
          >
            {type === "text" && (
              <span className="product-option-text">{option}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
