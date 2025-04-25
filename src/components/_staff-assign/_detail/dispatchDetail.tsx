"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { getDispatchById } from "@/ultis/dispatch";
import { DispatchDetail, DispatchResponseDto } from "@/type/dispatchdetail";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const DispatchDetailPage: React.FC = () => {
  const params = useParams();
  const id = Number(params?.id);
  const [data, setData] = useState<DispatchResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    getDispatchById(id)
      .then(setData)
      .catch((err) => setError(err.message || "Lỗi tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={10}>
        {error}
      </Typography>
    );

  if (!data)
    return (
      <Typography align="center" mt={10}>
        Không tìm thấy dữ liệu Dispatch.
      </Typography>
    );

  const { jsonDispatchGet, auditLogs } = data;
  const {
    dispatchId,
    createdByUser,
    createdDate,
    status,
    referenceNumber,
    remarks,
    originalId,
    completedDate,
    details,
  } = jsonDispatchGet;
  ;

  return (
    <Box sx={{ p: 4, backgroundColor: "#fafafa", minHeight: "100vh", color: "#212121" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Chi Tiết Phiếu Xuất #{dispatchId}
      </Typography>
      <Divider sx={{ mb: 3, borderColor: "#e0e0e0" }} />

      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          mb: 3,
          backgroundColor: "#fff",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Chi tiết" />
          <Tab label="Sản phẩm" />
          <Tab label="Lịch sử đơn xuất" />
        </Tabs>
      </Paper>

      <TabPanel value={tabIndex} index={0}>
        <Card
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          <Grid container spacing={2}>
            {[
              ["Người Tạo Đơn", createdByUser],
              ["Ngày Tạo Đơn", new Date(createdDate).toLocaleString()],
              ["Trạng Thái", status],
              ["Mã Xuất Hàng.", referenceNumber],
              ["Đánh Dấu", remarks || "-"],
              ["Mã Gốc", originalId ?? "-"],
              ["Ngày Hoàn Thành", completedDate ?? "-"],
            ].map(([label, val]) => (
              <Grid item xs={12} sm={6} md={4} key={label.toString()}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {label}
                </Typography>
                {label === "Status" ? (
                  <Chip
                    label={status}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderRadius: "6px",
                      textTransform: "capitalize",
                      ...(status === "Done"
                        ? {
                          color: "#388e3c",
                          borderColor: "#388e3c",
                          backgroundColor: "#e8f5e9",
                        }
                        : status === "Pending"
                          ? {
                            color: "#f57c00",
                            borderColor: "#f57c00",
                            backgroundColor: "#fff3e0",
                          }
                          : status === "Processing"
                            ? {
                              color: "#1976d2",
                              borderColor: "#1976d2",
                              backgroundColor: "#e3f2fd",
                            }
                            : status === "Handled"
                              ? {
                                color: "#6a1b9a",
                                borderColor: "#6a1b9a",
                                backgroundColor: "#f3e5f5",
                              }
                              : status === "Failed" || status === "Error"
                                ? {
                                  color: "#d32f2f",
                                  borderColor: "#d32f2f",
                                  backgroundColor: "#fdecea",
                                }
                                : {
                                  color: "#757575",
                                  borderColor: "#bdbdbd",
                                  backgroundColor: "#f5f5f5",
                                }),
                    }}
                  />
                ) : (
                  <Typography variant="body1">{val}</Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </Card>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Typography variant="h6" gutterBottom>
          Danh sách chi tiết
        </Typography>
        <Table sx={{ backgroundColor: "#fff", border: "1px solid #e0e0e0" }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {[
                "Mã chi tiết",
                "Biến thể",
                "Số lượng",
                "Đơn giá",
                "Kho xuất",
                "Đã phân bổ",
                "Trạng thái",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{ fontWeight: 600, color: "#212121" }}
                  align={["Số lượng", "Đơn giá", "Đã phân bổ"].includes(header) ? "right" : "left"}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {details.map((d: DispatchDetail) => (
              <TableRow
                key={d.dispatchDetailId}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <TableCell>{d.dispatchDetailId}</TableCell>
                <TableCell>{d.variantName}</TableCell>
                <TableCell align="right">{d.quantity}</TableCell>
                <TableCell align="right">0 VND</TableCell>
                <TableCell>{d.storeExportDetail[0]?.warehouseName}</TableCell>
                <TableCell align="right">{d.storeExportDetail[0]?.allocatedQuantity}</TableCell>
                <TableCell>
                  <Chip
                    label={status}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderRadius: "6px",
                      textTransform: "capitalize",
                      ...(status === "Done"
                        ? {
                          color: "#388e3c",
                          borderColor: "#388e3c",
                          backgroundColor: "#e8f5e9",
                        }
                        : status === "Pending"
                          ? {
                            color: "#f57c00",
                            borderColor: "#f57c00",
                            backgroundColor: "#fff3e0",
                          }
                          : status === "Processing"
                            ? {
                              color: "#1976d2",
                              borderColor: "#1976d2",
                              backgroundColor: "#e3f2fd",
                            }
                            : status === "Handled"
                              ? {
                                color: "#6a1b9a",
                                borderColor: "#6a1b9a",
                                backgroundColor: "#f3e5f5",
                              }
                              : status === "Failed" || status === "Error"
                                ? {
                                  color: "#d32f2f",
                                  borderColor: "#d32f2f",
                                  backgroundColor: "#fdecea",
                                }
                                : {
                                  color: "#757575",
                                  borderColor: "#bdbdbd",
                                  backgroundColor: "#f5f5f5",
                                }),
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography variant="h6" gutterBottom>
          Lịch Sử Xuất Hàng
        </Typography>
        {auditLogs.length === 0 ? (
          <Typography color="text.secondary">Không có log.</Typography>
        ) : (
          auditLogs.map((log) => (
            <Card
              key={log.auditLogId}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                boxShadow: "none",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {log.operation} bởi {log.changedBy} lúc {new Date(log.changeDate).toLocaleString()}
              </Typography>
              {log.comment && (
                <Typography variant="body2" mt={1} color="text.primary">
                  {log.comment}
                </Typography>
              )}
            </Card>
          ))
        )}
      </TabPanel>
    </Box>
  );

};

export default DispatchDetailPage;
