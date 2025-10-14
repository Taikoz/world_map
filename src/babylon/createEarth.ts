/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Color3,
  Vector3,
  Mesh,
  DynamicTexture,
} from "@babylonjs/core";
import earthTextureUrl from "../assets/earth.jpg";
import earthNormalTexture from "../assets/earth_normal.jpg";
import earthSpecularTextureUrl from "../assets/earth_specular.jpg";
import earthTextureNight from "../assets/earth_nightmap.jpg";
import WorldGeoJsonUrl from '../utils/world.geojson?url';
import { toCartesian } from "../utils/ConvertGeo";


export const createEarth = (scene: Scene) => {
 

  const sphere = MeshBuilder.CreateSphere(
    "earth",
    { diameter: 2, segments: 64 },
    scene
  );

  const earthMaterial = new StandardMaterial("earthMat", scene);
  earthMaterial.diffuseTexture = new Texture(earthTextureUrl, scene);
  earthMaterial.bumpTexture = new Texture(earthNormalTexture, scene);
  earthMaterial.bumpTexture.level = 9;
  earthMaterial.specularTexture = new Texture(earthSpecularTextureUrl, scene);
  earthMaterial.specularColor = new Color3(1, 0.3, 0.5);
  earthMaterial.specularPower = 10;
  earthMaterial.emissiveTexture = new Texture(earthTextureNight, scene);
  earthMaterial.emissiveColor = new Color3(0.01, 0.01, 0.1);
 

  sphere.material = earthMaterial;
  sphere.rotation.x = Math.PI;
  sphere.rotation.y = Math.PI / 2;

 

  fetch(WorldGeoJsonUrl)
    .then(res => res.json())
    .then(data => {
      const radius = 1.001;
      const lineColor: Color3 = Color3.FromInts(56, 173, 169);

      data.features.forEach((feature: any) => {
        const coords = feature.geometry.coordinates;
        console.log(feature.properties.NAME)
        
        const name = feature.properties?.name || feature.properties?.NAME || "Inconnu";
        const centroid = computeCentroid(feature.geometry);
        if (centroid) {
          const { lat, lon } = centroid;
          const { x, y, z } = toCartesian(lat, lon, radius + 0.02);
          createLabel3D(name, new Vector3(x, y, z), scene);
        }

        if (feature.geometry.type === "Polygon") {
          coords.forEach((ring: number[][]) => {
            const points = ring.map(([lon, lat]) => {
              const { x, y, z } = toCartesian(lat, lon, radius);
              return new Vector3(x, y, z);
            });

            const lines = MeshBuilder.CreateLines(
              "country-border",
              { points, updatable: false },
              scene
            );
            const mat = new StandardMaterial("lineMat", scene);
            mat.emissiveColor = lineColor;
            lines.material = mat;
          });
        }

        if (feature.geometry.type === "MultiPolygon") {
          coords.forEach((polygon: number[][][]) => {
            polygon.forEach((ring: number[][]) => {
              const points = ring.map(([lon, lat]) => {
                const { x, y, z } = toCartesian(lat, lon, radius);
                return new Vector3(x, y, z);
              });
              const lines = MeshBuilder.CreateLines(
                "country-border",
                { points, updatable: false },
                scene
              );
              const mat = new StandardMaterial("lineMat", scene);
              mat.emissiveColor = lineColor;
              lines.material = mat;
            });
          });
        }
      });
    })
    .catch(err => console.error("Erreur chargement GeoJSON :", err));

  return { sphere };
};

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
