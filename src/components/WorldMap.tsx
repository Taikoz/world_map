import { useEffect, useRef, useState } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Color3,
  PointerInfo,
  PointerEventTypes,
  Animation,
  EasingFunction,
  CubicEase,
  GlowLayer,
  Mesh,
  AbstractMesh,
  CubeTexture,
  ParticleSystem,
  

} from "@babylonjs/core";

import citiesData from "../utils/cities.json"

import earthTextureUrl from "../assets/earth.jpg"
import skyBoxTexture from "../assets/skybox.jpg"
import convertGeoToCartesian from "../utils/ConvertGeo";
import type City from "../interfaces/city";
import CityInformation from "./CityInformation";



export default function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.05,0.05,0.05).toColor4()


    
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      4,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 2.3; 
    camera.upperRadiusLimit = 25;

    const cameraAnimation = new Animation(
      "cameraZoom",
      "radius",
      60,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    cameraAnimation.setKeys([
      { frame: 0, value: 8 },
      { frame: 120, value: 4 },
    ]);
    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
    cameraAnimation.setEasingFunction(ease);
    camera.animations.push(cameraAnimation);
    scene.beginAnimation(camera, 0, 120, false);


    const hemisphericLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      scene
    );
    hemisphericLight.intensity = 0.6;

    const directionalLight = new HemisphericLight(
      "dirLight",
      new Vector3(1, 0.5, 1),
      scene
    );
    directionalLight.intensity = 0.5;

    
    const gl = new GlowLayer("glow", scene);
    gl.intensity = 0.8;


    const sphere = MeshBuilder.CreateSphere("earth", { diameter: 2, segments: 64}, scene);
    
    const earthMaterial = new StandardMaterial("earthMat", scene);
    earthMaterial.diffuseTexture = new Texture(earthTextureUrl, scene);
    earthMaterial.specularColor = new Color3(0.2, 0.3, 0.5);
    earthMaterial.emissiveColor = new Color3(0.05, 0.08, 0.10);
    
   
    sphere.material = earthMaterial;
    sphere.rotation.x = Math.PI
    

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
            { diameter: 0.025  },
            scene
        );

        if (!city.bounding_box) return;

        marker.position = position;
        marker.material = markerMaterial;
        marker.isPickable = true
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
        
    })

    let pulseValue = 0;
    scene.registerBeforeRender(() => {
      pulseValue += 0.02;
      const scale = 1 + Math.sin(pulseValue) * 0.15;
      markers.forEach((marker) => {
        if (marker.metadata !== hoveredCity) {
          marker.scaling = new Vector3(scale, scale, scale);
        }
      });
    });

    let currentHoveredMesh: AbstractMesh | null = null;
    let selectedCityMesh: AbstractMesh | null = null;
    

    scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
    if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
        const result = scene.pick(scene.pointerX, scene.pointerY);
        
        if (result?.pickedMesh?.metadata && result.pickedMesh !== sphere) {
        if (currentHoveredMesh !== result.pickedMesh) {
            if (currentHoveredMesh && currentHoveredMesh !== selectedCityMesh) {
            currentHoveredMesh.material = markerMaterial;
            currentHoveredMesh.scaling = new Vector3(1, 1, 1);
            }

            currentHoveredMesh = result.pickedMesh;

            if (currentHoveredMesh !== selectedCityMesh) {
            currentHoveredMesh.material = hoveredMarkerMaterial;
            }

            currentHoveredMesh.scaling = new Vector3(1.5, 1.5, 1.5);
            canvasRef.current!.style.cursor = "pointer";
        }
        } else {
        if (currentHoveredMesh && currentHoveredMesh !== selectedCityMesh) {
            currentHoveredMesh.material = markerMaterial;
            currentHoveredMesh.scaling = new Vector3(1, 1, 1);
        }
        currentHoveredMesh = null;
        canvasRef.current!.style.cursor = "default";
        }
    }

    if (pointerInfo.type === PointerEventTypes.POINTERPICK) {
        const result = pointerInfo.pickInfo;

        if (result && result.pickedMesh?.metadata) {
        
        if (selectedCityMesh && selectedCityMesh !== result.pickedMesh) {
            selectedCityMesh.material = markerMaterial;
        }

        selectedCityMesh = result.pickedMesh;
        selectedCityMesh.material = selectedMarkerMaterial; 

        setHoveredCity(selectedCityMesh.metadata);
        } else if (result?.pickedMesh === sphere) {
        if (selectedCityMesh) {
            selectedCityMesh.material = markerMaterial;
        }
        selectedCityMesh = null;
        setHoveredCity(null);
        }
    }
    });


    scene.registerBeforeRender(() => {
      sphere.rotation.y += 0.0005;
    });
     
    engine.runRenderLoop(() => {
      scene.render();
     
    });
    setTimeout(() => setIsLoaded(true), 250);

    
    

  }, []);

  

  return (
  <div className="w-full h-screen">
  <div className="grid grid-cols-3 gap-2 w-full h-full">
    
    <div className="col-span-1 bg-gray-900 text-white p-4 overflow-auto">
      <div className={`absolute top-8 left-8 z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
          Globe Interactif
        </h1>
        <p className="text-cyan-200/70 text-lg">
          Explorez les villes du monde
        </p>

      </div>

      <div className={`absolute bottom-8 left-8 z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4">
          <div className="text-3xl font-bold text-cyan-400">{citiesData.length} 🏙️</div>
          <div className="text-sm text-cyan-200/60">Villes disponibles </div>
        </div>
      </div>
    
      <CityInformation className="fixed top-40 left-20 z-50" city={hoveredCity} />
    
    </div>
    

    <div className="col-span-2 relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full "
      />

      <div className={`absolute bottom-8 right-8 z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4 text-cyan-200/80 text-sm">
          <div className="font-semibold mb-2 text-cyan-400">💡 Contrôles</div>
          <div className="space-y-1">
            <div>🖱️ Glisser pour tourner</div>
            <div>🔍 Molette pour zoomer</div>
            <div>👆 Cliquer sur les points</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
  )
}
