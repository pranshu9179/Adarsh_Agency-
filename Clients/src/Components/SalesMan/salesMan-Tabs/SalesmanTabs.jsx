import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import AddSalesMan from "./AddSalesMan";
import DisplaySalesMan from "./DisplaySalesMan";

const SalesmanTabs = () => {
  const [key, setKey] = useState("form");
  const [editId, setEditId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleEdit = (id) => {
    setEditId(id);
    setKey("form");
  };

  const handleSuccess = () => {
    setEditId(null); // Clear edit mode
    setRefreshList((prev) => !prev); // Toggle to trigger list refresh
    setKey("list");
  };

  return (
    <div className="container mt-3">
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        justify
      >
        <Tab eventKey="form" title={editId ? "Edit Salesman" : "Add Salesman"}>
          <AddSalesMan idToEdit={editId} onSuccess={handleSuccess} />
        </Tab>
        <Tab eventKey="list" title="Salesman List">
          <DisplaySalesMan onEdit={handleEdit} refreshTrigger={refreshList} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default SalesmanTabs;
