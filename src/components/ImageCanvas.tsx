
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Box, Typography } from '@mui/material';

import type { Annotation, DefectLabel, Point } from '../types';
import { normalizeRectangle } from '../utils/geometry';

interface ImageCanvasProps {
  imageUrl: string;
  annotations: Annotation[];
  selectedId: number | null;
  label: DefectLabel;
  onCreate: (annotation: Annotation) => void;
  onSelect: (id: number | null) => void;
  onUpdate: (annotation: Annotation) => void;
}

type Interaction =
  | { mode: 'draw'; start: Point }
  | { mode: 'move'; start: Point; original: Annotation }
  | { mode: 'resize'; start: Point; original: Annotation };

function ImageCanvas({
  imageUrl,
  annotations,
  selectedId,
  label,
  onCreate,
  onSelect,
  onUpdate,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactionRef = useRef<Interaction | null>(null);

  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [draft, setDraft] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const image = new Image();

    setLoadedImage(null);

    image.onload = () => {
      if (active) setLoadedImage(image);
    };

    image.onerror = () => {
      console.error('Image loading failed:', imageUrl);
    };

    image.src = imageUrl;

    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !loadedImage) return;

    canvas.width = loadedImage.naturalWidth;
    canvas.height = loadedImage.naturalHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(loadedImage, 0, 0);

    annotations.forEach((item) => {
      const selected = item.id === selectedId;

      context.strokeStyle = selected ? '#ffb020' : '#22c55e';
      context.lineWidth = Math.max(2, canvas.width / 500);

      context.strokeRect(item.x, item.y, item.width, item.height);

      context.fillStyle = context.strokeStyle;
      context.font = `${Math.max(14, canvas.width / 70)}px Arial`;
      context.fillText(item.label, item.x, Math.max(18, item.y - 6));

      if (selected) {
        const size = Math.max(10, canvas.width / 100);

        context.fillStyle = '#ffb020';
        context.fillRect(
          item.x + item.width - size / 2,
          item.y + item.height - size / 2,
          size,
          size
        );
      }
    });

    if (draft) {
      context.strokeStyle = '#ffb020';
      context.lineWidth = 3;
      context.setLineDash([8, 5]);
      context.strokeRect(draft.x, draft.y, draft.width, draft.height);
      context.setLineDash([]);
    }
  }, [loadedImage, annotations, selectedId, draft]);

  const getPoint = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * canvas.width / rect.width,
      y: (event.clientY - rect.top) * canvas.height / rect.height,
    };
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!;
    const point = getPoint(event);

    event.currentTarget.setPointerCapture(event.pointerId);

    // Check annotations from top to bottom.
    const clicked = [...annotations].reverse().find((item) =>
      point.x >= item.x &&
      point.x <= item.x + item.width &&
      point.y >= item.y &&
      point.y <= item.y + item.height
    );

    if (clicked) {
      onSelect(clicked.id);

      const rect = canvas.getBoundingClientRect();
      const handleSize = 18 * canvas.width / rect.width;

      const nearCorner =
        Math.abs(point.x - (clicked.x + clicked.width)) < handleSize &&
        Math.abs(point.y - (clicked.y + clicked.height)) < handleSize;

      interactionRef.current = {
        mode: nearCorner ? 'resize' : 'move',
        start: point,
        original: clicked,
      };
    } else {
      onSelect(null);
      interactionRef.current = { mode: 'draw', start: point };
    }
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    const interaction = interactionRef.current;
    if (!interaction) return;

    const canvas = canvasRef.current!;
    const point = getPoint(event);

    if (interaction.mode === 'draw') {
      setDraft(normalizeRectangle(interaction.start, point));
      return;
    }

    const original = interaction.original;

    if (interaction.mode === 'move') {
      const dx = point.x - interaction.start.x;
      const dy = point.y - interaction.start.y;

      onUpdate({
        ...original,
        x: Math.max(0, Math.min(canvas.width - original.width, original.x + dx)),
        y: Math.max(0, Math.min(canvas.height - original.height, original.y + dy)),
      });
    }

    if (interaction.mode === 'resize') {
      const width = Math.max(5, Math.min(
        canvas.width - original.x,
        original.width + point.x - interaction.start.x
      ));

      const height = Math.max(5, Math.min(
        canvas.height - original.y,
        original.height + point.y - interaction.start.y
      ));

      onUpdate({
        ...original,
        width,
        height,
      });
    }
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLCanvasElement>
  ) => {
    const interaction = interactionRef.current;
    if (!interaction) return;

    if (interaction.mode === 'draw') {
      const rectangle = normalizeRectangle(
        interaction.start,
        getPoint(event)
      );

      if (rectangle.width > 5 && rectangle.height > 5) {
        onCreate({
          id: Date.now() + Math.random(),
          ...rectangle,
          label,
        });
      }
    }

    interactionRef.current = null;
    setDraft(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerCancel = () => {
    interactionRef.current = null;
    setDraft(null);
  };

  return (
    <Box className="canvas-panel">
      <Typography variant="h6" gutterBottom>
        Image Workspace
      </Typography>

      <Box className="canvas-container">
        {loadedImage ? (
          <canvas
            ref={canvasRef}
            className="annotation-canvas"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          />
        ) : (
          <Typography color="text.secondary">
            Loading image...
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default ImageCanvas;
