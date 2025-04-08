import React from "react";

interface Order {
  id: string;
  customer: string;
  status: string;
  total: string;
}

const OrdersTable: React.FC = () => {
  const orders: Order[] = [
    { id: "ORD001", customer: "Alice", status: "Confirmed", total: "$120" },
    { id: "ORD002", customer: "Bob", status: "Pending", total: "$80" },
    { id: "ORD003", customer: "Charlie", status: "Delivered", total: "$150" },
    { id: "ORD004", customer: "Daisy", status: "Cancelled", total: "$60" },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-md p-4 transition hover:shadow-lg">
      <h2 className="font-semibold text-gray-800 mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-800">
          <thead>
            <tr className="text-sm text-gray-600 border-b border-gray-300">
              <th className="py-2">Order ID</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Status</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={idx}
                className="text-sm border-b border-gray-200 last:border-0 hover:bg-white/40 transition"
              >
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.customer}</td>
                <td className="py-2">{order.status}</td>
                <td className="py-2">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
