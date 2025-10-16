import {
  Scene,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Color3,
} from "@babylonjs/core";
import earthTextureUrl from "../assets/earth.jpg";
import earthNormalTexture from "../assets/earth_normal.jpg";
import earthSpecularTextureUrl from "../assets/earth_specular.jpg";
import earthTextureNight from "../assets/earth_nightmap.jpg";
import WorldGeoJsonUrl from "../utils/world.geojson?url";

import { GeoJson } from "./geojson";

export class Earth {
  private _sphere!: Mesh;
  private _material!: StandardMaterial;
  readonly scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this._material = this.createMaterial();
    this._sphere = this.createSphere();
    this.drawCountryBorders();
  }

  public get sphere(): Mesh {
    return this._sphere;
  }

  public get material(): StandardMaterial {
    return this._material;
  }

  private createSphere(): Mesh {
    const sphere = MeshBuilder.CreateSphere(
      "earth",
      { diameter: 2, segments: 64 },
      this.scene
    );
    sphere.material = this._material;
    sphere.checkCollisions = true;
    sphere.rotation.x = Math.PI;
    sphere.rotation.y = Math.PI / 2;
    return sphere;
  }

  private createMaterial(): StandardMaterial {
    const earthMaterial = new StandardMaterial("earthMat", this.scene);
    earthMaterial.diffuseTexture = new Texture(earthTextureUrl, this.scene);
    earthMaterial.bumpTexture = new Texture(earthNormalTexture, this.scene);
    earthMaterial.bumpTexture.level = 9;
    earthMaterial.specularTexture = new Texture(
      earthSpecularTextureUrl,
      this.scene
    );
    earthMaterial.specularColor = new Color3(1, 0.3, 0.5);
    earthMaterial.specularPower = 10;
    earthMaterial.emissiveTexture = new Texture(earthTextureNight, this.scene);
    earthMaterial.emissiveColor = new Color3(0.01, 0.01, 0.1);
    return earthMaterial;
  }

  private drawCountryBorders(): void {
    const geoJson = new GeoJson(this.scene);
    geoJson.load(WorldGeoJsonUrl, {
      color: Color3.FromInts(56, 173, 169),
    });
    
  }
}