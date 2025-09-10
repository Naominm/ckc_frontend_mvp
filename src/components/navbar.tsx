import { Box, Button } from "@mui/material";
import LogoImage from "../assets/Group.svg";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <Box
      component="nav"
      display="flex"
      alignItems="center"
      padding="8px 16px"
      sx={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <Box component="img" src={LogoImage} alt="logo" sx={{ height: 10 }} />
      <Box
        component="div"
        display="flex"
        alignItems="center"
        gap={10}
        sx={{ textTransform: "uppercase", ml: 35, fontSize: "0.6rem" }}
      >
        <NavLink to="/about">About</NavLink>
        <NavLink to="/product">Product</NavLink>
        <NavLink to="/about">Recipe</NavLink>
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
