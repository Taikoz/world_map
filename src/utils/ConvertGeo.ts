import { Vector3 } from "@babylonjs/core/Maths/math.vector";



export default function convertGeoToCartesian(lat: number, lon: number): Vector3 {
    const rad_lat = (lat * Math.PI) / 180; 
    const rad_long = (lon * Math.PI) / 180; 

    const x = -Math.cos(rad_lat) * Math.cos(rad_long);
    const y = -Math.sin(rad_lat);
    const z = Math.cos(rad_lat) * Math.sin(rad_long);

    return new Vector3(x, y, z);
}
