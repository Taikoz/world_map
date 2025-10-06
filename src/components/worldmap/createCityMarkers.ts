import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Vector3,
  Animation,
  Mesh,
} from "@babylonjs/core";
import citiesData from "../../utils/cities.json";
import type City from "../../interfaces/city";
import convertGeoToCartesian from "../../utils/ConvertGeo";

export const createCityMarkers = (scene: Scene, sphere: Mesh) => {
  const markerMaterial = new StandardMaterial("markerMat", scene);
  markerMaterial.diffuseColor = new Color3(1, 0, 0);
  markerMaterial.emissiveColor = new Color3(1, 0, 0);

  const hoveredMarkerMaterial = new StandardMaterial("hoveredMat", scene);
  hoveredMarkerMaterial.diffuseColor = new Color3(1, 0.8, 0);
  hoveredMarkerMaterial.emissiveColor = new Color3(1, 0.8, 0);

  const selectedMarkerMaterial = new StandardMaterial("selectedMat", scene);
  selectedMarkerMaterial.diffuseColor = new Color3(0, 0.8, 0);
  selectedMarkerMaterial.emissiveColor = new Color3(0, 0.8, 0);

  const markers: Mesh[] = [];

  citiesData.forEach((city: City) => {
    const position = convertGeoToCartesian(
      city.coordinates.latitude,
      city.coordinates.longitude
    );

    const marker = MeshBuilder.CreateSphere(
      `${city.city}_marker`,
      { diameter: 0.009 },
      scene
    );

    if (!city.bounding_box) return;

    marker.position = position;
    marker.material = markerMaterial;
    marker.isPickable = true;
    marker.metadata = city;
    marker.parent = sphere;

    marker.scaling = Vector3.Zero();
    const scaleAnimation = new Animation(
      "markerScale",
      "scaling",
      60,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    scaleAnimation.setKeys([
      { frame: 0, value: Vector3.Zero() },
      { frame: 30, value: new Vector3(1, 1, 1) },
    ]);
    marker.animations.push(scaleAnimation);

    setTimeout(() => {
      scene.beginAnimation(marker, 0, 30, false);
    }, 20);

    markers.push(marker);
  });

  return { markers, markerMaterial, hoveredMarkerMaterial, selectedMarkerMaterial };
};
