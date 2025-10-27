import React, { useEffect, useState } from "react";
import { Container, Table, Image, Button } from "react-bootstrap";
import axios from "../../../Config/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";
import toast from "react-hot-toast";
import CustomDataTable from "../../CustomDataTable";
import { PencilFill, TrashFill } from "react-bootstrap-icons";

const API_BASE = import.meta.env.VITE_API;
const IMAGE_BASE = import.meta.env.VITE_API.replace(/\/api$/, "");

function DisplaySalesMan({ onEdit, refreshTrigger }) {
  const [salesmen, setSalesmen] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSalesmen = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/salesman");
      setSalesmen(response.data);
    } catch (error) {
      console.error("Error fetching salesmen:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesmen();
  }, [refreshTrigger]);

  const navigate = useNavigate();

  const handleEdit = (id) => {
    // navigate(`/add-salesman/${id}`);
    if (onEdit) {
      onEdit(id); // Go to form tab
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this salesman?")) {
      try {
        setLoading(true);
        await axios.delete(`/salesman/${id}`);
        fetchSalesmen(); // Refresh the list
        toast.success("Delete Successfully");
      } catch (error) {
        console.error("Error deleting salesman:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getSalesmanColumns = (handleEdit, handleDelete, IMAGE_BASE) => [
    {
      name: "SR",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Photo",
      selector: (row) =>
        row.photo ? (
          <Image
            src={`${IMAGE_BASE}/Images/${row.photo}`}
            roundedCircle
            width={40}
            height={40}
          />
        ) : (
          "No Photo"
        ),
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    // {
    //   name: "Alternate Mobile",
    //   selector: (row) => row.alternateMobile,
    //   sortable: true,
    // },
    {
      name: "Beat",
      selector: (row) =>
        row.beat?.map((b, i) => (
          <span key={i} className="bg-light px-2 py-1 rounded d-block">
            {b.area}
          </span>
        )),
      sortable: false,
      wrap: true,
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="btn-group" role="group">
          <Button
            variant="link"
            className="text-primary"
            onClick={() => handleEdit(row._id)}
          >
            <PencilFill />
          </Button>
          <Button
            variant="link"
            className="text-danger"
            onClick={() => handleDelete(row._id)}
          >
            <TrashFill />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="my-4">
      <CustomDataTable
        title="Salesman List"
        columns={getSalesmanColumns(handleEdit, handleDelete, IMAGE_BASE)}
        data={salesmen?.Data || []}
        pagination={true}
        loading={loading}
      />
    </Container>
  );
}

export default DisplaySalesMan;
