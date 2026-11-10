
import type { Annotation } from '../types';

self.onmessage = (event: MessageEvent<Annotation[]>) => {
  const annotations = event.data;

  const result = JSON.stringify(annotations, null, 2);

  self.postMessage(result);
};
