import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";

export class SurfaceCamera extends ArcRotateCamera {
  private _globeDiameter: number;
  constructor(scene: Scene, globeDiameter = 2) {
    super(
      "surfaceCamera",
      Math.PI / 2,
      Math.PI / 3,
      globeDiameter * 2,
      Vector3.Zero(),
      scene
    );
    this._globeDiameter = globeDiameter;
    this.setupCamera();
    this.addBeforeRenderObservable();
  }

  public get globeDiameter(): number {
    return this._globeDiameter;
  }

  public set wheelDelta(value: number) {
    this.wheelDeltaPercentage = value;
  }

  public get wheelDelta(): number {
    return this.wheelDeltaPercentage;
  }

  private setupCamera(): void {
    this.lowerRadiusLimit = 0.01;
    this.upperRadiusLimit = this._globeDiameter * 50;
    this.wheelDeltaPercentage = 0.005;
    this.minZ = 0.01;
    this.checkCollisions = true;
    this.panningSensibility = 0;
    this.zoomToMouseLocation = true;
    this.collisionRadius = new Vector3(0.01, 0.01, 0.01);
    this.attachControl(this.getScene().getEngine().getRenderingCanvas(), true);
  }

  private addBeforeRenderObservable(): void {
    this.getScene().onBeforeRenderObservable.add(() => {
      const center = Vector3.Zero();
      const lerpFactor = 0.02;
      this.target = Vector3.Lerp(this.target, center, lerpFactor);
    });
  }
}