
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import type { Annotation } from '../types';

interface SidebarProps {
  annotations: Annotation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

function AnnotationSidebar({
  annotations,
  selectedId,
  onSelect,
  onDelete,
}: SidebarProps) {
  return (
    <Box className="sidebar">
      <Typography variant="h6">
        Annotations ({annotations.length})
      </Typography>

      <Divider sx={{ my: 2 }} />

      {annotations.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          No annotations yet. Draw a box on the image.
        </Typography>
      ) : (
        <List>
          {annotations.map((annotation) => (
            <ListItem key={annotation.id} disablePadding>
              <ListItemButton
                selected={selectedId === annotation.id}
                onClick={() => onSelect(annotation.id)}
              >
                <ListItemText
                  primary={annotation.label}
                  secondary={`X: ${Math.round(annotation.x)}, Y: ${Math.round(annotation.y)}`}
                />

                <Button
                  color="error"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(annotation.id);
                  }}
                >
                  Delete
                </Button>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default AnnotationSidebar;
