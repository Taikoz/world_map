import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Color3,
  GlowLayer,
} from "@babylonjs/core";
import earthTextureUrl from "../../assets/earth.jpg";
import earthNormalTexture from "../../assets/earth_normal.jpg";
import earthSpecularTextureUrl from "../../assets/earth_specular.jpg";

export const createEarth = (scene: Scene) => {
  const gl = new GlowLayer("glow", scene);
  gl.intensity = 0.6;

  const sphere = MeshBuilder.CreateSphere(
    "earth",
    { diameter: 2, segments: 64 },
    scene
  );

  const earthMaterial = new StandardMaterial("earthMat", scene);
  earthMaterial.diffuseTexture = new Texture(earthTextureUrl, scene);
  earthMaterial.bumpTexture = new Texture(earthNormalTexture, scene);
  earthMaterial.bumpTexture.level = 8;
  earthMaterial.specularTexture = new Texture(earthSpecularTextureUrl, scene);
  earthMaterial.specularColor = new Color3(1, 0.3, 0.5);
  earthMaterial.emissiveColor = new Color3(0.05, 0.08, 0.1);

  sphere.material = earthMaterial;
  sphere.rotation.x = Math.PI;

  scene.registerBeforeRender(() => {
    sphere.rotation.y += 0.0002;
  });

  return { sphere, gl };
};
