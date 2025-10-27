// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableCaption,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import axios from "../../Config/axios.js";
// import { toast, ToastContainer } from "react-toastify";
// import { format, getMonth, getYear } from "date-fns";
// import { Button } from "../../components/ui/button";
// import BillModel from "../BillModel/BillModel";
// import { SheetDemo } from "../SliderSidebar/SliderSideBar.jsx";

// const Dashboard = () => {
//   const [showModel, setShowModel] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [invoices, setInvoices] = useState([]);
//   const [passBillModelData, setPassBillModelData] = useState([]);
//   const [showSheet, setShowSheet] = useState(false);
//   const [productData, setProductData] = useState([]);
//   const [allInvoices, setAllInvoices] = useState([]);
//   const [filterGrid, setFilterGrid] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // 👇 new states for button-specific loading
//   const [todayLoading, setTodayLoading] = useState(false);
//   const [monthLoading, setMonthLoading] = useState(false);
//   const [productLoading, setProductLoading] = useState(false);
//   const [filterLoading, setFilterLoading] = useState(false);
//   const [clearLoading, setClearLoading] = useState(false);
//   const [boxClearLoading, setBoxClearLoading] = useState(false);

//   const fetchInvoices = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("/pro-billing/salesman");
//       console.log(response.data);

//       setAllInvoices(response.data);
//       setInvoices(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch invoices");
//       console.error("Failed to fetch invoices:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   // Search filter
//   useEffect(() => {
//     if (!filterGrid) {
//       setInvoices(allInvoices);
//       return;
//     }
//     const lowerSearch = filterGrid.toLowerCase();
//     const filtered = allInvoices.filter(
//       (item) =>
//         item?.customer?.CustomerName?.toLowerCase().includes(lowerSearch) ||
//         item?.customerId?.area?.toLowerCase().includes(lowerSearch) ||
//         item?.customer?.FirmName?.toLowerCase().includes(lowerSearch)
//     );
//     setInvoices(filtered);
//   }, [filterGrid, allInvoices]);

//   const handleShowTodayBill = () => {
//     setTodayLoading(true);
//     setTimeout(() => {
//       const today = format(new Date(), "dd-MM-yyyy");
//       const todayDateFilter = allInvoices?.filter(
//         (item) => format(new Date(item.billDate), "dd-MM-yyyy") === today
//       );
//       console.log(todayDateFilter);

//       setInvoices(todayDateFilter);
//       setTodayLoading(false);
//     }, 500);
//   };

//   const handleShowLastMonthBill = () => {
//     setMonthLoading(true);
//     setTimeout(() => {
//       const now = new Date();
//       let lastMonth = getMonth(now) - 1;
//       let year = getYear(now);
//       if (lastMonth < 0) {
//         lastMonth = 11;
//         year -= 1;
//       }
//       const lastMonthBills = allInvoices?.filter((item) => {
//         const billDate = new Date(item.billDate);
//         return getMonth(billDate) === lastMonth && getYear(billDate) === year;
//       });
//       setInvoices(lastMonthBills);
//       setMonthLoading(false);
//     }, 500);
//   };

//   const showAllProduct = async () => {
//     setProductLoading(true);
//     try {
//       const purRes = await axios.get("/product/salesman");
//       setProductData(purRes?.data?.data || []);
//       setShowSheet(true);
//     } catch (err) {
//       console.error("Error fetching product data:", err);
//       toast.error("Failed to fetch product data.");
//     } finally {
//       setProductLoading(false);
//     }
//   };

//   const handleDateFilter = () => {
//     if (fromDate || toDate) {
//       setFilterLoading(true);
//       setTimeout(() => {
//         if (!fromDate || !toDate) {
//           toast.error("Please select both dates!");
//           setFilterLoading(false);
//           return;
//         }
//         const filtered = allInvoices.filter((item) => {
//           const billDate = new Date(item.billDate);
//           return billDate >= new Date(fromDate) && billDate <= new Date(toDate);
//         });
//         setInvoices(filtered);
//         setFilterLoading(false);
//       }, 500);
//     } else {
//       toast.error("please select the date");
//     }
//   };

