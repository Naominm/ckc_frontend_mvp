import { Box, Typography } from "@mui/material";
import image from "../assets/logo.png";
interface formProps {
  title: String;
  subtitle: String;
}
export default function FormHeader({ title, subtitle }: formProps) {
  return (
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
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
}
