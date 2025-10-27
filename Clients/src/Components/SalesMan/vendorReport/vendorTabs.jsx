import React, { useState, useEffect, useRef } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import VendorForm from "./VendorForm";
import VendorList from "./VendorList";
import axios from "../../../Config/axios";
import toast from "react-hot-toast";
import Loader from "../../Loader";

const VendorTabs = () => {
  const [key, setKey] = useState("form");

  const [vendor, setVendor] = useState({
    firm: "",
    mobile: "",
    city: "",
    address: "",
    gstNumber: "",
    totalBalance: 0,
    advanceBalance: 0,
  });

  const [vendorList, setVendorList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const formTabRef = useRef(null);
  const listTabRef = useRef(null);

  const inputRefs = useRef([]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/vendor");
      setVendorList(res.data || []);
    } catch (error) {
      toast.error("Error fetching vendor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (key === "form" && formTabRef.current) {
      formTabRef.current.focus();
    } else if (key === "list" && listTabRef.current) {
      listTabRef.current.focus();
    }
  }, [key]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/vendor/${editId}`, vendor);
        toast.success("Vendor updated");
      } else {
        await axios.post("/vendor", vendor);
        toast.success("Vendor added");
      }
      setVendor({
        firm: "",
        mobile: "",
        city: "",
        address: "",
        gstNumber: "",
        totalBalance: 0,
      });
      setEditId(null);
      fetchVendors();
      setKey("list");
    } catch (error) {
      toast.error("Error saving vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (v) => {
    setVendor(v);
    setEditId(v._id);
    setKey("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete?")) return;
    setLoading(true);
    try {
      await axios.delete(`/vendor/${id}`);
      toast.success("Vendor deleted");
      fetchVendors();
    } catch (err) {
      toast.error("Error deleting vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e, index) => {
    const input = inputRefs.current[index];
    const total = inputRefs.current.length;

    const next = () => {
      const nextIndex = index + 1;
      if (nextIndex < total) {
        inputRefs.current[nextIndex]?.focus();
      }
    };

    const prev = () => {
      const prevIndex = index - 1;
      if (prevIndex >= 0) {
        inputRefs.current[prevIndex]?.focus();
      }
    };

    const isAtStart = () => {
      try {
        return input.selectionStart === 0;
      } catch {
        return true;
      }
    };

    const isAtEnd = () => {
      try {
        return input.selectionStart === input.value.length;
      } catch {
        return true;
      }
    };

    switch (e.key) {
      case "Enter":
      case "ArrowDown":
        e.preventDefault();
        next();
        break;

      case "Escape":
      case "ArrowUp":
        e.preventDefault();
        prev();
        break;

      case "ArrowRight":
        if (isAtEnd()) {
          e.preventDefault();
          next();
        }
        break;

      case "ArrowLeft":
        if (isAtStart()) {
          e.preventDefault();
          prev();
        }
        break;

      case "F10":
        e.preventDefault();
        handleSubmit(e);
        break;

      default:
        break;
    }
  };

  if (loading) return <Loader />;

  return (
    <Container className="my-4">
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        justify
        className="mb-3"
      >
        <Tab
          eventKey="form"
          title={
            <span
              ref={formTabRef}
              tabIndex={0}
              className="tab-title"
              aria-controls="form-tab-panel"
            >
              {editId ? "Edit Party" : "Add Party"}
            </span>
          }
        >
          <VendorForm
            vendor={vendor}
            setVendor={setVendor}
            handleSubmit={handleSubmit}
            editId={editId}
            inputRefs={inputRefs}
            handleKeyDown={handleKeyDown}
          />
        </Tab>
        <Tab
          eventKey="list"
          title={
            <span
              ref={listTabRef}
              tabIndex={0}
              className="tab-title"
              aria-controls="list-tab-panel"
            >
              Party List
            </span>
          }
        >
          <VendorList
            vendorList={vendorList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            loading={loading}
          />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default VendorTabs;
