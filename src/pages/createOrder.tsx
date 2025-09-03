import { useState } from "react";
import { Alert, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";

export default function CreateOrder() {
  const [productId, setProductId] = useState("");
  const [quantity, SetQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [price, setPrice] = useState(0);

  const handleCreateOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("you must be logged in to place an order");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/order",
        {
          items: [
            {
              productId,
              quantity,
              price,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessage(`Order created successfully: `);
    } catch (err: any) {
      setMessage("Failed to create an order. Try again");
    } finally {
    }
  };
  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h6">Create an order</Typography>
      {message && (
        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          {message}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Product ID"
        value={productId}
        onChange={(e) => {
          setProductId(e.target.value);
        }}
        margin="normal"
      />
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
    </Paper>
  );
}
