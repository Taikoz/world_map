import { Vector3 } from "@babylonjs/core/Maths/math.vector";

const EARTH_RADIUS = 1.0; 

export class SpatialTools {
    static convertGeoToCartesian(lat: number, lon: number): Vector3 {
        const rad_lat = (lat * Math.PI) / 180; 
        const rad_long = (lon * Math.PI) / 180; 

        const x = -Math.cos(rad_lat) * Math.cos(rad_long);
        const y = -Math.sin(rad_lat);
        const z = Math.cos(rad_lat) * Math.sin(rad_long);

        return new Vector3(x, y, z);
    }

    static toCartesian(lat: number, lon: number, radius: number = EARTH_RADIUS) {
        
        const latRad = lat * (Math.PI / 180);
        const lonRad = lon * (Math.PI / 180);
        
        
        const lonRadAdjusted = lonRad + (Math.PI / 2); 

        
        const cosLat = Math.cos(latRad);
        
        
        const y = radius * Math.sin(latRad);
        
    
        const x = radius * cosLat * Math.cos(lonRadAdjusted);
        
        const z = radius * cosLat * Math.sin(lonRadAdjusted);
        

        return { x, y: y, z: z };
    };
}
