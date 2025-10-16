import { useEffect, useRef, useState } from "react";

import citiesData from "../utils/cities.json";
import { useBabylonScene } from "../babylon/babylonScene";

import { CityOnMap } from "../babylon/cityOnMap";
import type City from "../interfaces/city";
import CityInformation from "./cityInformation";
import { Earth } from "../babylon/earth";



export default function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  
  const scene = useBabylonScene(canvasRef);

  useEffect(() => {
    if (scene) {
      const earth = new Earth(scene);
      const sphere = earth.sphere;
      const cityOnMap = new CityOnMap(scene, sphere);

      cityOnMap.enableInteractions(setHoveredCity);

      setTimeout(() => setIsLoaded(true), 250);
    }
  }, [scene]);

  return (
    <div className="w-full h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full h-full">
        <div className="col-span-1 md:col-span-1 bg-gray-900 text-white p-4 overflow-auto">
          <div
            className={`absolute top-8 left-4 md:left-8 z-10 transition-all duration-1000 ${ isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              Globe Interactif
            </h1>
            <p className="text-cyan-200/70 text-lg">
              Explorez les villes du monde
            </p>
          </div>

          <div
            className={`absolute bottom-8 left-4 md:left-8 z-10 transition-all duration-1000 ${ isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-cyan-400">
                {citiesData.length} 🏙️
              </div>
              <div className="text-sm text-cyan-200/60">
                Villes disponibles 
              </div>
            </div>
          </div>
        </div>
        <CityInformation
          className="relative md:fixed top-80 z-50"
          city={hoveredCity}
        />
        <div className="col-span-1 md:col-span-2 relative">
          <canvas ref={canvasRef} className="w-full h-full " />

          <div
            className={`absolute bottom-8 right-4 md:right-8 z-10 transition-all duration-1000 ${ isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4 text-cyan-200/80 text-sm">
              <div className="font-semibold mb-2 text-cyan-400">
                💡 Contrôles
              </div>
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
  );
}
