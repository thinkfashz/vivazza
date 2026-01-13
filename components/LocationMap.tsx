
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';

declare const L: any;

interface LocationMapProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: string, coords: { lat: number; lng: number }) => void;
  initialCoords?: { lat: number; lng: number };
  isStatic?: boolean;
}

const DEFAULT_CENTER = { lat: -35.4264, lng: -71.6554 };

const LocationMap: React.FC<LocationMapProps> = ({ isOpen, onClose, onConfirm, initialCoords, isStatic = false }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('Detectando ubicación...');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(initialCoords || DEFAULT_CENTER);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen || !mapContainerRef.current || mapInstanceRef.current || typeof L === 'undefined') return;

    const initMap = () => {
        if (!mapContainerRef.current) return;

        const startCoords = initialCoords || DEFAULT_CENTER;
        
        try {
          const map = L.map(mapContainerRef.current, {
              scrollWheelZoom: !isStatic,
              dragging: !isStatic,
              zoomControl: !isStatic
          }).setView([startCoords.lat, startCoords.lng], 16);
          
          L.tileLayer('https://{s}.tile.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; OpenStreetMap &copy; CARTO'
          }).addTo(map);

          // SVG Custom Icon - Pin Rojo Vivazza
          const customIcon = L.divIcon({
            html: `
              <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 40px; height: 40px; background-color: #cf1736; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>
                <div style="position: absolute; width: 12px; height: 12px; background-color: white; border-radius: 50%; top: 14px;"></div>
              </div>
            `,
            className: 'custom-pin',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });

          const marker = L.marker([startCoords.lat, startCoords.lng], { 
              draggable: !isStatic,
              icon: customIcon
          }).addTo(map);

          markerRef.current = marker;
          mapInstanceRef.current = map;

          if (!isStatic) {
              marker.on('dragend', async function(event: any) {
                  const position = marker.getLatLng();
                  const newCoords = { lat: position.lat, lng: position.lng };
                  setCurrentCoords(newCoords);
                  map.panTo(position);
                  await fetchAddress(newCoords.lat, newCoords.lng);
              });

              map.on('click', async function(e: any) {
                  marker.setLatLng(e.latlng);
                  const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
                  setCurrentCoords(newCoords);
                  map.panTo(e.latlng);
                  await fetchAddress(newCoords.lat, newCoords.lng);
              });
          }
          
          fetchAddress(startCoords.lat, startCoords.lng);
        } catch (err) {
          console.error("Leaflet init error", err);
        }
    };

    const timer = setTimeout(initMap, 200);

    return () => {
        clearTimeout(timer);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, [isOpen, isStatic, initialCoords]);

  const fetchAddress = async (lat: number, lng: number) => {
    if (isStatic && initialCoords) {
        setCurrentAddress("1 Oriente #1234, Centro, Talca");
        return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',').slice(0, 3).join(',');
        setCurrentAddress(parts);
      } else {
        setCurrentAddress('Ubicación seleccionada');
      }
    } catch (error) {
      setCurrentAddress('Ubicación seleccionada');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    onConfirm(currentAddress, currentCoords);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={isStatic ? "w-full h-full" : "fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"}>
      <div className={isStatic ? "w-full h-full" : "bg-white dark:bg-[#1d1d20] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"}>
        {!isStatic && (
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#1d1d20] dark:text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <MapPin className="text-[#cf1736]" size={20}/> Punto de Entrega
                </h3>
                <button onClick={onClose} className="hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>
        )}

        <div className="relative w-full h-full min-h-[400px] bg-gray-100 dark:bg-[#252528]">
            <div ref={mapContainerRef} className="w-full h-full z-10" />
            {!isStatic && isLoading && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/80 px-4 py-2 rounded-full text-[10px] font-bold uppercase shadow-md z-[500] animate-pulse text-[#cf1736]">
                    Buscando dirección...
                </div>
            )}
        </div>

        {!isStatic && (
            <div className="p-6 bg-white dark:bg-[#1d1d20] border-t border-black/5 dark:border-white/5">
                <div className="mb-6">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mb-1">Dirección Detectada</p>
                    <p className="text-lg font-bold text-[#1b0e10] dark:text-white leading-tight">{currentAddress}</p>
                </div>

                <button 
                    onClick={handleConfirm}
                    className="w-full bg-[#cf1736] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#b5142f] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    Confirmar Ubicación
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LocationMap;
