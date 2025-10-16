/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DynamicTexture,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
  Color3,
} from "@babylonjs/core";
import { SpatialTools } from "../utils/ConvertGeo";

interface GeoJsonStyle {
  color?: Color3;
  radiusOffset?: number;
  label?: boolean;
}

export class GeoJson {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public async load(url: string, options: GeoJsonStyle = {}): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }
      const geojson = await response.json();
      this.draw(geojson, options);
    } catch (err) {
      console.error("Error loading or parsing GeoJSON:", err);
    }
  }

  public draw(geojson: any, options: GeoJsonStyle = {}): void {
    if (!geojson || !geojson.features) {
      console.error("Invalid GeoJSON:", geojson);
      return;
    }

    this.processFeatures(geojson.features, options);
  }

  private processFeatures(features: any[], options: GeoJsonStyle) {
    let index = 0;
    const batchSize = 5;

    const processBatch = () => {
      const end = Math.min(index + batchSize, features.length);
      for (; index < end; index++) {
        this.processFeature(features[index], options);
      }
      if (index < features.length) {
        requestAnimationFrame(processBatch);
      }
    };

    processBatch();
  }

  private processFeature(feature: any, options: GeoJsonStyle) {
    const { geometry, properties } = feature;
    const name = properties?.name || properties?.NAME || "Unknown";

    if (options.label) {
      this.createLabelForFeature(geometry, name, options);
    }

    switch (geometry.type) {
      case "Point":
        this.drawPoint(geometry.coordinates, options);
        break;
      case "MultiPoint":
        this.drawMultiPoint(geometry.coordinates, options);
        break;
      case "Polygon":
        this.drawPolygon(geometry.coordinates, options);
        break;
      case "MultiPolygon":
        this.drawMultiPolygon(geometry.coordinates, options);
        break;
      case "LineString":
        this.drawLineString(geometry.coordinates, options);
        break;
      case "MultiLineString":
        this.drawMultiLineString(geometry.coordinates, options);
        break;
    }
  }

  private drawPolygon(coordinates: number[][][], options: GeoJsonStyle) {
    coordinates.forEach((ring) => this.createLine(ring, options));
  }

  private drawMultiPolygon(coordinates: number[][][][], options: GeoJsonStyle) {
    coordinates.forEach((polygon) =>
      polygon.forEach((ring) => this.createLine(ring, options))
    );
  }

  private drawLineString(coordinates: number[][], options: GeoJsonStyle) {
    this.createLine(coordinates, options);
  }

  private drawMultiLineString(
    coordinates: number[][][],
    options: GeoJsonStyle
  ) {
    coordinates.forEach((line) => this.createLine(line, options));
  }

  private drawPoint(coordinates: number[], options: GeoJsonStyle) {
    const [lon, lat] = coordinates;
    const radius = 1.001 + (options.radiusOffset || 0);
    const { x, y, z } = SpatialTools.toCartesian(lat, lon, radius);

    const pointMesh = MeshBuilder.CreateSphere(
      "point",
      { diameter: 0.01 },
      this.scene
    );
    pointMesh.position = new Vector3(x, y, z);

    const mat = new StandardMaterial("pointMat", this.scene);
    mat.diffuseColor = options.color || new Color3(1, 1, 1);
    pointMesh.material = mat;
  }

  private drawMultiPoint(coordinates: number[][], options: GeoJsonStyle) {
    coordinates.forEach((point) => this.drawPoint(point, options));
  }

  private createLine(points: number[][], options: GeoJsonStyle) {
    const radius = 1.001 + (options.radiusOffset || 0);
    const lineColor = options.color || new Color3(1, 1, 1);

    const linePoints = points.map(([lon, lat]) => {
      const { x, y, z } = SpatialTools.toCartesian(lat, lon, radius);
      return new Vector3(x, y, z);
    });

    const lines = MeshBuilder.CreateLines(
      "geo-line",
      { points: linePoints },
      this.scene
    );
    const mat = new StandardMaterial("lineMat", this.scene);
    mat.emissiveColor = lineColor;
    lines.material = mat;
  }

  private createLabelForFeature(
    geometry: any,
    name: string,
    options: GeoJsonStyle
  ) {
    const centroid = this.computeCentroid(geometry);
    if (centroid) {
      const radius = 1.001 + (options.radiusOffset || 0);
      const { lat, lon } = centroid;
      const { x, y, z } = SpatialTools.toCartesian(lat, lon, radius + 0.02);
      this.createLabel3D(name, new Vector3(x, y, z));
    }
  }

  private computeCentroid(geometry: any): { lat: number; lon: number } | null {
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

    const getPolygonArea = (polygon: number[][][]): number => {
      let area = 0;
      const ring = polygon[0]; // Use the outer ring for area calculation
      for (let i = 0; i < ring.length; i++) {
        const [x1, y1] = ring[i];
        const [x2, y2] = ring[(i + 1) % ring.length];
        area += x1 * y2 - x2 * y1;
      }
      return Math.abs(area / 2);
    };

    switch (geometry.type) {
      case "Polygon":
        geometry.coordinates.forEach(addPoints);
        break;
      case "MultiPolygon": {
        let largestPolygon: number[][][] | null = null;
        let maxArea = 0;
        geometry.coordinates.forEach((poly: number[][][]) => {
          const area = getPolygonArea(poly);
          if (area > maxArea) {
            maxArea = area;
            largestPolygon = poly;
          }
        });
        if (largestPolygon) {
          (largestPolygon as number[][][]).forEach(addPoints);
        }
        break;
      }
      case "Point":
        totalLon = geometry.coordinates[0];
        totalLat = geometry.coordinates[1];
        count = 1;
        break;
      case "MultiPoint":
        geometry.coordinates.forEach(([lon, lat]: number[]) => {
          totalLon += lon;
          totalLat += lat;
          count++;
        });
        break;
      default:
        return null;
    }

    if (count === 0) return null;
    return { lat: totalLat / count, lon: totalLon / count };
  }

  private createLabel3D(text: string, position: Vector3) {
    const textureWidth = 64;
    const textureHeight = 24;

    const dynamicTexture = new DynamicTexture(
      "labelTexture",
      { width: textureWidth, height: textureHeight },
      this.scene,
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

    const plane = MeshBuilder.CreatePlane(
      "label",
      { width: 0.12, height: 0.04 },
      this.scene
    );
    plane.position = position;

    const labelMat = new StandardMaterial("labelMat", this.scene);
    labelMat.diffuseTexture = dynamicTexture;
    labelMat.emissiveColor = new Color3(1, 1, 1);
    labelMat.backFaceCulling = false;
    labelMat.specularColor = new Color3(0, 0, 0);
    labelMat.alpha = 0.8;

    plane.material = labelMat;
    plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
    plane.scaling.scaleInPlace(0.8);
  }
}
