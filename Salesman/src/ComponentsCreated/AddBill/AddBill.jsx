// import React, { useState, useEffect } from "react";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Button } from "../../components/ui/button";
// import axios from "../../Config/axios";
// import ItemNameModel from "../itemNameModel/ItemNameModek";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { toast, ToastContainer } from "react-toastify";

// const MobileBillForm = () => {
//   const initialFormData = {
//     salesmanId: "",
//     salesmanName: "",
//     location: "",
//     billDate: "",
//     paymentMode: "",
//     billType: "credit",
//     shop: "",
//   };

//   const initialProduct = {
//     productId: "",
//     itemName: "",
//     unit: "",
//     primaryUnit: "",
//     secondaryUnit: "",
//     qty: 0,
//     freeQty: 0,
//     rate: 0,
//     sch: 0,
//     schAmt: 0,
//     cd: 0,
//     cdAmt: 0,
//     total: 0,
//     GST: 0,
//     totalGstAmount: 0,
//     amount: 0,
//     finalAmount: 0,
//     pendingAmount: 0,
//     availableQty: 0,
//   };

//   // const [loginUser, setLoginUser] = useState([initialProduct]);
//   const [formData, setFormData] = useState(initialFormData);
//   const [products, setProducts] = useState([initialProduct]);

//   const [showModel, setShowModel] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [invoices, setInvoices] = useState([]);
//   const [shops, setShops] = useState([]);
//   const [activeProductIndex, setActiveProductIndex] = useState(null);
//   const [disable, setDisable] = useState(false);
//   const [editingIndex, setEditingIndex] = useState(null);

//   // Load user once
//   useEffect(() => {
//     const data = localStorage.getItem("userData");
//     if (data) {
//       try {
//         const user = JSON.parse(data);
//         // setLoginUser(user);

//         const id = user?._id || user?.data?._id || null;
//         const username = user?.username || user?.data?.username || "";

//         console.log(id);
//         console.log(username);

//         if (!id) {
//           console.error(
//             "⚠️ No salesmanId found in localStorage userData:",
//             user
//           );
//           return; // stop if no id
//         }

//         setFormData((prev) => ({
//           ...prev,
//           salesmanId: id,
//           salesmanName: username,
//         }));
//       } catch (err) {
//         console.error("Failed to parse userData:", err);
//       }
//     }
//   }, []);

//   // Fetch invoices
//   const fetchInvoices = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("/pro-billing/salesman");
//       setInvoices(response.data);
//     } catch (error) {
//       console.error("Failed to fetch invoices:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   // Generic form field change
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Product field change + calculation
//   const handleProductChange = (index, field, value) => {
//     setProducts((prev) =>
//       prev.map((p, i) => {
//         if (i !== index) return p;

//         const updated = { ...p };

//         if (
//           [
//             "qty",
//             "freeQty",
//             "rate",
//             "sch",
//             "cd",
//             "GST",
//             "availableQty",
//           ].includes(field)
//         ) {
//           updated[field] = value === "" ? "" : Number(value);
//         } else {
//           updated[field] = value;
//         }

//         // Validation qty + freeQty <= availableQty
//         const qty = Number(updated.qty) || 0;
//         const free = Number(updated.freeQty) || 0;
//         const maxAvailable = Number(updated.availableQty) || 0;

//         if (qty + free > maxAvailable) {
//           if (field === "qty") {
//             updated.qty = Math.max(0, maxAvailable - free);
//           } else if (field === "freeQty") {
//             updated.freeQty = Math.max(0, maxAvailable - qty);
//           }
//           alert(
//             `Total of Quantity + Free cannot exceed available quantity (${maxAvailable})`
//           );
//         }

//         // Recalculate derived fields
//         const rate = Number(updated.rate) || 0;
//         const gst = Number(updated.GST) || 0;
//         const qtyNum = Number(updated.qty) || 0;

//         const basic = ((100 - gst) * rate) / 100;

//         const schAmt = basic * qtyNum * ((Number(updated.sch) || 0) / 100);
//         const cdAmt = basic * qtyNum * ((Number(updated.cd) || 0) / 100);

//         const totalBeforeGst = basic * qtyNum - schAmt - cdAmt;
//         const totalGstAmount = totalBeforeGst * (gst / 100);
//         const total = totalBeforeGst;
//         const amount = total + totalGstAmount;

