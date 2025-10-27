import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export function SheetDemo({ isOpen, setIsOpen, productData }) {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(productData || []);
  const [alphaSort, setAlphaSort] = useState(null); // null, "asc", "desc"
  const [priceSort, setPriceSort] = useState(null); // null, "asc", "desc"
  useEffect(() => {
    if (!productData) return;

    let data = [...productData];

    // search filter
    if (search) {
      data = data.filter(
        (item) =>
          item?.productName?.toLowerCase().includes(search.toLowerCase()) ||
          item?.companyId?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // alpha sorting
    if (alphaSort === "asc") {
      data.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (alphaSort === "desc") {
      data.sort((a, b) => b.productName.localeCompare(a.productName));
    }

    // price sorting
    if (priceSort === "asc") {
      data.sort((a, b) => a.mrp - b.mrp); // Low → High
    } else if (priceSort === "desc") {
      data.sort((a, b) => b.mrp - a.mrp); // High → Low
    }

    setFilteredData(data);
  }, [search, productData, alphaSort, priceSort]);

  console.log(productData);
  

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-auto p-2">
        <SheetHeader>
          <SheetTitle>Product Details</SheetTitle>
          <SheetDescription>
            <Input
              placeholder="Search product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SheetDescription>
          <div className="flex justify-between items-center">
            <div
              onClick={() =>
                setAlphaSort(alphaSort === "asc" ? "desc" : "asc") ||
                setPriceSort(null)
              }
              className="bg-blue-700 p-2 rounded w-20 text-white cursor-pointer"
            >
              {alphaSort === "asc" ? "A → Z" : "Z → A"}
            </div>

            <div
              onClick={() =>
                setPriceSort(priceSort === "asc" ? "desc" : "asc") ||
                setAlphaSort(null)
              }
              className="bg-blue-700 p-2 rounded w-28 text-white cursor-pointer"
            >
              {priceSort === "asc" ? "Low → High" : "High → Low"}
            </div>
          </div>
        </SheetHeader>

        <div className="grid grid-cols-2">
          {filteredData?.map((item, index) => (
            <div
              key={index}
              className="border rounded p-2 mb-2 flex flex-col gap-4"
            >
              <img
                src={
                  
                  item?.productImg
                    ? `https://agency-backend-cqiy.onrender.com/public/images/${item?.productImg}`
                    : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                }
                alt={item?.productName || "Product"}
                className="w-full h-32 object-cover"
              />
              <div>
                <h1>
                  <span className="font-bold">Product Name: </span>
                  {item?.productName}
                </h1>
                <h1>
                  <span className="font-bold">MRP Price: </span>₹{item?.mrp}
                </h1>
                <h1>
                  <span className="font-bold">Sale Price: </span>₹
                  {item?.salesRate}
                </h1>
                <h1>
                  <span className="font-bold">Brand: </span>
                  {item?.companyId?.name || "NAN"}
                </h1>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
