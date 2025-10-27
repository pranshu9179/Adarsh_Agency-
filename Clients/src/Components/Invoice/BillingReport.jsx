//new code
import React, { useEffect, useState, useRef, useCallback } from "react";
import ProductBillingReport from "./ProductBillingReport";
import CustomerBilling from "./CustomerBilling";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";
import { useNavigate, useParams } from "react-router-dom";
import {
  createInvoice,
  updateInvoice,
  fetchInvoiceById,
} from "../../redux/features/product-bill/invoiceThunks";
import { useDispatch } from "react-redux";

function BillingReport() {
  const [billingData, setBillingData] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const navigate = useNavigate();
  const [finalAmount, setFinalAmount] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [originalInvoice, setOriginalInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();

  const productRef = useRef();

  useEffect(() => {
    if (id) {
      dispatch(fetchInvoiceById(id))
        .unwrap()
        .then((invoice) => {
          setOriginalInvoice(invoice);
        })
        .catch((err) => {
          console.error("Failed to load invoice: " + err);
        });
    }
  }, [id, dispatch]);

  const handleBillingDataChange = (data, totalAmount) => {
    setBillingData(data);
    setFinalAmount(parseFloat(totalAmount));
  };

  const handleCustomerDataChange = (data) => {
    setCustomerData(data);
  };

  const resetForm = () => {
    setBillingData([]);
    setCustomerData({});
    setFinalAmount(0);
    setResetKey((prev) => prev + 1);
  };

  const handleSubmit = useCallback(
    async (shouldNavigate = true) => {
      setLoading(true);

      const finalData = {
        companyId: customerData.companyId,
        salesmanId: customerData.salesmanId,
        customerId: customerData.customerId,
        customer: customerData,
        customerName: customerData.name,
        billing: billingData,
        finalAmount,
      };

      try {
        let invoice;

        if (id) {
          invoice = await dispatch(
            updateInvoice({ id, invoiceData: finalData })
          ).unwrap();
          toast.success("Invoice updated successfully!");
        } else {
          invoice = await dispatch(createInvoice(finalData)).unwrap();
          toast.success("Invoice created successfully!");
        }

        if (shouldNavigate) {
          navigate(`/generate-invoice/${invoice._id}`);
        } else {
          resetForm();
        }
      } catch (err) {
        toast.error(err || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [
      id, // dependencies
      customerData,
      billingData,
      finalAmount,
      dispatch,
      navigate,
      resetForm,
    ]
  );

  const focusNextComponent = () => {
    productRef.current?.focusItemName();
  };

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.key === "F10") {
        e.preventDefault();
        await handleSubmit(true);
      }

      if (e.altKey && (e.key === "w" || e.key === "W")) {
        e.preventDefault();
        await handleSubmit(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);

  if (loading) {
    return <Loader />;
  }

  // console.log(originalInvoice);

  return (
    <>
      <CustomerBilling
        value={customerData}
        onDataChange={handleCustomerDataChange}
        resetTrigger={resetKey}
        onEdit={originalInvoice}
        onNextFocus={focusNextComponent}
      />
      <ProductBillingReport
        finalAmount={finalAmount}
        value={billingData}
        ref={productRef}
        onBillingDataChange={handleBillingDataChange}
        key={resetKey}
        onEdit={originalInvoice}
      />

      <div
        style={{
          fontSize: "12px",
          margin: "4px",
          color: "#555",
          textAlign: "center",
        }}
      >
        Press <kbd>F10</kbd> to submit
      </div>
      <div className="text-center mt-4">
        <button
          className="btn btn-primary px-4 py-2"
          onClick={() => handleSubmit(true)}
          style={{ fontWeight: "bold", fontSize: "16px", borderRadius: "8px" }}
          title="Shortcut: Ctrl + Enter"
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default BillingReport;
