// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Card,
//   Table,
//   Modal,
// } from "react-bootstrap";

// // import Loader from "../Loader";
// import toast from "react-hot-toast";
// import { BsPlusCircle, BsTrash } from "react-icons/bs";

// import { MdModeEdit, MdOutlineKeyboardHide } from "react-icons/md";

// import { confirmAlert } from "react-confirm-alert";
// import dayjs from "dayjs";

// import CustomDataTable from "../../CustomDataTable";
// import axiosInstance from "../../../Config/axios";

// const PurchaseList = ({ onEdit, refreshTrigger }) => {
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleDelete = async (id) => {
//     confirmAlert({
//       title: "Confirm Delete",
//       message: "Are you sure you want to delete this purchase?",
//       buttons: [
//         {
//           label: "Yes",
//           onClick: async () => {
//             try {
//               setLoading(true);
//               await axiosInstance.delete(`/purchase/${id}`);
//               toast.success("Purchase deleted successfully.");
//               fetchInitialData();
//             } catch (err) {
//               console.error("Error deleting purchase:", err);
//               toast.error("Failed to delete purchase.");
//             } finally {
//               setLoading(false);
//             }
//           },
//         },
//         {
//           label: "No",
//           onClick: () => {
//             // do nothing
//           },
//         },
//       ],
//     });
//   };

//   const fetchInitialData = async () => {
//     setLoading(true);
//     try {
//       const purRes = await axiosInstance.get("/purchase");

//       setPurchases(purRes.data || []);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       toast.error("Failed to fetch initial data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditPurchase = (purchase) => {
//     onEdit(purchase._id); // ✅ pass ID to parent
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   // ✅ Add useEffect to refresh data when refreshTrigger changes
//   useEffect(() => {
//     if (refreshTrigger) {
//       fetchInitialData();
//     }
//   }, [refreshTrigger]);

//   const getPurchaseColumns = (handleEditPurchase, handleDelete) => [
//     {
//       name: "SR",
//       selector: (row, index) => index + 1,
//       sortable: true,
//       width: "70px",
//     },
//     {
//       name: "Entry No.",
//       selector: (row) => row.entryNumber,
//       sortable: true,
//     },
//     {
//       name: "Party No.",
//       selector: (row) => row.partyNo,
//       sortable: true,
//     },
//     {
//       name: "Party Name",
//       selector: (row) => row.vendorId?.firm || "-",
//       sortable: true,
//     },
//     {
//       name: "Items Count",
//       selector: (row) => row.items?.length || 0,
//       sortable: false,
//     },
//     {
//       name: "Item Quantity",
//       selector: (row) =>
//         row.items?.map((i, idx) => (
//           <div key={idx}>
//             {i.productId?.productName}: {i.quantity}
//           </div>
//         )),
//       wrap: true,
//     },
//     {
//       name: "Item Rate",
//       selector: (row) =>
//         row.items?.map((i, idx) => <div key={idx}>₹{i.purchaseRate}</div>),
//       wrap: true,
//     },
//     {
//       name: "Total Amount",
//       selector: (row) =>
//         row.items?.map((i, idx) => <div key={idx}>₹{i.totalAmount}</div>),
//       wrap: true,
//     },
//     {
//       name: "Purchase Date",
//       selector: (row) => dayjs(row.date).format("DD MMM YYYY"),
//       sortable: true,
//     },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <div className="d-flex gap-2">
//           <Button
//             variant="warning"
//             size="sm"
//             onClick={() => handleEditPurchase(row)}
//           >
//             <MdModeEdit />
//           </Button>
//           <Button
//             variant="danger"
//             size="sm"
//             onClick={() => handleDelete(row._id)}
//           >
//             <BsTrash />
//           </Button>
//         </div>
//       ),
//       ignoreRowClick: true,
//       allowOverflow: true,
//       button: true,
//     },
//   ];

//   return (
//     <div>
//       {/* Purchase List */}
//       <Card className="p-3 mt-4">
//         <h5>Purchase List</h5>
//         {purchases.length === 0 ? (
//           <p>No purchases found.</p>
//         ) : (
//           <CustomDataTable
//             title=""
//             columns={getPurchaseColumns(handleEditPurchase, handleDelete)}
//             data={purchases}
//             pagination={true}
//             loading={loading}
//           />
//         )}
//       </Card>
//     </div>
//   );
// };

// export default PurchaseList;




import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Modal,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { BsPlusCircle, BsTrash } from "react-icons/bs";
import { MdModeEdit, MdOutlineKeyboardHide } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import dayjs from "dayjs";
import CustomDataTable from "../../CustomDataTable";
import axiosInstance from "../../../Config/axios";

const PurchaseList = ({ onEdit, refreshTrigger }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this purchase?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              setLoading(true);
              await axiosInstance.delete(`/purchase/${id}`);
              toast.success("Purchase deleted successfully.");
              fetchInitialData();
            } catch (err) {
              console.error("Error deleting purchase:", err);
              toast.error("Failed to delete purchase.");
            } finally {
              setLoading(false);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const purRes = await axiosInstance.get("/purchase");
      setPurchases(purRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch initial data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPurchase = (purchase) => {
    onEdit(purchase._id);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      fetchInitialData();
    }
  }, [refreshTrigger]);

  const getPurchaseColumns = (handleEditPurchase, handleDelete) => [
    {
      name: "SR",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Entry No.",
      selector: (row) => row.entryNumber,
      sortable: true,
    },
    {
      name: "Party No.",
      selector: (row) => row.partyNo,
      sortable: true,
    },
    {
      name: "Party Name",
      selector: (row) => row.vendorId?.firm || "-",
      sortable: true,
    },
    {
      name: "Items Count",
      selector: (row) => row.items?.length || 0,
      sortable: false,
    },
    {
      name: "Item Quantity",
      selector: (row) =>
        row.items?.map((i, idx) => (
          <div key={idx}>
            {i.productId?.productName}: {Number(i.quantity || 0).toFixed(2)}
          </div>
        )),
      wrap: true,
    },
    {
      name: "Item Rate",
      selector: (row) =>
        row.items?.map((i, idx) => (
          <div key={idx}>₹{Number(i.purchaseRate || 0).toFixed(2)}</div>
        )),
      wrap: true,
    },
    {
      name: "Total Amount",
      selector: (row) =>
        row.items?.map((i, idx) => (
          <div key={idx}>₹{Number(i.totalAmount || 0).toFixed(2)}</div>
        )),
      wrap: true,
    },
    {
      name: "Purchase Date",
      selector: (row) => dayjs(row.date).format("DD MMM YYYY"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleEditPurchase(row)}
          >
            <MdModeEdit />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row._id)}
          >
            <BsTrash />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div>
      <Card className="p-3 mt-4">
        <h5>Purchase List</h5>
        {purchases.length === 0 ? (
          <p>No purchases found.</p>
        ) : (
          <CustomDataTable
            title=""
            columns={getPurchaseColumns(handleEditPurchase, handleDelete)}
            data={purchases}
            pagination={true}
            loading={loading}
          />
        )}
      </Card>
    </div>
  );
};

export default PurchaseList;
