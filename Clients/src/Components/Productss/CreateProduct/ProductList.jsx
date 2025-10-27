import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import axios from "../../../Config/axios";
const IMAGE_BASE = import.meta.env.VITE_API.replace(/\/api$/, "");
import Image from "react-bootstrap/Image";
import Loader from "../../Loader";
import toast from "react-hot-toast";
import CustomDataTable from "../../CustomDataTable";

const ProductList = ({ onEdit, refreshFlag }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/product");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshFlag]);

  // ✅ Fixed: now takes product object instead of index
  const handleEdit = (product) => {
    if (onEdit) {
      onEdit(product);
    }
  };

  // ✅ Fixed: now takes product object instead of index
  const handleDelete = async (product) => {
    if (!product?._id) return;

    try {
      setLoading(true);
      await axios.delete(`/product/${product._id}`);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const productColumns = [
    {
      name: "SR",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Product Image",
      selector: (row) =>
        row.productImg ? (
          <Image
            src={`${IMAGE_BASE}/Images/${row.productImg}`}
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
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.companyId?.name || "N/A",
      sortable: true,
    },
    {
      name: "HSN Code",
      selector: (row) => row.hsnCode,
      sortable: true,
    },
    {
      name: "MRP",
      selector: (row) =>
        row.mrp !== undefined && row.mrp !== null
          ? Number(row.mrp).toFixed(2)
          : "0.00",
      sortable: true,
    },
    {
      name: "Sales Rate",
      selector: (row) =>
        row.salesRate !== undefined && row.salesRate !== null
          ? Number(row.salesRate).toFixed(2)
          : "0.00",
      sortable: true,
    },
    {
      name: "Purchase Rate",
      selector: (row) =>
        row.purchaseRate !== undefined && row.purchaseRate !== null
          ? Number(row.purchaseRate).toFixed(2)
          : "0.00",
      sortable: true,
    },
    {
      name: "Available Qty",
      selector: (row) => row.availableQty,
      sortable: true,
    },
    {
      name: "GST %",
      selector: (row) =>
        row.gstPercent !== undefined && row.gstPercent !== null
          ? Number(row.gstPercent).toFixed(2)
          : "0.00",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          {/* ✅ Fixed: pass row instead of index */}
          <button
            className="btn btn-sm btn-warning me-2"
            onClick={() => handleEdit(row)}
          >
            <PencilFill />
          </button>
          {/* ✅ Fixed: pass row instead of index */}
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row)}
          >
            <TrashFill />
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="col-md-12 mb-4">
      <div className="card shadow border-0">
        <div className="card-body">
          <h5 className="card-title text-success mb-3">Product List</h5>
          {products.length === 0 ? (
            <p>No products added yet.</p>
          ) : (
            <CustomDataTable
              title="Product Table"
              columns={productColumns}
              data={products}
              pagination={true}
              loading={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
