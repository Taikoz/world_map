/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Scene,
  StandardMaterial,
  Color3,
  Mesh,
  AbstractMesh,
} from "@babylonjs/core";
import type City from "../interfaces/city";
import { SpatialTools } from "../utils/ConvertGeo";
import citiesData from "../utils/cities.json";
import { Point } from "./common/geometry";
import { mouseClick, mouseEnter } from "./interaction/mouse";

export class CityOnMap {
  public markers: Mesh[] = [];
  public markerMaterial: StandardMaterial;
  public hoveredMarkerMaterial: StandardMaterial;
  public selectedMarkerMaterial: StandardMaterial;

  private scene: Scene;
  private sphere: Mesh;

  constructor(scene: Scene, sphere: Mesh) {
    this.scene = scene;
    this.sphere = sphere;

    this.markerMaterial = new StandardMaterial("markerMat", this.scene);
    this.markerMaterial.diffuseColor = new Color3(1, 0, 0);
    this.markerMaterial.emissiveColor = new Color3(1, 0, 0);

    this.hoveredMarkerMaterial = new StandardMaterial("hoveredMat", this.scene);
    this.hoveredMarkerMaterial.diffuseColor = new Color3(1, 0.8, 0);
    this.hoveredMarkerMaterial.emissiveColor = new Color3(1, 0.8, 0);

    this.selectedMarkerMaterial = new StandardMaterial("selectedMat", this.scene);
    this.selectedMarkerMaterial.diffuseColor = new Color3(0, 0.8, 0);
    this.selectedMarkerMaterial.emissiveColor = new Color3(0, 0.8, 0);

    this.createMarkers();
  }

  private createMarkers() {
    citiesData.forEach((city: City) => {
      const position = SpatialTools.convertGeoToCartesian(
        city.coordinates.latitude,
        city.coordinates.longitude
      );

      const marker = Point.createMesh(
        `${city.city}_city`,
        0.002,
        this.scene,
        undefined,
        this.markerMaterial
      );

      if (!city.bounding_box) return;

      marker.position = position;
      marker.isPickable = true;
      marker.metadata = city;
      marker.parent = this.sphere

      this.markers.push(marker);
    });
  }

  public enableInteractions(setHoveredCity: (city: City | null) => void) {
    let currentHoveredMesh: AbstractMesh | null = null;
    let selectedMesh: AbstractMesh | null = null;
    let lastPickTime = 0;

    const findCity = (
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

    mouseClick(this.scene, () => {
      const pickResult = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY,
        (m) => typeof m.name === "string" && m.name.includes("city")
      );

      const pickedMesh = findCity(pickResult?.pickedMesh ?? null);

      if (pickedMesh && pickedMesh.name !== "earth") {
        if (selectedMesh !== pickedMesh) {
          if (selectedMesh && !selectedMesh.isDisposed()) {
            selectedMesh.material = this.markerMaterial;
          }

          pickedMesh.material = this.selectedMarkerMaterial;
          selectedMesh = pickedMesh;
          setHoveredCity(selectedMesh.metadata);
        } else {
          pickedMesh.material = this.markerMaterial;
          selectedMesh = null;
          setHoveredCity(null);
        }
      } else {
        if (selectedMesh && !selectedMesh.isDisposed()) {
          selectedMesh.material = this.markerMaterial;
          selectedMesh = null;
          setHoveredCity(null);
        }
      }
    });

    mouseEnter(this.scene, () => {
      const now = performance.now();
      if (now - lastPickTime < 25) return;
      lastPickTime = now;

      const pickResult = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY,
        (m) => typeof m.name === "string" && m.name.includes("city")
      );

      const pickedMesh = findCity(pickResult?.pickedMesh ?? null);

      if (pickedMesh && pickedMesh.name !== "earth") {
        if (pickedMesh !== selectedMesh) {
          if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
            currentHoveredMesh.material = this.markerMaterial;
          }
          pickedMesh.material = this.hoveredMarkerMaterial;
          currentHoveredMesh = pickedMesh;
        }
      } else {
        if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
          currentHoveredMesh.material = this.markerMaterial;
          currentHoveredMesh = null;
        }
      }
    });

    const canvas = this.scene.getEngine().getRenderingCanvas();
    if (canvas) {
      canvas.addEventListener("pointerleave", () => {
        if (currentHoveredMesh && currentHoveredMesh !== selectedMesh) {
          currentHoveredMesh.material = this.markerMaterial;
          currentHoveredMesh = null;
        }
      });
    }
  }
}