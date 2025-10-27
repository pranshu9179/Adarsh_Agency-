import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { InputGroup, Form, Button } from "react-bootstrap";

function CustomDataTable({
  title = "",
  columns,
  data = [],
  pagination = true,
  exportButtons = null,
  loading = false,
}) {
  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  useEffect(() => {
    const lowerText = filterText.toLowerCase();

    const filtered = data.filter((item) => {
      const flattenValues = (obj) => {
        let result = [];

        for (const key in obj) {
          const value = obj[key];
          if (typeof value === "string") {
            result.push(value);
          } else if (typeof value === "object" && value !== null) {
            result = result.concat(flattenValues(value)); // recursively flatten
          }
        }

        return result;
      };

      const allValues = flattenValues(item);

      return allValues.some((val) => val.toLowerCase().includes(lowerText));
    });

    setFilteredData(filtered);
  }, [filterText, data]);

  if (loading) {
    return <div className="py-4 text-center">Loading...</div>; // or your Loader component
  }

  return (
    <div>
      {/* ✅ Search Bar */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        {filterText && (
          <Button variant="outline-secondary" onClick={() => setFilterText("")}>
            Clear
          </Button>
        )}
      </InputGroup>

      {/* ✅ Export Buttons (optional) */}
      {exportButtons}

      {/* ✅ Table */}
      <DataTable
        title={title}
        columns={columns}
        data={filteredData}
        pagination={pagination}
        persistTableHead
        responsive
        striped
        highlightOnHover
        pointerOnHover
        paginationComponentOptions={paginationOptions}
        defaultSortFieldId={1}
        defaultSortAsc={true}
        noDataComponent={<div className="py-4">No data found</div>}
      />
    </div>
  );
}

export default CustomDataTable;
