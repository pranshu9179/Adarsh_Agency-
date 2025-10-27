// ✅ GET /api/ledgers/customer/:customerId

const getLedgersByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    const ledgers = await Ledger.find({ customerId })
      .populate("customerId", "name")
      .populate("refId"); // refId will show invoice if linked

    res.status(200).json({
      message: "Ledgers fetched successfully",
      count: ledgers.length,
      ledgers,
    });
  } catch (error) {
    console.error("[getLedgersByCustomerId] Error:", error);
    res.status(500).json({ error: error.message });
  }
};



