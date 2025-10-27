import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import axios from "../../Config/axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

function AddCustomer({
  refresh,
  editingCustomer,
  setEditingCustomer,
  setActiveTab,
}) {
  const [customer, setCustomer] = useState({
    ledger: "",
    name: "",
    mobile: "",
    city: "",
    address1: "",
    creditLimit: "",
    gstNumber: "",
    creditDays: 0,
    area: "",
    balance: "",
  });

  console.log(editingCustomer);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      setCustomer({
        ledger: editingCustomer.ledger || "",
        name: editingCustomer.name || "",
        city: editingCustomer.city || "",
        mobile: editingCustomer.mobile || "",
        address1: editingCustomer.address1 || "",
        gstNumber: editingCustomer.gstNumber || "",
        balance: editingCustomer.balance || "",

        creditLimit: editingCustomer.creditLimit || "",
        creditDays: editingCustomer.creditDays
          ? editingCustomer.creditDays.slice(0, 10)
          : "",
        area: editingCustomer.area || "",
      });
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // !
  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    const totalFields = inputRefs.current.length;
    const input = inputRefs.current[index];

    const next = () => {
      const nextIndex = index + 1;
      if (nextIndex < totalFields) inputRefs.current[nextIndex]?.focus();
    };

    const prev = () => {
      const prevIndex = index - 1;
      if (prevIndex >= 0) inputRefs.current[prevIndex]?.focus();
    };

    if (e.key === "Enter") {
      e.preventDefault();
      next();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      prev();
    }

    if (e.key === "F10") {
      e.preventDefault();
      handleSubmit(e);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      next();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      prev();
    }

    // LEFT key
    if (e.key === "ArrowLeft") {
      try {
        const pos = input.selectionStart;
        if (pos === 0 || pos === null || pos === undefined) {
          e.preventDefault();
          prev();
        }
      } catch {
        // fallback for input types without selectionStart support
        e.preventDefault();
        prev();
      }
    }

    // RIGHT key
    if (e.key === "ArrowRight") {
      try {
        const pos = input.selectionStart;
        if (pos === input.value.length || pos === null || pos === undefined) {
          e.preventDefault();
          next();
        }
      } catch {
        // fallback for input types without selectionStart support
        e.preventDefault();
        next();
      }
    }
  };

  // !

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCustomer) {
        await axios.put(`/customer/${editingCustomer._id}`, customer);
        toast.success("Customer updated successfully!");
      } else {
        await axios.post("/customer", customer);
        toast.success("Customer saved successfully!");
      }
      setActiveTab("details");

      // Reset form
      setCustomer({
        ledger: "",
        name: "",
        mobile: "",
        city: "",
        address1: "",
        gstNumber: "",
        creditLimit: "",
        creditDays: "",
        area: "",
      });

      setEditingCustomer(null);
      if (refresh) refresh();
    } catch (error) {
      toast.error("Failed to save customer.");
      console.error("Error saving customer:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>{editingCustomer ? "Edit" : "Add"} Customer</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>
                  Firm <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[0] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  name="ledger"
                  type="text"
                  placeholder="Enter Firm Name"
                  value={customer.ledger}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>
                  Mobile Number <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[1] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  type="number"
                  name="mobile"
                  placeholder="Mobile"
                  value={customer.mobile}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[2] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                  type="text"
                  name="city"
                  placeholder="City"
                  value={customer.city}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>
                  Area <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[3] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                  type="text"
                  placeholder="Area Name"
                  name="area"
                  value={customer.area}
                  onChange={handleChange}
                />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[4] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 4)}
                  name="address1"
                  placeholder="Address"
                  value={customer.address1}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Credit Limit</Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[5] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 5)}
                  type="number"
                  name="creditLimit"
                  placeholder="Credit Limit"
                  value={customer.creditLimit}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Balance</Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[6] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 6)}
                  type="number"
                  name="balance"
                  placeholder="Balance"
                  value={customer.balance}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Credit Days</Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[7] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 7)}
                  // type='date'
                  type="number"
                  name="creditDays"
                  value={customer.creditDays}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>GST No.</Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[8] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 8)}
                  name="gstNumber"
                  placeholder="GST No."
                  value={customer.gstNumber}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              {editingCustomer ? "Update Customer" : "Add Customer"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddCustomer;
