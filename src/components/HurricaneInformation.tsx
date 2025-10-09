import type { HurricanePointData } from "../interfaces/hurricane";
import Separator from "./commons/Separator";

interface HurricaneInformationProps {
  hurricane: HurricanePointData | null | undefined;
  className?: string;
}

export default function HurricaneInformation({
  hurricane,
  className = "",
}: HurricaneInformationProps) {
  if (!hurricane) return null;

  return (
    <div
      className={`z-50 w-full md:w-80 transition-all duration-500 ${className}`}
    >
      <div className="relative p-6 bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden">
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 animate-pulse"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Hurricane title */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                {hurricane.name}
              </h2>
              <p className="text-cyan-200/70 text-sm font-medium">
                Category: {hurricane.category}
              </p>
            </div>
          </div>

          <Separator />

          {/* Hurricane details */}
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-indigo-400/30">
                <svg
                  className="w-4 h-4 text-indigo-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3"
                  />
                </svg>
              </div>
              <div>
                <p className="text-cyan-200/60 text-xs font-medium uppercase tracking-wider">
                  Hour
                </p>
                <p className="text-xl font-bold text-white">
                  {hurricane.point.hour}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-indigo-400/30">
                <svg
                  className="w-4 h-4 text-indigo-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12h18M3 6h18M3 18h18"
                  />
                </svg>
              </div>
              <div>
                <p className="text-cyan-200/60 text-xs font-medium uppercase tracking-wider">
                  Wind
                </p>
                <p className="text-xl font-bold text-white">
                  {hurricane.point.power_kmh} km/h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
