import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Paper, IconButton, Typography, Box, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function InputFeatures({ formValues, setFormValues }) {
  const [inputValue, setInputValue] = useState("");

  const handleAddFeature = () => {
    const newFeature = inputValue.trim();
    if (newFeature === "" || formValues.features.includes(newFeature)) return;

    setFormValues((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));
    setInputValue("");
  };

  const handleDelete = (item) => {
    setFormValues((prev) => ({
      ...prev,
      features: prev.features.filter((el) => el !== item),
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(formValues.features);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setFormValues({ ...formValues, features: reordered });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 0.5,
          }}
        >
          <TextField
            label="Aggiungi le caratteristiche del prodotto"
            variant="outlined"
            fullWidth
            name="features"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddFeature();
              }
            }}
          />
          <IconButton
            aria-label="add feature"
            onClick={(e) => {
              e.preventDefault();
              handleAddFeature();
            }}
          >
            <AddIcon sx={{ color: "#3f51b5", height: "35px", width: "auto" }} />
          </IconButton>
        </Box>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="caratteristiche">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "100%",
                }}
              >
                {formValues.features.map((item, index) => (
                  <Draggable
                    key={`feature-${index}-${item}`}
                    draggableId={`${item}-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        elevation={0}
                        sx={{
                          padding: 0.5,
                          border: "solid 1px gray",
                          pl: 1.5,
                          pr: 0.6,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          {item}
                        </Typography>
                        <IconButton onClick={() => handleDelete(item)}>
                          <CloseIcon />
                        </IconButton>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </>
  );
}
