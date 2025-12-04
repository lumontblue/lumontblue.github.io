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
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        
        const geoJsonLayer = L.geoJSON(data, {
            
            style: function (feature) {
                return {
                    fillColor: '#0070c0', 
                    weight: 2,
                    opacity: 1,
                    color: 'white', 
                    fillOpacity: 0.5
                };
            },

            // --- ESTA ES LA CLAVE: Añadir Tooltips y Popups ---
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.nombre) {
                    const nombre = feature.properties.nombre;

                    // 1. Añade el Pop-up (al hacer clic)
                    // (Esta parte ya estaba para que no la pierdas)
                    layer.bindPopup("<b>Nombre:</b> " + nombre);

                    // 2. Añade el Tooltip (al pasar el mouse)
                    layer.bindTooltip(nombre, {
                        permanent: false, // Desaparece cuando el mouse se va
                        direction: 'center', // Aparece centrado sobre la geometría
                        className: 'geojson-tooltip' // Opcional: clase para CSS personalizado
                    });
                }
            }
            // ---------------------------------------------------

        }).addTo(map);

        // Opcional: Centrar el mapa a la extensión de los datos cargados
        map.fitBounds(geoJsonLayer.getBounds());
        
        console.log("GeoJSON cargado y visualizado correctamente.");
    })
    .catch(error => {
        console.error('Hubo un error al cargar el GeoJSON:', error);
    });
