import { Box, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/HighlightOff";

export default function ImageManager({ oldImages, setOldImages }) {
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "content-box",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: 1,
      }}
    >
      {oldImages.map((item) => (
        <Box key={item._id} sx={{ position: "relative" }}>
          <Box
            component="img"
            srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
            loading="lazy"
            sx={{
              objectFit: "contain",
              border: "1px solid black",
              width: "10vw",
              height: "10vw",
              minWidth: "100px",
              minHeight: "100px",
            }}
          />
          <IconButton
            sx={{ position: "absolute", top: 0, right: 0 }}
            onClick={() => {
              const copy = oldImages.filter((el) => el._id !== item._id);
              setOldImages(copy);
            }}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
