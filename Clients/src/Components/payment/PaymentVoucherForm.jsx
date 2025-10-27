import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BillAdjustmentModal from "./BillAdjustmentModal";
import PendingBillsModal from "./PendingBillsModal";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchVendorBills,
  fetchVendors,
} from "../../redux/features/vendor/VendorThunks";
import { getBalance } from "../../redux/features/purchase/purchaseThunks";
import axiosInstance from "../../Config/axios";

const PaymentVoucherForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [vendorIndex, setVendorIndex] = useState(0);
  const [debitAmount, setDebitAmount] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [pendingValue, setPendingValue] = useState(0);
  const [pendingRowIndex, setPendingRowIndex] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const billAdjustmentModalRef = useRef();
  const [openBillModalRequested, setOpenBillModalRequested] = useState(false);

  const [dateValue, setDateValue] = useState("");
  const [dayValue, setDayValue] = useState("");

  const formRefs = useRef([]);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const [showBillModal, setShowBillModal] = useState(false);

  const vendorList = useSelector((state) => state.vendor.vendors);
  const vendorBills = useSelector((state) => state.vendor.vendorBills);
  const balance = useSelector((state) => state.purchase?.balance);

  const [voucherNumber, setVoucherNumber] = useState("");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  console.log(vendorList);

  const fetchNextVoucherNumber = async () => {
    try {
      const res = await axiosInstance.get(
        "/vendor/ledger/next-vendor-voucher-number"
      );
      setVoucherNumber(res.data.nextVoucherNumber);
    } catch (err) {
      console.error("Error fetching vendor voucher number:", err);
    }
  };

  useEffect(() => {
    fetchNextVoucherNumber();
  }, []);

  const handleOpenPendingBills = (rowIdx) => {
    setPendingRowIndex(rowIdx);
    dispatch(fetchVendorBills(selectedVendor?._id)).then((res) => {
      if (res.payload?.length > 0) {
        setShowPendingModal(true);
      }
    });
  };

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  useEffect(() => {
    if (vendorBills.length > 0 && showBillModal && pendingRowIndex !== null) {
      setShowPendingModal(true);
    }
  }, [vendorBills, showBillModal, pendingRowIndex]);

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      if (e.target.name === "date") {
        setVendorIndex(0);
        setShowModal(true);
        return;
      }
      if (index === 4) {
        setOpenBillModalRequested(true);
        setShowBillModal(true);
        return;
      }
      formRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      formRefs.current[index - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      formRefs.current[0]?.focus();
    }
  };

  const handleVendorKey = (e) => {
    if (!showModal) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setVendorIndex((prev) => (prev + 1) % vendorList.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setVendorIndex((prev) => (prev === 0 ? vendorList.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectVendor(vendorList[vendorIndex]);
    } else if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  useEffect(() => {
    let timeout;
    if (showModal) {
      timeout = setTimeout(() => {
        window.addEventListener("keydown", handleVendorKey);
      }, 300);
    }
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", handleVendorKey);
    };
  }, [showModal, vendorIndex]);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const formattedDay = now.toLocaleDateString("en-GB", { weekday: "long" });

    setDateValue(formattedDate);
    setDayValue(formattedDay);
  }, []);

  const handleDateChange = (e) => {
    const input = e.target.value;
    setDateValue(input);

    const [day, month, year] = input.split("/");
    const parsedDate = new Date(`${year}-${month}-${day}`);

    if (!isNaN(parsedDate)) {
      const newDay = parsedDate.toLocaleDateString("en-GB", {
        weekday: "long",
      });
      setDayValue(newDay);
    } else {
      setDayValue("");
    }
  };

  const selectVendor = async (vendor) => {
    setSelectedVendor(vendor);
    await dispatch(getBalance(vendor._id));
    dispatch(fetchVendorBills(vendor._id));
    setShowModal(false);
  };

  useEffect(() => {
    if (openBillModalRequested && vendorBills.length > 0) {
      setShowBillModal(true);
      setOpenBillModalRequested(false);
    }
  }, [openBillModalRequested, vendorBills]);

  // --- Pagination Calculations ---
  const filteredVendors = vendorList.filter((v) =>
    v.firm?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Container className="mt-4">
      <h4 className="text-center mb-2">SAMRIDDHI ENTERPRISES - JYOTHY</h4>
      <p className="text-center mb-1">
        H.NO 2, NAGAR NIGAM COLONY COAL & TIMBER MARKET CHHOLA ROAD, BHOPAL
      </p>
      <p className="text-center mb-4">Period : 01-04-2025 - 31-03-2026</p>
      <div className="line mb-3"></div>

      <Form>
        <Row className="mb-4">
          {/* Left Side */}
          <Col md={6} className="mt-4">
            {/* Voucher Type */}
            <Form.Group as={Row} className="mb-3 align-items-center">
              <Form.Label column sm={4} className="col-form-label">
                Voucher Type
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  defaultValue="Payment"
                  ref={(el) => (formRefs.current[0] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                />
              </Col>
            </Form.Group>

            {/* Voucher No. */}
            <Form.Group as={Row} className="mb-3 align-items-center">
              <Form.Label column sm={4} className="col-form-label">
                Voucher No.
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={voucherNumber}
                  readOnly
                  placeholder="Auto-generated"
                  ref={(el) => (formRefs.current[1] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                />
              </Col>
            </Form.Group>
          </Col>

          {/* Right Side */}
          <Col md={6} className="mt-4">
            {/* Date */}
            <Form.Group as={Row} className="mb-3 align-items-center">
              <Form.Label column sm={4} className="col-form-label">
                Date{" "}
                <span style={{ fontSize: "12px", color: "red" }}>
                  (Press Enter to trigger a function)
                </span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="date"
                  placeholder="DD/MM/YYYY"
                  value={dateValue}
                  onChange={handleDateChange}
                  ref={(el) => (formRefs.current[2] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                />
              </Col>
            </Form.Group>

            {/* Day */}
            <Form.Group as={Row} className="mb-3 align-items-center">
              <Form.Label column sm={4} className="col-form-label">
                Day
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={dayValue}
                  readOnly
                  ref={(el) => (formRefs.current[3] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                />
              </Col>
            </Form.Group>
          </Col>
        </Row>

        {/* Optional horizontal line */}
        <hr />
      </Form>

      {/* --- Vendor Selection Modal --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Vendor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search vendor name..."
            className="form-control mb-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Rows per page */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              Rows per page:{" "}
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 15, 20].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {paginatedVendors?.map((vendor, index) => (
            <div
              key={vendor._id}
              onClick={() => {
                selectVendor(vendor);
                setVendorIndex(index);
              }}
              style={{
                padding: "12px 16px",
                backgroundColor: vendorIndex === index ? "#007bff" : "#f8f9fa",
                color: vendorIndex === index ? "#fff" : "#000",
                cursor: "pointer",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0" style={{ flex: 1 }}>
                  {vendor?.name}
                </p>
                <p className="mb-0 text-center mr-4" style={{ flex: 1 }}>
                  {vendor?.firm}
                </p>
                <p className="mb-0 text-end" style={{ flex: 1 }}>
                  {vendorBills?.balance}
                </p>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>

          {vendorList[vendorIndex] && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                backgroundColor: "#e9ecef",
                borderRadius: "6px",
                border: "1px solid #ced4da",
              }}
            >
              <h6 style={{ marginBottom: "8px", color: "#333" }}>
                Selected Vendor Address:
              </h6>
              <p style={{ margin: 0, fontStyle: "italic", color: "#495057" }}>
                🏠 {vendorList[vendorIndex]?.address || "Address not available"}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {selectedVendor && (
        <>
          <div className="d-flex align-items-center gap-5 mt-4 w-full">
            <p className="mb-0">
              <strong></strong> {selectedVendor?.name}
            </p>
            <p className="mb-0">
              <strong></strong> {selectedVendor?.city}
            </p>
            <p className="mb-0">
              <strong>Total Balance:</strong> ₹
              {balance?.balance?.toFixed(2) || "0.00"}
            </p>

            <Form.Group className="d-flex" controlId="formDebit">
              <Form.Label column>Debit Amount</Form.Label>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={debitAmount}
                  ref={(el) => (formRefs.current[4] = el)}
                  onChange={(e) => setDebitAmount(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 4)}
                />
              </Col>
            </Form.Group>
          </div>
          <div className="line mt-5"></div>
        </>
      )}

      <BillAdjustmentModal
        ref={billAdjustmentModalRef}
        show={showBillModal}
        onHide={() => setShowBillModal(false)}
        amount={parseFloat(debitAmount || 0)}
        openPendingModal={(rowIndex) => {
          handleOpenPendingBills(rowIndex);
        }}
        selectedVendorId={selectedVendor?._id}
        onPendingChange={(value) => {
          console.log("⏱ Pending from modal:", value);
          setPendingValue(value);
        }}
        setDebitAmount={setDebitAmount}
      />

      <PendingBillsModal
        show={!!showPendingModal}
        onHide={() => setShowPendingModal(false)}
        bills={vendorBills}
        onSelectItem={(result) => {
          billAdjustmentModalRef.current?.insertBill(pendingRowIndex, result);
          setShowPendingModal(false);
        }}
        amountBill={pendingValue}
        setDebitAmount={setDebitAmount}
      />
    </Container>
  );
};

export default PaymentVoucherForm;
