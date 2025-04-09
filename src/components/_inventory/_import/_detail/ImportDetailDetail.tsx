
"use client";
import React, { useState } from "react";
import { Box, Typography, Button, Collapse, Grid, Alert } from "@mui/material";
import { ImportDetailItem, AuditLog } from "@/type/importdetail";

// Component xử lý hiển thị một mảng với nút collapse riêng
interface CollapsibleArrayProps {
  data: any[];
}
const CollapsibleArray: React.FC<CollapsibleArrayProps> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box sx={{ ml: 2 }}>
      <Button variant="text" onClick={() => setOpen((prev) => !prev)}>
        {open ? "Hide Items" : "Show Items"}
      </Button>
      <Collapse in={open}>
        {data.map((item, index) => (
          <Box key={index} sx={{ ml: 2, mt: 1 }}>
            <RenderValue value={item} />
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

// Component đệ quy để render một giá trị (primitive, object, hoặc mảng)
interface RenderValueProps {
  value: any;
}
const RenderValue: React.FC<RenderValueProps> = ({ value }) => {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value !== "object") {
    return <Typography variant="body2">{String(value)}</Typography>;
  }

  // Nếu là mảng
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return <CollapsibleArray data={value} />;
  }

  // Nếu là object
  const entries = Object.entries(value).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  if (entries.length === 0) return null;
  return (
    <Box sx={{ ml: 2 }}>
      {entries.map(([key, val]) => (
        <Box key={key} sx={{ mb: 1 }}>
          <Typography variant="body2">
            <strong>{key}:</strong>{" "}
            {typeof val === "object" ? <RenderValue value={val} /> : String(val)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

interface ImportDetailDetailsProps {
  details: ImportDetailItem[];
  auditLogs: AuditLog[];
}

const ImportDetailDetails: React.FC<ImportDetailDetailsProps> = ({ details, auditLogs }) => {
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [openAudit, setOpenAudit] = useState<boolean>(false);

  const handleToggleDetails = () => setOpenDetails((prev) => !prev);
  const handleToggleAudit = () => setOpenAudit((prev) => !prev);

  // Hàm renderChangeData sử dụng RenderValue để xử lý đệ quy
  const renderChangeData = (changeData: string): React.ReactNode => {
    if (!changeData) return null;
    try {
      const parsed = JSON.parse(changeData);
      return <RenderValue value={parsed} />;
    } catch (error) {
      return <Typography variant="body2">{changeData}</Typography>;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Import Details */}
      <Button variant="outlined" onClick={handleToggleDetails} sx={{ mb: 1 }}>
        {openDetails ? "Hide Import Details" : "Show Import Details"}
      </Button>
      <Collapse in={openDetails}>
        {details.map((detail) => (
          <Box
            key={detail.importDetailId}
            sx={{ ml: 2, mt: 1, borderBottom: "1px solid #ccc", pb: 1, mb: 1 }}
          >
            <Typography variant="body1">
              <strong>Product Variant ID:</strong> {detail.productVariantId}
            </Typography>
            <Typography variant="body1">
              <strong>Quantity:</strong> {detail.quantity}
            </Typography>
            <Typography variant="body1">
              <strong>Product Variant Name:</strong> {detail.productVariantName || "-"}
            </Typography>
            <Box sx={{ ml: 2, mt: 1 }}>
              <Typography variant="body1">
                <strong>Store Allocations:</strong>
              </Typography>
              {detail.storeDetails.map((store) => {
                const missing = store.allocatedQuantity - store.actualQuantity;
                return (
                  <Box key={store.storeId} sx={{ ml: 2, mt: 0.5 }}>
                    <Typography variant="body2">
                      <strong>Store ID:</strong> {store.storeId} - <strong>Name:</strong> {store.storeName} -{" "}
                      <strong>Allocated:</strong> {store.allocatedQuantity} - <strong>Actual:</strong>{" "}
                      {store.actualQuantity} - <strong>Staff:</strong> {store.staffName} -{" "}
                      <strong>Status:</strong> {store.status.trim()}
                    </Typography>
                    {missing > 0 &&
                      store.status.trim() === "Shortage" && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          Missing {missing} item{missing > 1 ? "s" : ""}
                        </Alert>
                      )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Collapse>

      {/* Audit Logs */}
      <Button variant="outlined" onClick={handleToggleAudit} sx={{ mt: 2, mb: 1 }}>
        {openAudit ? "Hide Audit Logs" : "Show Audit Logs"}
      </Button>
      <Collapse in={openAudit}>
        {auditLogs.map((log) => (
          <Box
            key={log.auditLogId}
            sx={{ ml: 2, mt: 1, borderBottom: "1px solid #ccc", pb: 1, mb: 1 }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Audit Log ID:</strong> {log.auditLogId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Table:</strong> {log.tableName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Operation:</strong> {log.operation}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Changed By:</strong> {log.changedBy}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Change Date:</strong> {log.changeDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Comment:</strong> {log.comment}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Change Data:</strong>
                </Typography>
                {renderChangeData(log.changeData)}
              </Grid>
            </Grid>
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

export default ImportDetailDetails;
