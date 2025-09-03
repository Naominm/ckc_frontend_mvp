import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import FormHeader from "./formHeader";

interface SignupProps {
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {
        name,
        email,
        password,
      });
      setSuccess("signup success");
      localStorage.setItem("token", response.data.token);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "something went wrong");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "80%",
        p: 4,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <FormHeader title="Join Chakancha" subtitle="create an account " />
      <Typography variant="h5" fontWeight="bold" align="center">
        Sign Up
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Box component="div" sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="name"
            type="text"
            variant="outlined"
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          size="medium"
          fullWidth
          sx={{
            mt: 1,
            background: "linear-gradient(to right, #60a5fa, #6d28d9)",
          }}
        >
          Sign Up
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center">
        Already have an account?{" "}
        <Button
          variant="text"
          size="small"
          onClick={onSwitchToLogin}
          sx={{ textTransform: "none", color: "primary.main" }}
        >
          Login
        </Button>
      </Typography>
    </Paper>
  );
};

export default Signup;
