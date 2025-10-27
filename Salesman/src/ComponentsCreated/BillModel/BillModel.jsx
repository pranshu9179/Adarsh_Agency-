import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BillModel = ({ passBillModelData, setShowModel }) => {
  console.log(passBillModelData);

  return (
    <Dialog defaultOpen={true} onOpenChange={() => setShowModel(false)}>
      <DialogContent className="sm:max-w-[700px]">
        <Table className="w-full max-w-6xl mx-auto">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>SR NO.</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Free</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Scheme %</TableHead>
              <TableHead>Scheme</TableHead>
              <TableHead>CD %</TableHead>
              <TableHead>CDAMT</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passBillModelData?.billing?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item?.itemName}</TableCell>
                <TableCell>{Number(item?.qty || 0).toFixed(2)}</TableCell>
                <TableCell>{item?.unit}</TableCell>
                <TableCell>{Number(item?.Free || 0).toFixed(2)}</TableCell>
                <TableCell>{Number(item?.rate || 0).toFixed(2)}</TableCell>
                <TableCell>{Number(item?.sch || 0).toFixed(2)}</TableCell>
                <TableCell>{Number(item?.schAmt || 0).toFixed(2)}</TableCell>
                <TableCell>{Number(item?.cd || 0).toFixed(2)}</TableCell>
                <TableCell>{Number(item?.cdAmt || 0).toFixed(2)}</TableCell>
                <TableCell>{Number(item?.gst || 0).toFixed(2)}</TableCell>
                <TableCell>{Number(item?.total || 0).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default BillModel;
