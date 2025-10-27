import React from "react";

const VendorModal = ({
  showModal,
  setShowModal,
  filterText,
  setFilterText,
  focusedIndex,
  setFocusedIndex,
  modalRef,
  inputRef,
  rowRefs,
  VendorList,
  setPurchaseData,
}) => {
  if (!showModal) return null;

  console.log("Vendors List", VendorList);

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
              prev < VendorList.length - 1 ? prev + 1 : 0
            );
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : VendorList.length - 1
            );
          }
          if (e.key === "Enter" && focusedIndex >= 0) {
            e.preventDefault();
            const selected = VendorList[focusedIndex];
            setPurchaseData((prev) => ({
              ...prev,
              vendorId: selected._id,
              vendorName: vendor.firm,
            }));
            setShowModal(false);
            // Focus the date input
            setTimeout(() => {
              document.querySelector('input[name="date"]')?.focus();
            }, 100);
          }
          if (e.key === "Escape") {
            e.preventDefault();
            setShowModal(false);
            // Refocus the vendor input
            setTimeout(() => {
              document
                .querySelector('div[data-nav][class*="form-select"]')
                ?.focus();
            }, 100);
          }
        }}
      >
        <input
          ref={inputRef}
          className="form-control mb-3"
          placeholder="Search Party..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setFocusedIndex(0);
          }}
        />

        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th>Firm Name</th>
              <th>Mobile No</th>
              <th>City</th>
              <th>Address</th>
              <th>Balance</th>
              <th>Gst.No</th>
            </tr>
          </thead>
          <tbody>
            {VendorList.map((vendor, idx) => (
              <tr
                key={vendor._id}
                ref={(el) => (rowRefs.current[idx] = el)}
                className={idx === focusedIndex ? "table-active" : ""}
                onClick={() => {
                  setPurchaseData((prev) => ({
                    ...prev,
                    vendorId: vendor._id,
                  }));
                  setShowModal(false);
                }}
              >
                <td>{vendor?.firm}</td>
                <td>{vendor?.mobile}</td>
                <td>{vendor?.city}</td>
                <td>{vendor?.address}</td>
                <td>{vendor?.totalBalance}</td>
                <td>{vendor?.gstNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorModal;
