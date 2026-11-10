# DefectLens – Interactive Image Annotation Tool

DefectLens is a React and TypeScript-based image annotation application designed to simplify manual defect labelling in industrial and manufacturing images. It provides an interactive canvas where users can upload images, mark defects using bounding boxes, edit annotations, and export the results as structured JSON data.

## Features

- **Image Upload:** Upload images directly from your local device.
- **Defect Labelling:** Categorize defects using predefined labels: Scratch, Particle, and Crack.
- **Interactive Bounding Boxes:** Draw rectangular annotations around defects using mouse interactions.
- **Annotation Editing:** Select, move, resize, and delete existing annotations.
- **Visual Selection:** Highlight selected annotations for easier editing.
- **JSON Export:** Export annotation data in JSON format.
- **Web Worker Integration:** Handle JSON serialization in a background thread.
- **Responsive Interface:** Built with Material UI components.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based UI development |
| TypeScript | Type safety and maintainable code |
| Vite | Development server and build tooling |
| Material UI | UI components and styling |
| HTML Canvas API | Image rendering and bounding-box annotation |
| Web Workers | Background JSON processing |
| Vitest | Component testing |
| React Testing Library | UI component testing |

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd defectlens
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## How to Use

1. Launch the application.
2. Click **Upload Image** and select an image from your device.
3. Choose a defect category from the label selector.
4. Click and drag on the image to draw a bounding box around a defect.
5. Select an existing annotation to move or resize it.
6. Use the annotation sidebar to review, select, or delete annotations.
7. Click **Export JSON** to download the annotation data.

## Annotation Data Format

Annotations are exported as JSON objects containing an identifier, bounding-box coordinates, dimensions, and defect label.

Example:

```json
[
  {
    "id": 123456,
    "x": 120,
    "y": 85,
    "width": 150,
    "height": 90,
    "label": "Scratch"
  }
]
```

Coordinates and dimensions are measured relative to the original image.

## Running Tests

```bash
npm run test:run
```

## Production Build

```bash
npm run build
```

The generated build files are stored in the `dist` directory.

## Potential Applications

- Manual defect annotation in manufacturing images.
- Semiconductor and electronic component inspection workflows.
- Preparation of labelled image datasets for computer vision models.
- Visual quality-control data collection.

## Future Enhancements

- Zoom and pan support for detailed image inspection.
- Additional resize handles for more flexible bounding-box editing.
- Annotation persistence and project history.
- AI-powered automatic defect detection.

---

**DefectLens** is a manual image annotation tool. It does not currently perform automatic AI-based defect detection.