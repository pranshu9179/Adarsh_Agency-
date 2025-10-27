import React, { useEffect,useState } from "react";
import axios from "axios";

const SalesManWindow = () => {
  const [salesmen, setSalesmen] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, custRes] = await Promise.all([
          axios.get("/salesman"),
          axios.get("/customer"),
        ]);

        setSalesmen(salesRes.data); // 👈 save API data to state
        setCustomers(custRes.data);

        console.log(salesRes);
        console.log(custRes);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center">
        <table>
          <thead>
            <tr>
              <th>area name</th>
              <th>No of Shop</th>
              <th>No. of salesman assign</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>chola</td>
              <td>15</td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SalesManWindow;
