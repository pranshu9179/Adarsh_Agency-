// import React, { useState, useEffect, useMemo } from "react";
// import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";
// import { useModal } from "./global/ModalContext";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPurchaseBill } from "../redux/features/PurchaseBill/purchaseThunk";
// import { fetchCustomerBill } from "../redux/features/CustomerBill/customerThunk";
// import { useNavigate } from "react-router-dom";

// const ModifyBill = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [billType, setBillType] = useState("vendor");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { clodeModifyBill, modifyBill } = useModal();

//   const { PurchaseInvoice } = useSelector((state) => state.purchaseBillInvoice);
//   const { CustomerInvoice } = useSelector((state) => state.customerBillInvoice);

//   // Fetch data on type change
//   useEffect(() => {
//     if (billType === "vendor") {
//       dispatch(fetchPurchaseBill());
//     } else {
//       dispatch(fetchCustomerBill());
//     }
//   }, [dispatch, billType]);

//   // ✅ Filtered data based on bill type
//   const filteredData = useMemo(() => {
//     const bills = billType === "vendor" ? PurchaseInvoice : CustomerInvoice;

//     if (!Array.isArray(bills)) return [];

//     return bills.filter((b) => {
//       if (billType === "vendor") {
//         return (
//           b.entryNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           b.vendorId?.firm?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       } else {
//         return (
//           b.customer?.CustomerName?.toLowerCase().includes(
//             searchTerm.toLowerCase()
//           ) ||
//           b.customerId?.CustomerName?.toLowerCase().includes(
//             searchTerm.toLowerCase()
//           )
//         );
//       }
//     });
//   }, [billType, PurchaseInvoice, CustomerInvoice, searchTerm]);

//   // ✅ Pagination logic
//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const paginatedData = filteredData.slice(
//     startIndex,
//     startIndex + rowsPerPage
//   );

//   // ✅ Navigate to edit page
//   const handleEditInvoice = (id) => {
//     if (billType === "vendor") {
//       navigate(`/purchase/${id}`);
//     } else {
//       navigate(`/add-invoice/${id}`);
//     }
//     clodeModifyBill();
//   };

//   // ✅ Pagination handler
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <Modal show={modifyBill} onHide={clodeModifyBill} centered size="lg">
//       <Modal.Header closeButton>
//         <Modal.Title>Modify Bill</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         {/* Search + Dropdown */}
//         <Form className="mb-3 d-flex gap-2 align-items-center">
//           <Form.Control
//             type="text"
//             placeholder={
//               billType === "vendor"
//                 ? "Search by entry number or vendor name..."
//                 : "Search by customer name..."
//             }
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <Form.Select
//             value={billType}
//             onChange={(e) => {
//               setBillType(e.target.value);
//               setCurrentPage(1);
//               setSearchTerm("");
//             }}
//           >
//             <option value="vendor">Vendor Bill</option>
//             <option value="customer">Customer Bill</option>
//           </Form.Select>

//           <Form.Select
//             style={{ width: "120px" }}
//             value={rowsPerPage}
//             onChange={(e) => {
//               setRowsPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//           >
//             <option value="5">5 / page</option>
//             <option value="10">10 / page</option>
//             <option value="25">25 / page</option>
//           </Form.Select>
//         </Form>

//         {/* Table */}
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>#</th>
//               {billType === "vendor" ? (
//                 <th>Entry Number</th>
//               ) : (
//                 <th>Customer Name</th>
//               )}
//               <th>Total Amount</th>
//               <th>Pending</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="text-center text-muted">
//                   No bills found
//                 </td>
//               </tr>
//             ) : (
//               paginatedData.map((bill, index) => (
//                 <tr
//                   key={bill._id}
//                   style={{ cursor: "pointer" }}
//                   onClick={() => handleEditInvoice(bill._id)}
//                 >
//                   <td>{startIndex + index + 1}</td>
//                   {billType === "vendor" ? (
//                     <td>{bill.entryNumber}</td>
//                   ) : (
//                     <td>
//                       {bill.customer?.CustomerName ||
//                         bill.customerId?.CustomerName}
//                     </td>
//                   )}
//                   <td>₹{bill.finalAmount?.toFixed(2)}</td>
//                   <td>₹{bill.pendingAmount?.toFixed(2)}</td>
//                   <td>
//                     {new Date(
//                       bill.date || bill.billDate || bill.customer?.Billdate
//                     ).toLocaleDateString("en-GB")}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </Table>

