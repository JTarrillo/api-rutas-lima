const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Datos del grafo basados en el PDF con coordenadas reales
const nodes = {
    A: { name: 'Óvalo de Miraflores', lat: -12.11925, lng: -77.02907 },
    B: { name: 'Av. Arequipa con Av. Angamos', lat: -12.11384, lng: -77.03007 },
    C: { name: 'Av. Petit Thouars con Av. Aramburú', lat: -12.10800, lng: -77.02950 },
    D: { name: 'Av. Arequipa con Av. Javier Prado', lat: -12.09221, lng: -77.03306 },
    E: { name: 'Av. Paseo de la República con Av. Javier Prado', lat: -12.09150, lng: -77.02800 },
    F: { name: 'Hospital Edgardo Rebagliati Martins', lat: -12.07793, lng: -77.04300 }
};

const edges = [
    { from: 'A', to: 'B', weight: 8, street: 'Av. Arequipa' },
    { from: 'A', to: 'C', weight: 7, street: 'Av. Petit Thouars' },
    { from: 'B', to: 'D', weight: 12, street: 'Av. Arequipa' },
    { from: 'C', to: 'D', weight: 9, street: 'Av. Aramburú → Av. Arequipa' },
    { from: 'D', to: 'E', weight: 6, street: 'Av. Javier Prado' },
    { from: 'D', to: 'F', weight: 10, street: 'Av. Arequipa' },
    { from: 'E', to: 'F', weight: 8, street: 'Av. Paseo de la República' }
];

// Algoritmo de Dijkstra para encontrar la ruta más corta
function dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(nodes));

    // Inicializar distancias
    for (const node in nodes) {
        distances[node] = Infinity;
    }
    distances[start] = 0;

    while (unvisited.size > 0) {
        // Encontrar el nodo no visitado con menor distancia
        let current = null;
        let minDist = Infinity;
        for (const node of unvisited) {
            if (distances[node] < minDist) {
                minDist = distances[node];
                current = node;
            }
        }

        if (current === null || current === end) break;

        unvisited.delete(current);

        // Buscar vecinos
        const neighbors = edges.filter(e => e.from === current || e.to === current);
        for (const edge of neighbors) {
            const neighbor = edge.from === current ? edge.to : edge.from;
            if (!unvisited.has(neighbor)) continue;

            const alt = distances[current] + edge.weight;
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = current;
            }
        }
    }

    // Reconstruir ruta
    const path = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = previous[current];
    }

    if (path[0] !== start) {
        return null; // No hay ruta
    }

    return {
        path,
        totalDistance: distances[end],
        steps: path.map((node, i) => ({
            node,
            name: nodes[node].name,
            lat: nodes[node].lat,
            lng: nodes[node].lng,
            cumulativeTime: i === 0 ? 0 : distances[node]
        }))
    };
}

// API Endpoints
app.get('/api/nodes', (req, res) => {
    res.json(nodes);
});

app.get('/api/edges', (req, res) => {
    res.json(edges);
});

app.get('/api/route/:from/:to', (req, res) => {
    const { from, to } = req.params;
    const result = dijkstra(from.toUpperCase(), to.toUpperCase());

    if (!result) {
        return res.status(404).json({ error: 'No route found' });
    }

    res.json(result);
});

app.get('/api/all-routes', (req, res) => {
    const allRoutes = [];
    const startNode = 'A';
    const endNode = 'F';

    // Rutas específicas del PDF
    const routes = [
        ['A', 'B', 'D', 'F'],
        ['A', 'C', 'D', 'F'],
        ['A', 'B', 'D', 'E', 'F'],
        ['A', 'C', 'D', 'E', 'F']
    ];

    for (const route of routes) {
        let totalTime = 0;
        const steps = [];

        for (let i = 0; i < route.length - 1; i++) {
            const edge = edges.find(e =>
                (e.from === route[i] && e.to === route[i + 1]) ||
                (e.to === route[i] && e.from === route[i + 1])
            );
            if (edge) {
                totalTime += edge.weight;
                steps.push({
                    from: route[i],
                    to: route[i + 1],
                    street: edge.street,
                    time: edge.weight
                });
            }
        }

        allRoutes.push({
            path: route,
            totalTime,
            steps,
            coordinates: route.map(node => ({
                id: node,
                name: nodes[node].name,
                lat: nodes[node].lat,
                lng: nodes[node].lng
            }))
        });
    }

    // Ordenar por tiempo total
    allRoutes.sort((a, b) => a.totalTime - b.totalTime);

    res.json(allRoutes);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
