import { Paper, Typography, Button, Alert, Box } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDropDown } from "@mui/icons-material";

interface ReferralNode {
  nickname: string;
  children?: ReferralNode[];
}

function ReferralTree({ node }: { node: ReferralNode }) {
  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Typography variant="body2" fontWeight="bold">
        {node.nickname}
      </Typography>
      {node.children && node.children.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
          {node.children.map((child, idx) => (
            <ReferralTree key={idx} node={child} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function Profile() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [referralTree, setReferralTree] = useState<ReferralNode | null>(null);

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
        const treeRes = await axios.get(
          "http://localhost:5000/api/referrals/tree",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setReferralTree(treeRes.data); // 👈 backend should return ReferralNode object
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
    <Paper elevation={0} sx={{ p: 3, Width: "100%", mx: "auto" }}>
      <Box
        component="div"
        sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}
      >
        <Typography variant="h4">My Page</Typography>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          borderBottom: "var(--primary-color)",
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000", color: "#fff" }}
        >
          Referral
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#fff", color: "#000" }}
        >
          Purchase History
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#fff", color: "#000" }}
        >
          Personal Details
        </Button>
      </Box>
      {/* {name && (
        <Typography variant="body1">
          Welcome back, <strong>{name}</strong> 👋
        </Typography>
      )} */}

      {/* {email && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {email}
        </Typography>
      )} */}

      {message && <Alert severity="info">{message}</Alert>}

      <Box
        component="div"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ gap: 4, mt: 4 }}
      >
        <Typography variant="body2">Referral Code</Typography>
        <Typography variant="h6" sx={{ color: "var(--text-color)" }}>
          {referralCode || ""}
        </Typography>
        <Button size="small" onClick={copyReferralCode} variant="text">
          Copy
        </Button>
      </Box>
      <Box
        component="div"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ gap: 2, mt: 2 }}
      >
        <Typography variant="body2">Your Credit</Typography>
        <Typography variant="h6" sx={{ color: "var(--text-color)" }}>
          ###
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={() => {
          navigate("/orders/new");
        }}
      >
        make an order
      </Button>
      <Box
        component="div"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 2, borderRadius: "20px" }}
      >
        <Button
          variant="contained"
          sx={{
            color: "#000",
            backgroundColor: "#fff",
            borderBottom: "var(--primary-color)",
            ml: 10,
          }}
        >
          Transfer {<ArrowDropDown />}
        </Button>
      </Box>
      <Typography variant="h6"> Referral tree</Typography>
      {referralTree ? (
        <ReferralTree node={referralTree} />
      ) : (
        <Typography variant="body2">No referrals yet.</Typography>
      )}
    </Paper>
  );
}
