import React from "react";

const ProductModel = ({
  showModal,
  setShowModal,
  filterText,
  setFilterText,
  focusedIndex,
  setFocusedIndex,
  modalRef,
  inputRef,
  rowRefs,
  filteredItems,
  handleProductSelect,
  productRef,
}) => {
  if (!showModal) return null;

  // Find the next selectable index (skip disabled)
  const getNextIndex = (start, direction) => {
    let idx = start;
    const len = filteredItems.length;
    do {
      idx = (idx + direction + len) % len;
    } while (filteredItems[idx].availableQty === 0);
    return idx;
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
      onClick={() => setShowModal(false)}
    >
      <div
        className="modal-body"
        ref={modalRef}
        style={{
          width: "80%",
          margin: "5% auto",
          backgroundColor: "white",
          padding: "1rem",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((prev) => getNextIndex(prev, 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) => getNextIndex(prev, -1));
          }
          if (e.key === "Enter" && focusedIndex >= 0) {
            e.preventDefault();
            const selected = filteredItems[focusedIndex];
            if (selected.availableQty > 0) {
              handleProductSelect(selected);
            }
          }
          if (e.key === "Escape") {
            e.preventDefault();
            setShowModal(false);
            setTimeout(() => {
              productRef.current?.focus();
            }, 100);
          }
        }}
      >
        <input
          ref={inputRef}
          className="form-control mb-3"
          placeholder="Search product..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setFocusedIndex(0);
          }}
        />

        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th>Product Name</th>
              <th>Brand</th>
              <th>HSN Code</th>
              <th>MRP</th>
              <th>Sales Rate</th>
              <th>Purchase Rate</th>
              <th>Available QTY.</th>
              <th>GST%</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((prod, idx) => {
              {
                /* const isDisabled = prod.availableQty === 0; */
              }
              const isFocused = idx === focusedIndex;

              return (
                <tr
                  key={prod._id}
                  ref={(el) => (rowRefs.current[idx] = el)}
                  className={`${isFocused ? "table-active" : ""}`}
                  style={{
                    // cursor: isDisabled ? "not-allowed" : "pointer",
                    cursor: "pointer",
                    backgroundColor: "",
                    color: "",
                    opacity: 1,
                    pointerEvents: "auto",
                  }}
                  onClick={() => {
                    // if (!isDisabled) {
                    handleProductSelect(prod);
                    // }
                  }}
                >
                  <td>{prod.productName}</td>
                  <td>{prod.companyId?.name || "-"}</td>
                  <td>{prod.hsnCode}</td>
                  <td>{prod.mrp}</td>
                  <td>{prod.salesRate}</td>
                  <td>{prod.purchaseRate}</td>
                  <td>{prod.availableQty}</td>
                  <td>{prod.gstPercent}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductModel;
