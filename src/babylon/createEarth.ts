/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Color3,
  Vector3,
  ArcRotateCamera,
} from "@babylonjs/core";
import earthTextureUrl from "../assets/earth.jpg";
import earthNormalTexture from "../assets/earth_normal.jpg";
import earthSpecularTextureUrl from "../assets/earth_specular.jpg";
import earthTextureNight from "../assets/earth_nightmap.jpg";
import WorldGeoJsonUrl from "../utils/world.geojson?url";
import ain_commune_geojson from "../utils/departement/01-ain/commune.geojson?url";

import drawGeoJson from "./drawGeoJson";
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
  console.log(sphere.getBoundingInfo().boundingSphere.radius);


  drawGeoJson(WorldGeoJsonUrl, scene, { color: Color3.FromInts(56, 173, 169) });

  const frenchCenter = { lat: 46.5, lon: 2.5 };

  const francePos = toCartesian(
    frenchCenter.lat,
    frenchCenter.lon,
    sphere.getBoundingInfo().boundingSphere.radius
  );

  let frenchLoaded: boolean = false;

  scene.onBeforeRenderObservable.add(() => {
    const camera = scene.activeCamera as ArcRotateCamera;
    if (!camera || frenchLoaded) return;

    const sphereRadius = sphere.getBoundingInfo().boundingSphere.radius;
    camera.lowerRadiusLimit = sphereRadius + 0.1; 
    camera.upperRadiusLimit = 10;

    if (camera.position <= new Vector3(francePos.x, francePos.y, francePos.z)) {
      if (camera.radius <= 1.3) {
        frenchLoaded = true;

        drawGeoJson(ain_commune_geojson, scene);
      }
    }
  });

  return { sphere };
};
