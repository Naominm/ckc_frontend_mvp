import { Box, Typography } from "@mui/material";
import HeroImage from "../assets/hero.svg";

export default function HomePage() {
  return (
    <Box component="div">
      <Typography
        variant="h1"
        sx={{ fontSize: "3rem", fontWeight: "bold", mb: 2 }}
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
        }}
      />
    </Box>
  );
}
