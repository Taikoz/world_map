import { Vector3, Mesh, MeshBuilder, StandardMaterial, Color3, Scene, Material, ActionManager, ExecuteCodeAction } from "@babylonjs/core";

export class Point {
    public static create(x: number, y: number, z: number): Vector3 {
        return new Vector3(x, y, z);
    }

    public static createMesh(name: string, diameter: number, scene: Scene, color?: Color3, material?: Material): Mesh {
        const sphere = MeshBuilder.CreateSphere(name, { diameter }, scene);
        if (material) {
            sphere.material = material;
        } else if (color) {
            const newMaterial = new StandardMaterial(name + "-material", scene);
            newMaterial.diffuseColor = color;
            sphere.material = newMaterial;
        }
        return sphere;
    }

    public static enableHoverEffect(mesh: Mesh, hoveredMaterial: Material, originalMaterial: Material) {
        mesh.actionManager = mesh.actionManager || new ActionManager(mesh.getScene());

        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger,
                () => {
                    mesh.material = hoveredMaterial;
                }
            )
        );

        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger,
                () => {
                    mesh.material = originalMaterial;
                }
            )
        );
    }

    public static enableSelectEffect(mesh: Mesh, selectedMaterial: Material, onSelect?: (mesh: Mesh) => void) {
        mesh.actionManager = mesh.actionManager || new ActionManager(mesh.getScene());

        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger,
                () => {
                    mesh.material = selectedMaterial;
                    if (onSelect) {
                        onSelect(mesh);
                    }
                }
            )
        );
    }
}

export class Line {
    public static create(name: string, points: Vector3[], scene: Scene, color?: Color3): Mesh {
        const line = MeshBuilder.CreateLines(name, { points }, scene);
        if (color) {
            line.color = color;
        }
        return line;
    }
}

export class Polygon {
    public static create(name: string, points: Vector3[], holes: Vector3[][], scene: Scene, color?: Color3, material?: Material): Mesh {
        const polygon = MeshBuilder.CreatePolygon(name, { shape: points, holes }, scene);
        if (material) {
            polygon.material = material;
        } else if (color) {
            const newMaterial = new StandardMaterial(name + "-material", scene);
            newMaterial.diffuseColor = color;
            polygon.material = newMaterial;
        }
        return polygon;
    }
}

export class MultiPolygon {
    public static create(name: string, polygons: Vector3[][][], scene: Scene, color?: Color3, material?: Material): Mesh[] {
        const meshes: Mesh[] = [];
        polygons.forEach((polygon, i) => {
            const shape = polygon[0];
            const holes = polygon.slice(1);
            const mesh = Polygon.create(`${name}-${i}`, shape, holes, scene, color, material);
            meshes.push(mesh);
        });
        return meshes;
    }
}

export class MultiLineString {
    public static create(name: string, lines: Vector3[][], scene: Scene, color?: Color3): Mesh[] {
        const meshes: Mesh[] = [];
        lines.forEach((line, i) => {
            const mesh = Line.create(`${name}-${i}`, line, scene, color);
            meshes.push(mesh);
        });
        return meshes;
    }
}