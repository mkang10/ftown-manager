export const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "#b0bec5";  // Màu xám nhẹ nhàng, tạo cảm giác chờ đợi, phù hợp với phong cách tối giản
    case "Approved":
      return "#388e3c";  // Màu xanh lá cây đậm, tượng trưng cho sự chấp nhận, ổn định
    case "Rejected":
      return "#d32f2f";  // Màu đỏ đậm, tượng trưng cho sự từ chối
    case "Processing":
      return "#ff9800";  // Màu cam sáng, thể hiện quá trình xử lý, nhưng không quá chói mắt
    case "Done":
      return "#00796b";  // Màu xanh ngọc trầm, biểu thị sự hoàn tất, mang lại cảm giác yên tâm
    case "Partial Success":
      return "#ffa000";  // Màu vàng đậm, tượng trưng cho thành công một phần, nhẹ nhàng
    case "Supplement Created":
      return "#4caf50";  // Màu xanh lá cây nhạt, tượng trưng cho việc bổ sung mới, tạo cảm giác dễ chịu
    default:
      return "#b0bec5";  // Màu xám nhẹ mặc định cho trạng thái chưa xác định
  }
};
