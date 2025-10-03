interface Coordinate {
    latitude: number,
    longitude: number
}

interface CoordinateBoundingBox {
    latitude_max: number,
    longitude_max: number,
    latitude_min: number,
    longitude_min: number
}

export default interface City  {
    
    city: string,
    country: string,
    population: number,
    coordinates: Coordinate,
    bounding_box: CoordinateBoundingBox
}


