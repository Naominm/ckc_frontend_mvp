import { useState } from "react";
import { Alert, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";

export default function CreateOrder() {
  const [price, setPrice] = useState(0);
  const [quantity, SetQuantity] = useState(1);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [captureDetails, setCaptureDetails] = useState<any | null>(null);

  const token = localStorage.getItem("token");
  const handleCreateOrder = async () => {
    try {
      if (!token) {
        setMessage("you must be logged in to place an order");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/order",
        { items: [{ quantity, price }] },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrderId(response.data.order.id);
      setPaypalOrderId(response.data.payment.providerOrderId);
      setApprovalUrl(response.data.approvalUrl);

      setMessage(`Order created successfully: #${response.data.order.id}`);
    } catch (err: any) {
      setMessage("Failed to create an order. Try again");
    }
  };
  const handleCaptureOrder = async () => {
    if (!paypalOrderId) {
      setMessage("No PayPal order to capture");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/order/capture",
        { paypalOrderId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCaptureDetails(response.data);
      setMessage("Order captured successfully ✅");
      console.log("Capture response:", response.data);
    } catch (err: any) {
      setMessage("Failed to capture order. Try again");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h6">Create an order</Typography>
      {message && (
        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          {message}
        </Alert>
      )}
      <TextField
        fullWidth
        type="number"
        label="Quantity"
        margin="normal"
        value={quantity}
        onChange={(e) => {
          SetQuantity(Number(e.target.value));
        }}
      />
      <TextField
        fullWidth
        type="number"
        label="price"
        margin="normal"
        value={price}
        onChange={(e) => {
          setPrice(Number(e.target.value));
        }}
      />
      <Button variant="contained" onClick={handleCreateOrder}>
        Place Order
      </Button>

      {approvalUrl && (
        <>
          <Button
            variant="outlined"
            sx={{ mt: 0, ml: 2 }}
            onClick={() => window.open(approvalUrl, "_blank")}
          >
            Approve on PayPal
          </Button>
        </>
      )}
      {/* {captureDetails && (
        <Paper sx={{ mt: 3, p: 2, bgcolor: "#f9f9f9" }}>
          <Typography variant="subtitle1" gutterBottom>
            Order Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography>Order ID: {captureDetails.orderId}</Typography>
          <Typography>
            Buyer Discount: ${captureDetails.buyerDiscount.toFixed(2)}
          </Typography>

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Referral Bonuses:
          </Typography>
          <List dense>
            {captureDetails.referralChain.map((ref: any, idx: number) => (
              <ListItem key={idx}>
                Level {ref.level + 1}: {ref.name} ({ref.email}) — Bonus: $
                {ref.bonus.toFixed(2)}
              </ListItem>
            ))}
          </List>
        </Paper>
      )} */}
    </Paper>
  );
}
