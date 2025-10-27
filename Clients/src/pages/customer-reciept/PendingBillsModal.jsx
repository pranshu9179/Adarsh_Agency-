import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import axiosInstance from "../../Config/axios";
import Header from "./Header1";
import { useDispatch, useSelector } from "react-redux";

import {
  updateCustomerBalanced,
  fetchCustomerById,
} from "../../redux/features/customer/customerThunks";

const PendingBillsModal = ({
  show,
  onHide,
  onBillSelect,
  bills = [],
  amountBill,
  setBillAdjust,
  setDebitAmount,
  debitAmount,
  selectedCustomer,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [balanceType, setBalanceType] = useState("new"); // default: new balance

  const [inputValue, setInputValue] = useState(debitAmount);

  // const [leftAmount, setLeftAmount] = useState(0);

  const dispatch = useDispatch();

  const pendingBills = bills.invoices?.length ? bills.invoices : [];
  const { customer } = useSelector((state) => state.customer);

  console.log(customer, "this is useselector data");

  useEffect(() => {
    if (show) {
      setSelectedIndex(0);
    }
  }, [show]);

  // useEffect(() => {
  //   if (show) {
  //     // setLeftAmount(Number(selectedCustomer?.balance || 0));
  //   }
  // }, [show, selectedCustomer]);

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
    if (debitAmount > 0) {
      console.log(amountBill, "this is amount b8lll");

      const payload = {
        invoiceId: id,
        amount: Number(amountBill),
      };
      console.log(id);
      try {
        const res = await axiosInstance.post("/pro-billing/adjust", payload);
        const adjustedAmount = Number(res.data?.adjustedAmount || 0);
        console.log(adjustedAmount);

        if (res.data?.adjustedAmount > 0) {
          setBillAdjust((prev) => [...prev, res.data]);
          setDebitAmount((prev) => Math.max(prev - adjustedAmount, 0)); // ✅ safely update the displaye
        }
        alert("Payment adjusted successfully");
        onHide();
      } catch (error) {
        console.error("Error saving adjustment:", error);
        alert("Failed to save adjustment");
      }
    } else {
      alert("Your debited Amount is Zero");
    }
  };

  console.log(pendingBills);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); // allow only numbers & dot
    const numericValue = parseFloat(value || 0);

    // Prevent value greater than debitAmount
    if (numericValue > debitAmount) return;

    setInputValue(value);

    // Dynamically decrease the old balance live
    const totalLeft =
      Number(selectedCustomer.balance || 0) - Number(numericValue || 0);

    setLeftAmount(totalLeft > 0 ? totalLeft : 0);
  };

  const handleSubmit = async () => {
    try {
      const amount = Number(inputValue || debitAmount);

      if (!amount || amount <= 0) {
        alert("Please enter a valid debit amount.");
        return;
      }

      const res = await dispatch(
        updateCustomerBalanced({
          id: selectedCustomer._id,
          data: amount,
        })
      ).unwrap();

      if (res.success) {
        alert("✅ Payment successful!");

        setDebitAmount((prev) => Math.max(prev - amount, 0));
        dispatch(fetchCustomerById(selectedCustomer?._id));
        setInputValue(""); // reset input field
      } else {
        alert(res.message || "Payment failed");
      }
    } catch (error) {
      console.error("Error while updating balance:", error);
      alert(error.message || "Something went wrong while debiting balance");
    }
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Header />
      <Modal.Header
        style={{ backgroundColor: "#3C6360" }}
        closeButton
        className="bg-bg-success"
      >
        <Modal.Title className="text-white">PENDING INVOICE</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pending-modal-body">
        <div className="d-flex justify-content-between">
          <input
            type="number d-flex justify-content-center align-items-center"
            readOnly
            value={`₹${Number(debitAmount)?.toFixed(2)}`}
            className="h-25 text-end"
          />
          <div>
            <label htmlFor="balance" className="me-2">
              Select Balance:
            </label>
            <select
              id="balance"
              value={balanceType}
              onChange={(e) => {
                // handleFetchBalanced;
                setBalanceType(e.target.value);
              }}
            >
              <option value="old">Old Balance</option>
              <option value="new">New Balance</option>
            </select>

            <p className="mt-2">
              Selected: {balanceType === "old" ? "Old Balance" : "New Balance"}
            </p>
          </div>
        </div>
        {balanceType == "old" ? (
          <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6 border border-gray-100">
            {/* Old Balance */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Old Balance
              </label>
              <input
                type="text"
                readOnly
                // value={`₹${leftAmount.toFixed(2)}`}
                value={
                  customer?.balance
                    ? customer?.balance
                    : selectedCustomer?.balance
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 font-medium cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Debited Balance */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Debited Balance
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-gray-500 mr-1 font-medium">₹</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  className="flex-1 outline-none text-gray-700 font-semibold"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max allowed: ₹{Number(debitAmount).toFixed(2)}
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                // className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                className="bg-blue-700"
              >
                Confirm Debit
              </button>
            </div>
          </div>
        ) : (
          <div className="pending-table-wrapper">
            <div className="pending-table-header">
              <span>INVOICE NO.</span>
              <span>INV. AMOUNT</span>
              <span>BILL DATE</span>
              <span>DUE DATE</span>
              <span>DAYS</span>
              <span>BALANCE</span>
              <span>AMOUNT</span>
            </div>
            {pendingBills.length > 0 ? (
              pendingBills.map((bill, index) => {
                console.log(bill);
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
                    className={`pending-row ${isSelected ? "active-row" : ""}`}
                  >
                    <span>{bill?.invoiceNo}</span>
                    <span>
                      {balance.toFixed(2)} {bill?.type}
                    </span>
                    <span>{formatDate(bill?.billDate)}</span>
                    <span>{formatDate(bill?.dueDate)}</span>
                    <span>{daysDiff}</span>
                    <span>
                      {balance.toFixed(2)} {bill?.type}
                    </span>
                    <span>
                      <button
                        className="select-btn"
                        onClick={() => {
                          handleSave(bill?._id);
                          onHide();
                        }}
                      >
                        SELECT
                      </button>
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="pending-empty">No pending bills available.</div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PendingBillsModal;