//         {/* Pagination controls */}
//         <div className="d-flex justify-content-between align-items-center mt-3">
//           <span>
//             Showing {startIndex + 1}–
//             {Math.min(startIndex + rowsPerPage, filteredData.length)} of{" "}
//             {filteredData.length}
//           </span>
//           <Pagination className="mb-0">
//             <Pagination.Prev
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//             />
//             {[...Array(totalPages)].map((_, i) => (
//               <Pagination.Item
//                 key={i + 1}
//                 active={currentPage === i + 1}
//                 onClick={() => handlePageChange(i + 1)}
//               >
//                 {i + 1}
//               </Pagination.Item>
//             ))}
//             <Pagination.Next
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//             />
//           </Pagination>
//         </div>
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="secondary" onClick={clodeModifyBill}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ModifyBill;



import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";
import { useModal } from "./global/ModalContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseBill } from "../redux/features/PurchaseBill/purchaseThunk";
import { fetchCustomerBill } from "../redux/features/CustomerBill/customerThunk";
import { useNavigate } from "react-router-dom";

const ModifyBill = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [billType, setBillType] = useState("vendor");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clodeModifyBill, modifyBill } = useModal();

  const { PurchaseInvoice } = useSelector((state) => state.purchaseBillInvoice);
  const { CustomerInvoice } = useSelector((state) => state.customerBillInvoice);

  // Fetch data on type change
  useEffect(() => {
    if (billType === "vendor") {
      dispatch(fetchPurchaseBill());
    } else {
      dispatch(fetchCustomerBill());
    }
  }, [dispatch, billType]);

  // Filtered data based on bill type
  const filteredData = useMemo(() => {
    const bills = billType === "vendor" ? PurchaseInvoice : CustomerInvoice;

    if (!Array.isArray(bills)) return [];

    return bills.filter((b) => {
      if (billType === "vendor") {
        return (
          b.entryNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.vendorId?.firm?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        return (
          b.customer?.CustomerName?.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          b.customerId?.CustomerName?.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
        );
      }
    });
  }, [billType, PurchaseInvoice, CustomerInvoice, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Navigate to edit page
  const handleEditInvoice = (id) => {
    if (billType === "vendor") {
      navigate(`/purchase/${id}`);
    } else {
      navigate(`/add-invoice/${id}`);
    }
    clodeModifyBill();
  };

  // Pagination handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Pagination UI generator with ellipsis
  const renderPaginationItems = () => {
    const pages = [];
    const maxButtons = 5; // maximum visible page buttons

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages.map((page, idx) =>
      page === "..." ? (
        <Pagination.Ellipsis key={idx} disabled />
      ) : (
        <Pagination.Item
          key={idx}
          active={currentPage === page}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      )
    );
  };

  return (
    <Modal show={modifyBill} onHide={clodeModifyBill} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modify Bill</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Search + Dropdown */}
        <Form className="mb-3 d-flex gap-2 align-items-center">
          <Form.Control
            type="text"
            placeholder={
              billType === "vendor"
                ? "Search by entry number or vendor name..."
                : "Search by customer name..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Form.Select
            value={billType}
            onChange={(e) => {
              setBillType(e.target.value);
              setCurrentPage(1);
              setSearchTerm("");
            }}
          >
            <option value="vendor">Vendor Bill</option>
            <option value="customer">Customer Bill</option>
          </Form.Select>

          <Form.Select
            style={{ width: "120px" }}
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
          </Form.Select>
        </Form>

        {/* Table */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              {billType === "vendor" ? <th>Entry Number</th> : <th>Customer Name</th>}
              <th>Total Amount</th>
              <th>Pending</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No bills found
                </td>
              </tr>
            ) : (
              paginatedData.map((bill, index) => (
                <tr
                  key={bill._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEditInvoice(bill._id)}
                >
                  <td>{startIndex + index + 1}</td>
                  {billType === "vendor" ? (
                    <td>{bill.entryNumber}</td>
                  ) : (
                    <td>
                      {bill.customer?.CustomerName || bill.customerId?.CustomerName}
                    </td>
                  )}
                  <td>₹{Number(bill.finalAmount || 0).toFixed(2)}</td>
                  <td>₹{Number(bill.pendingAmount || 0).toFixed(2)}</td>
                  <td>
                    {new Date(bill.date || bill.billDate || bill.customer?.Billdate).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Pagination controls */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Showing {startIndex + 1}–{Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length}
          </span>
          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {renderPaginationItems()}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={clodeModifyBill}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifyBill;