//         updated.schAmt = schAmt;
//         updated.cdAmt = cdAmt;
//         updated.total = total;
//         updated.totalGstAmount = totalGstAmount;
//         updated.amount = amount;
//         updated.finalAmount = amount;
//         updated.pendingAmount = amount;

//         return updated;
//       })
//     );
//   };

//   // When product is selected from modal
//   const getSelectedProductData = (val) => {
//     if (activeProductIndex === null) {
//       setShowModel(false);
//       return;
//     }

//     setProducts((prev) =>
//       prev.map((p, i) =>
//         i === activeProductIndex
//           ? {
//               ...p,
//               productId: val?._id,
//               itemName: val.productName ?? p.itemName,
//               unit: val.primaryUnit ?? p.unit,
//               primaryUnit: val.primaryUnit ?? p.primaryUnit,
//               secondaryUnit: val.secondaryUnit ?? p.secondaryUnit,
//               rate: Number(val.salesRate) || p.rate,
//               availableQty: Number(val.availableQty) || p.availableQty,
//               GST: Number(val.gstPercent) || p.GST,
//             }
//           : p
//       )
//     );
//     setShowModel(false);
//   };

//   // Add new blank product row
//   const addNewProduct = () => {
//     setProducts((prev) => [...prev, initialProduct]);
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setDisable(true);

//     try {
//       const res = await axios.post("/addsalesmanproductdata/additem", {
//         formData,
//         products,
//       });

//       if (res?.data?.status) {
//         toast.success("Bill created successfully");

//         const data = localStorage.getItem("userData");
//         let salesmanId = "";
//         let salesmanName = "";
//         if (data) {
//           const user = JSON.parse(data);
//           salesmanId = user?._id || user?.data?._id || "";
//           salesmanName = user?.username || user?.data?.username || "";
//         }

//         setFormData({
//           ...initialFormData,
//           salesmanId,
//           salesmanName,
//         });

//         setProducts([initialProduct]);
//         setDisable(false);
//       }
//     } catch (err) {
//       setDisable(false);
//       console.error("Submit failed:", err);
//     } finally {
//       setDisable(false);
//     }
//   };

//   // Fetch shops by location
//   const handlefetchShop = async (location) => {
//     try {
//       const res = await axios.get("/fetchshopname", { params: { location } });
//       setShops(res?.data ?? []);
//     } catch (err) {
//       console.error("Error fetching shop:", err);
//     }
//   };

//   // Calculate grand total
//   const grandTotal = products.reduce((sum, p) => sum + (p.amount || 0), 0);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit}
//         className="p-2 sm:p-4 space-y-6 max-w-7xl mx-auto"
//       >
//         {/* Bill Form */}
//         <div className="space-y-4 border p-4 rounded-lg shadow-sm bg-white">
//           <h2 className="text-lg font-bold mb-2">Bill Details</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {/* Location */}
//             <div className="flex flex-col gap-2">
//               <Label>Location</Label>
//               <Select
//                 value={formData.location}
//                 onValueChange={(val) => {
//                   handleChange("location", val);
//                   handlefetchShop(val);
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Enter location" />
//                 </SelectTrigger>

//                 <SelectContent>
//                   {invoices?.[0]?.salesmanId?.beat
//                     ?.filter(
//                       (beatItem) =>
//                         beatItem?.area && beatItem.area.trim() !== ""
//                     )
//                     .map((beatItem, idx) => (
//                       <SelectItem key={idx} value={beatItem.area}>
//                         {beatItem.area}
//                       </SelectItem>
//                     ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Shop */}
//             <div className="flex flex-col gap-2">
//               <Label>Shop</Label>
//               <Select
//                 value={formData.shop}
//                 onValueChange={(val) => handleChange("shop", val)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select shop" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {shops.map((shop) => (
//                     <SelectItem key={shop._id} value={shop._id}>
//                       {shop.name || "Unnamed Shop"}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Bill Date */}
//             <div className="flex flex-col gap-2">
//               <Label>Bill Date</Label>
//               <Input
//                 type="date"
//                 value={formData.billDate}
//                 onChange={(e) => handleChange("billDate", e.target.value)}
//               />
//             </div>

