import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BillAdjustmentModal from "./BillAdjustmentModal";
import PendingBillsModal from "./PendingBillsModal";

import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../redux/features/customer/customerThunks";
import { fetchVendorBills } from "../../redux/features/vendor/VendorThunks";
import {
  fetchBalanceByCustomer,
  fetchInvoicesByCustomer,
} from "../../redux/features/product-bill/invoiceThunks";
import axiosInstance from "../../Config/axios";

const CustomerForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [customerIndex, setCustomerIndex] = useState(0);
  const [debitAmount, setDebitAmount] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [billAjust, setBillAdjust] = useState([]);

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

  const [searchQuery, setSearchQuery] = useState("");

  const customerList = useSelector((state) => state.customer.customers);
  const vendorBills = useSelector((state) => state.vendor.vendorBills);
  const balance = useSelector((state) => state.purchase?.balance);
  const { balanceByCustomer, invoicesByCustomer } = useSelector(
    (state) => state.invoice
  );

  const [voucherNumber, setVoucherNumber] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch next voucher number
  const fetchNextVoucherNumber = async () => {
    try {
      const res = await axiosInstance.get("/ledger/next-voucher-number");
      setVoucherNumber(res.data.nextVoucherNumber);
    } catch (err) {
      console.error("Error fetching voucher number:", err);
    }
  };

  useEffect(() => {
    fetchNextVoucherNumber();
  }, []);

  const handleOpenPendingBills = (rowIdx) => {
    setPendingRowIndex(rowIdx);
    dispatch(fetchVendorBills(selectedCustomer?._id)).then((res) => {
      if (res.payload?.length > 0) {
        setShowPendingModal(true);
      }
    });
  };

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (vendorBills.length > 0 && showBillModal && pendingRowIndex !== null) {
      setShowPendingModal(true);
    }
  }, [vendorBills, showBillModal, pendingRowIndex]);

  useEffect(() => {
    formRefs.current[2]?.focus();
  }, []);

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      if (e.target.name === "date") {
        setCustomerIndex(0);
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

  const handleCustomerKey = (e) => {
    if (!showModal) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCustomerIndex((prev) => (prev + 1) % customerList.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCustomerIndex((prev) =>
        prev === 0 ? customerList.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectCustomer(customerList[customerIndex]);
    } else if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  useEffect(() => {
    let timeout;
    if (showModal) {
      timeout = setTimeout(() => {
        window.addEventListener("keydown", handleCustomerKey);
      }, 300);
    }
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", handleCustomerKey);
    };
  }, [showModal, customerIndex]);

  useEffect(() => {
    const now = new Date();
    setDateValue(now.toLocaleDateString("en-GB"));
    setDayValue(now.toLocaleDateString("en-GB", { weekday: "long" }));
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

  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    dispatch(fetchBalanceByCustomer(customer._id));
    dispatch(fetchInvoicesByCustomer(customer._id));
    setShowModal(false);

    setTimeout(() => {
      formRefs.current[4]?.focus();
    }, 200);
  };

  useEffect(() => {
    if (openBillModalRequested && vendorBills.length > 0) {
      setShowBillModal(true);
      setOpenBillModalRequested(false);
    }
  }, [openBillModalRequested, vendorBills]);

  // Filter customers
  const filteredCustomers = customerList.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
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
          <Col md={6} className="mt-4">
            <Form.Group as={Row} className="mb-3 align-items-center">
              <Form.Label column sm={4} className="col-form-label">
                Voucher Type
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  defaultValue="Receipt"
                  ref={(el) => (formRefs.current[0] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                />
              </Col>
            </Form.Group>

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

          <Col md={6} className="mt-4">
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
        <hr />
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Customer</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex justify-content-between mb-2">
            <input
              type="text"
              placeholder="Search customer name..."
              className="form-control me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="form-select w-auto"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num} rows
                </option>
              ))}
            </select>
          </div>

          {paginatedCustomers.map((customer, index) => (
            <div
              key={customer._id}
              onClick={() => {
                selectCustomer(customer);
                setCustomerIndex(index);
              }}
              style={{
                padding: "12px 16px",
                backgroundColor:
                  customerIndex === index ? "#007bff" : "#f8f9fa",
                color: customerIndex === index ? "#fff" : "#000",
                cursor: "pointer",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0" style={{ flex: 1 }}>
                  {customer?.name || customer?.ledger}
                </p>
                <p className="mb-0 text-center" style={{ flex: 1 }}>
                  {customer?.city || customer?.area}
                </p>
              </div>
            </div>
          ))}

          {filteredCustomers[customerIndex] && (
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
                Selected Customer Address:
              </h6>
              <p style={{ margin: 0, fontStyle: "italic", color: "#495057" }}>
                🏠{" "}
                {filteredCustomers[customerIndex]?.address ||
                  "Address not available"}
              </p>
            </div>
          )}

          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {selectedCustomer && (
        <>
          <div className="d-flex align-items-center gap-5 mt-4 w-full">
            <p className="mb-0">
              <strong></strong>{" "}
              {selectedCustomer?.name || selectedCustomer?.ledger}
            </p>
            <p className="mb-0">
              <strong></strong> {selectedCustomer?.city}
            </p>
            <p className="mb-0">
              <strong>Total Balance:</strong> ₹
              {(
                Number(selectedCustomer?.balance || 0) +
                Number(selectedCustomer?.totalBalance || 0)
              ).toFixed(2)}
            </p>

            <Form.Group className=" d-flex " controlId="formDebit">
              <Form.Label column>Debit Amount</Form.Label>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={debitAmount}
                  ref={(el) => (formRefs.current[4] = el)}
                  onChange={(e) => {
                    // Restrict to 2 decimal places
                    const value = e.target.value;
                    const regex = /^\d*\.?\d{0,2}$/;
                    if (regex.test(value)) setDebitAmount(value);
                  }}
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
        openPendingModal={(rowIndex) => {
          handleOpenPendingBills(rowIndex);
        }}
        selectedVendorId={selectedCustomer?._id}
        onPendingChange={(value) => {
          setPendingValue(value);
        }}
        billAjust={billAjust}
        debitAmount={debitAmount}
        selectedCustomer={selectedCustomer}
      />

      <PendingBillsModal
        show={!!showPendingModal}
        onHide={() => setShowPendingModal(false)}
        onShowAdjustment={() => setShowBillModal(true)}
        bills={invoicesByCustomer}
        onSelectItem={(result) => {
          billAdjustmentModalRef.current?.insertBill(pendingRowIndex, result);
          setShowPendingModal(false);
        }}
        amountBill={pendingValue}
        setBillAdjust={setBillAdjust}
        debitAmount={debitAmount}
        setDebitAmount={setDebitAmount}
        selectedCustomer={selectedCustomer}
      />
    </Container>
  );
};

export default CustomerForm;
