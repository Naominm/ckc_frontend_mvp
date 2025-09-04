import { Paper, Typography, Button, TextField, Alert } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/auth");
      }
      try {
        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
        setEmail(response.data.email);
        setReferralCode(response.data.referral_code);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth");
        } else {
          console.error(
            "profile fetch error",
            err.response?.data || err.message,
          );
          setMessage("Failed to fetch profile");
        }
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const copyReferralCode = () => {
    if (referralCode) navigator.clipboard.writeText(referralCode);
    setMessage("Referral code copied");
  };
  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      {name && (
        <Typography variant="body1">
          Welcome back, <strong>{name}</strong> 👋
        </Typography>
      )}

      {email && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {email}
        </Typography>
      )}

      {message && <Alert severity="info">{message}</Alert>}

      <TextField
        label="Your Referral Code"
        value={referralCode || ""}
        fullWidth
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Button onClick={copyReferralCode} variant="outlined">
              Copy
            </Button>
          ),
        }}
        sx={{ mt: 2 }}
      />
    </Paper>
  );
}
