import type { AbstractMesh, Scene, StandardMaterial } from "@babylonjs/core";
import { mouseClick, mouseEnter } from "./mouseEnter";
import type City from "../../interfaces/city";

export const cityInteract = (
  scene: Scene,
  markerMaterial: StandardMaterial,
  hoveredMarkerMaterial: StandardMaterial,
  selectedMarkerMaterial: StandardMaterial,
  setHoveredCity: (hurricane: City | null) => void
) => {
  let currentHoveredMesh: AbstractMesh | null = null;
  let selectedMesh: AbstractMesh | null = null;
  let lastPickTime = 0;

  const findHurricaneRoot = (
    mesh: AbstractMesh | null
  ): AbstractMesh | null => {
    let node: any = mesh;
    while (node) {
      if (typeof node.name === "string" && node.name.includes("city")) {
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
      (m) => typeof m.name === "string" && m.name.includes("city")
    );

    const pickedMesh = findHurricaneRoot(pickResult?.pickedMesh ?? null);

    if (pickedMesh && pickedMesh.name !== "earth") {
      if (selectedMesh !== pickedMesh) {
        if (selectedMesh && !selectedMesh.isDisposed()) {
          selectedMesh.material = markerMaterial;
        }

        pickedMesh.material = selectedMarkerMaterial;
        selectedMesh = pickedMesh;
        setHoveredCity(selectedMesh.metadata);
      } else {
        pickedMesh.material = markerMaterial;
        selectedMesh = null;
        setHoveredCity(null);
      }
    } else {
      if (selectedMesh && !selectedMesh.isDisposed()) {
        selectedMesh.material = markerMaterial;
        selectedMesh = null;
        setHoveredCity(null);
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
      (m) => typeof m.name === "string" && m.name.includes("city")
    );

    const pickedMesh = findHurricaneRoot(pickResult?.pickedMesh ?? null);

    if (pickedMesh && pickedMesh.name !== "earth") {
      if (pickedMesh !== selectedMesh) {
        if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
          currentHoveredMesh.material = markerMaterial;
        }
        pickedMesh.material = hoveredMarkerMaterial;
        currentHoveredMesh = pickedMesh;
      }
    } else {
      if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
        currentHoveredMesh.material = markerMaterial;
        currentHoveredMesh = null;
      }
    }
  });

  const canvas = scene.getEngine().getRenderingCanvas();
  if (canvas) {
    canvas.addEventListener("pointerleave", () => {
      if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
        currentHoveredMesh.material = markerMaterial;
        currentHoveredMesh = null;
      }
    });
  }
};
