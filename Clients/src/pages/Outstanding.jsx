import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { Table, Pagination, Form, Row, Col } from "react-bootstrap";
import FilterModal from "./outstanding/FilterModal";
import NameSelectModal from "./outstanding/NameSelectModals";
import { useDispatch, useSelector } from "react-redux";

import { getAllBeats } from "../redux/features/customer/customerThunks";
import { fetchSalesmen } from "../redux/features/salesMan/salesManThunks";
import {
  fetchInvoicesByBeat,
  fetchInvoicesBySalesman,
} from "../redux/features/product-bill/invoiceThunks";

const Outstanding = () => {
  const [showFilterModal, setShowFilterModal] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    invoices: salesmanInvoices,
    totalPendingAmount: salesmanTotal,
    count: salesmanCount,
  } = useSelector((s) => s?.invoice?.invoicesBySalesman || {});

  const {
    invoices: areaWiseInvoices,
    totalPendingAmount: areaWiseTotal,
    count: areaWiseCount,
  } = useSelector((s) => s?.invoice?.areaWise || {});

  const tableData =
    selectedType === "mrwise"
      ? salesmanInvoices || []
      : selectedType === "areawise"
      ? areaWiseInvoices?.length > 0
        ? areaWiseInvoices
        : [
            {
              invoice: "DUMMY/AREA001",
              date: "21-07-25",
              partyName: "DEMO AREA PARTY",
              billValue: 12345.0,
              paid: 10000.0,
              balance: 2345.0,
              day: 15,
            },
          ]
      : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBeats());
    dispatch(fetchSalesmen());
  }, [dispatch]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (selectedType) {
      setShowFilterModal(false);
      setShowNameModal(true);
    } else {
      alert("Please select Type.");
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (selectedName?.id) {
      if (selectedType === "mrwise") {
        dispatch(fetchInvoicesBySalesman(selectedName.id));
      } else if (selectedType === "areawise") {
        dispatch(
          fetchInvoicesByBeat({
            beatId: selectedName.id,
            beatName: selectedName.name,
          })
        );
      }
      setShowNameModal(false);
      setCurrentPage(1);
    } else {
      alert("Please select a name.");
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalEntries = tableData.length;
  const totalPages =
    rowsPerPage === "all" ? 1 : Math.ceil(totalEntries / Number(rowsPerPage));

  const startIndex =
    rowsPerPage === "all" ? 0 : (currentPage - 1) * Number(rowsPerPage);
  const endIndex =
    rowsPerPage === "all" ? totalEntries : startIndex + Number(rowsPerPage);

  const currentEntries =
    rowsPerPage === "all" ? tableData : tableData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Pagination render
  const renderPagination = () => {
    if (rowsPerPage === "all" || totalPages <= 1) return null;

    return (
      <Pagination className="justify-content-end mt-3">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        <Pagination.Item active>{currentPage}</Pagination.Item>
        {currentPage !== totalPages && <Pagination.Item>{totalPages}</Pagination.Item>}
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

  const totalBillValue =
    selectedType === "mrwise"
      ? Number(salesmanTotal || 0).toFixed(2)
      : selectedType === "areawise"
      ? Number(areaWiseTotal || 0).toFixed(2)
      : "0.00";

  return (
    <div className="p-3">
      <FilterModal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        onSubmit={handleFilterSubmit}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <NameSelectModal
        show={showNameModal}
        onHide={() => {
          setShowNameModal(false);
          setShowFilterModal(true);
        }}
        onSubmit={handleNameSubmit}
        selectedType={selectedType}
        selectedName={selectedName}
        setSelectedName={setSelectedName}
      />

      {!showFilterModal && !showNameModal && (
        <>
          <Row className="mb-2 align-items-center">
            <Col>
              <h5 className="text-center fw-bold mb-0 py-2">
                SAMRIDHI ENTERPRISES
              </h5>
              <h3 className="text-center fw-bold mb-0 py-2">
                {selectedName?.name?.toUpperCase()} OUTSTANDING{" "}
                {startDate && endDate
                  ? `FROM ${new Date(startDate).toLocaleDateString(
                      "en-GB"
                    )} TO ${new Date(endDate).toLocaleDateString("en-GB")}`
                  : startDate
                  ? `FROM ${new Date(startDate).toLocaleDateString("en-GB")}`
                  : endDate
                  ? `TO ${new Date(endDate).toLocaleDateString("en-GB")}`
                  : ""}
              </h3>
            </Col>

            {/* Rows per page dropdown */}
            <Col xs="auto">
              <Form.Label className="mb-0 me-2 fw-semibold">
                Rows per page:
              </Form.Label>
              <Form.Select
                size="sm"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                style={{ width: "100px" }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="all">All</option>
              </Form.Select>
            </Col>
          </Row>

          <Table bordered responsive>
            <thead>
              <tr className="text-center fw-bold">
                <th colSpan={1}>TOTAL NO.</th>
                <th colSpan={2}>
                  BILLS :{" "}
                  {selectedType === "mrwise" ? salesmanCount : areaWiseCount}
                </th>
                <th colSpan={2}>GRAND TOTAL : </th>
                <th>{totalBillValue}</th>
                <th colSpan={4}></th>
              </tr>
              <tr className="text-center border">
                <th>Sr No.</th>
                <th>DATE</th>
                <th>PARTY NAME</th>
                <th>BILL VALUE</th>
                <th>PAID</th>
                <th>BALANCE</th>
                <th>DAY</th>
                <th>REMARK</th>
                <th>REMARK</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries &&
                currentEntries.map((row, index) => (
                  <tr key={index} className="text-center">
                    <td>{startIndex + index + 1}</td>
                    <td>{dayjs(row.billDate).format("DD-MM-YYYY")}</td>
                    <td>{row.customerName}</td>
                    <td>{Number(row.billValue || 0).toFixed(2)}</td>
                    <td>{Number(row.ledgerAmount || 0).toFixed(2)}</td>
                    <td>{Number(row.pendingAmount || 0).toFixed(2)}</td>
                    <td
                      style={{
                        color: row.daysPending > 30 ? "red" : "inherit",
                        fontWeight: row.daysPending > 30 ? "bold" : "normal",
                      }}
                    >
                      {row.daysPending}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default Outstanding;
