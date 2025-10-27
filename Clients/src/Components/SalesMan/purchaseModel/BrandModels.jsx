import React from "react";

const BrandModels = ({
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
  setPurchaseData,
  brandRef,
  partyNoRef,
}) => {
  if (!showModal) return null;

  const handleBrandSelect = (brand) => {
    setPurchaseData((prev) => ({
      ...prev,
      companyId: brand._id,
      item: {
        ...prev.item,
        companyId: brand._id,
      },
    }));
    setShowModal(false);

    setTimeout(() => {
      partyNoRef.current?.focus();
    }, 100);
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
            setFocusedIndex((prev) =>
              prev < filteredItems.length - 1 ? prev + 1 : 0
            );
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredItems.length - 1
            );
          }
          if (e.key === "Enter" && focusedIndex >= 0) {
            e.preventDefault();
            handleBrandSelect(filteredItems[focusedIndex]);
          }
          if (e.key === "Escape") {
            e.preventDefault();
            setShowModal(false);
            setTimeout(() => {
              brandRef.current?.focus();
            }, 100);
          }
        }}
      >
        <input
          ref={inputRef}
          className="form-control mb-3"
          placeholder="Search brand..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setFocusedIndex(0);
          }}
          autoFocus
        />

        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th>Brand Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((brand, idx) => (
              <tr
                key={brand._id}
                ref={(el) => (rowRefs.current[idx] = el)}
                className={idx === focusedIndex ? "table-active" : ""}
                // onClick={() => {
                //   setPurchaseData((prev) => ({
                //     ...prev,
                //     item: {
                //       ...prev.item,
                //       companyId: brand._id,
                //     },
                //   }));
                //   setShowModal(false);
                // }}
                onClick={() => handleBrandSelect(brand)}
                style={{ cursor: "pointer" }}
              >
                <td>{brand.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandModels;
