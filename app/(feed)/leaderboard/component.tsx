'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';

// Extend window interface to include L.heatLayer
// declare global {
//     interface Window {
//         L: typeof L;
//     }
// }

// interface HeatmapLayerProps {
//     points: number[][];
// }

export function HeatmapLayer({ points }: { points: number[][] }) {
    const map = useMap();

    useEffect(() => {
        if (!map || !points.length) return;

        // @ts-ignore: Leaflet heat layer type is not recognized
        const heatLayer = L.heatLayer(points, {
            radius: 25,
            blur: 15,
            maxZoom: 10,
            max: 1.0,
            gradient: {
                0.4: 'blue',
                0.6: 'lime',
                0.8: 'yellow',
                1.0: 'red'
            }
        }).addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, points]);

    return null;
} 