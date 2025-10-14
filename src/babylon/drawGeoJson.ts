/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3, Color3 } from "@babylonjs/core";
import { toCartesian } from "../utils/ConvertGeo";

interface GeoJsonStyle {
    color?: Color3;
    radiusOffset?: number;
    label?: boolean;
}

export default function drawGeoJson(
  url: string,
  scene: Scene,
  options: GeoJsonStyle = {}
) {
  const radius = 1.001 + (options.radiusOffset || 0);
  const lineColor = options.color || new Color3(1, 1, 1);

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur réseau : ${response.status}`);
      }
      return response.json();
    })
    .then((geojson) => {
      if (!geojson || !geojson.features) {
        console.error("GeoJSON invalide :", geojson);
        return;
      }

      const features = geojson.features;
      console.log(`✅ ${features.length} features chargées depuis ${url}`);

      // --- Fonction pour traiter une feature ---
      const processFeature = (feature: any) => {
        const coords = feature.geometry.coordinates;
        const name = feature.properties?.name || feature.properties?.NAME || "Inconnu";

        // --- Labels 3D ---
        if (options.label) {
          const centroid = computeCentroid(feature.geometry);
          if (centroid) {
            const { lat, lon } = centroid;
            const { x, y, z } = toCartesian(lat, lon, radius + 0.02);
            createLabel3D(name, new Vector3(x, y, z), scene);
          }
        }

        // --- Création des lignes ---
        const createLine = (points: number[][]) => {
          const linePoints = points.map(([lon, lat]) => {
            const { x, y, z } = toCartesian(lat, lon, radius);
            return new Vector3(x, y, z);
          });
          const lines = MeshBuilder.CreateLines("geo-line", { points: linePoints }, scene);
          const mat = new StandardMaterial("lineMat", scene);
          mat.emissiveColor = lineColor;
          lines.material = mat;
        };

        switch (feature.geometry.type) {
          case "Polygon":
            coords.forEach((ring: number[][]) => createLine(ring));
            break;
          case "MultiPolygon":
            coords.forEach((polygon: number[][][]) =>
              polygon.forEach((ring: number[][]) => createLine(ring))
            );
            break;
          case "LineString":
            createLine(coords);
            break;
          case "MultiLineString":
            coords.forEach((line: number[][]) => createLine(line));
            break;
        }
      };

     
      let index = 0;
      const batchSize = 1; 

      const processBatch = () => {
        const end = Math.min(index + batchSize, features.length);
        for (; index < end; index++) {
          processFeature(features[index]);
        }
        if (index < features.length) {
          
          requestAnimationFrame(processBatch);
        }
      };

      processBatch();
    })
    .catch((err) => {
      console.error("Erreur de chargement ou parsing du GeoJSON :", err);
    });
}

function computeCentroid(geometry: any): { lat: number; lon: number } | null {
  let totalLat = 0;
  let totalLon = 0;
  let count = 0;

  const addPoints = (points: number[][]) => {
    points.forEach(([lon, lat]) => {
      totalLat += lat;
      totalLon += lon;
      count++;
    });
  };

  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach(addPoints);
  } else if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((poly: number[][][]) =>
      poly.forEach(addPoints)
    );
  } else {
    return null;
  }

  if (count === 0) return null;
  return { lat: totalLat / count, lon: totalLon / count };
}


function createLabel3D(text: string, position: Vector3, scene: Scene) {
  const textureWidth = 64;
  const textureHeight = 24;

  const dynamicTexture = new DynamicTexture(
    "labelTexture",
    { width: textureWidth, height: textureHeight },
    scene,
    true
  );
  dynamicTexture.hasAlpha = true;

  const ctx = dynamicTexture.getContext();
  const fontSize = 12;
  const font = `light ${fontSize}px sans-serif`;
  ctx.font = font;

  const textWidth = ctx.measureText(text).width;
  const textX = Math.max((textureWidth - textWidth) / 2, 0);
  const textY = textureHeight / 2 + fontSize / 2.8;

  
  dynamicTexture.drawText(
    text,
    textX,
    textY,
    font,
    "rgba(255,255,255,0.4)",
    "transparent",
    true
  );

  const plane = MeshBuilder.CreatePlane("label", { width: 0.12, height: 0.04 }, scene);
  plane.position = position;

  const labelMat = new StandardMaterial("labelMat", scene);
  labelMat.diffuseTexture = dynamicTexture;
  labelMat.emissiveColor = new Color3(1, 1, 1);
  labelMat.backFaceCulling = false;
  labelMat.specularColor = new Color3(0, 0, 0);
  labelMat.alpha = 0.8; 

  plane.material = labelMat;


  plane.billboardMode = Mesh.BILLBOARDMODE_ALL;

  
  plane.scaling.scaleInPlace(0.8);
}