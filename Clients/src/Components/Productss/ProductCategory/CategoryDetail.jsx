import React, { useEffect, useState } from "react";
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
import AddTask from "./AddCategory";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "../../../Config/axios";

const CategoryDetail = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("view");
  const [category, setCategory] = useState([]);
  const fetchCategory = async () => {
    try {
      const res = await axios.get("/category");
      console.log(res.data);
      setCategory(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  console.log(category, "fdsjkfkds");
  const handleDelete = (id) => {
    console.log(id);
  };
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // State for modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchCategory();

    // Dummy tasks data to prevent crash (replace this with API call later)
    setTasks([
      { id: 1, title: "Task A" },
      { id: 2, title: "Task B" },
      { id: 3, title: "Task C" },
    ]);
  }, []);

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
    <div className="">
      <h4>Product Category</h4>
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
                <Tab eventKey="view" title={<b>View Category</b>} />
                <Tab eventKey="add" title={<b> Create Category</b>} />
              </Tabs>
            </div>

            <div className="card-body">
              {activeTab === "view" && (
                <div className="table-responsive">
                  <div className="row mb-3">
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
                  </div>

                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Company Name</th>
                        <th>Category Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.map((task, index) => (
                        <tr key={task._id}>
                          <td>{indexOfFirstEntry + index + 1}</td>
                          <td>{task.company?.name || "N/A"}</td>
                          <td>{task.cat || "N/A"}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                variant="link"
                                className="text-primary"
                                onClick={() => {
                                  alert(`Edit task ${task._id}`);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="link"
                                className="text-danger"
                                onClick={() => handleDelete(task._id)}
                              >
                                Delete
                              </Button>
                            </div>
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
                  <AddTask />
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

export default CategoryDetail;
