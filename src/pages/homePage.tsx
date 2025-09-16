import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import HeroImage from "../assets/hero.svg";
import axios from "axios";

interface TopUser {
  rank: number;
  username: string;
  nickname: string;
  total: number;
}

export default function HomePage() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const { data } = await axios.get<TopUser[]>(`${API_URL}/api/top-users`);
        setTopUsers(data);
      } catch (err) {
        console.error("Failed to fetch top users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <Box sx={{ height: "auto", backgroundColor: "var(--primary-color)" }}>
      <Typography
        variant="h1"
        sx={{ fontSize: "4rem", fontWeight: "bold", mb: 2, p: 3 }}
      >
        One Sip. <br /> One Change.
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 350,
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          mx: "auto",
          mb: 4,
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 4, p: 4 }}>
        <Typography variant="h6">
          Who has <br /> the most credit
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {loading ? (
            <CircularProgress />
          ) : topUsers.length === 0 ? (
            <Typography>No users found</Typography>
          ) : (
            topUsers.map((user) => (
              <Button
                key={user.rank}
                variant="outlined"
                sx={{
                  width: "10rem",
                  fontSize: "0.5rem",
                  whiteSpace: "normal",
                }}
              >
                {user.rank}. <br /> <br /> @{user.nickname} <br /> ${user.total}
              </Button>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
