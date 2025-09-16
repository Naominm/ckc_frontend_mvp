import { Paper, Typography, Button, Alert, Box } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDropDown } from "@mui/icons-material";
import chackanLogo from "../assets/logo.svg";

interface ReferralNode {
  nickname: string;
  children?: ReferralNode[];
}

interface LevelEarning {
  level: number;
  total: number;
  sentence: string;
}

function ReferralTree({ node }: { node: ReferralNode }) {
  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Box sx={{ display: "inline-block", margin: "auto" }}>
        <Box
          sx={{
            borderRadius: "50%",
            width: 50,
            height: 50,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <img src={chackanLogo} alt="logo" style={{ width: 20, height: 20 }} />
        </Box>
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          {node.nickname}
        </Typography>
      </Box>

      {node.children && node.children.length > 0 && (
        <Box sx={{ mt: 4, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "2px",
              height: 20,
              bgcolor: "#000",
              transform: "translateX(-50%)",
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              mt: 2,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                bgcolor: "#000",
                margin: "0 auto",
                width: "100%",
                maxWidth: `${node.children.length * 120}px`,
              }}
            />
            {node.children.map((child, idx) => (
              <Box key={idx} sx={{ position: "relative", px: 2 }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    width: "2px",
                    height: 20,
                    bgcolor: "#000",
                    transform: "translateX(-50%)",
                  }}
                />
                <ReferralTree node={child} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function Profile() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [, setName] = useState<string | null>(null);
  const [, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [referralTree, setReferralTree] = useState<ReferralNode | null>(null);

  const [levelEarnings, setLevelEarnings] = useState<LevelEarning[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [totalSentence] = useState<string>("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const normalizeNode = (apiNode: any): ReferralNode => ({
    nickname: apiNode.nickname || apiNode.name || "Unknown",
    children: apiNode.children ? apiNode.children.map(normalizeNode) : [],
  });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/auth");
        return;
      }
      try {
        // Profile
        const response = await axios.get(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
        setEmail(response.data.email);
        setReferralCode(response.data.referral_code);

        // Tree
        const treeRes = await axios.get(`${API_URL}/api/referrals/tree`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReferralTree(normalizeNode(treeRes.data));

        // Earnings
        const earningsRes = await axios.get(`${API_URL}/api/rewards/levels`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLevelEarnings(earningsRes.data.levels);
        setTotalEarnings(earningsRes.data.total);
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
    <Paper elevation={0} sx={{ p: 3, width: "100%", mx: "auto" }}>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}
      >
        <Typography variant="h4">My Page</Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000", color: "#fff" }}
        >
          Referral
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/wallet")}
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
        <Button variant="contained" onClick={() => navigate("/orders/new")}>
          make an order
        </Button>
      </Box>

      {message && <Alert severity="info">{message}</Alert>}
      <Box
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

      {/* Credit */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ gap: 2, mt: 2 }}
      >
        <Typography variant="body2">Your Total Credit</Typography>
        <Typography variant="h6" sx={{ color: "var(--text-color)" }}>
          $ {totalEarnings}
        </Typography>
      </Box>

      {/* Transfer */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 2 }}
      >
        <Button
          variant="contained"
          sx={{ color: "#000", backgroundColor: "#fff", ml: 10 }}
        >
          Transfer <ArrowDropDown />
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Referral tree
      </Typography>
      {referralTree ? (
        <ReferralTree node={referralTree} />
      ) : (
        <Typography variant="body2">No referrals yet.</Typography>
      )}

      {/* Earnings per level */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Earnings by Level
      </Typography>

      {levelEarnings.map((lvl) => (
        <Box key={lvl.level} sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {lvl.sentence}
          </Typography>
        </Box>
      ))}

      {/* Grand total */}
      <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
        {totalSentence}
      </Typography>
    </Paper>
  );
}
