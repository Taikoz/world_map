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
import convertGeoToCartesian from "../../utils/ConvertGeo";

export const createInteractionManager = (
  scene: Scene,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  gl: GlowLayer,
  sphere: Mesh,
  setHoveredCity: (city: City | null) => void,
  markerMaterial: StandardMaterial,
  hoveredMarkerMaterial: StandardMaterial,
  selectedMarkerMaterial: StandardMaterial
) => {
  let currentHoveredMesh: AbstractMesh | null = null;
  let selectedCityMesh: AbstractMesh | null = null;
  let boundingBoxMesh: Mesh | null = null;
  let lastSelectedMarker: AbstractMesh | null = null;

  scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
    if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
      const result = scene.pick(scene.pointerX, scene.pointerY);

      if (result?.pickedMesh?.metadata && result.pickedMesh.name !== "earth") {
        if (currentHoveredMesh !== result.pickedMesh) {
          if (currentHoveredMesh && currentHoveredMesh !== selectedCityMesh) {
            currentHoveredMesh.material = markerMaterial;
            currentHoveredMesh.scaling = new Vector3(1, 1, 1);
          }

          currentHoveredMesh = result.pickedMesh;

          if (currentHoveredMesh !== selectedCityMesh) {
            currentHoveredMesh.material = hoveredMarkerMaterial;
          }

          currentHoveredMesh.scaling = new Vector3(1.5, 1.5, 1.5);
          canvasRef.current!.style.cursor = "pointer";
        }
      } else {
        if (currentHoveredMesh && currentHoveredMesh !== selectedCityMesh) {
          currentHoveredMesh.material = markerMaterial;
          currentHoveredMesh.scaling = new Vector3(1, 1, 1);
        }
        currentHoveredMesh = null;
        canvasRef.current!.style.cursor = "default";
      }
    }

    if (pointerInfo.type === PointerEventTypes.POINTERPICK) {
      const result = pointerInfo.pickInfo;

      if (result && result.pickedMesh?.metadata && result.pickedMesh.name !== "earth") {
        if (selectedCityMesh && selectedCityMesh !== result.pickedMesh) {
          selectedCityMesh.material = markerMaterial;
          if (lastSelectedMarker) lastSelectedMarker.isVisible = true;
        }

        selectedCityMesh = result.pickedMesh;
        selectedCityMesh.material = selectedMarkerMaterial;
        selectedCityMesh.isVisible = false;
        lastSelectedMarker = selectedCityMesh;

        setHoveredCity(selectedCityMesh.metadata);

        if (boundingBoxMesh) {
          boundingBoxMesh.dispose();
        }

        const city = selectedCityMesh.metadata as City;
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
      } else if (result?.pickedMesh?.name === "earth") {
        if (selectedCityMesh) {
          selectedCityMesh.material = markerMaterial;
          if (lastSelectedMarker) lastSelectedMarker.isVisible = true;
        }
        selectedCityMesh = null;
        setHoveredCity(null);
        if (boundingBoxMesh) {
          boundingBoxMesh.dispose();
          boundingBoxMesh = null;
        }
      }
    }
  });
};
