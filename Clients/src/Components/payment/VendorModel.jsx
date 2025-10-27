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
import { useSelector, useDispatch } from "react-redux";
import { fetchVendors } from "../../redux/features/vendor/VendorThunks";

const VendorModal = ({ show, onHide, onSelect }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  const vendors = useSelector((state) => state.vendor.vendors || []);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  // ✅ Filter by search
  const filtered = vendors.filter((v) =>
    v?.firm?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination logic
  const totalEntries = filtered.length;
  const totalPages =
    rowsPerPage === "all" ? 1 : Math.ceil(totalEntries / rowsPerPage);

  const startIndex =
    rowsPerPage === "all" ? 0 : (currentPage - 1) * rowsPerPage;
  const endIndex =
    rowsPerPage === "all" ? filtered.length : startIndex + Number(rowsPerPage);

  const currentEntries =
    rowsPerPage === "all" ? filtered : filtered.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (rowsPerPage === "all" || totalPages <= 1) return null;

    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {paginationItems}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Vendor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="align-items-center mb-3">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Search vendor..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>
          <Col md={4} className="text-end">
            {/* ✅ Rows per page dropdown */}
            <Form.Select
              size="sm"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              style={{ width: "130px", display: "inline-block" }}
            >
              <option value="5">5 rows</option>
              <option value="10">10 rows</option>
              <option value="15">15 rows</option>
              <option value="20">20 rows</option>
              <option value="all">All</option>
            </Form.Select>
          </Col>
        </Row>

        <Table bordered hover responsive size="sm">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>City</th>
              <th style={{ width: "90px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((v) => (
                <tr key={v._id}>
                  <td>{v.firm}</td>
                  <td>{v.mobile || "-"}</td>
                  <td>{v.city || "-"}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onSelect(v);
                        onHide();
                      }}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No vendor found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* ✅ Pagination */}
        {renderPagination()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VendorModal;
