import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { payAgainstPurchase } from "../../redux/features/purchase/purchaseThunks";
import { useDispatch } from "react-redux";
import Header1 from "../../pages/customer-reciept/Header1";

const PendingBillsModal = ({
  show,
  onHide,
  onBillSelect,
  bills = [],
  amountBill,
  setDebitAmount,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dispatch = useDispatch();

  const pendingBills = bills?.length ? bills : null;

  useEffect(() => {
    if (show) setSelectedIndex(0);
  }, [show]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!show || pendingBills.length === 0) return;
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % pendingBills.length);
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) =>
          prev === 0 ? pendingBills.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        const selected = pendingBills[selectedIndex];
        if (selected) {
          onBillSelect(selected._id);
          onHide();
        }
      } else if (e.key === "Escape") {
        onHide();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, selectedIndex, pendingBills]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  const handleSave = async (id) => {
    const payload = {
      purchaseId: id,
      amount: Number(amountBill),
    };
    try {
      await dispatch(payAgainstPurchase(payload))
        .unwrap()
        .then((res) => {
          console.log("✅ Payment Success:", res);
          setDebitAmount((prev) => prev - res?.paidAmount);
          alert("Payment Done!");
        })
        .catch((err) => {
          console.error("❌ Payment Error:", err);
          alert(err);
        });

      onHide();
      // navigate("/");
    } catch (error) {
      console.error("Error saving adjustment:", error);
      alert("Failed to save adjustment");
    }
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Header1 />
      <Modal.Header
        style={{ backgroundColor: "#3C6360" }}
        closeButton
        className="bg-bg-success"
      >
        <Modal.Title className="text-white">PENDING INVOICE</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="px-4 py-3"
        style={{ fontFamily: "Courier New, monospace" }}
      >
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <div>
              <strong>SAMRIDDHI ENTERPRISES - JYOTHY</strong>
              <br />
              H.NO 2, NAGAR NIGAM COLONY COAL & TIMBER MARKET CHHOLA ROAD,
              BHOPAL
            </div>
          </div>
        </div>

        <div>
          <input type="text" readOnly value={amountBill} />
        </div>

        <div
          className="border border-dark"
          style={{ borderWidth: "2px" }}
        ></div>

        <div
          className="d-flex text-uppercase fw-bold mt-2 mb-2 px-1"
          style={{ fontSize: "13px" }}
        >
          <span style={{ width: "15%" }}>INVOICE NO.</span>
          <span style={{ width: "15%" }}>INV. AMOUNT</span>
          <span style={{ width: "15%" }}>BILL DATE</span>
          <span style={{ width: "15%" }}>DUE DATE</span>
          <span style={{ width: "10%" }}>DAYS</span>
          <span style={{ width: "15%" }}>BALANCE</span>
          <span style={{ width: "15%" }}>AMOUNT</span>
        </div>

        <div
          className="border border-dark"
          style={{ borderWidth: "1px" }}
        ></div>

        {pendingBills?.length > 0 ? (
          pendingBills?.map((bill, index) => {
            const isSelected = index === selectedIndex;
            const balance = bill?.pendingAmount || 0;
            const daysDiff = (() => {
              const billDate = new Date(bill?.billDate);
              const dueDate = new Date(bill?.dueDate);
              const diff = Math.floor(
                (dueDate - billDate) / (1000 * 60 * 60 * 24)
              );
              return isNaN(diff) ? "-" : diff;
            })();

            return (
              <div
                key={bill._id}
                className={`d-flex align-items-center py-2 px-1 ${
                  isSelected ? "bg-primary text-white" : ""
                }`}
                style={{ fontSize: "14px" }}
              >
                <span style={{ width: "15%" }}>
                  {bill?.invoiceNo || bill?.entryNumber || "N/A"}
                </span>
                <span style={{ width: "15%" }}>
                  {balance.toFixed(2)} {bill?.type || "Dr"}
                </span>
                <span style={{ width: "15%" }}>
                  {formatDate(bill?.billDate)}
                </span>
                <span style={{ width: "15%" }}>
                  {formatDate(bill?.dueDate)}
                </span>
                <span style={{ width: "10%" }}>{daysDiff}</span>
                <span style={{ width: "15%" }}>
                  {balance.toFixed(2)} {bill?.type || "Dr"}
                </span>
                <span style={{ width: "15%" }}>
                  <button
                    className={`btn btn-sm ${
                      isSelected ? "btn-light" : "btn-primary"
                    }`}
                    onClick={() => {
                      handleSave(bill._id);
                    }}
                  >
                    SELECT
                  </button>
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4">No pending bills available.</div>
        )}

        <div
          className="border border-dark mt-2"
          style={{ borderWidth: "2px" }}
        ></div>
      </Modal.Body>
    </Modal>
  );
};

export default PendingBillsModal;
