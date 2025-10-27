import React, { useState, useEffect } from "react";
import axios from "../../Config/axios";
import {
  Tab,
  Tabs,
  Modal,
  Button,
  Form,
  Table,
  Pagination,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import AddFirm from "./AddFirm";

const FirmDetail = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("view");
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/firm");
      console.log(res.data);
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
      // alert("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const deleteFirm = async (id) => {
    try {
      await axios.delete(`/firm/${id}`);
      // alert("Company deleted");
      fetchCompanies();
    } catch (err) {
      console.error(err);
      // alert("Failed to delete company");
    }
  };

  // State for task data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      financialProduct: "",
      companyName: "",
      employee: "",
      taskName: "",
      description: "",
      checklist: "",
      sms: "",
      email: ``,
      whatsapp: "",
    },
    {
      id: 2,
      financialProduct: "Life Insurance",
      companyName: "LIC OF INDIA",
      employee: "OE",
      taskName: "Ankit",
      description: "Ankit Testing",
      checklist: "check 2",
      sms: "sms",
      email: "email",
      whatsapp: "whatsapp",
    },
  ]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // State for modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Open modal with task details
  const openModal = (type, task) => {
    setCurrentTask(task);
    switch (type) {
      case "detail":
        setShowDetailModal(true);
        break;
      case "checklist":
        setShowChecklistModal(true);
        break;
      case "sms":
        setShowSmsModal(true);
        break;
      case "email":
        setShowEmailModal(true);
        break;
      default:
        break;
    }
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = tasks.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(tasks.length / entriesPerPage);

  return (
    <div className="container mt-2 mb-4">
      <h4>Create Firm</h4>
      <div className="row">
        <div className="col-md-12">
          <div className="card card-primary card-outline">
            <div style={{ backgroundColor: "black" }} className="card-header">
              <Tabs
                id="task-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="view" title={<b>View Firm</b>} />
                <Tab eventKey="add" title={<b>Add Firm</b>} />
              </Tabs>
            </div>

            <div className="card-body">
              {activeTab === "view" && (
                <div className="table-responsive">
                  {/* <div className=" "> */}
                  <div className="row mb-6 py-2 dataTables_filter float-center">
                    <label>
                      Search:
                      <input
                        type="search"
                        className="form-control form-control-sm"
                        placeholder=""
                      />
                    </label>
                  </div>
                  {/* </div> */}
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Firm Name</th>
                        <th>Contact Person</th>
                        <th>Designation</th>
                        <th>City</th>
                        {/* <th>Address</th> */}
                        <th>Mobile</th>
                        {/* <th>Alt Mobile</th> */}
                        <th>Email</th>
                        <th>WhatsApp</th>
                        <th>GST</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((c) => (
                        <tr key={c._id}>
                          {/* company name */}
                          <td>{c.name}</td>
                          <td>{c.contactPerson}</td>
                          <td>{c.designation}</td>
                          <td>{c.city}</td>
                          {/* <td>{c.address}</td> */}
                          <td>{c.mobile}</td>
                          {/* <td>{c.alternateMobile}</td> */}
                          <td>{c.email}</td>
                          <td>{c.whatsapp}</td>
                          <td>
                            {c.gstNumber}
                            {"%"}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteFirm(c._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="row">
                    <div className="col-sm-5">
                      <div className="dataTables_info">
                        Showing {indexOfFirstEntry + 1} to{" "}
                        {Math.min(indexOfLastEntry, tasks.length)} of{" "}
                        {tasks.length} entries
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <Pagination className="float-right">
                        <Pagination.Prev
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        />
                        {[...Array(totalPages)].map((_, i) => (
                          <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        />
                      </Pagination>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "add" && (
                <div>
                  <AddFirm />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      <Modal
        show={showChecklistModal}
        onHide={() => setShowChecklistModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{currentTask?.taskName || ""} Checklist</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>
            <center>
              <h5>{currentTask?.checklist || "No checklist available"}</h5>
            </center>
          </b>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowChecklistModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSmsModal} onHide={() => setShowSmsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{currentTask?.taskName || ""} SMS</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTask?.sms || "No SMS template available"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSmsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEmailModal}
        onHide={() => setShowEmailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>{currentTask?.taskName || ""} EMAIL</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            dangerouslySetInnerHTML={{
              __html: currentTask?.email || "No email template available",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FirmDetail;
