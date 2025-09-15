import { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Box,
  Button,
} from "@mui/material";

import SuccessCard from "../components/successCard";

export default function PayPalSuccess() {
  const [loading, setLoading] = useState(true);
  const [_message, setMessage] = useState<string | null>(null);
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

        console.log("Capture response:", res.data);

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
      elevation={0}
      sx={{
        p: 3,
        maxWidth: "full",
        mx: "auto",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "var[--primary-color]",
      }}
    >
      {/* {message && (
        <Alert severity={captureDetails ? "success" : "error"} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )} */}

      {captureDetails && (
        <>
          {captureDetails.isFirstPayment ? (
            <Box
              textAlign="center"
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography sx={{ mb: 2 }}>
                <SuccessCard />
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 2, width: "100%", textAlign: "center" }}
              >
                Thank you for your purchase! You can view order details in{" "}
                <b>Purchase History under MyPage order Number</b>{" "}
                {captureDetails.orderId}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
                You have completed your first purchase Congratulations !
              </Typography>
              <Typography variant="body1">
                We are exited to give you your referral code
              </Typography>
              <Box
                component="div"
                sx={{
                  backgroundColor: "var(--table-bg)",
                  fontWeight: "bold",
                  mt: 2,
                  width: "50%",
                  borderRadius: "10px",
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1">
                  Your referral code has been successfully assigned
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", mt: 2, color: "var(--text-color)" }}
                >
                  {captureDetails.referralCode}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Share this code to invite others and receive bonus rewards.
                  Your referral code is available in your myPage.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Copy Code
                </Button>
              </Box>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                <Button variant="outlined">View Order details</Button>
                <Button variant="outlined">Home page</Button>
              </Box>
            </Box>
          ) : (
            // Normal Payment Success Page
            <>
              <SuccessCard />
              <Typography
                variant="body2"
                sx={{ mt: 2, width: "100%", textAlign: "center" }}
              >
                Thank you for your purchase! You can view order details in{" "}
                <b>Purchase History under MyPage order Number</b>{" "}
                {captureDetails.orderId}
              </Typography>
              <Box
                component="div"
                sx={{ display: "flex", flexDirection: "column", mt: 2, gap: 2 }}
              >
                <Button variant="outlined">View order Details</Button>
                <Button variant="outlined">Home page</Button>
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 5 }}>
                Bonuses distributed to your uplines (when you buy)
              </Typography>
              {Array.isArray(captureDetails.referralChain) &&
              captureDetails.referralChain.length > 0 ? (
                <Table
                  size="small"
                  style={{
                    backgroundColor: "var(--table-bg)",
                    width: "50%",
                    marginTop: 2,
                    borderRadius: "10px",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Upline</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell align="right">Bonus ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {captureDetails.referralChain.map(
                      (ref: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{ref.name}</TableCell>
                          <TableCell>{ref.level}</TableCell>
                          <TableCell align="right">
                            {ref.bonus.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No bonuses distributed</Typography>
              )}

              <Typography variant="subtitle2" sx={{ mt: 5 }}>
                Credit Earned from your referrals
              </Typography>
              {Array.isArray(captureDetails.myRewardsFromChildren) &&
              captureDetails.myRewardsFromChildren.length > 0 ? (
                <Table
                  size="small"
                  style={{
                    backgroundColor: "var(--table-bg)",
                    width: "50%",
                    marginTop: 2,
                    borderRadius: "10px",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Referral</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell align="right">rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {captureDetails.myRewardsFromChildren.map(
                      (ref: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{ref.childName}</TableCell>
                          <TableCell>{ref.level}</TableCell>
                          <TableCell align="right">{ref.rate}</TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No referral bonuses</Typography>
              )}
            </>
          )}
        </>
      )}
      <Box sx={{ borderBottom: "1px solid #e0e0e0" }}></Box>
    </Paper>
  );
}
