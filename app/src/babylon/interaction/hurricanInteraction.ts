import type { AbstractMesh, Scene, StandardMaterial } from "@babylonjs/core";
import { mouseClick, mouseEnter } from "./mouseEnter";
import type { HurricanePointData } from "../../interfaces/hurricane";

export const hurricaneInteract = (
  scene: Scene,
  hurricaneMarkerMaterial: StandardMaterial,
  hoveredHurricaneMarkerMaterial: StandardMaterial,
  selectedHurricaneMarkerMaterial: StandardMaterial,
  setHoveredHurricane: (hurricane: HurricanePointData | null) => void
) => {
  let currentHoveredMesh: AbstractMesh | null = null;
  let selectedMesh: AbstractMesh | null = null;
  let lastPickTime = 0;

  const findHurricaneRoot = (
    mesh: AbstractMesh | null
  ): AbstractMesh | null => {
    let node: any = mesh;
    while (node) {
      if (typeof node.name === "string" && node.name.includes("hurricane")) {
        return node as AbstractMesh;
      }
      node = node.parent;
    }
    return null;
  };

  mouseClick(scene, () => {
    const pickResult = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (m) => typeof m.name === "string" && m.name.includes("hurricane")
    );

    const pickedMesh = findHurricaneRoot(pickResult?.pickedMesh ?? null);

    if (pickedMesh && pickedMesh.name !== "earth") {
      if (selectedMesh !== pickedMesh) {
        if (selectedMesh && !selectedMesh.isDisposed()) {
          selectedMesh.material = hurricaneMarkerMaterial;
        }

        pickedMesh.material = selectedHurricaneMarkerMaterial;
        selectedMesh = pickedMesh;
        setHoveredHurricane(selectedMesh.metadata);
      } else {
        pickedMesh.material = hurricaneMarkerMaterial;
        selectedMesh = null;
        setHoveredHurricane(null);
      }
    } else {
      if (selectedMesh && !selectedMesh.isDisposed()) {
        selectedMesh.material = hurricaneMarkerMaterial;
        selectedMesh = null;
        setHoveredHurricane(null);
      }
    }
  });

  mouseEnter(scene, () => {
    const now = performance.now();
    if (now - lastPickTime < 25) return;
    lastPickTime = now;

    const pickResult = scene.pick(
      scene.pointerX,
      scene.pointerY,
      (m) => typeof m.name === "string" && m.name.includes("hurricane")
    );

    const pickedMesh = findHurricaneRoot(pickResult?.pickedMesh ?? null);

    if (pickedMesh && pickedMesh.name !== "earth") {
      if (pickedMesh !== selectedMesh) {
        if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
          currentHoveredMesh.material = hurricaneMarkerMaterial;
        }
        pickedMesh.material = hoveredHurricaneMarkerMaterial;
        currentHoveredMesh = pickedMesh;
      }
    } else {
      if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
        currentHoveredMesh.material = hurricaneMarkerMaterial;
        currentHoveredMesh = null;
      }
    }
  });

  const canvas = scene.getEngine().getRenderingCanvas();
  if (canvas) {
    canvas.addEventListener("pointerleave", () => {
      if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
        currentHoveredMesh.material = hurricaneMarkerMaterial;
        currentHoveredMesh = null;
      }
    });
  }
};
