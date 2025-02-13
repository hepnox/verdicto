'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HeatmapLayer } from './component';
import { getCrimeReports } from './action';
import styles from './map.module.css';

export default function MapPage() {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        const fetchReports = async () => {
            const data = await getCrimeReports();
            setReports(data);
        };
        fetchReports();
    }, []);

    const points = reports
        .filter(report => report.geolocations)
        .map(report => [
            report.geolocations.latitude,
            report.geolocations.longitude,
            5 // increased base intensity value
        ]);

    return (
        <div className={styles.mapContainer}>
            <MapContainer
                center={[0, 0]} // Center at equator for world view
                zoom={2} // Very zoomed out - world view
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HeatmapLayer 
                    points={points}
                    options={{
                        radius: 50, // Much larger radius for world view
                        blur: 30, // Increased blur for smoother appearance
                        maxZoom: 15,
                        max: 10,
                        minOpacity: 0.3, // Lower opacity for better visibility at world scale
                        gradient: {
                            0.4: 'blue',
                            0.6: 'lime',
                            0.8: 'yellow',
                            1.0: 'red'
                        }
                    }}
                />
            </MapContainer>
        </div>
    );
}