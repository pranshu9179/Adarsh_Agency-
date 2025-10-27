import React from "react";
import Select from "react-select";

const BillingTableRow = ({
  row,
  rowIndex,
  fields,
  handleChange,
  handleKeyDown,
  qtyRef,
  selectRef,
  setShowModal,
  setSelectedRowIndex,
}) => (
  <tr onKeyDown={(e) => handleKeyDown(e, rowIndex)}>
    {fields.map((field, colIndex) => (
      <td key={colIndex} style={{ minWidth: "150px" }}>
        {field === "SR" ? (
          rowIndex + 1
        ) : field === "ItemName" ? (
          <div
            tabIndex={0}
            onFocus={() => {
              setSelectedRowIndex(rowIndex);
              setShowModal(true);
            }}
          >
            <Select
              ref={selectRef}
              className="w-100 "
              value={
                row.product
                  ? { label: row.product.productName, value: row.product._id }
                  : null
              }
              placeholder="Select Product"
              isDisabled
              styles={{
                container: (base) => ({ ...base, minWidth: "350px" }),
              }}
            />
          </div>
        ) : field === "Unit" ? (
          <Select
            className="w-100"
            value={row.Unit ? { label: row.Unit, value: row.Unit } : null}
            options={[
              row.product?.primaryUnit && {
                label: row.product.primaryUnit,
                value: row.product.primaryUnit,
              },
              row.product?.secondaryUnit && {
                label: row.product.secondaryUnit,
                value: row.product.secondaryUnit,
              },
            ].filter(Boolean)}
            onChange={(selected) =>
              handleChange(rowIndex, "Unit", selected.value)
            }
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            onKeyDown={(e) => {
              const key = e.key.toLowerCase();
              if (key === "p" && row.product?.secondaryUnit) {
                e.preventDefault();
                handleChange(rowIndex, "Unit", row.product.secondaryUnit);
              }
              if (key === "c" && row.product?.primaryUnit) {
                e.preventDefault();
                handleChange(rowIndex, "Unit", row.product.primaryUnit);
              }
            }}
          />
        ) : [
            "Sch",
            "CD",
            "SchAmt",
            "CDAmt",
            "Total",
            "Amount",
            "Basic",
          ].includes(field) ? (
          <input
            type="text"
            className="form-control"
            value={row[field]}
            onFocus={() => {
              if (row[field] === "0.00" || row[field] === 0)
                handleChange(rowIndex, field, "");
            }}
            onBlur={() => {
              let val = parseFloat(row[field]);
              if (isNaN(val)) val = 0;
              handleChange(rowIndex, field, val.toFixed(2));
            }}
            onChange={(e) => {
              let value = e.target.value;
              if (!/^\d*\.?\d*$/.test(value)) return; // only number/dot
              if (value.includes(".")) {
                const [int, dec] = value.split(".");
                if (dec.length > 2) return;
              }
              handleChange(rowIndex, field, value);
            }}
          />
        ) : field === "GST" ? (
          <input
            type="text"
            className="form-control"
            value={row[field]}
            readOnly
          />
        ) : (
          <input
            type="text"
            className="form-control"
            ref={field === "Qty" ? qtyRef : null}
            value={row[field] || ""}
            onChange={(e) => handleChange(rowIndex, field, e.target.value)}
          />
        )}
      </td>
    ))}
  </tr>
);
export default BillingTableRow;
