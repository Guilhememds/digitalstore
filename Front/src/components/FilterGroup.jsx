import React from "react";

export default function FilterGroup({
  title,
  inputType = "checkbox",
  options = [],
  selectedValues = [],
  onChange,
}) {
  const groupName = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  return (
    <div className="filter-group">
      <h4 className="filter-group-title">{title}</h4>
      <div className="filter-group-options">
        {options.map((option, index) => {
          const optionValue = option.value ?? option.text;
          const isChecked =
            inputType === "radio"
              ? selectedValues === optionValue
              : Array.isArray(selectedValues) &&
                selectedValues.includes(optionValue);

          return (
            <label key={`${groupName}-${index}`} className="filter-option-label">
              <input
                type={inputType}
                name={groupName}
                value={optionValue}
                checked={isChecked}
                onChange={() => onChange && onChange(optionValue)}
                className="filter-option-input"
              />
              <span className="filter-option-text">{option.text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}