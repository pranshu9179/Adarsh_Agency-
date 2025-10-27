import React, { useState, useEffect, useRef } from "react";
import axios from "../../../Config/axios";
import {
  Tab,
  Tabs,
  Modal,
  Button,
  Table,
  Form,
  Pagination,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import AddTask from "./AddCompany";
import toast from "react-hot-toast";
import Loader from "../../Loader";

const CompanyDetail = () => {
  // State
  const [activeTab, setActiveTab] = useState("view");
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [editBrandName, setEditBrandName] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Refs
  const searchRef = useRef(null);
  const rowRefs = useRef([]);
  const brandNameCellRefs = useRef([]);

  // Fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/company");
      const data = res.data || [];
      setCompanies(data);
      setCurrentPage(1); // Reset page on fetch
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // Initial mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filter companies based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredCompanies(
        companies.filter((c) => (c.name || "").toLowerCase().includes(lower))
      );
    }
    setCurrentPage(1); // Reset page on search
  }, [searchTerm, companies]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Reset Add/Edit form after submission
  const handleAddEditSuccess = () => {
    setEditBrandName(null);
    setActiveTab("view");
    fetchCompanies();
  };

  // Delete company
  const deleteCompany = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    setLoading(true);
    try {
      await axios.delete(`/company/${id}`);
      toast.success("Brand deleted successfully");
      await fetchCompanies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete company");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mt-2 mb-4">
      <h4>Create Brand</h4>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-primary card-outline">
            <div className="card-header">
              <Tabs
                id="task-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="view" title={<b>View Brand</b>} />
                <Tab eventKey="add" title={<b>Add Brand</b>} />
              </Tabs>
            </div>

            <div className="card-body">
              {activeTab === "view" && (
                <div className="table-responsive">
                  <div className="d-flex justify-content-between mb-2">
                    <Form.Control
                      type="search"
                      ref={searchRef}
                      placeholder="Search brands..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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

                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Brand Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCompanies.length === 0 && (
                        <tr>
                          <td colSpan={2} className="text-center">
                            No brands available.
                          </td>
                        </tr>
                      )}

                      {paginatedCompanies.map((c, idx) => {
                        const globalIdx = startIndex + idx;
                        return (
                          <tr
                            key={c._id}
                            ref={(el) => (rowRefs.current[globalIdx] = el)}
                            onClick={() => setSelectedRow(globalIdx)}
                            style={{ cursor: "pointer" }}
                            className={
                              selectedRow === globalIdx ? "table-active" : ""
                            }
                          >
                            <td
                              tabIndex={0}
                              ref={(el) =>
                                (brandNameCellRefs.current[globalIdx] = el)
                              }
                            >
                              {c.name}
                            </td>
                            <td className="d-flex justify-content-center gap-3">
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteCompany(c._id);
                                }}
                              >
                                Delete
                              </Button>
                              <Button
                                size="sm"
                                variant="info"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditBrandName(c);
                                  setActiveTab("add");
                                }}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <Button
                        variant="outline-primary"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
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
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "add" && (
                <AddTask
                  fetchCompanies={fetchCompanies}
                  setActiveTab={setActiveTab}
                  edit={editBrandName}
                  onSuccess={handleAddEditSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Example Modals */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{currentTask?.taskName || ""} Description</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTask?.description || "No description available"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyDetail;
