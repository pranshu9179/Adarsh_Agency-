import React, { useRef, useEffect } from "react";
const IMAGE_BASE = "https://your-base-url.com"; // Change as per your config

function ProductSelectionModal({
  show,
  onClose,
  products,
  filterText,
  setFilterText,
  selectedRowIndex,
  handleSelectProduct,
  focusedIndex,
  setFocusedIndex,
  rowRefs,
  virtualStockMap,
}) {
  const inputRef = useRef();
  useEffect(() => {
    if (show && inputRef.current) inputRef.current.focus();
  }, [show]);
  useEffect(() => {
    if (show && rowRefs.current[focusedIndex]) {
      rowRefs.current[focusedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [show, focusedIndex]);
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: "1rem",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          outline: "none",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev < products.length - 1 ? prev + 1 : 0
            );
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : products.length - 1
            );
          }
          if (e.key === "Enter" && focusedIndex !== -1) {
            handleSelectProduct(products[focusedIndex]);
          }
        }}
        tabIndex={-1}
      >
        <h5>Select a Product</h5>
        <input
          ref={inputRef}
          type="text"
          className="form-control mb-3"
          placeholder="Search products..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setFocusedIndex(0);
          }}
          autoFocus
        />
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>SR</th>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Brand</th>
              <th>HSN Code</th>
              <th>MRP</th>
              <th>Sales Rate</th>
              <th>Purchase Rate</th>
              <th>GST %</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                ref={(el) => (rowRefs.current[index] = el)}
                className={index === focusedIndex ? "table-active" : ""}
                onClick={() => handleSelectProduct(product)}
              >
                <td>{index + 1}</td>
                <td>
                  {product.productImg ? (
                    <img
                      src={`${IMAGE_BASE}/Images/${product.productImg}`}
                      alt="Product"
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    "No Photo"
                  )}
                </td>
                <td>{product.productName}</td>
                <td>{virtualStockMap[product._id]}</td>
                <td>{product.companyId?.name || "-"}</td>
                <td>{product.hsnCode}</td>
                <td>{product.mrp}</td>
                <td>{product.salesRate}</td>
                <td>{product.purchaseRate}</td>
                <td>{product.gstPercent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ProductSelectionModal;
