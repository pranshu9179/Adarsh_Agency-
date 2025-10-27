import React, { useEffect, useState, useRef } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const ProductTabs = () => {
  const [key, setKey] = useState("form");
  const [productToEdit, setProductToEdit] = useState(null);
  const [refreshListFlag, setRefreshListFlag] = useState(0);
  const formTabRef = useRef(null);

  // ✅ Jab page load ho tab auto-focus
  useEffect(() => {
    if (key === "form" && formTabRef.current) {
      const firstInput = formTabRef.current.querySelector(
        "input, select, textarea, button, [tabindex]:not([tabindex='-1'])"
      );
      if (firstInput) firstInput.focus();
    }
  }, [key]);

  // ✅ Arrow keys for tab switch and Shift+E / Shift+L shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shift+E => go to form
      if (e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setKey("form");
        return;
      }
      // Shift+L => go to list
      if (e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setKey("list");
        return;
      }
      // Arrow navigation (still preserved)
      if (e.key === "ArrowRight") {
        if (key === "form") setKey("list");
      } else if (e.key === "ArrowLeft") {
        if (key === "list") setKey("form");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key]);

  const handleEdit = (product) => {
    setProductToEdit(product);
    setKey("form");
  };

  const handleSuccess = () => {
    setProductToEdit(null);
    setRefreshListFlag((prev) => prev + 1);
    setKey("list");
  };

  return (
    <div className="container mt-3">
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        justify
      >
        <Tab
          eventKey="form"
          title={productToEdit ? "Edit Product" : "Add Product"}
        >
          <div ref={formTabRef}>
            <ProductForm
              onSuccess={handleSuccess}
              productToEdit={productToEdit}
            />
          </div>
        </Tab>

        <Tab eventKey="list" title="Product List">
          <ProductList onEdit={handleEdit} refreshFlag={refreshListFlag} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProductTabs;
