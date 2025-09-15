import { Box, Button } from "@mui/material";
import LogoImage from "../assets/Group.svg";
import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <Box
      component="nav"
      display="flex"
      alignItems="center"
      padding="8px 16px"
      sx={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <Box
        component="img"
        src={LogoImage}
        alt="logo"
        sx={{ height: 10, cursor: "pointer" }}
        onClick={() => navigate("/home")}
      />
      <Box
        component="div"
        display="flex"
        alignItems="center"
        gap={10}
        sx={{
          textTransform: "uppercase",
          ml: 35,
          fontSize: "0.6rem",
          fontWeight: "bold",
        }}
      >
        <NavLink to="/about">About</NavLink>
        <NavLink to="/order">order</NavLink>
        <NavLink to="/profile">myPage</NavLink>
      </Box>
      <Button
        variant="text"
        sx={{
          textTransform: "uppercase",
          fontWeight: 500,
          ml: 30,
          fontSize: "0.6rem",
          color: "black",
        }}
      >
        Login
      </Button>
    </Box>
  );
}
