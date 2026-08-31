import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locationService, LocationRecord } from '../services/location';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const customIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapaPageProps {
  incidentId?: string;
}

export const MapaPage: React.FC<MapaPageProps> = ({ incidentId = 'demo-incident' }) => {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await locationService.getIncidentLocations(incidentId);
      setLocations(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao carregar localizações.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      setUpdating(true);
      setErrorMsg(null);
      await locationService.saveLocation(incidentId);
      await fetchLocations();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao obter localização do GPS.');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [incidentId]);

  const latestLocation = locations[locations.length - 1];
  const polylinePositions = locations.map((loc) => [loc.latitude, loc.longitude] as [number, number]);

  if (loading) {
    return <div className="p-4 text-center">Carregando mapa e coordenadas...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 bg-gray-900 text-white flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">
            {latestLocation
              ? `Última atualização: ${new Date(latestLocation.created_at!).toLocaleTimeString()}`
              : 'Nenhuma localização registrada'}
          </span>
          <button
            onClick={handleUpdateLocation}
            disabled={updating}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm disabled:opacity-50"
          >
            {updating ? 'Capturando...' : 'Atualizar Localização'}
          </button>
        </div>
        {errorMsg && <p className="text-red-400 text-xs mt-1">{errorMsg}</p>}
      </div>

      <div className="flex-1 w-full min-h-[400px] relative">
        {latestLocation ? (
          <MapContainer
            center={[latestLocation.latitude, latestLocation.longitude]}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {latestLocation.accuracy && (
              <Circle
                center={[latestLocation.latitude, latestLocation.longitude]}
                radius={latestLocation.accuracy}
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.15 }}
              />
            )}

            <Polyline positions={polylinePositions} color="blue" dashArray="5, 10" />

            {locations.map((loc, index) => (
              <Marker
                key={loc.id || index}
                position={[loc.latitude, loc.longitude]}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-xs">
                    <strong>Ponto #{index + 1}</strong>
                    <br />
                    Horário: {new Date(loc.created_at!).toLocaleTimeString()}
                    <br />
                    Precisão: {loc.accuracy ? `${Math.round(loc.accuracy)}m` : 'N/A'}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 text-sm">
            Clique no botão acima para capturar a primeira localização do incidente.
          </div>
        )}
      </div>
    </div>
  );
};

export default MapaPage;
