import React, { useEffect, useState } from "react";
import { Tab, Tabs, Button, Table, Pagination, Modal } from "react-bootstrap";
import axios from "../../../Config/axios";
import AddTask from "./AddSubCat";

const SubCatDetail = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [subcategories, setSubcategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const fetchSubcategories = async () => {
    try {
      const res = await axios.get("/Subcategory");
      setSubcategories(res.data);
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = subcategories.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(subcategories.length / entriesPerPage);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/subcategory/${id}`);
      alert("Deleted successfully");
      fetchSubcategories();
    } catch (err) {
      console.error("Failed to delete subcategory", err);
    }
  };

  return (
    <div className="container mt-3">
      <h4>Product Sub Categories</h4>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="view" title="View SubCategories">
          <div className="table-responsive">
            <Table bordered hover>
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Company</th>
                  <th>Category</th>
                  <th>SubCategory</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((sub, index) => (
                  <tr key={sub._id}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>{sub.company?.name || "N/A"}</td>
                    <td>{sub.category?.cat || "N/A"}</td>
                    <td>{sub.subCat}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(sub._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i}
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
        </Tab>

        <Tab eventKey="add" title="Add SubCategory">
          <AddTask onSubcategoryCreated={fetchSubcategories} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default SubCatDetail;
