
import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

import Toolbar from './components/Toolbar';
import ImageCanvas from './components/ImageCanvas';
import AnnotationSidebar from './components/AnnotationSidebar';

import type { Annotation, DefectLabel } from './types';

import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [label, setLabel] = useState<DefectLabel>('Scratch');

  const imageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    imageUrlRef.current = url;

    setImageUrl(url);
    setAnnotations([]);
    setSelectedId(null);
  };

  const handleCreate = (annotation: Annotation) => {
    setAnnotations((previous) => [...previous, annotation]);
    setSelectedId(annotation.id);
  };

  const handleUpdate = (updated: Annotation) => {
    setAnnotations((previous) =>
      previous.map((item) =>
        item.id === updated.id ? updated : item
      )
    );
  };

  const handleDelete = (id: number) => {
    setAnnotations((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleExport = () => {
    const worker = new Worker(
      new URL('./workers/worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event: MessageEvent<string>) => {
      const blob = new Blob([event.data], {
        type: 'application/json',
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = 'defect-annotations.json';

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);
      worker.terminate();
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
      worker.terminate();

      const blob = new Blob(
        [JSON.stringify(annotations, null, 2)],
        { type: 'application/json' }
      );

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = 'defect-annotations.json';

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);
    };

    worker.postMessage(annotations);
  };

  return (
    <Container maxWidth={false} className="app-container">
      <Toolbar
        label={label}
        onLabelChange={setLabel}
        onUpload={handleUpload}
        onExport={handleExport}
        hasImage={Boolean(imageUrl)}
      />

      <Box className="workspace">
        {imageUrl ? (
          <>
            <ImageCanvas
              imageUrl={imageUrl}
              annotations={annotations}
              selectedId={selectedId}
              label={label}
              onCreate={handleCreate}
              onSelect={setSelectedId}
              onUpdate={handleUpdate}
            />

            <AnnotationSidebar
              annotations={annotations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={handleDelete}
            />
          </>
        ) : (
          <Box className="welcome-panel">
            <Typography variant="h4" fontWeight="bold">
              Welcome to DefectLens
            </Typography>

            <Typography color="text.secondary">
              Upload an image to start identifying and annotating defects.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
