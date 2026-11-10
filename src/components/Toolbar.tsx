
import { useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { DefectLabel } from '../types';

interface ToolbarProps {
  label: DefectLabel;
  onLabelChange: (label: DefectLabel) => void;
  onUpload: (file: File) => void;
  onExport: () => void;
  hasImage: boolean;
}

function Toolbar({
  label,
  onLabelChange,
  onUpload,
  onExport,
  hasImage,
}: ToolbarProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleLabelChange = (event: SelectChangeEvent<DefectLabel>) => {
    onLabelChange(event.target.value as DefectLabel);
  };

  return (
    <Box className="toolbar">
      <Box>
        <Typography variant="h5" fontWeight="bold">
          DefectLens
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Interactive Image Annotation Tool
        </Typography>
      </Box>

      <Box className="toolbar-actions">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              onUpload(file);
            }

            event.target.value = '';
          }}
        />

        <Button
          variant="contained"
          onClick={() => fileInput.current?.click()}
        >
          Upload Image
        </Button>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select value={label} onChange={handleLabelChange}>
            <MenuItem value="Scratch">Scratch</MenuItem>
            <MenuItem value="Particle">Particle</MenuItem>
            <MenuItem value="Crack">Crack</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          disabled={!hasImage}
          onClick={onExport}
        >
          Export JSON
        </Button>
      </Box>
    </Box>
  );
}

export default Toolbar;
