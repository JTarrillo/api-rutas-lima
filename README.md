# API Rutas Lima - Optimización de Rutas Médicas

API con mapas para optimizar rutas de emergencias médicas en Lima, Perú. Basado en el proyecto de matemáticas discretas sobre optimización de rutas desde el Óvalo de Miraflores al Hospital Rebagliati.

## Características

- 🗺️ Mapa interactivo con Leaflet y OpenStreetMap (100% gratis)
- 🚑 Visualización de rutas para emergencias médicas
- 📊 Algoritmo de Dijkstra para encontrar la ruta óptima
- 📍 6 nodos representando intersecciones clave de Lima
- ⏱️ Cálculo de tiempos de viaje en hora punta

## Tecnologías

- **Backend**: Node.js + Express
- **Frontend**: HTML + JavaScript + Leaflet
- **Mapas**: OpenStreetMap (gratis y open source)

## Instalación

```bash
cd api-rutas-lima
npm install
npm start
```

El servidor correrá en http://localhost:3000

## Endpoints de la API

### GET /api/nodes
Devuelve todos los nodos con sus coordenadas:

```json
{
  "A": {
    "name": "Óvalo de Miraflores",
    "lat": -12.1185,
    "lng": -77.0305
  },
  ...
}
```

### GET /api/edges
Devuelve todas las aristas con sus pesos (tiempos en minutos):

```json
[
  {
    "from": "A",
    "to": "B",
    "weight": 8,
    "street": "Av. Arequipa"
  },
  ...
]
```

### GET /api/route/:from/:to
Encuentra la ruta óptima entre dos nodos usando Dijkstra:

```bash
curl http://localhost:3000/api/route/A/F
```

### GET /api/all-routes
Devuelve todas las rutas posibles ordenadas por tiempo:

```bash
curl http://localhost:3000/api/all-routes
```

## Nodos del Sistema

- **A**: Óvalo de Miraflores (Punto de Origen)
- **B**: Av. Arequipa con Av. Angamos
- **C**: Av. Petit Thouars con Av. Aramburú
- **D**: Av. Arequipa con Av. Javier Prado
- **E**: Av. Paseo de la República con Av. Javier Prado
- **F**: Hospital Edgardo Rebagliati Martins (Punto de Destino)

## Ruta Óptima

La ruta más rápida en hora punta es: **A → C → D → F** (26 minutos)

Esta ruta usa Av. Petit Thouars como alternativa para evitar el congestionamiento en Av. Arequipa.

## Uso de la Interfaz Web

1. Abre http://localhost:3000 en tu navegador
2. Haz clic en "Cargar Todas las Rutas" para ver todas las opciones
3. Haz clic en "Ruta Óptima" para ver solo la mejor ruta
4. Haz clic en cualquier ruta en el panel derecho para resaltarla en el mapa

## Datos del Proyecto Original

Basado en el proyecto académico "Optimización de rutas para Emergencias Médicas en hora punta: Del Óvalo de Miraflores al Hospital Rebagliati" - Lima, Perú (2026)
