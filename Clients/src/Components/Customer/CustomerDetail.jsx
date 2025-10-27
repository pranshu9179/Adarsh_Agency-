import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Tabs,
  Tab,
  Button,
  InputGroup,
  Form,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "../../Config/axios";
import AddCustomer from "./AddCustomer";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Loader";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// React Icons
import {
  BsPencilSquare,
  BsTrash,
  BsFileEarmarkExcel,
  BsFileEarmarkPdf,
} from "react-icons/bs";

// Bootstrap CSS & Toastify
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import CustomDataTable from "../../Components/CustomDataTable";

function CustomerDetail() {
  const [customers, setCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/customer");
      console.log(res);

      setCustomers(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      toast.error("Failed to fetch customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const lowercasedFilter = filterText.toLowerCase();
    const filtered = customers.filter(
      (item) =>
        (item.ledger && item.ledger.toLowerCase().includes(lowercasedFilter)) ||
        (item.area && item.area.toLowerCase().includes(lowercasedFilter)) ||
        (typeof item.mobile === "string" && item.mobile.includes(filterText))
    );
    setFilteredItems(filtered);
  }, [filterText, customers]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/customer/${id}`);
      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    console.log(customer);

    setEditingCustomer(customer);
    setActiveTab("add");
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredItems.map((item, index) => ({
        SNo: index + 1,
        FirmName: item.ledger || "N/A",
        Area: item.area || "N/A",
        Mobile: item.mobile || "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "CustomerList.xlsx");
  };

  // ✅ Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Customer List", 14, 10);
    const tableData = filteredItems.map((item, index) => [
      index + 1,
      item.ledger || "N/A",
      item.area || "N/A",
      item.mobile || "N/A",
    ]);
    doc.autoTable({
      head: [["#", "Firm Name", "Area", "Mobile"]],
      body: tableData,
    });
    doc.save("CustomerList.pdf");
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
      selector: (row) => row.ledger || "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Area",
      selector: (row) => row.area || "N/A",
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile || "N/A",
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city || "N/A",
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address1 || "N/A",
      sortable: true,
    },
    {
      name: "Balance",
      selector: (row) => row?.balance || "N/A",
      sortable: true,
    },
    {
      name: "GST NO",
      selector: (row) => row.gstNumber || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-edit-${row._id}`}>Edit Customer</Tooltip>
            }
          >
            <Button
              variant="warning"
              className="d-flex align-items-center justify-content-center"
              onClick={() => handleEdit(row)}
              style={{ width: "40px", height: "40px", padding: 0 }}
            >
              <BsPencilSquare size={18} />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-delete-${row._id}`}>
                Delete Customer
              </Tooltip>
            }
          >
            <Button
              variant="danger"
              className="d-flex align-items-center justify-content-center"
              onClick={() => handleDelete(row._id)}
              style={{ width: "40px", height: "40px", padding: 0 }}
            >
              <BsTrash size={18} />
            </Button>
          </OverlayTrigger>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k);
              if (k === "details") {
                fetchCustomers();
                setEditingCustomer(null);
              }
            }}
            className="mb-3"
          >
            <Tab eventKey="details" title="Customer Detail">
              <CustomDataTable
                title="Customers"
                columns={columns}
                data={filteredItems}
                loading={loading}
                filterComponent={
                  <div className="mb-3">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search by name, area or mobile..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                      {filterText && (
                        <Button
                          variant="outline-secondary"
                          onClick={() => setFilterText("")}
                        >
                          Clear
                        </Button>
                      )}
                    </InputGroup>
                  </div>
                }
                exportButtons={
                  <Row className="mb-3">
                    <Col>
                      <Button
                        variant="success"
                        onClick={exportToExcel}
                        className="me-2"
                      >
                        <BsFileEarmarkExcel /> Download Excel
                      </Button>
                      <Button variant="danger" onClick={exportToPDF}>
                        <BsFileEarmarkPdf /> Download PDF
                      </Button>
                    </Col>
                  </Row>
                }
              />
            </Tab>

            <Tab
              eventKey="add"
              title={editingCustomer ? "Edit Customer" : "Add Customer"}
            >
              <AddCustomer
                refresh={fetchCustomers}
                editingCustomer={editingCustomer}
                setEditingCustomer={setEditingCustomer}
                setActiveTab={setActiveTab}
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}

export default CustomerDetail;
