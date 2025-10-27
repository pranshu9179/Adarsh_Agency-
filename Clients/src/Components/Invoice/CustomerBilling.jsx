import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../../Config/axios";
import Select from "react-select";
import Loader from "../../Components/Loader";
import { Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getCurrentDate = () => new Date().toISOString().split("T")[0];

const CustomerBilling = ({
  onDataChange,
  resetTrigger,
  onEdit,
  onNextFocus,
}) => {
  const { id } = useParams(); // Get the id from URL parameters
  const isFirstRender = useRef(true);

  console.log(onEdit);

  const [formData, setFormData] = useState({
    Billdate: getCurrentDate(),
    paymentMode: "",
    billingType: "Credit",
    selectedSalesmanId: null,
    selectedBeatId: null,
    selectedCustomerId: null,
  });

  const [salesmen, setSalesmen] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [beatsOptions, setBeatsOptions] = useState([]);
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [allCustomers, setAllCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showSalesmanModal, setShowSalesmanModal] = useState(false);
  const [salesmanFilterText, setSalesmanFilterText] = useState("");
  const [customerFilterText, setCustomerFilterText] = useState(""); // 🔍 customer search
  const [salesmanFocusedIndex, setSalesmanFocusedIndex] = useState(0);
  const [customerFocusedIndex, setCustomerFocusedIndex] = useState(0);

  const salesmanModalRef = useRef(null);
  const salesmanInputRef = useRef(null);
  const billDateRef = useRef(null);
  const beatSelectRef = useRef(null);
  const customerTableRef = useRef(null);
  const billingTypeRef = useRef(null); // Ref for billing type select

  const removeCustomer = () => {
    setSelectedCustomer(null);
    setFormData((prev) => ({
      ...prev,
      selectedCustomerId: null,
    }));
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesRes, custRes] = await Promise.all([
          axios.get("/salesman"),
          axios.get("/customer"),
        ]);
        setSalesmen(salesRes.data.Data || []);
        const customers = custRes.data || [];
        setOriginalCustomers(customers);
        setAllCustomers(customers);
        const customerSelectOptions = customers.map((c) => ({
          label: c.ledger,
          value: c._id,
          customerObject: c,
        }));
        setFilteredCustomers(customerSelectOptions);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData((prev) => ({
      ...prev,
      selectedCustomerId: customer._id,
    }));
    setFilteredCustomers([]);
    setTimeout(() => billDateRef.current?.focus(), 0);
  };

  const handleSalesmanSelect = (salesman) => {
    setSelectedSalesman(salesman);
    setFormData((prev) => ({
      ...prev,
      selectedSalesmanId: salesman._id,
    }));
    setShowSalesmanModal(false);
    setSalesmanFilterText("");
    setSalesmanFocusedIndex(0);
    setTimeout(() => beatSelectRef.current?.focus?.(), 0);
  };

  const filteredSalesmen = salesmen.filter((s) =>
    s.name?.toLowerCase().includes(salesmanFilterText.toLowerCase())
  );

  const handleSalesmanKeyDown = (e) => {
    if (!filteredSalesmen.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSalesmanFocusedIndex((prev) =>
        Math.min(prev + 1, filteredSalesmen.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSalesmanFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const salesman = filteredSalesmen[salesmanFocusedIndex];
      if (salesman) {
        handleSalesmanSelect(salesman);
      }
    } else if (e.key === "Escape") {
      setShowSalesmanModal(false);
    }
  };

  const handleCustomerKeyDown = (e) => {
    if (!filteredCustomers.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCustomerFocusedIndex((prev) =>
        Math.min(prev + 1, filteredCustomers.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCustomerFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const customer = filteredCustomers[customerFocusedIndex]?.customerObject;
      if (customer) {
        handleCustomerSelect(customer);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Focus on the next input field
      if (e.target.name === "Billdate") {
        document.querySelector('select[name="paymentMode"]').focus();
      } else if (e.target.name === "paymentMode") {
        document.querySelector('select[name="billingType"]').focus();
      } else if (e.target.name === "billingType") {
        // Focus on the product billing input
        onNextFocus?.();
      }
    } else if (e.key === "Tab") {
      // Focus on the previous input field
      e.preventDefault();
      if (e.target.name === "paymentMode") {
        billDateRef.current.focus();
      } else if (e.target.name === "billingType") {
        document.querySelector('select[name="paymentMode"]').focus();
      }
    }
  };

  useEffect(() => {
    if (showSalesmanModal) {
      setTimeout(() => salesmanInputRef.current?.focus(), 0);
    }
  }, [showSalesmanModal]);

  useEffect(() => {
    if ((selectedBeat || selectedSalesman) && filteredCustomers.length > 0) {
      setCustomerFocusedIndex(0);
      setTimeout(() => customerTableRef.current?.focus(), 0);
    }
  }, [selectedBeat, selectedSalesman, filteredCustomers.length]);

  useEffect(() => {
    setFormData({
      Billdate: getCurrentDate(),
      paymentMode: "",
      billingType: "Credit",
      selectedSalesmanId: null,
      selectedBeatId: null,
      selectedCustomerId: null,
    });
    setSelectedSalesman(null);
    setSelectedBeat(null);
    setSelectedCustomer(null);
    setBeatsOptions([]);
    setFilteredCustomers([]);
  }, [resetTrigger]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesRes, custRes] = await Promise.all([
          axios.get("/salesman"),
          axios.get("/customer"),
        ]);

        console.log(salesRes);
        console.log(custRes);

        setSalesmen(salesRes.data.Data || []);
        const customers = custRes.data || [];
        setOriginalCustomers(customers);
        setAllCustomers(customers);
        const customerSelectOptions = customers.map((c) => ({
          label: c.ledger,
          value: c._id,
          customerObject: c,
        }));
        setFilteredCustomers(customerSelectOptions);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedSalesman) return;
    const beatOpts = (selectedSalesman.beat || []).map((b) => ({
      label: b.area,
      value: b._id,
      beatObject: b,
    }));
    setBeatsOptions(beatOpts);
    setSelectedBeat(null);
    setSelectedCustomer(null);
    setFilteredCustomers([]);
    setFormData((prev) => ({
      ...prev,
      selectedSalesmanId: selectedSalesman._id,
      selectedBeatId: null,
      selectedCustomerId: null,
    }));
  }, [selectedSalesman]);

  useEffect(() => {
    if (!selectedBeat) {
      const allCustomerOptions = originalCustomers.map((c) => ({
        label: c.ledger,
        value: c._id,
        customerObject: c,
      }));
      setFilteredCustomers(allCustomerOptions);
      setSelectedCustomer(null);
      setFormData((prev) => ({
        ...prev,
        selectedCustomerId: null,
      }));
      return;
    }

    const BeatArea = selectedBeat.label.toLowerCase().trim();

    const customerOpts = originalCustomers
      .filter((customer) => customer?.area?.trim().toLowerCase() === BeatArea)
      .map((c) => ({ label: c.ledger, value: c._id, customerObject: c }));

    if (customerOpts.length === 0) {
      toast.error(`No customers found for beat: ${selectedBeat.label}`, {
        position: "top-right",
        autoClose: 5000,

        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    setFilteredCustomers(customerOpts);
    setSelectedCustomer(null);
    setFormData((prev) => ({
      ...prev,
      selectedBeatId: selectedBeat.value,
      selectedCustomerId: null,
    }));
  }, [selectedBeat, originalCustomers]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onDataChange({
      ...formData,
      salesmanName: selectedSalesman?.name || "",
      beatName: selectedBeat?.label || "",
      customerName: selectedCustomer?.ledger || "",
      companyId: selectedCustomer?._id || "",
    });
  }, [formData, selectedSalesman, selectedBeat, selectedCustomer]);

  // Fetch edit bill data
  useEffect(() => {
    if (id) {
      const fetchEditBill = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/pro-billing/${id}`);
          const editBill = response.data;

          // Extract salesman and customer data
          const salesman = salesmen.find(
            (s) => s._id === editBill.salesmanId._id
          );
          const customer = allCustomers.find(
            (c) => c._id === editBill.customerId._id
          );

          // Set form data
          setFormData({
            Billdate: editBill.billDate || getCurrentDate(),
            paymentMode: editBill.paymentMode || "",
            billingType: editBill.billingType || "Credit",
            selectedSalesmanId: editBill.salesmanId?._id || null,
            selectedBeatId: editBill.selectedBeatId || null,
            selectedCustomerId: editBill.customerId?._id || null,
          });

          setSelectedSalesman(salesman || null);
          setSelectedCustomer(customer || null);

          // Update beats options based on selected salesman
          if (salesman) {
            const beatOpts = (salesman.beat || []).map((b) => ({
              label: b.area,
              value: b._id,
              beatObject: b,
            }));
            setBeatsOptions(beatOpts);

            // Set selected beat if available
            const selectedBeat = beatOpts.find(
              (b) => b.value === editBill.selectedBeatId
            );
            setSelectedBeat(selectedBeat || null);
          }

          // Update customers based on selected beat
          if (editBill.selectedBeatId) {
            const beat = salesman?.beat.find(
              (b) => b._id === editBill.selectedBeatId
            );
            if (beat) {
              const customerOpts = originalCustomers
                .filter(
                  (c) =>
                    c.area.trim().toLowerCase() ===
                    beat.area.trim().toLowerCase()
                )
                .map((c) => ({
                  label: c.ledger,
                  value: c._id,
                  customerObject: c,
                }));
              setFilteredCustomers(customerOpts);
            }
          }
        } catch (error) {
          toast.error("Failed to fetch Edit bill");
          console.error("Failed to fetch Bill:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEditBill();
    }
  }, [id, salesmen, allCustomers]);

  // 🔍 Apply customer search filter
  const visibleCustomers = filteredCustomers.filter((c) =>
    c.label.toLowerCase().includes(customerFilterText.toLowerCase())
  );

  useEffect(() => {
    if (onEdit) {
      setShowSalesmanModal(false);

      // setSelectedBeat((prev)=>({
      //   ...prev,
      //   beatObject:{
      //     area:onEdit?.salesmanId?.beat?.area,
      //     _id:onEdit?.salesmanId?.beat?._id
      //   },
      //   label:onEdit?.salesmanId?.beat?.area,
      //   value:onEdit?.salesmanId?.beat?._id
      // }))
    } else {
      setShowSalesmanModal(true);
    }
  }, [onEdit]);

  if (loading) return <Loader />;

  return (
    <div className="container mt-4">
      <h4>Customer Billing</h4>
      <form>
        <div className="row">
          {/* Salesman Selector */}
          <div className="form-group col-md-6">
            <label>Salesman</label>
            <input
              type="text"
              className="form-control"
              placeholder="Select Salesman"
              value={selectedSalesman?.name || ""}
              readOnly
              onFocus={() => setShowSalesmanModal(true)}
            />
          </div>

          {/* Beat Selector */}
          <div className="form-group col-md-6">
            <label>Beat</label>
            <Select
              ref={beatSelectRef}
              options={beatsOptions}
              // {onEdit?value.onEdit?.customer?.}
              value={selectedBeat}
              onChange={(opt) => {
                setSelectedBeat(opt), console.log(opt);
              }}
              placeholder="Select Beat"
              isClearable
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="form-group col-md-4">
            <label>Bill Date</label>
            <input
              type="date"
              name="Billdate"
              className="form-control"
              value={formData.Billdate}
              onChange={handleInputChange}
              ref={billDateRef}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="form-group col-md-4">
            <label>Payment Mode</label>
            <select
              name="paymentMode"
              className="form-control"
              value={formData.paymentMode}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            >
              <option value="">Select Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div className="form-group col-md-4">
            <label>Billing Type</label>
            <select
              name="billingType"
              className="form-control"
              value={formData.billingType}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              ref={billingTypeRef} // Ref for billing type select
            >
              <option value="Credit">Credit</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {selectedCustomer && (
          <div className="row mt-3">
            <div className="col-12">
              <div className="alert alert-success d-flex justify-content-between">
                <div>
                  <strong>Selected Customer:</strong> {selectedCustomer.ledger}
                  {selectedCustomer.area && ` - ${selectedCustomer.area}`}
                  {selectedCustomer.mobile && ` - ${selectedCustomer.mobile}`}
                </div>
                <div>
                  <button
                    className="bg-black text-white px-3 py-1 rounded"
                    onClick={removeCustomer}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Customer Table */}
      {(selectedBeat || selectedSalesman) && visibleCustomers.length > 0 && (
        <div className="mt-4">
          <Card>
            <Card.Body style={{ position: "relative" }}>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setFilteredCustomers([])}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 12,
                  border: "none",
                  background: "transparent",
                  fontSize: 22,
                  lineHeight: 1,
                  cursor: "pointer",
                }}
              >
                ×
              </button>

              {/* 🔍 Customer Search */}
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Search Customer..."
                value={customerFilterText}
                onChange={(e) => {
                  setCustomerFilterText(e.target.value);
                  setCustomerFocusedIndex(0);
                }}
              />

              <div
                ref={customerTableRef}
                tabIndex={0}
                onKeyDown={handleCustomerKeyDown}
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  outline: "none",
                }}
              >
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Firm Name</th>
                      <th>Area</th>
                      <th>Mobile</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCustomers.map((opt, index) => (
                      <tr
                        key={opt.value}
                        onClick={() => handleCustomerSelect(opt.customerObject)}
                        onMouseEnter={() => setCustomerFocusedIndex(index)}
                        className={
                          customerFocusedIndex === index ? "table-active" : ""
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{opt.customerObject.ledger}</td>
                        <td>{opt.customerObject.area || "N/A"}</td>
                        <td>{opt.customerObject.mobile || "N/A"}</td>
                        <td>{opt.customerObject.address1 || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Salesman Modal */}
      {showSalesmanModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSalesmanModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-content"
            ref={salesmanModalRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 16,
              width: "min(900px, 95vw)",
              maxHeight: "80vh",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowSalesmanModal(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 12,
                border: "none",
                background: "transparent",
                fontSize: 22,
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search Salesman..."
              value={salesmanFilterText}
              onChange={(e) => {
                setSalesmanFilterText(e.target.value);
                setSalesmanFocusedIndex(0);
              }}
              ref={salesmanInputRef}
              onKeyDown={handleSalesmanKeyDown}
            />

            <div
              tabIndex={0}
              onKeyDown={handleSalesmanKeyDown}
              style={{ maxHeight: 400, overflowY: "auto", outline: "none" }}
            >
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Username</th>
                    <th>Beat Area</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalesmen.map((s, index) => (
                    <tr
                      key={s._id}
                      onClick={() => handleSalesmanSelect(s)}
                      onMouseEnter={() => setSalesmanFocusedIndex(index)}
                      className={
                        salesmanFocusedIndex === index ? "table-active" : ""
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td>{s.name}</td>
                      <td>{s.mobile}</td>
                      <td>{s.city}</td>
                      <td>{s.username}</td>
                      <td>{s.beat?.map((b) => b.area).join(", ") || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBilling;

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import axios from "../../Config/axios";
// import Select from "react-select";
// import Loader from "../../Components/Loader";
// import { Card } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const getCurrentDate = () => new Date().toISOString().split("T")[0];

// const CustomerBilling = ({
//   onDataChange,
//   resetTrigger,
//   onEdit,
//   onNextFocus,
// }) => {
//   const { id } = useParams();
//   const isFirstRender = useRef(true);

//   const [formData, setFormData] = useState({
//     Billdate: getCurrentDate(),
//     paymentMode: "",
//     billingType: "Credit",
//     selectedSalesmanId: null,
//     selectedBeatId: null,
//     selectedCustomerId: null,
//   });

//   const [salesmen, setSalesmen] = useState([]);
//   const [beatsOptions, setBeatsOptions] = useState([]);
//   const [allCustomers, setAllCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [selectedSalesman, setSelectedSalesman] = useState(null);
//   const [selectedBeat, setSelectedBeat] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [showSalesmanModal, setShowSalesmanModal] = useState(false);
//   const [salesmanFilterText, setSalesmanFilterText] = useState("");
//   const [customerFilterText, setCustomerFilterText] = useState("");
//   const [salesmanFocusedIndex, setSalesmanFocusedIndex] = useState(0);
//   const [customerFocusedIndex, setCustomerFocusedIndex] = useState(0);

//   const salesmanModalRef = useRef(null);
//   const salesmanInputRef = useRef(null);
//   const billDateRef = useRef(null);
//   const beatSelectRef = useRef(null);
//   const customerTableRef = useRef(null);
//   const billingTypeRef = useRef(null);

//   // ✅ Fetch Salesmen & Customers (only once)
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [salesRes, custRes] = await Promise.all([
//           axios.get("/salesman"),
//           axios.get("/customer"),
//         ]);

//         const salesData = salesRes.data.Data || [];
//         const customerData = custRes.data || [];

//         setSalesmen(salesData);
//         setAllCustomers(customerData);

//         const customerSelectOptions = customerData.map((c) => ({
//           label: c.ledger,
//           value: c._id,
//           customerObject: c,
//         }));
//         setFilteredCustomers(customerSelectOptions);
//       } catch (err) {
//         toast.error("Error fetching initial data");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // ✅ Handle Edit Mode (Wait until salesmen & customers are loaded)
//   useEffect(() => {
//     if (!id) return;
//     if (salesmen.length === 0 || allCustomers.length === 0) return;

//     const fetchEditBill = async () => {
//       try {
//         setLoading(true);
//         const { data: editBill } = await axios.get(`/pro-billing/${id}`);

//         const salesman = salesmen.find(
//           (s) => s._id === editBill.salesmanId._id
//         );
//         const customer = allCustomers.find(
//           (c) => c._id === editBill.customerId._id
//         );

//         // Set salesman & beat options
//         const beatOpts = (salesman?.beat || []).map((b) => ({
//           label: b.area,
//           value: b._id,
//           beatObject: b,
//         }));
//         setBeatsOptions(beatOpts);

//         // Set selected beat
//         const selectedBeat = beatOpts.find(
//           (b) => b.value === editBill.selectedBeatId
//         );
//         setSelectedBeat(selectedBeat || null);

//         // Set form and selections
//         setSelectedSalesman(salesman || null);
//         setSelectedCustomer(customer || null);
//         setFormData({
//           Billdate: editBill.billDate || getCurrentDate(),
//           paymentMode: editBill.paymentMode || "",
//           billingType: editBill.billingType || "Credit",
//           selectedSalesmanId: editBill.salesmanId?._id || null,
//           selectedBeatId: editBill.selectedBeatId || null,
//           selectedCustomerId: editBill.customerId?._id || null,
//         });
//       } catch (error) {
//         toast.error("Failed to load edit bill");
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEditBill();
//   }, [id, salesmen, allCustomers]);

//   // ✅ Skip reset when editing
//   useEffect(() => {
//     if (onEdit && Object.keys(onEdit).length > 0) return;
//     setFormData({
//       Billdate: getCurrentDate(),
//       paymentMode: "",
//       billingType: "Credit",
//       selectedSalesmanId: null,
//       selectedBeatId: null,
//       selectedCustomerId: null,
//     });
//     setSelectedSalesman(null);
//     setSelectedBeat(null);
//     setSelectedCustomer(null);
//     setBeatsOptions([]);
//     setFilteredCustomers([]);
//   }, [resetTrigger]);

//   // ✅ Auto-update parent with form data
//   useEffect(() => {
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       return;
//     }
//     onDataChange?.({
//       ...formData,
//       salesmanName: selectedSalesman?.name || "",
//       beatName: selectedBeat?.label || "",
//       customerName: selectedCustomer?.ledger || "",
//       companyId: selectedCustomer?._id || "",
//     });
//   }, [formData, selectedSalesman, selectedBeat, selectedCustomer]);

//   // ✅ Handle Beat Change → Filter Customers
//   useEffect(() => {
//     if (!selectedBeat) {
//       const allOpts = allCustomers.map((c) => ({
//         label: c.ledger,
//         value: c._id,
//         customerObject: c,
//       }));
//       setFilteredCustomers(allOpts);
//       setSelectedCustomer(null);
//       return;
//     }

//     const beatArea = selectedBeat.label.toLowerCase().trim();
//     const filtered = allCustomers
//       .filter((c) => c.area?.trim().toLowerCase() === beatArea)
//       .map((c) => ({ label: c.ledger, value: c._id, customerObject: c }));

//     if (filtered.length === 0) {
//       toast.error(`No customers found for beat: ${selectedBeat.label}`);
//     }

//     setFilteredCustomers(filtered);
//     setSelectedCustomer(null);
//     setFormData((prev) => ({
//       ...prev,
//       selectedBeatId: selectedBeat.value,
//       selectedCustomerId: null,
//     }));
//   }, [selectedBeat, allCustomers]);

//   // ✅ Keyboard navigation for salesman/customer modals
//   const handleSalesmanKeyDown = (e) => {
//     if (!salesmen.length) return;
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setSalesmanFocusedIndex((prev) =>
//         Math.min(prev + 1, salesmen.length - 1)
//       );
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setSalesmanFocusedIndex((prev) => Math.max(prev - 1, 0));
//     } else if (e.key === "Enter") {
//       e.preventDefault();
//       handleSalesmanSelect(salesmen[salesmanFocusedIndex]);
//     } else if (e.key === "Escape") {
//       setShowSalesmanModal(false);
//     }
//   };

//   const handleCustomerKeyDown = (e) => {
//     if (!filteredCustomers.length) return;
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setCustomerFocusedIndex((prev) =>
//         Math.min(prev + 1, filteredCustomers.length - 1)
//       );
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setCustomerFocusedIndex((prev) => Math.max(prev - 1, 0));
//     } else if (e.key === "Enter") {
//       e.preventDefault();
//       handleCustomerSelect(
//         filteredCustomers[customerFocusedIndex]?.customerObject
//       );
//     }
//   };

//   const handleSalesmanSelect = (salesman) => {
//     setSelectedSalesman(salesman);
//     setFormData((prev) => ({ ...prev, selectedSalesmanId: salesman._id }));
//     setShowSalesmanModal(false);

//     const beatOpts = (salesman.beat || []).map((b) => ({
//       label: b.area,
//       value: b._id,
//       beatObject: b,
//     }));
//     setBeatsOptions(beatOpts);
//     setTimeout(() => beatSelectRef.current?.focus?.(), 100);
//   };

//   const handleCustomerSelect = (customer) => {
//     setSelectedCustomer(customer);
//     setFormData((prev) => ({ ...prev, selectedCustomerId: customer._id }));
//     setFilteredCustomers([]);
//     setTimeout(() => billDateRef.current?.focus(), 0);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (e.target.name === "Billdate") {
//         document.querySelector('select[name="paymentMode"]').focus();
//       } else if (e.target.name === "paymentMode") {
//         document.querySelector('select[name="billingType"]').focus();
//       } else if (e.target.name === "billingType") {
//         onNextFocus?.();
//       }
//     }
//   };

//   const removeCustomer = () => {
//     setSelectedCustomer(null);
//     setFormData((prev) => ({ ...prev, selectedCustomerId: null }));
//   };

//   if (loading) return <Loader />;

//   const visibleCustomers = filteredCustomers.filter((c) =>
//     c.label.toLowerCase().includes(customerFilterText.toLowerCase())
//   );

//   return (
//     <div className="container mt-4">
//       <h4>Customer Billing</h4>
//       <form>
//         <div className="row">
//           <div className="form-group col-md-6">
//             <label>Salesman</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Select Salesman"
//               value={selectedSalesman?.name || ""}
//               readOnly
//               onFocus={() => setShowSalesmanModal(true)}
//             />
//           </div>

//           <div className="form-group col-md-6">
//             <label>Beat</label>
//             <Select
//               ref={beatSelectRef}
//               options={beatsOptions}
//               value={selectedBeat}
//               onChange={(opt) => setSelectedBeat(opt)}
//               placeholder="Select Beat"
//               isClearable
//               styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
//               menuPortalTarget={document.body}
//             />
//           </div>
//         </div>

//         <div className="row mt-3">
//           <div className="form-group col-md-4">
//             <label>Bill Date</label>
//             <input
//               type="date"
//               name="Billdate"
//               className="form-control"
//               value={formData.Billdate}
//               onChange={handleInputChange}
//               ref={billDateRef}
//               onKeyDown={handleKeyDown}
//             />
//           </div>

//           <div className="form-group col-md-4">
//             <label>Payment Mode</label>
//             <select
//               name="paymentMode"
//               className="form-control"
//               value={formData.paymentMode}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//             >
//               <option value="">Select Payment Mode</option>
//               <option value="Cash">Cash</option>
//               <option value="Card">Card</option>
//             </select>
//           </div>

//           <div className="form-group col-md-4">
//             <label>Billing Type</label>
//             <select
//               name="billingType"
//               className="form-control"
//               value={formData.billingType}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//               ref={billingTypeRef}
//             >
//               <option value="Credit">Credit</option>
//               <option value="Cash">Cash</option>
//             </select>
//           </div>
//         </div>

//         {selectedCustomer && (
//           <div className="row mt-3">
//             <div className="col-12">
//               <div className="alert alert-success d-flex justify-content-between">
//                 <div>
//                   <strong>Selected Customer:</strong> {selectedCustomer.ledger}
//                   {selectedCustomer.area && ` - ${selectedCustomer.area}`}
//                   {selectedCustomer.mobile && ` - ${selectedCustomer.mobile}`}
//                 </div>
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-danger"
//                   onClick={removeCustomer}
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </form>

//       {/* Customer Table */}
//       {(selectedBeat || selectedSalesman) && visibleCustomers.length > 0 && (
//         <div className="mt-4">
//           <Card>
//             <Card.Body>
//               <input
//                 type="text"
//                 className="form-control mb-2"
//                 placeholder="Search Customer..."
//                 value={customerFilterText}
//                 onChange={(e) => setCustomerFilterText(e.target.value)}
//               />

//               <div
//                 ref={customerTableRef}
//                 tabIndex={0}
//                 onKeyDown={handleCustomerKeyDown}
//                 style={{
//                   maxHeight: "300px",
//                   overflowY: "auto",
//                   outline: "none",
//                 }}
//               >
//                 <table className="table table-hover">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Firm Name</th>
//                       <th>Area</th>
//                       <th>Mobile</th>
//                       <th>Address</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {visibleCustomers.map((opt, index) => (
//                       <tr
//                         key={opt.value}
//                         onClick={() => handleCustomerSelect(opt.customerObject)}
//                         className={
//                           customerFocusedIndex === index ? "table-active" : ""
//                         }
//                         style={{ cursor: "pointer" }}
//                       >
//                         <td>{opt.customerObject.ledger}</td>
//                         <td>{opt.customerObject.area || "N/A"}</td>
//                         <td>{opt.customerObject.mobile || "N/A"}</td>
//                         <td>{opt.customerObject.address1 || "N/A"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </Card.Body>
//           </Card>
//         </div>
//       )}

//       {/* Salesman Modal */}
//       {showSalesmanModal && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowSalesmanModal(false)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.35)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1050,
//           }}
//         >
//           <div
//             className="modal-content"
//             ref={salesmanModalRef}
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               background: "#fff",
//               borderRadius: 8,
//               padding: 16,
//               width: "min(900px, 95vw)",
//               maxHeight: "80vh",
//               overflow: "hidden",
//               position: "relative",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//             }}
//           >
//             <button
//               type="button"
//               onClick={() => setShowSalesmanModal(false)}
//               style={{
//                 position: "absolute",
//                 top: 8,
//                 right: 12,
//                 border: "none",
//                 background: "transparent",
//                 fontSize: 22,
//                 cursor: "pointer",
//               }}
//             >
//               ×
//             </button>

//             <input
//               type="text"
//               className="form-control mb-2"
//               placeholder="Search Salesman..."
//               value={salesmanFilterText}
//               onChange={(e) => setSalesmanFilterText(e.target.value)}
//               ref={salesmanInputRef}
//               onKeyDown={handleSalesmanKeyDown}
//             />

//             <div
//               tabIndex={0}
//               onKeyDown={handleSalesmanKeyDown}
//               style={{ maxHeight: 400, overflowY: "auto", outline: "none" }}
//             >
//               <table className="table table-hover">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Name</th>
//                     <th>Mobile</th>
//                     <th>City</th>
//                     <th>Username</th>
//                     <th>Beat Area</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {salesmen
//                     .filter((s) =>
//                       s.name
//                         ?.toLowerCase()
//                         .includes(salesmanFilterText.toLowerCase())
//                     )
//                     .map((s, index) => (
//                       <tr
//                         key={s._id}
//                         onClick={() => handleSalesmanSelect(s)}
//                         className={
//                           salesmanFocusedIndex === index ? "table-active" : ""
//                         }
//                         style={{ cursor: "pointer" }}
//                       >
//                         <td>{s.name}</td>
//                         <td>{s.mobile}</td>
//                         <td>{s.city}</td>
//                         <td>{s.username}</td>
//                         <td>
//                           {s.beat?.map((b) => b.area).join(", ") || "N/A"}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default CustomerBilling;
