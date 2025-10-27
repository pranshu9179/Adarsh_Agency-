import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "../../Config/axios";
import { toast, ToastContainer } from "react-toastify";

const ItemNameModel = ({ getSelectedProductData, setShowModel }) => {
  //   console.log(passBillModelData);

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState([]);

  const showAllProduct = async () => {
    setLoading(true);
    try {
      const purRes = await axios.get("/product/salesman");
      console.log(purRes?.data?.data);
      setProductData(purRes?.data?.data || []);

      //   setShowSheet(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch initial data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showAllProduct();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Dialog defaultOpen={true} onOpenChange={() => setShowModel(false)}>
      <DialogContent className="sm:max-w-[700px]">
        {/* <div className="w-full max-w-6xl mx-auto">
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
            <Table className="w-full max-w-6xl mx-auto"> */}
        <div className="max-h-[400px] overflow-y-auto">
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>SR NO.</TableHead>
                  {/* <TableHead>Bill No.</TableHead> */}
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>MRP</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>GST%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productData?.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => {
                      getSelectedProductData(item);
                      setShowModel(false); // closes after selecting
                    }}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item?.productName}</TableCell>
                    <TableCell>{item?.availableQty}</TableCell>
                    <TableCell>{item?.primaryUnit}</TableCell>
                    <TableCell>{item?.mrp}</TableCell>
                    <TableCell>{item?.salesRate}</TableCell>
                    <TableCell>{item?.gstPercent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemNameModel;
