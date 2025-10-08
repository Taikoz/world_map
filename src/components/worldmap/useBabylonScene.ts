import { useEffect, useState } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Color3,
  Animation,
  CubicEase,
  EasingFunction,
} from "@babylonjs/core";

export const useBabylonScene = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const [scene, setScene] = useState<Scene | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.05, 0.05, 0.05).toColor4();

    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      4,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 1.1;
    camera.upperRadiusLimit = 25;
    camera.wheelPrecision = 50;
    camera.minZ = 0.1;

    const cameraAnimation = new Animation(
      "cameraZoom",
      "radius",
      60,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    cameraAnimation.setKeys([
      { frame: 0, value: 8 },
      { frame: 120, value: 2.5 },
    ]);
    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
    cameraAnimation.setEasingFunction(ease);
    camera.animations.push(cameraAnimation);
    scene.beginAnimation(camera, 0, 120, false);

  

    const directionalLight = new HemisphericLight(
      "dirLight",
      new Vector3(1, -0.5, 1),
      scene
    );
    directionalLight.intensity = 1.2;

    setScene(scene);

    

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      engine.dispose();
    };
  }, [canvasRef]);

  return scene;
};
