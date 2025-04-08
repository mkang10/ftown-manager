import React from "react";
import Image from "next/image";

interface Employee {
  name: string;
  tasks: number;
  image: string;
  description: string;
}

const TopEmployees: React.FC = () => {
  const employees: Employee[] = [
    {
      name: "John Smith",
      tasks: 52,
      image: "/assets/ava3.avif",
      description: "John luôn hoàn thành nhiệm vụ với chất lượng cao và hiệu quả.",
    },
    {
      name: "Alice Johnson",
      tasks: 47,
      image: "/assets/ava1.avif",
      description: "Alice đặc biệt xuất sắc trong việc xử lý đơn hàng và trả hàng.",
    },
    {
      name: "Michael Lee",
      tasks: 45,
      image: "/assets/ava3.avif",
      description: "Michael phụ trách nhập hàng, khuyến mãi, luôn nhanh và chính xác.",
    },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-md p-4 transition hover:shadow-lg">
      <h2 className="font-semibold text-gray-800 mb-4">Top Employees of the Month</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {employees.map((emp, idx) => (
          <div
            key={idx}
            className="bg-white/60 backdrop-blur-sm rounded-md shadow p-4 flex flex-col transition hover:shadow-md"
          >
            <Image
              src={emp.image}
              alt={emp.name}
              width={300}
              height={200}
              className="rounded object-cover w-full h-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{emp.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{emp.tasks} tasks completed</p>
            <p className="text-sm text-gray-700">{emp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopEmployees;
