export const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "grey.500";
    case "Approved":
      return "success.main";
    case "Rejected":
      return "error.main";
    case "Processing":
      return "#ffc107"; // màu vàng
    case "Done":
      return "#00695c"; // màu xanh đậm
    case "Partial Success":
      return "#FFA726"; // màu cam đậm (để biểu thị đơn có hàng thiếu)
    default:
      return "grey.500";
  }
};
