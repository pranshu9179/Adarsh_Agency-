import React from "react";
import "./PrintStyles.css"; // Include the custom print CSS

const Test = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container-fluid mt-3">
      <button
        className="btn btn-primary d-print-none mb-3"
        onClick={handlePrint}
      >
        Print Bill
      </button>

      <div id="print-section" className="p-3 border">
        <div className="text-center">
          <h5 className="mb-1">ADARSH AGENCY</h5>
          <small>
            H.NO.02, Nagar Nigam Colony, Timber Market, Chhola, Bhopal <br />
            Mob: 9926793332, 9893315590 <br />
            GSTIN: 23BENPR0816K1ZB
          </small>
        </div>

        <hr />

        <div
          className="d-flex justify-content-between mb-2"
          style={{ fontSize: "0.85rem" }}
        >
          <div>
            <strong>To:</strong> M/s SULTANA KIRANA L<br />
            Near Sana Kirana, Lal Ghati
            <br />
            Contact: 7415793921
            <br />
            GSTIN: --
          </div>
          <div>
            <strong>Bill No:</strong> 2599
            <br />
            <strong>Bill Date:</strong> 14/05/2025
            <br />
            <strong>Salesman:</strong> 8871584223 (JAIN)
            <br />
            <strong>Type:</strong> Credit
          </div>
        </div>

        <table
          className="table table-bordered table-sm"
          style={{ fontSize: "0.75rem" }}
        >
          <thead className="text-center">
            <tr>
              <th>SR</th>
              <th>PARTICULARS</th>
              <th>HSN CODE</th>
              <th>MRP</th>
              <th>QTY</th>
              <th>FREE</th>
              <th>RATE</th>
              <th>SCH%</th>
              <th>SCH.AMT</th>
              <th>CD%</th>
              <th>TAXABLE AMT</th>
              <th>SGST%</th>
              <th>CGST%</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>AWAL PICKLE MANGO 1KG</td>
              <td>20019000</td>
              <td>165.00</td>
              <td>8</td>
              <td>0</td>
              <td>93.75</td>
              <td>0</td>
              <td>0.00</td>
              <td>0</td>
              <td>750.00</td>
              <td>6.00</td>
              <td>6.00</td>
              <td>840.00</td>
            </tr>
            {/* Add other rows in the same format */}
            <tr>
              <td colSpan="10" className="text-end">
                <strong>Total</strong>
              </td>
              <td>3183.93</td>
              <td colSpan="2">382.08</td>
              <td>
                <strong>3566.01</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          className="d-flex justify-content-between mt-3"
          style={{ fontSize: "0.8rem" }}
        >
          <div style={{ width: "65%" }}>
            <p>
              <strong>Note:</strong>
            </p>
            <ul style={{ paddingLeft: "1rem" }}>
              <li>Goods once sold will not be taken back.</li>
              <li>Cheque bounce charges Rs. 500/-</li>
              <li>Credit 7 days only.</li>
              <li>Subject to Bhopal Jurisdiction.</li>
            </ul>
            <p>
              <strong>E. & O.E.</strong>
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p>
              <strong>SGST AMT:</strong> 191.04
            </p>
            <p>
              <strong>CGST AMT:</strong> 191.04
            </p>
            <p>
              <strong>Rs:</strong> Three Thousand Five Hundred Sixty Six Only
            </p>
            <p className="mt-4">
              <strong>Authorised Signatory</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
