import type City from "../interfaces/city"
import Separator from "./commons/Separator";

interface CityInfosProps {
    city: City | null | undefined;
    className?: string;
}

export default function CityInformation({ city, className = "" }: CityInfosProps) {
    if (!city) return null;

    return (
        <div className={`z-50 w-full md:w-80 transition-all duration-500 ${className}`}>
            <div className="relative p-6 bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden">
                
                {/* Effet de lueur animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 animate-pulse"></div>
                
                
                
                {/* Contenu */}
                <div className="relative z-10">
                    {/* Icône de localisation */}
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                                {city.city}
                            </h3>
                            <p className="text-cyan-200/70 text-sm font-medium">{city.country}</p>
                        </div>
                    </div>
                    
                    {/* Séparateur */}
                   <Separator />
                    
                    {/* Population */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-indigo-400/30">
                            <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-cyan-200/60 text-xs font-medium uppercase tracking-wider">Population</p>
                            <p className="text-xl font-bold text-white">{city.population.toLocaleString()}</p>
                        </div>
                    </div>
                    

                    
                </div>
                
            </div>
        </div>
    );
}