
 interface Hurricane {
    name: string,
    category: number,
    start: string,
    end: string,
    points: Point[]
}

interface Point {
    hour: string,
    latitude: number,
    longitude: number,
    power_kmh: number
}

interface HurricanePointData {
    name: string;
    category: number;
    start: string;
    end: string;
    point: Point;
}

export type {
    Hurricane,
    Point,
    HurricanePointData
}