//   const handleDateClear = async () => {
//     setClearLoading(true);
//     try {
//       if (fromDate || toDate) {
//         setFromDate("");
//         setToDate("");
//         const response = await axios.get("/pro-billing/salesman");
//         setAllInvoices(response.data);
//         setInvoices(response.data);
//       } else {
//         toast.success("you don't have date to clear date");
//       }
//     } catch (error) {
//       toast.error("Failed to fetch invoices");
//       console.error("Failed to fetch invoices:", error);
//     } finally {
//       setClearLoading(false);
//     }
//   };
//   const removeBoxFilter = async () => {
//     setBoxClearLoading(true);
//     try {
//       const response = await axios.get("/pro-billing/salesman");
//       setAllInvoices(response.data);
//       setInvoices(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch invoices");
//       console.error("Failed to fetch invoices:", error);
//     } finally {
//       setBoxClearLoading(false);
//     }
//   };

//   return (
//     <div className="w-full p-2 md:p-4">
//       {/* Top Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
//         <div
//           onClick={handleShowTodayBill}
//           className="cursor-pointer bg-blue-700 text-white rounded p-4 flex flex-col justify-center items-center shadow"
//         >
//           {todayLoading ? (
//             <span>Loading...</span>
//           ) : (
//             <>
//               <h1 className="text-lg font-bold">Today</h1>
//               <h1 className="text-lg font-bold">Bill</h1>
//             </>
//           )}
//         </div>
//         <div
//           onClick={handleShowLastMonthBill}
//           className="cursor-pointer bg-gray-700 text-white rounded p-4 flex flex-col justify-center items-center shadow"
//         >
//           {monthLoading ? (
//             <span>Loading...</span>
//           ) : (
//             <>
//               <h1 className="text-lg font-bold">Month</h1>
//               <h1 className="text-lg font-bold">Bill</h1>
//             </>
//           )}
//         </div>
//         <div
//           onClick={!productLoading ? showAllProduct : undefined}
//           className="cursor-pointer bg-red-700 text-white rounded p-4 flex flex-col justify-center items-center shadow"
//         >
//           {productLoading ? (
//             <span>Loading...</span>
//           ) : (
//             <>
//               <h1 className="text-lg font-bold">Product</h1>
//               <h1 className="text-lg font-bold">Gallery</h1>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Search & Date Filter */}
//       <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="border rounded p-2 w-full md:w-1/3"
//           onChange={(e) => setFilterGrid(e.target.value)}
//         />
//         <div className="flex flex-col sm:flex-row gap-2 md:gap-4 items-start md:items-end">
//           <div className="flex flex-col">
//             <label className="text-sm font-medium">From Date</label>
//             <input
//               type="date"
//               className="border rounded p-2"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-sm font-medium">To Date</label>
//             <input
//               type="date"
//               className="border rounded p-2"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             />
//           </div>
//           <Button
//             className="bg-blue-700 text-white mt-2 sm:mt-0"
//             onClick={handleDateFilter}
//             disabled={filterLoading}
//           >
//             {filterLoading ? "Filtering..." : "Filter"}
//           </Button>
//           <Button
//             className="bg-blue-700 text-white mt-2 sm:mt-0"
//             onClick={handleDateClear}
//             disabled={clearLoading}
//           >
//             {clearLoading ? "Clearing..." : "Clear Date"}
//           </Button>
//         </div>
//         <div>
//           <button
//             onClick={removeBoxFilter}
//             disabled={boxClearLoading}
//             className="bg-red-700 rounded p-2 text-white font-bold"
//           >
//             {boxClearLoading ? "Clearing" : "Clear Filtering"}
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <Table className="min-w-full">
//           <TableCaption>A list of your recent invoices.</TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Bill No.</TableHead>
//               <TableHead>Customer/Firm</TableHead>
//               <TableHead>Area</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Bill Date</TableHead>
//               <TableHead>Bill Time</TableHead>
//               <TableHead>Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {invoices?.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell className="font-medium">INV00{index + 1}</TableCell>
//                 <TableCell>{item?.customer?.CustomerName}</TableCell>
//                 <TableCell>{item?.customerId?.area}</TableCell>
//                 <TableCell>{item?.finalAmount?.toFixed(2)}</TableCell>
//                 <TableCell>
//                   {format(new Date(item?.billDate), "dd-MM-yyyy")}
//                 </TableCell>
//                 <TableCell>
//                   {format(new Date(item?.billDate), "hh:mm a")}
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     size="sm"
//                     onClick={() => {
//                       setShowModel(true);
//                       setPassBillModelData(item);
//                     }}
//                   >
//                     {showModel ? "Hide" : "Show"}
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//           {/* Pagination */}
//   {totalPages > 1 && (
//   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
//     <div className="text-muted-foreground text-sm">
//       {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, invoices.length)} of {invoices.length} row(s) shown
//     </div>
//     <div className="w-full sm:w-auto flex justify-end">
//       <Pagination>
//         <PaginationContent className="flex-wrap sm:justify-end">
//           <PaginationItem>
//             <PaginationPrevious
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setCurrentPage((prev) => Math.max(prev - 1, 1));
//               }}
//               className={currentPage > 1 ? "" : "pointer-events-none opacity-50"}
//             />
//           </PaginationItem>

