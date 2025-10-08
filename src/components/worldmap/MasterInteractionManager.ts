
import {
  Scene,
  PointerInfo,
  PointerEventTypes,
  AbstractMesh,
  StandardMaterial,
  Vector3,
  Mesh,
  Color3,
  MeshBuilder,
  GlowLayer,
} from "@babylonjs/core";
import type City from "../../interfaces/city";
import type { HurricanePointData } from "../../interfaces/hurricane";
import convertGeoToCartesian from "../../utils/ConvertGeo";

export const createMasterInteractionManager = (
  scene: Scene,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  gl: GlowLayer,
  setHoveredCity: (city: City | null) => void,
  setHoveredHurricane: (hurricane: HurricanePointData | null) => void,
  cityMarkerMaterial: StandardMaterial,
  hoveredCityMarkerMaterial: StandardMaterial,
  selectedCityMarkerMaterial: StandardMaterial,
  hurricaneMarkerMaterial: StandardMaterial,
  hoveredHurricaneMarkerMaterial: StandardMaterial,
  selectedHurricaneMarkerMaterial: StandardMaterial,
  sphere: Mesh
) => {
  let currentHoveredMesh: AbstractMesh | null = null;
  let selectedMesh: AbstractMesh | null = null;
  let boundingBoxMesh: Mesh | null = null;
  let lastSelectedMarker: AbstractMesh | null = null;

  scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
    const result = scene.pick(scene.pointerX, scene.pointerY);

    // POINTER MOVE
    if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
      if (result?.pickedMesh?.metadata && result.pickedMesh.name !== "earth") {
        if (currentHoveredMesh !== result.pickedMesh) {
          // Restore previous hovered mesh
          if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
            if (currentHoveredMesh.metadata.population) { // Is a city
              currentHoveredMesh.material = cityMarkerMaterial;
            } else if (currentHoveredMesh.metadata.point) { // Is a hurricane
              currentHoveredMesh.material = hurricaneMarkerMaterial;
            }
            currentHoveredMesh.scaling = new Vector3(1, 1, 1);
          }

          currentHoveredMesh = result.pickedMesh;

          // Apply hover effect
          if (currentHoveredMesh !== selectedMesh) {
            if (currentHoveredMesh.metadata.population) { // Is a city
              currentHoveredMesh.material = hoveredCityMarkerMaterial;
            } else if (currentHoveredMesh.metadata.point) { // Is a hurricane
              currentHoveredMesh.material = hoveredHurricaneMarkerMaterial;
            }
          }

          currentHoveredMesh.scaling = new Vector3(1, 1, 1);
          canvasRef.current!.style.cursor = "pointer";
        }
      } else {
        // Restore previous hovered mesh
        if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
          if (currentHoveredMesh.metadata.population) { // Is a city
            currentHoveredMesh.material = cityMarkerMaterial;
          } else if (currentHoveredMesh.metadata.point) { // Is a hurricane
            currentHoveredMesh.material = hurricaneMarkerMaterial;
          }
          currentHoveredMesh.scaling = new Vector3(1, 1, 1);
        }
        currentHoveredMesh = null;
        canvasRef.current!.style.cursor = "default";
      }
    }

    // POINTER PICK
    if (pointerInfo.type === PointerEventTypes.POINTERPICK) {
      if (result && result.pickedMesh?.metadata && result.pickedMesh.name !== "earth") {
        // Restore previous selected mesh
        if (selectedMesh && selectedMesh !== result.pickedMesh) {
          if (selectedMesh.metadata.population) {
            selectedMesh.material = cityMarkerMaterial;
            if (lastSelectedMarker) lastSelectedMarker.isVisible = true;
          } else if (selectedMesh.metadata.point) { // Is a hurricane
            selectedMesh.material = hurricaneMarkerMaterial;
          }
        }

        selectedMesh = result.pickedMesh;

        if (selectedMesh.metadata.population) { 
          selectedMesh.material = selectedCityMarkerMaterial;
          selectedMesh.isVisible = false;
          lastSelectedMarker = selectedMesh;
          setHoveredCity(selectedMesh.metadata);
          setHoveredHurricane(null);

          if (boundingBoxMesh) {
            boundingBoxMesh.dispose();
          }

          const city = selectedMesh.metadata as City;
          if (city.bounding_box) {
              const { latitude_min, latitude_max, longitude_min, longitude_max } = city.bounding_box;

              const p1 = convertGeoToCartesian(latitude_min, longitude_min);
              const p2 = convertGeoToCartesian(latitude_min, longitude_max);
              const p3 = convertGeoToCartesian(latitude_max, longitude_max);
              const p4 = convertGeoToCartesian(latitude_max, longitude_min);

              const lines = [
                  [p1, p2],
                  [p2, p3],
                  [p3, p4],
                  [p4, p1]
              ];

              boundingBoxMesh = MeshBuilder.CreateLineSystem("boundingBox", { lines: lines }, scene);
              boundingBoxMesh.parent = sphere;
              const material = new StandardMaterial("boundingbox-material", scene)
              material.emissiveColor = new Color3(0, 1, 0);
              boundingBoxMesh.material = material
              gl.addIncludedOnlyMesh(boundingBoxMesh);
          }
        } else if (selectedMesh.metadata.point) { // Is a hurricane
          selectedMesh.material = selectedHurricaneMarkerMaterial;
          setHoveredHurricane(selectedMesh.metadata);
          setHoveredCity(null);
          if (boundingBoxMesh) {
            boundingBoxMesh.dispose();
            boundingBoxMesh = null;
          }
        }
      } else if (result?.pickedMesh?.name === "earth") {
        // Restore previous selected mesh
        if (selectedMesh) {
          if (selectedMesh.metadata.population) { // Is a city
            selectedMesh.material = cityMarkerMaterial;
            if (lastSelectedMarker) lastSelectedMarker.isVisible = true;
          } else if (selectedMesh.metadata.point) { // Is a hurricane
            selectedMesh.material = hurricaneMarkerMaterial;
          }
        }
        selectedMesh = null;
        setHoveredCity(null);
        setHoveredHurricane(null);
        if (boundingBoxMesh) {
          boundingBoxMesh.dispose();
          boundingBoxMesh = null;
        }
      }
    }
  });
};
