import React from "react";
import { Table, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  return (
    <div
      style={{
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center bg-white px-4 py-3 shadow">
        <h5 className="mb-0 fw-bold">Welcome Aadrsh Agency</h5>
        {/* <span className='text-secondary'>EN</span> */}
      </div>

      {/* Stats Cards */}
      <div fluid className="py-4">
        {/* Stats Cards - Force 8 per row on desktop */}
        <div className="d-flex flex-wrap justify-content-start gap-3 px-1">
          {[
            { label: "Total Customers", value: "736", bg: "success" },
            { label: "Total Today Bill", value: "146", bg: "primary" },
            {
              label: "Total Purchase company all",
              value: "0",
              bg: "secondary",
            },
            { label: "Today Sale copy All", value: "₹ 0", bg: "info" },
            { label: "Today sale Month/day wise", value: "11", bg: "danger" },
            { label: "Total SO Value", value: "₹ 20,685.56", bg: "warning" },
            { label: "Total SI Count", value: "11", bg: "danger" },
            { label: "Total SI Value", value: "₹ 20,685.52", bg: "warning" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-${item.bg} text-white text-center p-3 rounded shadow-sm`}
              style={{
                width: "11.5%", // 100% / 8 cards
                minWidth: "140px", // fallback for small screens
              }}
            >
              <div className="small fw-semibold">{item.label}</div>
              <div className="fs-5 fw-bold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* KPI Table */}
        {/* KPI Table */}
        <div className="bg-white mt-4 rounded shadow p-3">
          <div style={{ overflowX: "auto" }}>
            <Table
              bordered
              hover
              responsive
              className="mb-0 text-center align-middle table-striped"
              style={{ borderCollapse: "separate", borderSpacing: "0" }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#ffc107",
                    color: "#212529",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    fontSize: "14px",
                    letterSpacing: "0.5px",
                  }}
                >
                  <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>
                    Description
                  </th>
                  <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>
                    This Month (₹)
                  </th>
                  <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>
                    Last Month (₹)
                  </th>
                  <th style={{ border: "1px solid #dee2e6", padding: "12px" }}>
                    Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["All Purchase Orders", "0", "0", "0%"],
                  [
                    "All Sales Orders",
                    "5,28,697.61",
                    "69,63,303.73",
                    "-92.4074%",
                  ],
                  ["Pending Orders for Invoicing", "210", "252", "-16.6667%"],
                  ["Outstanding Amount", "4,81,572", "64,40,702", "-92.523%"],
                  [
                    "All Sales Invoices",
                    "4,81,570.72",
                    "64,40,687.64",
                    "-92.523%",
                  ],
                  ["All Purchase Invoices", "0", "58,97,620.86", "-100%"],
                  ["Collected Amount", "0", "0", "0%"],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        style={{
                          border: "1px solid #dee2e6",
                          backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9",
                          padding: "10px",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="text-center mt-3">
            <Button variant="primary">Go to Reports Page</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
