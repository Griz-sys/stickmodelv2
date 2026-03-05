"use client";

import "@google/model-viewer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModelViewerElement = "model-viewer" as any;

export default function BuildingModel() {
  return (
    <ModelViewerElement
      src="/model.obj"
      auto-rotate
      camera-controls
      style={{ width: "100%", height: "100%" }}
    />
  );
}
