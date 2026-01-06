
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin, Check, Navigation } from 'lucide-react';

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

          const customIcon = L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png', // Icono de Pizza para Vivazza
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
    <div className={isStatic ? "w-full h-full" : "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"}>
      <div className={isStatic ? "w-full h-full" : "bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"}>
        {!isStatic && (
            <div className="p-4 bg-vivazza-stone text-white flex justify-between items-center">
                <h3 className="font-heading text-xl flex items-center gap-2">
                    <MapPin className="text-vivazza-gold" size={20}/> Punto de Entrega
                </h3>
                <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full">
                    <X size={24} />
                </button>
            </div>
        )}

        <div className="relative w-full h-full min-h-[300px] bg-gray-100">
            <div ref={mapContainerRef} className="w-full h-full z-10" />
            {!isStatic && isLoading && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-1 rounded-full text-xs font-bold shadow-md z-[500] animate-pulse text-vivazza-stone">
                    Buscando dirección...
                </div>
            )}
        </div>

        {!isStatic && (
            <div className="p-6 bg-white border-t border-gray-100">
                <div className="mb-4">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Dirección Detectada</p>
                    <p className="text-lg font-medium text-vivazza-stone leading-tight">{currentAddress}</p>
                </div>

                <button 
                    onClick={handleConfirm}
                    className="w-full bg-vivazza-red text-white py-3 rounded-xl font-heading text-xl shadow-red hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Check size={20} />
                    Confirmar para WhatsApp
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LocationMap;
