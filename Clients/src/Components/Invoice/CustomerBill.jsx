import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import axios from "../../Config/axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BillingTableRow from "./Model/BillingTableRow";
import NumericInputModal from "./Model/NumericInputModal";
import ProductSelectionModal from "./Model/ProductSelectionModal";
import { recalculateRow, getVirtualStockMap } from "./Model/billingUtils";

const defaultRow = {
  product: null,
  Qty: "",
  Unit: "",
  Free: "",
  Basic: "",
  Rate: "",
  Sch: "0.00",
  SchAmt: "",
  CD: "0.00",
  CDAmt: "",
  Total: "",
  GST: "",
  Amount: 0,
};

const fields = [
  "SR",
  "ItemName",
  "Qty",
  "Unit",
  "Free",
  "Basic",
  "Rate",
  "Sch",
  "SchAmt",
  "CD",
  "CDAmt",
  "Total",
  "GST",
  "Amount",
];

const CustomerBill = ({ onBillingDataChange }, ref) => {
  const [rows, setRows] = useState([{ ...defaultRow }]);
  const [products, setProducts] = useState([]);
  const [finalTotalAmount, setFinalTotalAmount] = useState("0.00");

  // State for modals
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [schemeValue, setSchemeValue] = useState("");
  const [showCDModal, setShowCDModal] = useState(false);
  const [cdValue, setCDValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Refs
  const qtyRefs = useRef([]);
  const selectRefs = useRef({});
  const selectRef = useRef();
  const rowRefs = useRef([]);

  // Product search
  const [filterText, setFilterText] = useState("");

  // --- Effects for fetch and modals ---

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/product");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  // --- Imperative exposed method ---
  useImperativeHandle(ref, () => ({
    focusItemName: () => {
      selectRef.current?.focus();
    },
  }));

  // --- Handlers ---
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    let row = { ...updatedRows[index], [field]: value };

    // All your update logic for Qty, product, unit...
    if (field === "product") {
      row.product = value;
      row.GST = parseFloat(value.gstPercent) || 0;
      row.Unit = value.primaryUnit || "";
      const baseRate = parseFloat(value.salesRate) || 0;
      row.Rate = !isNaN(baseRate) ? baseRate.toFixed(2) : "";
    }
    if (field === "Unit" && row.product) {
      const baseRate = parseFloat(row.product.salesRate) || 0;
      row.Rate = !isNaN(baseRate) ? baseRate.toFixed(2) : "";
    }
    if (field === "Qty" && row.product) {
      const qtyNum = parseFloat(value);
      if (!isNaN(qtyNum) && qtyNum > 0) {
        if (qtyNum > row.product.availableQty) {
          toast.error(
            `${row.product.productName} has only ${row.product.availableQty} in stock.`,
            { position: "top-center", autoClose: 3000 }
          );
          return;
        }
        const baseRate = parseFloat(row.product.salesRate) || 0;
        row.Rate = !isNaN(baseRate) ? baseRate.toFixed(2) : "";
      }
    }
    row = recalculateRow(row); // Keep your calculation logic!
    updatedRows[index] = row;
    setRows(updatedRows);

    updateBillingData(updatedRows);
  };

  const updateBillingData = (updatedRows) => {
    const finalTotal = updatedRows
      .reduce((sum, r) => sum + (parseFloat(r.Amount) || 0), 0)
      .toFixed(2);
    setFinalTotalAmount(finalTotal);

    const filteredBillingData = updatedRows
      .filter(
        (r) =>
          r.product !== null &&
          r.Qty !== "" &&
          !isNaN(parseFloat(r.Qty)) &&
          parseFloat(r.Qty) > 0
      )
      .map((r) => ({
        productId: r.product._id,
        itemName: r.product.productName,
        hsnCode: r.product.hsnCode,
        unit: r.Unit,
        qty: parseFloat(r.Qty),
        Free: parseFloat(r.Free) || 0,
        rate: parseFloat(r.Basic),
        sch: parseFloat(r.Sch) || 0,
        schAmt: parseFloat(r.SchAmt) || 0,
        cd: parseFloat(r.CD) || 0,
        cdAmt: parseFloat(r.CDAmt) || 0,
        total: parseFloat(r.Total) || 0,
        gst: parseFloat(r.GST) || 0,
        amount: parseFloat(r.Amount) || 0,
      }));

    onBillingDataChange(filteredBillingData, finalTotal);
  };

  // --- KeyDown-handler (pass to row component) ---

  const handleKeyDown = (e, rowIndex) => {
    const isEnter = e.key === "Enter";
    const isAltN = e.key === "F2";
    const isEscape = e.key === "Escape";

    if (e.key === "F7") {
      e.preventDefault();
      setShowSchemeModal(true);
      return;
    }

    if (e.key === "F8") {
      e.preventDefault();
      setShowCDModal(true);
      return;
    }

    if (e.key === "F4") {
      e.preventDefault();

      const selectInstance = selectRefs.current[rowIndex];
      if (selectInstance) {
        selectInstance.focus(); // ✅ ✅ ✅ बस यही सही है!
      } else {
        console.warn("❌ No Select instance found for row:", rowIndex);
      }
      return;
    }

    const focusableSelectors =
      "input:not([readonly]), select, .react-select__input input";
    const allFocusable = Array.from(
      document.querySelectorAll(focusableSelectors)
    );

    const currentIndex = allFocusable.indexOf(e.target);

    // LEFT ←
    if (e.key === "ArrowLeft") {
      const cursorAtStart =
        e.target.selectionStart === 0 && e.target.selectionEnd === 0;
      if (cursorAtStart) {
        e.preventDefault();
        const prev = allFocusable[currentIndex - 1];
        if (prev) prev.focus();
      }
      return;
    }

    // RIGHT →
    if (e.key === "ArrowRight") {
      const cursorAtEnd = e.target.selectionStart === e.target.value?.length;
      if (cursorAtEnd) {
        e.preventDefault();
        const next = allFocusable[currentIndex + 1];
        if (next) next.focus();
      }
      return;
    }

    // ===== UP / DOWN Arrow movement between rows =====
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const inputMatrix = getInputMatrix();

      let targetRow = -1;
      let targetCol = -1;

      for (let row = 0; row < inputMatrix.length; row++) {
        for (let col = 0; col < inputMatrix[row].length; col++) {
          if (inputMatrix[row][col] === e.target) {
            targetRow = row;
            targetCol = col;
            break;
          }
        }
        if (targetRow !== -1) break;
      }

      if (targetRow !== -1) {
        e.preventDefault();
        const nextRow = e.key === "ArrowUp" ? targetRow - 1 : targetRow + 1;

        if (inputMatrix[nextRow] && inputMatrix[nextRow][targetCol]) {
          inputMatrix[nextRow][targetCol].focus();
        }
      }

      return;
    }

    if (isEscape) {
      e.preventDefault();

      // Try going to previous input
      const prev = allFocusable[currentIndex - 1];

      if (prev) {
        prev.focus();
      } else {
        // Now manually focus React Select input

        const selectInstance = selectRefs.current[rowIndex];
        const reactSelectInput = selectInstance?.select?.inputRef;

        if (reactSelectInput) {
          reactSelectInput.focus();
        } else {
          console.warn("❌ React-Select inputRef not found");
        }
      }

      return;
    }

    // ===== Alt + N or Enter on last input: Add new row =====
    if ((isAltN || isEnter) && rowIndex === rows.length - 1) {
      const isLastInput = currentIndex === allFocusable.length - 1;

      if (isAltN || isLastInput) {
        e.preventDefault();
        const newRows = [...rows, { ...defaultRow }];
        setRows(newRows);

        // Focus first input of new row after DOM update
        setTimeout(() => {
          const updatedFocusable = Array.from(
            document.querySelectorAll(focusableSelectors)
          );
          updatedFocusable[allFocusable.length]?.focus(); // first input of new row
        }, 50);
        return;
      }
    }

    // ===== Enter: Normal move to next input =====
    if (isEnter) {
      e.preventDefault();
      const next = allFocusable[currentIndex + 1];
      if (next) {
        next.focus();
      } else {
        allFocusable[0]?.focus(); // fallback
      }
      return;
    }

    // ===== Delete row shortcut =====
    if ((e.key === "Delete" || e.key === "F3") && rows.length > 1) {
      e.preventDefault();
      const updatedRows = rows.filter((_, i) => i !== rowIndex);
      setRows(updatedRows);

      const filteredBillingData = updatedRows
        .filter(
          (r) =>
            r.product !== null &&
            r.Qty !== "" &&
            !isNaN(parseFloat(r.Qty)) &&
            parseFloat(r.Qty) > 0
        )
        .map((r) => ({
          productId: r.product._id,
          itemName: r.product.productName,
          hsnCode: r.product.hsnCode,
          unit: r.Unit,
          qty: parseFloat(r.Qty),
          Free: parseFloat(r.Free) || 0,
          rate: parseFloat(r.Basic),
          sch: parseFloat(r.Sch) || 0,
          schAmt: parseFloat(r.SchAmt) || 0,
          cd: parseFloat(r.CD) || 0,
          cdAmt: parseFloat(r.CDAmt) || 0,
          total: parseFloat(r.Total) || 0,
          gst: parseFloat(r.GST) || 0,
          amount: parseFloat(r.Amount) || 0,
        }));

      const recalculatedFinalTotal = updatedRows
        .reduce((sum, r) => {
          const amt = parseFloat(r.Amount);
          return sum + (isNaN(amt) ? 0 : amt);
        }, 0)
        .toFixed(2);

      setFinalTotalAmount(recalculatedFinalTotal);
      onBillingDataChange(filteredBillingData, recalculatedFinalTotal);
    }
  };

  // --- Scheme/CD Modal Apply ---
  const applySchemeToAll = () => {
    const updatedRows = rows.map((row) =>
      recalculateRow({ ...row, Sch: schemeValue })
    );
    setRows(updatedRows);
    updateBillingData(updatedRows);
    setShowSchemeModal(false);
  };
  const applyCDToAll = () => {
    const updatedRows = rows.map((row) =>
      recalculateRow({ ...row, CD: cdValue })
    );
    setRows(updatedRows);
    updateBillingData(updatedRows);
    setShowCDModal(false);
  };

  // --- Product Search Modal helpers ---
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(filterText.toLowerCase())
  );
  const virtualStockMap = getVirtualStockMap(rows, products);

  // --- Render ---
  return (
    <div
      className="mt-4"
      style={{
        width: "100vw",
        padding: "0 1rem",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <h2 className="text-center mb-4">Product Invoice </h2>
      <div className="mt-3 p-3 bg-light border rounded">
        <h5>Total Items: {rows.length}</h5>
        <div className="d-flex align-items-center gap-4 text-muted mb-0">
          <strong>Shortcuts:</strong>
          <div className="d-flex align-items-center gap-3">
            <span>
              <strong>New Line:</strong> Enter / F2
            </span>
            <span>
              <strong>Save Row:</strong> Enter
            </span>
            <span>
              <strong>Delete Row:</strong> Delete / F3
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="table-responsive"
        style={{ maxHeight: "70vh", overflowX: "auto", overflowY: "auto" }}
      >
        <table
          className="table table-bordered text-center"
          style={{
            border: "2px solid #dee2e6",
            borderRadius: "8px",
            minWidth: "1200px",
          }}
        >
          <thead className="table-secondary">
            <tr>
              {fields.map((field, idx) => (
                <th key={idx}>
                  {field === "Sch" ? "Sch%" : field === "CD" ? "CD%" : field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <BillingTableRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                fields={fields}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                qtyRef={(el) => (qtyRefs.current[rowIndex] = el)}
                selectRef={(el) => (selectRefs.current[rowIndex] = el)}
                setShowModal={setShowModal}
                setSelectedRowIndex={setSelectedRowIndex}
              />
            ))}
            <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
              <td colSpan={fields.length - 1} className="text-start">
                Final Amount: ₹ <span>{finalTotalAmount}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- MODALS --- */}
      <ProductSelectionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        products={filteredProducts}
        filterText={filterText}
        setFilterText={setFilterText}
        selectedRowIndex={selectedRowIndex}
        handleSelectProduct={(product) => {
          handleChange(selectedRowIndex, "product", product);
          setShowModal(false);
          setTimeout(() => {
            qtyRefs.current[selectedRowIndex]?.focus();
          }, 100);
        }}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        rowRefs={rowRefs}
        virtualStockMap={virtualStockMap}
      />

      <NumericInputModal
        show={showSchemeModal}
        onClose={() => setShowSchemeModal(false)}
        title="Apply Scheme for All Items"
        value={schemeValue}
        setValue={setSchemeValue}
        onApply={applySchemeToAll}
      />
      <NumericInputModal
        show={showCDModal}
        onClose={() => setShowCDModal(false)}
        title="Apply Cash Discount (CD) for All Items"
        value={cdValue}
        setValue={setCDValue}
        onApply={applyCDToAll}
      />
    </div>
  );
};

export default forwardRef(CustomerBill);
