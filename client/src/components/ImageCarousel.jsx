import Slider from "react-slick";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ArrowStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,
  color: "#fff",
  backgroundColor: "rgba(0,0,0,0.4)",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  transition: "opacity 0.3s",
  opacity: 0,
};

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{ ...ArrowStyle, left: 10 }}
    className="carousel-arrow"
  >
    <ArrowBackIos />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{ ...ArrowStyle, right: 10 }}
    className="carousel-arrow"
  >
    <ArrowForwardIos />
  </IconButton>
);

export default function ImageCarousel({ images = [] }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 450,
        "&:hover .carousel-arrow": {
          opacity: 1,
        },
      }}
    >
      <Slider {...settings}>
        {images.map((img, index) => (
          <Box
            key={index}
            component="img"
            src={img.url}
            alt={`img-${index}`}
            sx={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: 2,
              maxHeight: "45vh",
            }}
          />
        ))}
      </Slider>
    </Box>
  );
}
