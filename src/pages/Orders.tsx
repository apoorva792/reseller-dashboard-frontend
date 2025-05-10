
import React from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      
      <div className="card-neumorph p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/30">
                <td className="py-3 px-4">
                  <Link to="/orders/SP-12345" className="text-primary hover:underline">
                    SP-12345
                  </Link>
                </td>
                <td className="py-3 px-4">Apr 15, 2023</td>
                <td className="py-3 px-4">Jane Smith</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Shipped
                  </span>
                </td>
                <td className="py-3 px-4">$136.99</td>
              </tr>
              <tr className="border-b hover:bg-muted/30">
                <td className="py-3 px-4">
                  <Link to="/orders/SP-12346" className="text-primary hover:underline">
                    SP-12346
                  </Link>
                </td>
                <td className="py-3 px-4">Apr 12, 2023</td>
                <td className="py-3 px-4">John Davis</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Processing
                  </span>
                </td>
                <td className="py-3 px-4">$89.50</td>
              </tr>
              <tr className="border-b hover:bg-muted/30">
                <td className="py-3 px-4">
                  <Link to="/orders/SP-12347" className="text-primary hover:underline">
                    SP-12347
                  </Link>
                </td>
                <td className="py-3 px-4">Apr 10, 2023</td>
                <td className="py-3 px-4">Maria Rodriguez</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Delivered
                  </span>
                </td>
                <td className="py-3 px-4">$212.30</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