//           {/* Ellipsis logic starts here */}
//           {(() => {
//             const pageItems = [];
//             const maxVisible = 3; // Show up to 3 page buttons
//             const startPage = Math.max(1, currentPage - 1);
//             const endPage = Math.min(totalPages, startPage + maxVisible - 1);

//             if (startPage > 1) {
//               pageItems.push(
//                 <PaginationItem key="first">
//                   <PaginationLink
//                     href="#"
//                     isActive={currentPage === 1}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setCurrentPage(1);
//                     }}
//                   >
//                     1
//                   </PaginationLink>
//                 </PaginationItem>
//               );
//               if (startPage > 2) {
//                 pageItems.push(
//                   <PaginationItem key="start-ellipsis">
//                     <PaginationEllipsis />
//                   </PaginationItem>
//                 );
//               }
//             }

//             for (let i = startPage; i <= endPage; i++) {
//               pageItems.push(
//                 <PaginationItem key={i}>
//                   <PaginationLink
//                     href="#"
//                     isActive={currentPage === i}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setCurrentPage(i);
//                     }}
//                   >
//                     {i}
//                   </PaginationLink>
//                 </PaginationItem>
//               );
//             }

//             if (endPage < totalPages) {
//               if (endPage < totalPages - 1) {
//                 pageItems.push(
//                   <PaginationItem key="end-ellipsis">
//                     <PaginationEllipsis />
//                   </PaginationItem>
//                 );
//               }
//               pageItems.push(
//                 <PaginationItem key={totalPages}>
//                   <PaginationLink
//                     href="#"
//                     isActive={currentPage === totalPages}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setCurrentPage(totalPages);
//                     }}
//                   >
//                     {totalPages}
//                   </PaginationLink>
//                 </PaginationItem>
//               );
//             }

//             return pageItems;
//           })()}
//           {/* Ellipsis logic ends */}

//           <PaginationItem>
//             <PaginationNext
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//               }}
//               className={currentPage < totalPages ? "" : "pointer-events-none opacity-50"}
//             />
//           </PaginationItem>
//         </PaginationContent>
//       </Pagination>
//     </div>
//   </div>
// )}

//       {/* Modals */}
//       {showModel && (
//         <BillModel
//           passBillModelData={passBillModelData}
//           setShowModel={setShowModel}
//         />
//       )}
//       <SheetDemo
//         isOpen={showSheet}
//         setIsOpen={setShowSheet}
//         productData={productData}
//       />
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "../../Config/axios.js";
import { toast, ToastContainer } from "react-toastify";
import { format, getMonth, getYear } from "date-fns";
import { Button } from "../../components/ui/button";
import BillModel from "../BillModel/BillModel";
import { SheetDemo } from "../SliderSidebar/SliderSideBar.jsx";

