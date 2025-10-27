import React from "react";
import { Button, Image } from "react-bootstrap";
import CustomDataTable from "../../../Components/CustomDataTable";
import { BsPencil, BsTrash2 } from "react-icons/bs";

const VendorList = ({ vendorList, handleEdit, handleDelete, loading }) => {
  const columns = [
    {
      name: "SR",
      selector: (row, index) => index + 1,
      width: "70px",
      sortable: true,
    },
    {
      name: "Firm",
      selector: (row) => row.firm,
      sortable: true,
    },
    // { // name: "Name", 
    //  selector: (row) => row.name,
    //  sortable: true, 
    //  },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Balance",
      selector: (row) =>
        row.totalBalance !== undefined && row.totalBalance !== null
          ? Number(row.totalBalance).toFixed(2)
          : "0.00",
      sortable: true,
    },
    {
      name: "GST NO.",
      selector: (row) => row.gstNumber,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button variant="warning" size="sm" onClick={() => handleEdit(row)}>
            <BsPencil />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="ms-2"
            onClick={() => handleDelete(row._id)}
          >
            <BsTrash2 />
          </Button>
        </>
      ),
    },
  ];

  return (
    <CustomDataTable
      title="Party List"
      columns={columns}
      data={vendorList}
      loading={loading}
      pagination={true}
    />
  );
};

export default VendorList;