//             {/* Payment Mode */}
//             <div className="flex flex-col gap-2">
//               <Label>Payment Mode</Label>
//               <Select
//                 value={formData.paymentMode}
//                 onValueChange={(val) => handleChange("paymentMode", val)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select mode" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="null">Selected Payment mode</SelectItem>
//                   <SelectItem value="card">Card</SelectItem>
//                   <SelectItem value="cash">Cash</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Bill Type */}
//             <div className="flex flex-col gap-2">
//               <Label>Bill Type</Label>
//               <Select
//                 value={formData.billType}
//                 onValueChange={(val) => handleChange("billType", val)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="credit">Credit</SelectItem>
//                   <SelectItem value="cash">Cash</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4 border p-4 rounded-lg shadow-sm bg-white">
//           <h2 className="text-lg font-bold mb-2">Product Details</h2>

//           {products.map((product, index) => {
//             const isLastProduct = index === products.length - 1;
//             const isEditing = editingIndex === index;

//             return (
//               <div
//                 key={index}
//                 className={`grid gap-4 border-b pb-4 mb-4 ${
//                   isLastProduct || isEditing
//                     ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
//                     : "grid-cols-1"
//                 }`}
//               >
//                 {/* Summary row for previous products */}
//                 {!isLastProduct && !isEditing ? (
//                   <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                     <span className="font-medium">
//                       {product.itemName || "Item Name"}
//                     </span>
//                     <span>Qty: {product.qty}</span>
//                     <span>Free: {product.freeQty}</span>
//                     <span>Amount: ₹{product.amount.toFixed(2)}</span>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setEditingIndex(index)}
//                     >
//                       Edit
//                     </Button>
//                   </div>
//                 ) : (
//                   // Editable row (last product or editing a previous row)
//                   <>
//                     {/* Item Name */}
//                     <div className="flex flex-col gap-2">
//                       <Label>Item Name</Label>
//                       <Input
//                         type="text"
//                         value={product.itemName}
//                         readOnly
//                         onClick={() => {
//                           setActiveProductIndex(index);
//                           setShowModel(true);
//                         }}
//                         placeholder="Click to select item"
//                       />
//                     </div>

//                     {/* Unit */}
//                     <div className="flex flex-col gap-2">
//                       <Label>Unit</Label>
//                       <Select
//                         value={product.unit}
//                         onValueChange={(val) =>
//                           handleProductChange(index, "unit", val)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select unit" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {product?.primaryUnit && (
//                             <SelectItem value={product.primaryUnit}>
//                               {product.primaryUnit}
//                             </SelectItem>
//                           )}
//                           {product?.secondaryUnit && (
//                             <SelectItem value={product.secondaryUnit}>
//                               {product.secondaryUnit}
//                             </SelectItem>
//                           )}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     {/* Quantity */}
//                     <div className="flex flex-col gap-2">
//                       <Label>Quantity</Label>
//                       <Input
//                         type="text"
//                         value={product.qty}
//                         min={0}
//                         max={Math.max(
//                           0,
//                           (product.availableQty || 0) - (product.freeQty || 0)
//                         )}
//                         onChange={(e) =>
//                           handleProductChange(index, "qty", e.target.value)
//                         }
//                       />
//                       <small className="text-gray-500">
//                         Available:{" "}
//                         {Math.max(
//                           0,
//                           (product.availableQty || 0) - (product.freeQty || 0)
//                         )}
//                       </small>
//                     </div>

//                     {/* Free */}
//                     <div className="flex flex-col gap-2">
//                       <Label>Free</Label>
//                       <Input
//                         type="number"
//                         value={product.freeQty}
//                         min={0}
//                         max={Math.max(
//                           0,
//                           (product.availableQty || 0) - (product.qty || 0)
//                         )}
//                         onChange={(e) =>
//                           handleProductChange(index, "freeQty", e.target.value)
//                         }
//                       />
//                       <small className="text-gray-500">
//                         Max Free:{" "}
//                         {Math.max(
//                           0,
//                           (product.availableQty || 0) - (product.qty || 0)
//                         )}
//                       </small>
//                     </div>

//                     {/* Basic */}
//                     <div className="flex flex-col gap-2">
//                       <Label>Basic</Label>
//                       <Input
//                         type="text"
//                         value={(() => {
//                           const rate = Number(product?.rate) || 0;
//                           const gst = Number(product?.GST) || 0;
//                           const basic = ((100 - gst) * rate) / 100;
//                           return (Number.isFinite(basic) ? basic : 0).toFixed(
//                             2
//                           );
//                         })()}
//                         readOnly
//                       />
//                     </div>

//                     {/* Rate */}
//                     <div className="flex flex-col gap-2">
//                       <Label>Rate</Label>
//                       <Input type="number" value={product.rate} readOnly />
//                     </div>

