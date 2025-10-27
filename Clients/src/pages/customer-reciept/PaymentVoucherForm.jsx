import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Row, Col, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BillAdjustmentModal from "./BillAdjustmentModal";
import PendingBillsModal from "./PendingBillsModal";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchVendorBills,
  fetchVendors,
} from "../../redux/features/vendor/VendorThunks";
import { getBalance } from "../../redux/features/purchase/purchaseThunks";

const PaymentVoucherForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [vendorIndex, setVendorIndex] = useState(0);
  const [debitAmount, setDebitAmount] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [pendingRowIndex, setPendingRowIndex] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const billAdjustmentModalRef = useRef();

  const [openBillModalRequested, setOpenBillModalRequested] = useState(false);

  const [dateValue, setDateValue] = useState("");
  const [dayValue, setDayValue] = useState("");

  const formRefs = useRef([]);

  const dispatch = useDispatch();

  const [showBillModal, setShowBillModal] = useState(false);
  const [pendingValue, setPendingValue] = useState(0);

  const vendorList = useSelector((state) => state.vendor.vendors);
  const vendorBills = useSelector((state) => state.vendor.vendorBills);
  const balance = useSelector((state) => state.purchase?.balance);


  const handleOpenPendingBills = (rowIdx) => {
    setPendingRowIndex(rowIdx);
    dispatch(fetchVendorBills(selectedVendor?._id)).then((res) => {
      if (res.payload?.length > 0) {
        setShowPendingModal(true);
      } else {
        // alert("No pending bills available.");
      }
    });
  };

  useEffect(() => {
    if (vendorBills.length > 0 && showBillModal && pendingRowIndex !== null) {
      setShowPendingModal(true);
    }
  }, [vendorBills, showBillModal, pendingRowIndex]);

  useEffect(() => {
    dispatch(fetchVendors());
  }, []);

  // 🔑 Enter / Arrow navigation between fields
  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      if (e.target.name === "date") {
        setVendorIndex(0);
        setShowModal(true);
        return;
      }
      if (index === 4) {
        // Debit field index pe Bill Adjustment Modal open
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

  // ✅ Modal keyboard support
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

  // Attach keyboard listener after small delay to avoid accidental Enter
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

  //! date and day
  useEffect(() => {
    const now = new Date();

    // Format: 15/03/2000
    const formattedDate = now.toLocaleDateString("en-GB"); // dd/mm/yyyy
    const formattedDay = now.toLocaleDateString("en-GB", { weekday: "long" });

    setDateValue(formattedDate);
    setDayValue(formattedDay);
  }, []);

  const handleDateChange = (e) => {
    const input = e.target.value;
    setDateValue(input);

    // Convert DD/MM/YYYY to Date
    const [day, month, year] = input.split("/");
    const parsedDate = new Date(`${year}-${month}-${day}`);

    if (!isNaN(parsedDate)) {
      const newDay = parsedDate.toLocaleDateString("en-GB", {
        weekday: "long",
      });
      setDayValue(newDay);
      fetchNextVoucherNumber();
    } else {
      setDayValue("");
    }
  };

  //! date end

  const selectVendor = async (vendor) => {
    // console.log("ssss", vendor._id);
    setSelectedVendor(vendor);
    const res = await dispatch(getBalance(vendor._id));
    console.log("Balance thunk result:", res);

    dispatch(fetchVendorBills(vendor._id));

    setShowModal(false);
    // Focus next input after vendor selection
    setTimeout(() => {
      formRefs.current[4]?.focus();
    }, 100);
  };

  useEffect(() => {
    if (openBillModalRequested && vendorBills.length > 0) {
      setShowBillModal(true);
      setOpenBillModalRequested(false);
    }
  }, [openBillModalRequested, vendorBills]);

  return (
    <Container className='mt-4'>
      <h4 className='text-center mb-2'>SAMRIDDHI ENTERPRISES - JYOTHY</h4>
      <p className='text-center mb-1'>
        H.NO 2, NAGAR NIGAM COLONY COAL & TIMBER MARKET CHHOLA ROAD, BHOPAL
      </p>
      <p className='text-center mb-4'>Period : 01-04-2025 - 31-03-2026</p>

      <Form>
        <Row className='mb-4'>
          <Col md={12}>
            <Form.Group className='mb-3'>
              <Form.Label>Voucher Type</Form.Label>
              <Form.Control
                type='text'
                defaultValue='Payment'
                ref={(el) => (formRefs.current[0] = el)}
                onKeyDown={(e) => handleKeyDown(e, 0)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Voucher No.</Form.Label>
              <Form.Control
                type='text'
                value={voucherNumber}
                readOnly
                placeholder='Auto-generated'
                ref={(el) => (formRefs.current[1] = el)}
                onKeyDown={(e) => handleKeyDown(e, 1)}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Row>
              <Col md={12}>
                <Form.Group className='mb-3'>
                  <Form.Label>
                    Date{" "}
                    <span style={{ fontSize: "12px", color: "blue" }}>
                      (Press Enter to trigger a function)
                    </span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    name='date'
                    placeholder='DD/MM/YYYY'
                    value={dateValue}
                    onChange={handleDateChange}
                    ref={(el) => (formRefs.current[2] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Day</Form.Label>
                  <Form.Control
                    type='text'
                    value={dayValue}
                    readOnly
                    ref={(el) => (formRefs.current[3] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>

      {/*  Modal for Vendor Selection */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Vendor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Vendor List */}
          {vendorList.map((vendor, index) => (
            <div
              key={vendor._id}
              onClick={() => selectVendor(vendor, index)}
              style={{
                padding: "12px 16px",
                backgroundColor: vendorIndex === index ? "#007bff" : "#f8f9fa",
                color: vendorIndex === index ? "#fff" : "#000",
                cursor: "pointer",
                borderRadius: "6px",
                marginBottom: "8px",
                transition: "background-color 0.2s",
              }}
            >
              <div className='d-flex justify-content-between align-items-center'>
                <p className='mb-0' style={{ flex: 1 }}>
                  {vendor?.name}
                </p>
                <p className='mb-0 text-center' style={{ flex: 1 }}>
                  {vendor?.city}
                </p>
                <p className='mb-0 text-end' style={{ flex: 1 }}>
                  {vendorBills?.balance}
                </p>
              </div>
            </div>
          ))}

          {/* Selected Vendor Address Section */}
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

      {/*  Selected Vendor Info + Debit Input */}
      {selectedVendor && (
        <>
          <hr />
          <h5>Vendor Details</h5>
          <p>
            <strong>Name:</strong> {selectedVendor?.name}
          </p>
          <p>
            <strong>City:</strong> {selectedVendor?.city}
          </p>
          <p>
            <strong>Total Balance:</strong> ₹
            {balance?.balance?.toFixed(2) || "0.00"}
          </p>

          <Form.Group as={Row} className='mb-3' controlId='formDebit'>
            <Form.Label column sm={2}>
              Debit Amount
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                type='number'
                placeholder='Enter amount'
                value={debitAmount}
                ref={(el) => (formRefs.current[4] = el)}
                onChange={(e) => setDebitAmount(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 4)}
              />
            </Col>
          </Form.Group>
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
      />
    </Container>
  );
};

export default PaymentVoucherForm;
