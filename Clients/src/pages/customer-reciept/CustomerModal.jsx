import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { fetchCustomers } from "../../redux/features/customer/customerThunks";
import { useSelector, useDispatch } from "react-redux";

const CustomerModal = ({ show, onHide, onSelect }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.customers);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Condensed Pagination Logic
  const getPaginationItems = () => {
    const items = [];
    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      items.push(1); // first page

      if (left > 2) items.push("left-ellipsis");

      for (let i = left; i <= right; i++) items.push(i);

      if (right < totalPages - 1) items.push("right-ellipsis");

      items.push(totalPages); // last page
    }
    return items;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Select Customer</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Search + Rows dropdown */}
        <Row className="align-items-center mb-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>

          <Col xs="auto" className="text-end">
            <div className="d-flex align-items-center justify-content-end">
              <Form.Label className="mb-0 me-2 fw-semibold">
                Rows per page:
              </Form.Label>
              <Form.Select
                size="sm"
                style={{ width: "90px" }}
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </Form.Select>
            </div>
          </Col>
        </Row>

        {/* Scrollable Table */}
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Table bordered hover size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.mobile || "-"}</td>
                  <td>{c.email || "-"}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onSelect(c);
                        onHide();
                      }}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No customer found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Condensed Pagination */}
        <div className="d-flex justify-content-center mt-2">
          <Pagination className="mb-0">
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {getPaginationItems().map((item, idx) =>
              item === "left-ellipsis" || item === "right-ellipsis" ? (
                <Pagination.Ellipsis key={idx} disabled />
              ) : (
                <Pagination.Item
                  key={idx}
                  active={item === currentPage}
                  onClick={() => handlePageChange(item)}
                >
                  {item}
                </Pagination.Item>
              )
            )}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerModal;
