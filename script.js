// Variable para almacenar la instancia del mapa
let map; 

// Variable global para mantener la referencia a la capa GeoJSON actual
let currentGeoJsonLayer = null; 

// Inicialización del mapa (solo se ejecuta una vez al inicio)
function initializeMap() {
    // 1. Inicializa el mapa y establece la vista inicial.
    map = L.map('map').setView([-34.6037, -58.3816], 6); 

    // 2. Agrega la capa base (OpenStreetMap)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap' 
    }).addTo(map);

    // 3. Configura el evento de cambio del selector
    document.getElementById('map-selector').addEventListener('change', function() {
        const fileName = this.value;
        if (fileName) {
            // Llama a la función de carga con el nombre del archivo seleccionado
            loadGeoJsonMap(fileName);
        } else {
            // Si selecciona "--- Seleccione ---", quita el mapa actual
            removeCurrentGeoJson();
        }
    });

    console.log("Mapa base inicializado.");
}

// Función para eliminar la capa GeoJSON actualmente visible
function removeCurrentGeoJson() {
    if (currentGeoJsonLayer) {
        map.removeLayer(currentGeoJsonLayer);
        currentGeoJsonLayer = null;
        console.log("Capa GeoJSON anterior eliminada.");
    }
}

// Función principal para cargar y dibujar el GeoJSON
function loadGeoJsonMap(fileName) {
    // 1. Quitar la capa GeoJSON anterior antes de cargar la nueva
    removeCurrentGeoJson();

    // 2. Construir la URL completa (asumiendo que los archivos están en la raíz del mismo servidor)
    // NOTA: Si usas GitHub Pages y el archivo está en la raíz, './' funciona bien.
    const geojsonUrl = `./${fileName}`; 

    // 3. Cargar los datos
    fetch(geojsonUrl)
        .then(response => {
            if (!response.ok) {
                // Si hay error (ej. archivo no existe), lo reportamos
                throw new Error(`Error HTTP: ${response.status} - No se encontró el archivo ${fileName}`);
            }
            return response.json();
        })
        .then(data => {
            // 4. Crear y añadir la nueva capa GeoJSON
            currentGeoJsonLayer = L.geoJSON(data, {
                style: function (feature) {
                    return {
                        fillColor: '#0070c0', 
                        weight: 2,
                        opacity: 1,
                        color: 'white', 
                        fillOpacity: 0.5
                    };
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.nombre) {
                        const nombre = feature.properties.nombre;
                        layer.bindPopup("<b>Nombre:</b> " + nombre);
                        layer.bindTooltip(nombre, {
                            permanent: false, 
                            direction: 'center', 
                            className: 'geojson-tooltip'
                        });
                    }
                }
            }).addTo(map);

            // 5. Ajustar la vista al nuevo mapa
            map.fitBounds(currentGeoJsonLayer.getBounds());
            
            console.log(`Archivo ${fileName} cargado y visualizado correctamente.`);
        })
        .catch(error => {
            console.error('Hubo un error al cargar el GeoJSON:', error);
            // Mostrar un mensaje de error al usuario si lo deseas
        });
}

// Iniciar la aplicación al cargar la página
initializeMap();