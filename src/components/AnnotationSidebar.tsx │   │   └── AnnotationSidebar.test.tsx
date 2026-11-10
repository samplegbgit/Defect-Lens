
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import AnnotationSidebar from './AnnotationSidebar';
import type { Annotation } from '../types';

const sampleAnnotations: Annotation[] = [
  {
    id: 1,
    x: 20,
    y: 30,
    width: 100,
    height: 60,
    label: 'Scratch',
  },
];

describe('AnnotationSidebar', () => {
  it('shows the empty state', () => {
    render(
      <AnnotationSidebar
        annotations={[]}
        selectedId={null}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText(/No annotations yet/i)
    ).toBeInTheDocument();
  });

  it('displays annotation labels', () => {
    render(
      <AnnotationSidebar
        annotations={sampleAnnotations}
        selectedId={null}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Scratch')).toBeInTheDocument();
  });

  it('calls delete when the delete button is clicked', () => {
    const onDelete = vi.fn();

    render(
      <AnnotationSidebar
        annotations={sampleAnnotations}
        selectedId={null}
        onSelect={vi.fn()}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText('Delete'));

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
