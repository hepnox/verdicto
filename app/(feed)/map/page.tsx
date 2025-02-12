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
            1 // intensity value
        ]);

    return (
        <div className={styles.mapContainer}>
            <MapContainer
                center={[14.5995, 120.9842]} // Manila coordinates
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HeatmapLayer points={points} />
            </MapContainer>
        </div>
    );
}