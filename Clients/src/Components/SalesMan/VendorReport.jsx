import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "../../Config/axios";
import toast from "react-hot-toast";
import Loader from "../Loader";

import CustomDataTable from "../../Components/CustomDataTable";

import { BsPencil, BsTrash2 } from "react-icons/bs";

const VendorReport = () => {
  const [vendor, setVendor] = useState({
    firm: "",
    name: "",
    designation: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    whatsapp: "",
    city: "",
    address: "",
    gstNumber: "",
  });

  const [vendorList, setVendorList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/vendor");
      // console.log(res.data, "Vendors fetched");
      setVendorList(res.data);
    } catch (error) {
      toast.error(error?.response?.message || "Something wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendor.name || !vendor.mobile || !vendor.address) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/vendor/${editId}`, vendor);
        setEditId(null);
      } else {
        await axios.post("/vendor", vendor);
      }

      setVendor({
        firm: "",
        name: "",
        designation: "",
        mobile: "",
        alternateMobile: "",
        email: "",
        whatsapp: "",
        city: "",
        address: "",
        gstNumber: "",
      });
      fetchVendors();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (v) => {
    setVendor(v);
    setEditId(v._id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/vendor/${id}`);
      fetchVendors();
    } catch (error) {
      console.log(error);
      toast.error("FAILED");
    } finally {
      setLoading(false);
    }
  };

  // !
  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    const input = inputRefs.current[index];
    const total = inputRefs.current.length;

    const next = () => {
      const nextIndex = index + 1;
      if (nextIndex < total) inputRefs.current[nextIndex]?.focus();
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

    if (e.key === "ArrowLeft") {
      try {
        const pos = input.selectionStart;
        if (pos === 0) {
          e.preventDefault();
          prev();
        }
      } catch (err) {
        // Fallback if selectionStart is not supported (e.g., type=email)
        e.preventDefault();
        prev();
      }
    }

    if (e.key === "ArrowRight") {
      try {
        const pos = input.selectionStart;
        if (pos === input.value.length) {
          e.preventDefault();
          next();
        }
      } catch (err) {
        e.preventDefault();
        next();
      }
    }
  };

  const columns = [
    {
      name: "SR",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Firm Name",
      selector: (row) => row.firm || "N/A",
      sortable: true,
    },
    {
      name: "Vendor Name",
      selector: (row) => row.name || "N/A",
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email || "N/A",
    },
    {
      name: "Address",
      selector: (row) => row.address || "N/A",
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleEdit(row)}
            className="me-2"
          >
            <BsPencil />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row._id)}
          >
            <BsTrash2 />
          </Button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="my-4">
      <Card className="p-4">
        <h4 className="mb-3">{editId ? "Edit Vendor" : "Add Vendor"}</h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group controlId="vendorFirm">
                <Form.Label>
                  Firm Name <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[0] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  type="text"
                  name="firm"
                  value={vendor.firm}
                  onChange={handleChange}
                  placeholder="Enter vendor firm"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="vendorName">
                <Form.Label>
                  Vendor Name <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[1] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  type="text"
                  name="name"
                  value={vendor.name}
                  onChange={handleChange}
                  placeholder="Enter vendor name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[2] = el)}
                onKeyDown={(e) => handleKeyDown(e, 2)}
                name="designation"
                placeholder="Designation"
                value={vendor.designation}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4}>
              <Form.Group controlId="vendorMobile">
                <Form.Label>
                  Mobile Number <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[3] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                  type="text"
                  name="mobile"
                  value={vendor.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>Alternate Mobile</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[4] = el)}
                onKeyDown={(e) => handleKeyDown(e, 4)}
                name="alternateMobile"
                placeholder="Alternate Mobile"
                value={vendor.alternateMobile}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Group controlId="vendorEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[5] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 5)}
                  type="text"
                  name="email"
                  value={vendor.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4} className="mb-3">
              <Form.Label>WhatsApp No.</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[6] = el)}
                onKeyDown={(e) => handleKeyDown(e, 6)}
                name="whatsapp"
                placeholder="WhatsApp"
                value={vendor.whatsapp}
                onChange={handleChange}
              />
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                ref={(el) => (inputRefs.current[7] = el)}
                onKeyDown={(e) => handleKeyDown(e, 7)}
                name="city"
                placeholder="City"
                value={vendor.city}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Group controlId="vendorAddress">
                <Form.Label>
                  Address <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[8] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 8)}
                  type="text"
                  name="address"
                  value={vendor.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>GST No.</Form.Label>
                <Form.Control
                  ref={(el) => (inputRefs.current[9] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 9)}
                  name="gstNumber"
                  className="form-control"
                  placeholder="GST No."
                  value={vendor.gstNumber}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" className="mt-3">
            {editId ? "Update Vendor" : "Add Vendor"}
          </Button>
        </Form>
      </Card>

      <Card className="mt-4 p-3">
        <Card className="mt-4 p-3">
          <CustomDataTable
            title="Vendor List"
            columns={columns}
            data={vendorList}
            loading={loading}
          />
        </Card>
      </Card>
    </Container>
  );
};

export default VendorReport;
