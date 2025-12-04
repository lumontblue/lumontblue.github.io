// 1. Inicializa el mapa y establece la vista inicial.
// (Asegúrate de ajustar las coordenadas y el zoom para que se centren en tu área de interés)
var map = L.map('map').setView([-34.6037, -58.3816], 6); 

// 2. Agrega la capa base (OpenStreetMap)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap' 
}).addTo(map);

// --- URL del archivo GeoJSON en GitHub Pages ---
// IMPORTANTE: Reemplaza esta URL por la URL REAL de tu archivo GeoJSON.
const geojsonUrl = './dpa_comuna_subdere_4.geojson';

// 3. Función para cargar y mostrar el GeoJSON
fetch(geojsonUrl)
    .then(response => {
        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        // Convierte la respuesta a formato JSON
        return response.json();
    })
    .then(data => {
        // Asegúrate de que 'data' sea un objeto GeoJSON válido (FeatureCollection)

        // Crea una capa GeoJSON y la añade al mapa
        const geoJsonLayer = L.geoJSON(data, {
            // Aquí puedes definir funciones opcionales para personalizar la visualización

            // Función para estilizar las geometrías (opcional)
            style: function (feature) {
                return {
                    fillColor: '#0070c0', // Color de relleno azul
                    weight: 2,
                    opacity: 1,
                    color: 'white', // Color del borde
                    fillOpacity: 0.5
                };
            },

            // Función para añadir pop-ups (opcional)
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.nombre) {
                    // Crea un pop-up que muestre la propiedad 'nombre'
                    layer.bindPopup("<b>Nombre:</b> " + feature.properties.nombre);
                }
            }
        }).addTo(map);

        // Opcional: Centrar el mapa a la extensión de los datos cargados
        map.fitBounds(geoJsonLayer.getBounds());
        
        console.log("GeoJSON cargado y visualizado correctamente.");
    })
    .catch(error => {
        console.error('Hubo un error al cargar el GeoJSON:', error);
        // Muestra un mensaje de error en la consola o en el mapa si es necesario
    });
