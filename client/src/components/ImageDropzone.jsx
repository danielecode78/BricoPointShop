import { useDropzone } from "react-dropzone";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import CancelIcon from "@mui/icons-material/HighlightOff";
import { useState } from "react";

export default function ImageDropzone({ onFilesChange }) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
  });

  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #3f51b5",
        borderRadius: 2,
        p: 2,
        textAlign: "center",
        backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
        cursor: "pointer",
        width: "100%",
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="body2" mb={2}>
        Trascina qui le immagini o clicca per selezionarle
      </Typography>

      <Grid container spacing={2}>
        {files.map((file, index) => (
          <Grid key={index}>
            <Box sx={{ position: "relative" }}>
              <img
                crossOrigin="anonymous"
                src={file.preview}
                alt={`preview-${index}`}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <CancelIcon
                  fontSize="large"
                  sx={{
                    color: "error.main",
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
