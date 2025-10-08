import {
  Color3,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Vector3,
  type Scene,
} from "@babylonjs/core";
import hurricaneDataPoints from "../../utils/hurrican.json";
import convertGeoToCartesian from "../../utils/ConvertGeo";
import type { Point, Hurricane } from "../../interfaces/hurricane";

export const createHurricanePresentation = (scene: Scene, sphere: Mesh) => {
  const hurricaneMarkerMaterial = new StandardMaterial("hurricanPoint", scene);
  hurricaneMarkerMaterial.emissiveColor = new Color3(1, 1, 1);
  const hurricaneLineMaterial = new StandardMaterial("hurricaneLine", scene);
  hurricaneLineMaterial.emissiveColor = new Color3(1, 1, 1); 

  const hoveredHurricaneMarkerMaterial = new StandardMaterial("hoveredHurricaneMat", scene);
  hoveredHurricaneMarkerMaterial.emissiveColor = new Color3(1, 1, 0);

  const selectedHurricaneMarkerMaterial = new StandardMaterial("selectedHurricaneMat", scene);
  selectedHurricaneMarkerMaterial.emissiveColor = new Color3(0, 1, 0);

  const hurricanePoints: Mesh[] = [];
  const hurricaneLines: Mesh[] = [];
  hurricaneDataPoints.forEach((data: Hurricane) => {
    const positions: Vector3[] = [];
    data.points.forEach((point: Point) => {
      const hurricanePosition = convertGeoToCartesian(
        point.latitude,
        point.longitude
      );
      positions.push(hurricanePosition);

      const marker = MeshBuilder.CreateSphere(
        `${data.name}_marker_${point.hour}`,
        { diameter: 0.006 },
        scene
      );

      marker.position = hurricanePosition;
      marker.material = hurricaneMarkerMaterial;
      marker.isPickable = true;
      marker.metadata = {
        name: data.name,
        category: data.category,
        start: data.start,
        end: data.end,
        point: point,
      };
      marker.parent = sphere;
      hurricanePoints.push(marker);

    });
    
    const line = MeshBuilder.CreateLines(`${data.name}_line`, { points: positions, updatable: false }, scene);
    line.color = new Color3(1, 1, 1);
    line.parent = sphere;
    hurricaneLines.push(line);
  });
  return { hurricanePoints, hurricaneMarkerMaterial, hoveredHurricaneMarkerMaterial, selectedHurricaneMarkerMaterial };
};