//                     {/* SCH% */}
//                     <div className="flex flex-col gap-2">
//                       <Label>SCH%</Label>
//                       <Input
//                         type="number"
//                         value={product.sch}
//                         onChange={(e) =>
//                           handleProductChange(index, "sch", e.target.value)
//                         }
//                       />
//                     </div>

//                     {/* SchAmt */}
//                     <div className="flex flex-col gap-2">
//                       <Label>SchAmt</Label>
//                       <Input
//                         type="number"
//                         value={product.schAmt.toFixed(2)}
//                         readOnly
//                       />
//                     </div>

//                     {/* CD% */}
//                     <div className="flex flex-col gap-2">
//                       <Label>CD%</Label>
//                       <Input
//                         type="number"
//                         value={product.cd}
//                         onChange={(e) =>
//                           handleProductChange(index, "cd", e.target.value)
//                         }
//                       />
//                     </div>

//                     {/* CDAmt */}
//                     <div className="flex flex-col gap-2">
//                       <Label>CDAmt</Label>
//                       <Input
//                         type="number"
//                         value={product.cdAmt.toFixed(2)}
//                         readOnly
//                       />
//                     </div>

//                     {/* Total */}
//                     <div className="flex flex-col gap-2">
//                       <Label>Total</Label>
//                       <Input
//                         type="number"
//                         value={product.total.toFixed(2)}
//                         readOnly
//                       />
//                     </div>

//                     {/* GST */}
//                     <div className="flex flex-col gap-2">
//                       <Label>GST</Label>
//                       <Input type="number" value={product.GST} readOnly />
//                     </div>

//                     {/* Amount */}
//                     <div className="flex flex-col gap-2">
//                       <Label>Amount</Label>
//                       <Input
//                         type="number"
//                         value={product.amount.toFixed(2)}
//                         readOnly
//                       />
//                     </div>

//                     {/* Close Edit Button */}
//                     {!isLastProduct && (
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setEditingIndex(null)}
//                       >
//                         Close
//                       </Button>
//                     )}
//                   </>
//                 )}
//               </div>
//             );
//           })}

//           <Button
//             type="button"
//             variant="outline"
//             onClick={addNewProduct}
//             className="mt-2 w-full sm:w-auto"
//           >
//             + Add Product
//           </Button>
//         </div>

//         {/* Grand Total */}
//         <div className="text-right font-bold text-lg">
//           Grand Total: ₹{grandTotal.toFixed(2)}
//         </div>

//         {/* Submit */}
//         <Button disabled={disable} type="submit" className="w-full">
//           {disable ? "Submitting..." : "Submit Bill"}
//         </Button>
//       </form>

//       {showModel && (
//         <ItemNameModel
//           getSelectedProductData={getSelectedProductData}
//           setShowModel={setShowModel}
//         />
//       )}

//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// };

// export default MobileBillForm;

import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import axios from "../../Config/axios";
import ItemNameModel from "../itemNameModel/ItemNameModek";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { AlertTriangle } from "lucide-react";

