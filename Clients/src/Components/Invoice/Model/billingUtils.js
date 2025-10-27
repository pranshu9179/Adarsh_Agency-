// All calculation helpers, just copy from your logic (NO logic changes)
// Example:
export function recalculateRow(row) {
  const qty = parseFloat(row.Qty) || 0;
  const schPercent = parseFloat(row.Sch) || 0;
  const cdPercent = parseFloat(row.CD) || 0;
  const gstPercent = parseFloat(row.GST) || 0;

  const rateWithGst = parseFloat(row.Rate) || 0;
  const rateWithoutGst = rateWithGst / (1 + gstPercent / 100);
  const basicRate = rateWithoutGst.toFixed(2);

  const basicTotal = rateWithoutGst * qty;
  const schAmt = (basicTotal * schPercent) / 100;
  const cdAmt = (basicTotal * cdPercent) / 100;
  const discountedTotal = basicTotal - schAmt - cdAmt;
  const finalAmount = discountedTotal + (discountedTotal * gstPercent) / 100;

  return {
    ...row,
    Basic: basicRate,
    Total: discountedTotal.toFixed(2),
    SchAmt: schAmt.toFixed(2),
    CDAmt: cdAmt.toFixed(2),
    Amount: finalAmount.toFixed(2),
  };
}

export function getVirtualStockMap(rows, products) {
  const usedQtyMap = {};
  rows.forEach((row) => {
    if (row.product && row.Qty) {
      const pid = row.product._id;
      usedQtyMap[pid] = (usedQtyMap[pid] || 0) + parseFloat(row.Qty || 0);
    }
  });
  const stockMap = {};
  products.forEach((prod) => {
    stockMap[prod._id] = prod.availableQty - (usedQtyMap[prod._id] || 0);
  });
  return stockMap;
}
