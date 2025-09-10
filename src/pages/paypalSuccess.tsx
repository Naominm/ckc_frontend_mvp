import { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";

export default function PayPalSuccess() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [captureDetails, setCaptureDetails] = useState<any | null>(null);

  useEffect(() => {
    const capturePayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const paypalOrderId = params.get("token");
        const token = localStorage.getItem("token");

        if (!paypalOrderId || !token) {
          setMessage("Missing PayPal order ID or user token");
          return;
        }

        const res = await axios.post(
          "http://localhost:5000/api/order/capture",
          { paypalOrderId },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setCaptureDetails(res.data);
        setMessage("Payment captured successfully ✅");
      } catch (err) {
        console.error("Capture failed:", err);
        setMessage("Failed to capture payment");
      } finally {
        setLoading(false);
      }
    };

    capturePayment();
  }, []);

  if (loading) {
    return (
      <Paper
        sx={{ p: 4, mt: 5, maxWidth: 500, mx: "auto", textAlign: "center" }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Processing your payment...</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        maxWidth: "full",
        mx: "auto",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {message && (
        <Alert severity={captureDetails ? "success" : "error"} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {captureDetails && (
        <>
          <Typography variant="h6" sx={{ borderBottom: "1px solid #e0e0e0" }}>
            Your Payment has been completed successfully
          </Typography>
          <Typography
            variant="body2"
            sx={{ borderBottom: "1px solid #e0e0e0" }}
          >
            Thank you for your purchase! You can view order details in{" "}
            <b>Purchase History under MyPage order Number</b>{" "}
            {captureDetails.orderId}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography>Order ID: {captureDetails.orderId}</Typography>
          <Typography>
            Buyer Discount: ${captureDetails.buyerDiscount.toFixed(2)}
          </Typography>
          <Typography>
            Order Amount: $
            {captureDetails?.orderAmount
              ? Number(captureDetails.orderAmount).toFixed(2)
              : "N/A"}
          </Typography>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Referral Bonuses:
          </Typography>
          {captureDetails.referralChain.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Level</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Bonus ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {captureDetails.referralChain.map((ref: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{ref.level + 1}</TableCell>
                    <TableCell>{ref.name}</TableCell>
                    <TableCell>{ref.email}</TableCell>
                    <TableCell align="right">{ref.bonus.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No referral bonuses</Typography>
          )}
        </>
      )}
    </Paper>
  );
}
