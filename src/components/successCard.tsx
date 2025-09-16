import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SuccessCard() {
  const [, setCaptureDetails] = useState<any | null>(null);
  useEffect(() => {
    const capturePayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const paypalOrderId = params.get("token");
        const token = localStorage.getItem("token");

        if (!paypalOrderId || !token) {
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const response = await axios.post(
          `${API_URL}/api/order/capture`,
          { paypalOrderId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setCaptureDetails(response.data);
      } catch (err) {
        console.error("Capture failed:", err);
      } finally {
      }
    };

    capturePayment();
  }, []);
  return (
    <Box component="div">
      <Typography
        variant="h6"
        sx={{
          width: "100%",
          textAlign: "center",
          borderBottom: "1px solid #e0e0e0",
          mb: 2,
        }}
      >
        Your Payment has been completed successfully. <br />
        <br />
      </Typography>
    </Box>
  );
}