const MobileBillForm = () => {
  const initialFormData = {
    salesmanId: "",
    salesmanName: "",
    location: "",
    billDate: "",
    paymentMode: "",
    billType: "credit",
    shop: "",
  };

  const initialProduct = {
    productId: "",
    itemName: "",
    unit: "",
    primaryUnit: "",
    secondaryUnit: "",
    qty: 0,
    freeQty: 0,
    rate: 0,
    sch: 0,
    schAmt: 0,
    cd: 0,
    cdAmt: 0,
    total: 0,
    GST: 0,
    totalGstAmount: 0,
    amount: 0,
    finalAmount: 0,
    pendingAmount: 0,
    availableQty: 0,
    isDuplicate: false, // NEW FIELD to detect duplicate item selection
  };

  const [formData, setFormData] = useState(initialFormData);
  const [products, setProducts] = useState([initialProduct]);
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [shops, setShops] = useState([]);
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [disable, setDisable] = useState(false);

  //   --- ADD THESE NEW STATES ---
  const [editingIndex, setEditingIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateItemName, setDuplicateItemName] = useState("");

  // Merge helper
  const mergeDuplicateProductQuantity = (updatedProducts, currentIndex) => {
    const currentProduct = updatedProducts[currentIndex];
    if (!currentProduct || !currentProduct.productId) return updatedProducts;

    const existingIndex = updatedProducts.findIndex(
      (p, i) =>
        i !== currentIndex &&
        p.productId === currentProduct.productId &&
        p.unit === currentProduct.unit
    );

    if (existingIndex !== -1) {
      const existingProduct = { ...updatedProducts[existingIndex] };
      existingProduct.qty =
        (Number(existingProduct.qty) || 0) + (Number(currentProduct.qty) || 0);

      const rate = Number(existingProduct.rate) || 0;
      const gst = Number(existingProduct.GST) || 0;
      const qtyNum = Number(existingProduct.qty) || 0;
      const basic = ((100 - gst) * rate) / 100;
      const schAmt =
        basic * qtyNum * ((Number(existingProduct.sch) || 0) / 100);
      const cdAmt = basic * qtyNum * ((Number(existingProduct.cd) || 0) / 100);
      const totalBeforeGst = basic * qtyNum - schAmt - cdAmt;
      const totalGstAmount = totalBeforeGst * (gst / 100);
      const amount = totalBeforeGst + totalGstAmount;

      existingProduct.schAmt = schAmt;
      existingProduct.cdAmt = cdAmt;
      existingProduct.total = totalBeforeGst;
      existingProduct.totalGstAmount = totalGstAmount;
      existingProduct.amount = amount;
      existingProduct.finalAmount = amount;
      existingProduct.pendingAmount = amount;

      updatedProducts[existingIndex] = existingProduct;
      updatedProducts.splice(currentIndex, 1);
    }

    return updatedProducts;
  };

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      try {
        const user = JSON.parse(data);
        const id = user?._id || user?.data?._id || null;
        const username = user?.username || user?.data?.username || "";
        if (!id) return;
        setFormData((prev) => ({
          ...prev,
          salesmanId: id,
          salesmanName: username,
        }));
      } catch (err) {
        console.error("Failed to parse userData:", err);
      }
    }
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/pro-billing/salesman");
      setInvoices(response.data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index, field, value) => {
    setProducts((prev) => {
      const updatedProducts = prev.map((p, i) => {
        if (i !== index) return p;
        const updated = { ...p };
        if (
          [
            "qty",
            "freeQty",
            "rate",
            "sch",
            "cd",
            "GST",
            "availableQty",
          ].includes(field)
        ) {
          updated[field] = value === "" ? "" : Number(value);
        } else updated[field] = value;

        const qty = Number(updated.qty) || 0;
        const free = Number(updated.freeQty) || 0;
        const maxAvailable = Number(updated.availableQty) || 0;
        if (qty + free > maxAvailable) {
          if (field === "qty") updated.qty = Math.max(0, maxAvailable - free);
          else if (field === "freeQty")
            updated.freeQty = Math.max(0, maxAvailable - qty);
          alert(
            `Total of Quantity + Free cannot exceed available quantity (${maxAvailable})`
          );
        }

        const qtyNum = Number(updated.qty) || 0;
        const rate = Number(updated.rate) || 0;
        const gst = Number(updated.GST) || 0;
        const basic = ((100 - gst) * rate) / 100;
        const schAmt = basic * qtyNum * ((Number(updated.sch) || 0) / 100);
        const cdAmt = basic * qtyNum * ((Number(updated.cd) || 0) / 100);
        const totalBeforeGst = basic * qtyNum - schAmt - cdAmt;
        const totalGstAmount = totalBeforeGst * (gst / 100);
        const amount = totalBeforeGst + totalGstAmount;

        updated.schAmt = schAmt;
        updated.cdAmt = cdAmt;
        updated.total = totalBeforeGst;
        updated.totalGstAmount = totalGstAmount;
        updated.amount = amount;
        updated.finalAmount = amount;
        updated.pendingAmount = amount;

        return updated;
      });

      return mergeDuplicateProductQuantity(updatedProducts, index);
    });
  };

  // ✅ Update: When selecting an item again from dialog
  const getSelectedProductData = (val) => {
    if (activeProductIndex === null) {
      setShowModel(false);
      return;
    }

    setProducts((prev) => {
      const updatedProducts = [...prev];
      const selectedProductId = val?._id;

      const duplicateIndex = updatedProducts.findIndex(
        (p, i) => p.productId === selectedProductId
      );

      if (duplicateIndex !== -1) {
        // Item already selected, show modal instead of merging
        setDuplicateItemName(val.productName || "This item");
        setShowDuplicateModal(true);
        return updatedProducts;
      } else {
        updatedProducts[activeProductIndex] = {
          ...initialProduct,
          productId: selectedProductId,
          itemName: val.productName ?? "",
          unit: val.primaryUnit ?? "",
          primaryUnit: val.primaryUnit ?? "",
          secondaryUnit: val.secondaryUnit ?? "",
          rate: Number(val.salesRate) || 0,
          availableQty: Number(val.availableQty) || 0,
          GST: Number(val.gstPercent) || 0,
          isDuplicate: false,
        };
        return updatedProducts;
      }
    });

    setShowModel(false);
  };

  const addNewProduct = () => {
    const lastProduct = products[products.length - 1];
    const requiredFields = ["itemName", "unit", "qty", "freeQty", "sch", "cd"];
    const errors = {};
    requiredFields.forEach((field) => {
      if (
        lastProduct[field] === "" ||
        lastProduct[field] === null ||
        lastProduct[field] === undefined
      ) {
        errors[field] =
          field.charAt(0).toUpperCase() + field.slice(1) + " is required";
      }
    });
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    const existingIndex = products.findIndex(
      (p, i) =>
        i !== products.length - 1 &&
        p.productId === lastProduct.productId &&
        p.unit === lastProduct.unit
    );
    if (existingIndex !== -1) {
      const updatedProducts = [...products];
      updatedProducts[existingIndex].qty += Number(lastProduct.qty) || 0;
      updatedProducts.pop();
      setProducts(updatedProducts);
    } else {
      setProducts([...products, initialProduct]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const res = await axios.post("/addsalesmanproductdata/additem", {
        formData,
        products,
      });
      if (res?.data?.status) {
        toast.success("Bill created successfully");
        const data = localStorage.getItem("userData");
        let salesmanId = "";
        let salesmanName = "";
        if (data) {
          const user = JSON.parse(data);
          salesmanId = user?._id || user?.data?._id || ""
          salesmanName = user?.username || user?.data?.username || ""
        }
        setFormData({
          ...initialFormData,
          salesmanId,
          salesmanName,
        });
        setProducts([initialProduct])
      }
    } catch (err) {
      console.error("Submit failed:", err)
    } finally {
      setDisable(false)
    }
  }

  const handlefetchShop = async (location) => {
    try {
      const res = await axios.get("/fetchshopname", { params: { location } })
      setShops(res?.data ?? []);
    } catch (err) {
      console.error("Error fetching shop:", err);
    }
  }
  const grandTotal = products.reduce((sum, p) => sum + (p.amount || 0), 0)
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-2 sm:p-4 space-y-6 max-w-7xl mx-auto"
      >
        {/* Bill Form */}
        <div className="space-y-4 border p-4 rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-bold mb-2">Bill Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location */}
            <div className="flex flex-col gap-2">
              <Label>Location</Label>
              <Select
                value={formData.location}
                onValueChange={(val) => {
                  handleChange("location", val);
                  handlefetchShop(val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Enter location" />
                </SelectTrigger>

                <SelectContent>
                  {invoices?.[0]?.salesmanId?.beat
                    ?.filter(
                      (beatItem) =>
                        beatItem?.area && beatItem.area.trim() !== ""
                    )
                    .map((beatItem, idx) => (
                      <SelectItem key={idx} value={beatItem.area}>
                        {beatItem.area}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shop */}
            <div className="flex flex-col gap-2">
              <Label>Shop</Label>
              <Select
                value={formData.shop}
                onValueChange={(val) => handleChange("shop", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shop" />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((shop) => (
                    <SelectItem key={shop._id} value={shop._id}>
                      {shop.name || "Unnamed Shop"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bill Date */}
            <div className="flex flex-col gap-2">
              <Label>Bill Date</Label>
              <Input
                type="date"
                value={formData.billDate}
                onChange={(e) => handleChange("billDate", e.target.value)}
              />
            </div>

            {/* Payment Mode */}
            <div className="flex flex-col gap-2">
              <Label>Payment Mode</Label>
              <Select
                value={formData.paymentMode}
                onValueChange={(val) => handleChange("paymentMode", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Selected Payment mode</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bill Type */}
            <div className="flex flex-col gap-2">
              <Label>Bill Type</Label>
              <Select
                value={formData.billType}
                onValueChange={(val) => handleChange("billType", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Details Form */}
        <div className="space-y-4 border p-4 rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-bold mb-2">Product Details</h2>
          {products.map((product, index) => {
            const isLastProduct = index === products.length - 1;
            const isEditing = editingIndex === index;
            return (
              <div
                key={index}
                className={`grid gap-4 border-b pb-4 mb-4 ${
                  isLastProduct || isEditing
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {/* Summary row for previous products */}
                {!isLastProduct && !isEditing ? (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-gray-50 rounded space-y-2 sm:space-y-0">
                    <span className="font-medium">
                      {product.itemName || "Item Name"}
                    </span>
                    <span>Qty: {product.qty}</span>
                    <span>Free: {product.freeQty}</span>
                    <span>Amount: ₹{product.amount.toFixed(2)}</span>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setViewProduct(product);
                          setShowViewModal(true);
                        }}
                      >
                        Show
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingIndex(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => {
                          setDeleteIndex(index);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Editable row (last product or editing a previous row)
                  <>
                    {/* Item Name */}
                    <div className="flex flex-col gap-2">
                      <Label>Item Name</Label>
                      <Input
                        type="text"
                        value={product.itemName}
                        readOnly
                        onClick={() => {
                          setActiveProductIndex(index);
                          setShowModel(true);
                        }}
                        placeholder="Click to select item"
                        className={formErrors.itemName ? "border-red-500" : ""}
                      />
                      {formErrors.itemName && (
                        <small className="text-red-500">
                          {formErrors.itemName}
                        </small>
                      )}
                    </div>

                    {/* Unit */}
                    <div className="flex flex-col gap-2">
                      <Label>Unit</Label>
                      <Select
                        value={product.unit}
                        onValueChange={(val) =>
                          handleProductChange(index, "unit", val)
                        }
                      >
                        <SelectTrigger
                          className={formErrors.unit ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {product?.primaryUnit && (
                            <SelectItem value={product.primaryUnit}>
                              {product.primaryUnit}
                            </SelectItem>
                          )}
                          {product?.secondaryUnit && (
                            <SelectItem value={product.secondaryUnit}>
                              {product.secondaryUnit}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {formErrors.unit && (
                        <small className="text-red-500">
                          {formErrors.unit}
                        </small>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col gap-2">
                      <Label>Quantity</Label>
                      <Input
                        type="text"
                        value={product.qty}
                        min={0}
                        max={Math.max(
                          0,
                          (product.availableQty || 0) - (product.freeQty || 0)
                        )}
                        onChange={(e) =>
                          handleProductChange(index, "qty", e.target.value)
                        }
                        className={product.qty === 0 ? "border-red-500" : ""}
                      />
                      <small className="text-gray-500">
                        Available:{" "}
                        {Math.max(
                          0,
                          (product.availableQty || 0) - (product.freeQty || 0)
                        )}
                      </small>
                      {product.qty === 0 && (
                        <small className="text-red-500">
                          Quantity is required
                        </small>
                      )}
                    </div>

                    {/* Free */}
                    <div className="flex flex-col gap-2">
                      <Label>Free</Label>
                      <Input
                        type="text"
                        value={product.freeQty}
                        min={0}
                        max={Math.max(
                          0,
                          (product.availableQty || 0) - (product.qty || 0)
                        )}
                        onChange={(e) =>
                          handleProductChange(index, "freeQty", e.target.value)
                        }
                        className={
                          product.freeQty === 0 ? "border-red-500" : ""
                        }
                      />
                      <small className="text-gray-500"> 
                        Max Free:{" "}
                        {Math.max(
                          0,
                          (product.availableQty || 0) - (product.qty || 0)
                        )}
                      </small>
                      {product.freeQty === 0 && (
                        <small className="text-red-500">
                          Free Quantity is required
                        </small>
                      )}
                    </div>

                    {/* Basic */}
                    <div className="flex flex-col gap-2">
                      <Label>Basic</Label>
                      <Input
                        type="text"
                        value={(() => {
                          const rate = Number(product?.rate) || 0;
                          const gst = Number(product?.GST) || 0;
                          const basic = ((100 - gst) * rate) / 100;
                          return (Number.isFinite(basic) ? basic : 0).toFixed(
                            2
                          );
                        })()}
                        readOnly
                      />
                    </div>

                    {/* Rate */}
                    <div className="flex flex-col gap-2">
                      <Label>Rate</Label>
                      <Input type="number" value={product.rate} readOnly />
                    </div>

                    {/* SCH% */}
                    <div className="flex flex-col gap-2">
                      <Label>SCH%</Label>
                      <Input
                        type="text"
                        value={product.sch}
                        onChange={(e) =>
                          handleProductChange(index, "sch", e.target.value)
                        }
                        className={product.sch === 0 ? "border-red-500" : ""}
                      />
                      {product.sch === 0 && (
                        <small className="text-red-500">SCH% is required</small>
                      )}
                    </div>

                    {/* SchAmt */}
                    <div className="flex flex-col gap-2">
                      <Label>SchAmt</Label>
                      <Input
                        type="number"
                        value={product.schAmt.toFixed(2)}
                        readOnly
                      />
                    </div>

                    {/* CD% */}
                    <div className="flex flex-col gap-2">
                      <Label>CD%</Label>
                      <Input
                        type="text"
                        value={product.cd}
                        onChange={(e) =>
                          handleProductChange(index, "cd", e.target.value)
                        }
                        className={product.cd === 0 ? "border-red-500" : ""}
                      />
                      {product.cd === 0 && (
                        <small className="text-red-500">CD% is required</small>
                      )}
                    </div>

                    {/* CDAmt */}
                    <div className="flex flex-col gap-2">
                      <Label>CDAmt</Label>
                      <Input
                        type="number"
                        value={product.cdAmt.toFixed(2)}
                        readOnly
                      />
                    </div>

                    {/* Total */}
                    <div className="flex flex-col gap-2">
                      <Label>Total</Label>
                      <Input
                        type="number"
                        value={product.total.toFixed(2)}
                        readOnly
                      />
                    </div>

                    {/* GST */}
                    <div className="flex flex-col gap-2">
                      <Label>GST</Label>
                      <Input type="number" value={product.GST} readOnly />
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col gap-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={product.amount.toFixed(2)}
                        readOnly
                      />
                    </div>

                    {/* Close Edit Button */}
                    {!isLastProduct && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingIndex(null)}
                      >
                        Close
                      </Button>
                    )}
                  </>
                )}
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={addNewProduct}
            className="mt-2 w-full sm:w-auto"
          >
            + Add Product
          </Button>
        </div>

        {/* Grand Total */}
        <div className="text-right font-bold text-lg">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </div>

        {/* Submit */}
        <Button disabled={disable} type="submit" className="w-full">
          {disable ? "Submitting..." : "Submit Bill"}
        </Button>
      </form>

      {showModel && (
        <ItemNameModel
          getSelectedProductData={getSelectedProductData}
          setShowModel={setShowModel}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[400px] backdrop-blur-md bg-white/90">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="mb-4">Are you sure you want to delete this product?</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="transition-all duration-200 hover:bg-gray-100 hover:scale-105"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setProducts((prev) => prev.filter((_, i) => i !== deleteIndex));
                if (editingIndex === deleteIndex) setEditingIndex(null);
                setShowDeleteModal(false);
                setDeleteIndex(null);
              }}
              className="transition-all duration-200 hover:bg-red-600 hover:scale-105"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* View Product Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[500px] bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-indigo-700">
              Product Details
            </DialogTitle>
          </DialogHeader>

          {viewProduct && (
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Item Name:</p>
                <p className="text-gray-900">{viewProduct.itemName || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Unit:</p>
                <p className="text-gray-900">{viewProduct.unit || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Quantity:</p>
                <p className="text-gray-900">{viewProduct.qty}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Free Qty:</p>
                <p className="text-gray-900">{viewProduct.freeQty}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Rate:</p>
                <p className="text-gray-900">₹{viewProduct.rate.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">GST%:</p>
                <p className="text-gray-900">{viewProduct.GST}%</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">SCH%:</p>
                <p className="text-gray-900">{viewProduct.sch}%</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">CD%:</p>
                <p className="text-gray-900">{viewProduct.cd}%</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Total:</p>
                <p className="text-gray-900">₹{viewProduct.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Amount:</p>
                <p className="text-gray-900">
                  ₹{viewProduct.amount.toFixed(2)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-600">Available Quantity:</p>
                <p className="text-gray-900">{viewProduct.availableQty}</p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex justify-center">
            <Button
              variant="outline"
              className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
              onClick={() => setShowViewModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Alert Modal */}
      <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
        <DialogContent className="w-full max-w-sm sm:max-w-md p-6 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col gap-4 animate-fadeIn">
          <DialogHeader className="flex flex-col items-center gap-2 text-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="text-yellow-600 w-8 h-8" />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
              Duplicate Item Detected
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-600 text-center text-sm sm:text-base">
            <span className="font-medium">{duplicateItemName}</span> has already
            been selected. Please choose a different item.
          </p>

          <DialogFooter className="flex justify-center sm:justify-end">
            <Button
              onClick={() => setShowDuplicateModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileBillForm;

