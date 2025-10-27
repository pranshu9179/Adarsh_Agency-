import React, { useEffect, useState, useRef } from "react";
import axios from "../../Config/axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { FaPrint, FaEdit, FaTrash } from "react-icons/fa";

const DisplayInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/pro-billing");
      setInvoices(response.data);
    } catch (error) {
      toast.error("Failed to fetch invoices");
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filter invoices based on customer name or product name
  const filteredInvoices = invoices.filter((inv) => {
    const customerName = inv.customer?.CustomerName?.toLowerCase() || "";
    const billingNames = Array.isArray(inv.billing)
      ? inv.billing.map((b) => b.itemName?.toLowerCase()).join(" ")
      : "";
    const search = filterText.toLowerCase();
    return customerName.includes(search) || billingNames.includes(search);
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handlePrint = (invoiceId) => {
    navigate(`/generate-invoice/${invoiceId}`);
  };

  const handleDelete = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    setLoading(true);
    try {
      await axios.delete(`/pro-billing/${invoiceId}`);
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (error) {
      toast.error("Failed to delete invoice");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full mt-4 px-3">
      <h2 className="mb-4">All Invoices</h2>

      {/* Search and Row Per Page */}
      <div className="d-flex justify-content-between mb-2">
        <Form.Control
          type="text"
          placeholder="Search by customer or product..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          style={{ width: "300px" }}
        />

        <Form.Select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          style={{ width: "120px" }}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </Form.Select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <Table
          striped
          bordered
          hover
          responsive
          style={{ tableLayout: "fixed", minWidth: "900px" }}
        >
          <thead className="bg-light sticky-top" style={{ top: 0, zIndex: 1 }}>
            <tr>
              <th>Customer Name</th>
              <th style={{ width: "120px" }}>Date</th>
              <th>Item Purchased</th>
              <th>Quantity</th>
              <th>Free</th>
              <th>Total Qty</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted">
                  No invoices found
                </td>
              </tr>
            )}

            {paginatedInvoices.map((invoice) => {
              const { customer = {}, billing = [] } = invoice;
              return (
                <tr key={invoice._id}>
                  <td>{customer.CustomerName || "-"}</td>
                  <td>
                    {customer.Billdate
                      ? new Date(customer.Billdate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>{item.itemName || "-"}</div>
                    ))}
                  </td>
                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {Number(item.qty || 0).toFixed(2)} {item.unit || ""}
                      </div>
                    ))}
                  </td>
                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>{Number(item.Free || 0).toFixed(2)}</div>
                    ))}
                  </td>
                  <td>
                    {billing.map((item, idx) => (
                      <div key={idx}>
                        {Number((item.qty || 0) + (item.Free || 0)).toFixed(2)}
                      </div>
                    ))}
                  </td>
                  <td>₹{Number(invoice.finalAmount || 0).toFixed(2)}</td>
                  <td
                    style={{
                      display: "flex",
                      gap: "15px",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaPrint
                      size={20}
                      style={{ cursor: "pointer", color: "#0d6efd" }}
                      onClick={() => handlePrint(invoice._id)}
                    />
                    <FaEdit
                      size={20}
                      style={{ cursor: "pointer", color: "#198754" }}
                      onClick={() => navigate(`/edit-invoice/${invoice._id}`)}
                    />
                    <FaTrash
                      size={20}
                      style={{ cursor: "pointer", color: "#dc3545" }}
                      onClick={() => handleDelete(invoice._id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <Button
            variant="outline-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </Button>

          <div>
            <Button variant="light" disabled>
              {currentPage}
            </Button>
            {currentPage !== totalPages && (
              <>
                <span className="mx-1">...</span>
                <Button variant="light" disabled>
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DisplayInvoice;
