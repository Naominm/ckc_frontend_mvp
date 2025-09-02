import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import image from "../assets/logo.png";

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 4,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <Box
          component="img"
          src={image}
          alt="logo"
          sx={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            objectFit: "cover",
            p: 1,
            boxShadow: 2,
          }}
        />
        <Typography variant="h5" fontWeight="bold">
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to your Chakancha account
        </Typography>
      </Box>
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
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          required
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
          sx={{
            background: "linear-gradient(to right, #60a5fa, #6d28d9)",
            textTransform: "none",
          }}
        >
          Login
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
