
import type { HurricanePointData } from "../interfaces/hurricane";

interface HurricaneInformationProps {
  hurricane: HurricanePointData | null;
  className?: string;
}

export default function HurricaneInformation({ hurricane, className }: HurricaneInformationProps) {
  if (!hurricane) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold">{hurricane.name}</h2>
      <p>Category: {hurricane.category}</p>
      <p>Hour: {hurricane.point.hour}</p>
      <p>Wind: {hurricane.point.power_kmh} km/h</p>
    </div>
  );
}