const Dashboard = () => {
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [passBillModelData, setPassBillModelData] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [productData, setProductData] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [filterGrid, setFilterGrid] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [todayLoading, setTodayLoading] = useState(false);
  const [monthLoading, setMonthLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [boxClearLoading, setBoxClearLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/pro-billing/salesman");
      setAllInvoices(response.data);
      setInvoices(response.data);
    } catch (error) {
      toast.error("Failed to fetch invoices");
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (!filterGrid) {
      setInvoices(allInvoices);
      return;
    }
    const lowerSearch = filterGrid.toLowerCase();
    const filtered = allInvoices.filter(
      (item) =>
        item?.customer?.CustomerName?.toLowerCase().includes(lowerSearch) ||
        item?.customerId?.area?.toLowerCase().includes(lowerSearch) ||
        item?.customer?.FirmName?.toLowerCase().includes(lowerSearch)
    );
    setInvoices(filtered);
  }, [filterGrid, allInvoices]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter/search
  }, [invoices]);

  const handleShowTodayBill = () => {
    setTodayLoading(true);
    setTimeout(() => {
      const today = format(new Date(), "dd-MM-yyyy");
      const todayDateFilter = allInvoices?.filter(
        (item) => format(new Date(item.billDate), "dd-MM-yyyy") === today
      );
      setInvoices(todayDateFilter);
      setTodayLoading(false);
    }, 500);
  };

  const handleShowLastMonthBill = () => {
    setMonthLoading(true);
    setTimeout(() => {
      const now = new Date();
      let lastMonth = getMonth(now) - 1;
      let year = getYear(now);
      if (lastMonth < 0) {
        lastMonth = 11;
        year -= 1;
      }
      const lastMonthBills = allInvoices?.filter((item) => {
        const billDate = new Date(item.billDate);
        return getMonth(billDate) === lastMonth && getYear(billDate) === year;
      });
      setInvoices(lastMonthBills);
      setMonthLoading(false);
    }, 500);
  };

  const showAllProduct = async () => {
    setProductLoading(true);
    try {
      const purRes = await axios.get("/product/salesman");
      setProductData(purRes?.data?.data || []);
      setShowSheet(true);
    } catch (err) {
      console.error("Error fetching product data:", err);
      toast.error("Failed to fetch product data.");
    } finally {
      setProductLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (fromDate || toDate) {
      setFilterLoading(true);
      setTimeout(() => {
        if (!fromDate || !toDate) {
          toast.error("Please select both dates!");
          setFilterLoading(false);
          return;
        }
        const filtered = allInvoices.filter((item) => {
          const billDate = new Date(item.billDate);
          return billDate >= new Date(fromDate) && billDate <= new Date(toDate);
        });
        setInvoices(filtered);
        setFilterLoading(false);
      }, 500);
    } else {
      toast.error("please select the date");
    }
  };

  const handleDateClear = async () => {
    setClearLoading(true);
    try {
      if (fromDate || toDate) {
        setFromDate("");
        setToDate("");
        const response = await axios.get("/pro-billing/salesman");
        setAllInvoices(response.data);
        setInvoices(response.data);
      } else {
        toast.success("you don't have date to clear date");
      }
    } catch (error) {
      toast.error("Failed to fetch invoices");
      console.error("Failed to fetch invoices:", error);
    } finally {
      setClearLoading(false);
    }
  };

  const removeBoxFilter = async () => {
    setBoxClearLoading(true);
    try {
      const response = await axios.get("/pro-billing/salesman");
      setAllInvoices(response.data);
      setInvoices(response.data);
    } catch (error) {
      toast.error("Failed to fetch invoices");
      console.error("Failed to fetch invoices:", error);
    } finally {
      setBoxClearLoading(false);
    }
  };

  return (
    <div className="w-full p-2 md:p-4">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div
          onClick={handleShowTodayBill}
          className="cursor-pointer bg-blue-700 text-white rounded p-4 flex flex-col justify-center items-center shadow"
        >
          {todayLoading ? <span>Loading...</span> : (
            <>
              <h1 className="text-lg font-bold">Today</h1>
              <h1 className="text-lg font-bold">Bill</h1>
            </>
          )}
        </div>
        <div
          onClick={handleShowLastMonthBill}
          className="cursor-pointer bg-gray-700 text-white rounded p-4 flex flex-col justify-center items-center shadow"
        >
          {monthLoading ? <span>Loading...</span> : (
            <>
              <h1 className="text-lg font-bold">Month</h1>
              <h1 className="text-lg font-bold">Bill</h1>
            </>
          )}
        </div>
        <div
          onClick={!productLoading ? showAllProduct : undefined}
          className="cursor-pointer bg-red-700 text-white rounded p-4 flex flex-col justify-center items-center shadow"
        >
          {productLoading ? <span>Loading...</span> : (
            <>
              <h1 className="text-lg font-bold">Product</h1>
              <h1 className="text-lg font-bold">Gallery</h1>
            </>
          )}
        </div>
      </div>

      {/* Search & Date Filter */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded p-2 w-full md:w-1/3"
          onChange={(e) => setFilterGrid(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 items-start md:items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium">From Date</label>
            <input
              type="date"
              className="border rounded p-2"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">To Date</label>
            <input
              type="date"
              className="border rounded p-2"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <Button
            className="bg-blue-700 text-white mt-2 sm:mt-0"
            onClick={handleDateFilter}
            disabled={filterLoading}
          >
            {filterLoading ? "Filtering..." : "Filter"}
          </Button>
          <Button
            className="bg-blue-700 text-white mt-2 sm:mt-0"
            onClick={handleDateClear}
            disabled={clearLoading}
          >
            {clearLoading ? "Clearing..." : "Clear Date"}
          </Button>
        </div>
        <div>
          <button
            onClick={removeBoxFilter}
            disabled={boxClearLoading}
            className="bg-red-700 rounded p-2 text-white font-bold"
          >
            {boxClearLoading ? "Clearing" : "Clear Filtering"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Bill No.</TableHead>
              <TableHead>Customer/Firm</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bill Date</TableHead>
              <TableHead>Bill Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInvoices?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  INV00{(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{item?.customer?.CustomerName}</TableCell>
                <TableCell>{item?.customerId?.area}</TableCell>
                <TableCell>{item?.finalAmount?.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(item?.billDate), "dd-MM-yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(item?.billDate), "hh:mm a")}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowModel(true);
                      setPassBillModelData(item);
                    }}
                  >
                    {showModel ? "Hide" : "Show"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
  {totalPages > 1 && (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
    <div className="text-muted-foreground text-sm">
      {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, invoices.length)} of {invoices.length} row(s) shown
    </div>
    <div className="w-full sm:w-auto flex justify-end">
      <Pagination>
        <PaginationContent className="flex-wrap sm:justify-end">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
              className={currentPage > 1 ? "" : "pointer-events-none opacity-50"}
            />
          </PaginationItem>

          {/* Ellipsis logic starts here */}
          {(() => {
            const pageItems = [];
            const maxVisible = 3; // Show up to 3 page buttons
            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(totalPages, startPage + maxVisible - 1);

            if (startPage > 1) {
              pageItems.push(
                <PaginationItem key="first">
                  <PaginationLink
                    href="#"
                    isActive={currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              );
              if (startPage > 2) {
                pageItems.push(
                  <PaginationItem key="start-ellipsis">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
            }

            for (let i = startPage; i <= endPage; i++) {
              pageItems.push(
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i);
                    }}
                  >
                    {i}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pageItems.push(
                  <PaginationItem key="end-ellipsis">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              pageItems.push(
                <PaginationItem key={totalPages}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === totalPages}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            return pageItems;
          })()}
          {/* Ellipsis logic ends */}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              }}
              className={currentPage < totalPages ? "" : "pointer-events-none opacity-50"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
)}


      {/* Modals */}
      {showModel && (
        <BillModel
          passBillModelData={passBillModelData}
          setShowModel={setShowModel}
        />
      )}
      <SheetDemo
        isOpen={showSheet}
        setIsOpen={setShowSheet}
        productData={productData}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
