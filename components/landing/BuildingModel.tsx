"use client";

import "@google/model-viewer";

export default function BuildingModel() {
  return (
    <model-viewer
      src="/model.obj"
      auto-rotate
      camera-controls
      style={{ width: "100%", height: "100%" }}
    />
  );
}
