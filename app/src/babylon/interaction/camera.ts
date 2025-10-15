import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";

// Crée une ArcRotateCamera pour globe / plan
export const createSurfaceCamera = (scene: Scene, globeDiameter = 2) => {
  const target = new Vector3(0, 0, 0);
  const camera = new ArcRotateCamera(
    "surfaceCamera",
    Math.PI / 2,       // alpha
    Math.PI / 3,       // beta (angle)
    globeDiameter * 2, // start far enough
    target,
    scene
  );

  camera.lowerRadiusLimit = 0.01;  // Allow to zoom very close to the surface
  camera.upperRadiusLimit = globeDiameter * 50;   // zoom arrière maximum
  camera.wheelDeltaPercentage = 0.005;            // zoom smooth
  camera.minZ = 0.01;                             // clipping minimal
  camera.checkCollisions = true;
  camera.collisionRadius = new Vector3(0.01, 0.01, 0.01);
  camera.attachControl(scene.getEngine().getRenderingCanvas(), true);


  return camera;
};
