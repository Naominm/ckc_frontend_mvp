import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
} from "@mui/material";
import axios from "axios";
import FormHeader from "./formHeader";

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        identifier: email,
        password,
      });
      setSuccess("Login successfully");
      localStorage.setItem("token", response.data.token);
    } catch (err: any) {
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong, please try again.");
      }
    } finally {
      setLoading(false);
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
      <FormHeader
        title="welcome Back"
        subtitle=" Sign in to your Chakancha account"
      />
      {error && (
        <Alert severity="error" sx={{ fontSize: "small" }}>
          {error}
        </Alert>
      )}
      {success && <Alert severity="success">{success}</Alert>}
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          size="small"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
          />
          <Link href="#" variant="body2" underline="hover">
            Forgot password?
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="medium"
          fullWidth
          disabled={loading}
          sx={{
            background: "linear-gradient(to right, #60a5fa, #6d28d9)",
            textTransform: "none",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Typography variant="body2" align="center" mt={2}>
          Don’t have an account?{" "}
          <Link component="button" onClick={onSwitchToSignup} underline="hover">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default Login;
