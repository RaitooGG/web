//LLAMADA DEL TOKEN PARA USAR LA API
mapboxgl.accessToken =
  "pk.eyJ1IjoibWp2YWxlbnp1ZWxhIiwiYSI6ImNrb2Fmdm9zZDBpM28ybnFtYTQ2Z2MwMnYifQ.ZY3jTw0-6tjUSOOJXJHsdw";

//TIPO DE MAPA, Y PUNTO PRINCIPAL, CC. COSTA VERDE, MAS ZOOM PARA MEJOR VISUAL
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [-71.60771598547599, 10.678641490527223],
  zoom: 12.3,
});

//BUSCAR PUNTOS DE CENTROS DE SALUD EN EL CUADRO DE BÚSQUEDA, POR NOMBRES O COORDENADAS
var customData = {
  features: [
    {
      type: "Feature",
      properties: {
        title: "HOSPITAL DE LA POLICÍA: CENTRO MEDICO POLICIAL SANIPEZ",
      },
      geometry: {
        coordinates: [-71.61832622364449, 10.723704756426379],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOSPITAL DR. ADOLFO PONS",
      },
      geometry: {
        coordinates: [-71.6216860378375, 10.718074778184363],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOSPITAL MILITAR MARACAIBO",
      },
      geometry: {
        coordinates: [-71.62284971853596, 10.711434463183632],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CLINICA DR. ADOLFO DEMPAIRE",
      },
      geometry: {
        coordinates: [-71.6174083038698, 10.663212037985513],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CLINICA PARAÍSO",
      },
      geometry: {
        coordinates: [-71.6158536957068, 10.684183653030622],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CLINICA ZULIA",
      },
      geometry: {
        coordinates: [-71.63617967097093, 10.631660089599306],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CLINICA FALCÓN",
      },
      geometry: {
        coordinates: [-71.60838054466065, 10.656734545946373],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOSPITAL DE NIÑOS DE VERITAS",
      },
      geometry: {
        coordinates: [-71.60962256012877, 10.647645019356643],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOSPITAL CLÍNICO",
      },
      geometry: {
        coordinates: [-71.62629293630013, 10.686114815734268],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "IECTAS",
      },
      geometry: {
        coordinates: [-71.63173676212203, 10.675326433187134],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOSPITAL UNIVERSITARIO DE MARACAIBO",
      },
      geometry: {
        coordinates: [-71.62832189238746, 10.673226302627862],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOSPITAL CASTILLO PLAZA",
      },
      geometry: {
        coordinates: [-71.63247453524819, 10.671511157737354],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CLINICA SAN LUCAS",
      },
      geometry: {
        coordinates: [-71.62651245487856, 10.668551395268135],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CLINICA DE OJOS",
      },
      geometry: {
        coordinates: [-71.61072975587612, 10.66946388795776],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CRUZ ROJA ZULIA",
      },
      geometry: {
        coordinates: [-71.61242824841412, 10.659305094387163],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "POLICLINICA MARACAIBO",
      },
      geometry: {
        coordinates: [-71.61041658850367, 10.671776127897276],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CENTRO MEDICO DE OCCIDENTE",
      },
      geometry: {
        coordinates: [-71.60965282951364, 10.667183180551365],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOSPITAL COROMOTO",
      },
      geometry: {
        coordinates: [-71.59639767454324, 10.677390770746635],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOGAR CLINICA SAN RAFAEL",
      },
      geometry: {
        coordinates: [-71.6041167599401, 10.680064811510979],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CENTRO MÉDICO DOCENTE MARÍA AUXILIADORA",
      },
      geometry: {
        coordinates: [-71.62915450984002, 10.667299334228327],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "CLINICA IZOT",
      },
      geometry: {
        coordinates: [-71.62162854457277, 10.67305914169676],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOSPITAL CHIQUINQUIRA",
      },
      geometry: {
        coordinates: [-71.61621315970943, 10.642507916687984],
        type: "Point",
      },
    },

    {
      type: "Feature",
      properties: {
        title: "HOSPITAL CENTRAL DE MARACAIBO",
      },
      geometry: {
        coordinates: [-71.605544292028813, 10.642008624526426],
        type: "Point",
      },
    },
  ],
  type: "FeatureCollection",
};

//EMOJI PARA DIFERENCIAR LOS LUGARES Y PALABRAS CLAVES, DE LOS CENTROS DE SALUD EN EL CUADRO DE BÚSQUEDA
function forwardGeocoder(query) {
  var matchingFeatures = [];
  for (var i = 0; i < customData.features.length; i++) {
    var feature = customData.features[i];
    // Handle queries with different capitalization
    // than the source data by calling toLowerCase().
    if (
      feature.properties.title.toLowerCase().search(query.toLowerCase()) !== -1
    ) {
      // Add a tree emoji as a prefix for custom
      // data results using carmen geojson format:
      // https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
      feature["place_name"] = "🏥 " + feature.properties.title;
      feature["center"] = feature.geometry.coordinates;
      feature["place_type"] = [
        "Hospital",
        "Clínica",
        "Cruz Roja",
        "Policlinica",
        "Centro",
      ];
      matchingFeatures.push(feature);
    }
  }
  return matchingFeatures;
}

/*AGREGAR CUADRO DE BÚSQUEDA, YA ACEPTA: PALABRAS CLAVES, NOMBRES, COORDENADAS PERO PRIMERO LOS NÚMEROS POSITIVOS, 
PERMITIR QUE LOS USUARIOS SOLO DEN CLICK, A LOS PUNTOS DE SALUD (MARCAS) CUANDO SE USA EL CUADRO DE BÚSQUEDA, 
YA ESTABLECIDOS EN EL SISTEMA*/
const Geolocation = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  localGeocoder: forwardGeocoder,
  zoom: 12,
  placeholder: "Buscar un Centro de Salud",
  mapboxgl: mapboxgl,
  language: "es-VE",
  reverseGeocode: true,
});
map.addControl(Geolocation);

map.on("style.load", () => {
  let activeMarker = null; // Variable para almacenar el marcador activo

  Geolocation.on("result", function (e) {
    var coordinates = e.result.center;
    var existingMarker = document.querySelector(
      `.mapboxgl-marker[data-id="${e.result.id}"]`
    );

    // Eliminar marcador anterior si existe
    if (activeMarker) {
      activeMarker.remove();
    }

    if (existingMarker) {
      // Si ya existe un marcador, activar su click event
      existingMarker.click();
    } else {
      // Crear un nuevo marcador con color personalizado si no existe
      activeMarker = new mapboxgl.Marker({ color: "green" }) // Cambia 'red' por el color que prefieras
        .setLngLat(coordinates)
        .addTo(map);

      activeMarker.getElement().addEventListener("click", () => {
        Navigation.setDestination(coordinates);
      });
    }
  });

  // Cuando el cuadro de búsqueda se limpia
  Geolocation.on("clear", function () {
    if (activeMarker) {
      activeMarker.remove(); // Remover el marcador del mapa
      activeMarker = null; // Reiniciar la variable del marcador activo
    }
  });
});

//AGREGAR CUADRO DE NAVEGACIÓN, DE PUNTA A HACIA PUNTO B, YA MUESTRA LA RUTA EN ESPAÑOL Y EN KILÓMETROS
const Navigation = new MapboxDirections({
  accessToken: mapboxgl.accessToken,
  unit: "metric",
  language: "es-VE",
  interactive: false,
});
map.addControl(Navigation, "top-left");

//BOTÓN PARA ACTIVAR Y MOSTRAR UBICACIÓN ACTUAL DEL USUARIO
const Geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  // When active the map will receive updates to the device's location as it changes.
  trackUserLocation: true,
  // Draw an arrow next to the location dot to indicate which direction the device is heading.
  showUserHeading: true,
  fitBoundsOptions: { maxZoom: 12.3 },
});
const updateCamera = Geolocate._updateCamera;

// replace updateCamera method with noop operation
Geolocate._updateCamera = function () {};

map.addControl(Geolocate);

/*UBICACIÓN ACTUAL DEL USUARIO, YA LO HACE DE FORMA AUTOMÁTICA, CUANDO LA PERSONA ENTRA O  RECARGA EL SISTEMA, Y 
  ESTE CONCEDE PERMISO DE UBICACIÓN DEL NAVEGADOR SE TE DETECTA LA UBICACIÓN INMEDIATAMENTE, Y ESTA 
  SE COLOCA EN EL PUNTA A DEL CUADRO DE NAVEGACIÓN DIRECTAMENTE*/
map.on("load", () => {
  Geolocate.once("geolocate", function (e) {
    Geolocate._updateCamera = updateCamera;
    var lon = e.coords.longitude;
    var ganiza = e.coords.latitude;
    var location = [lon, ganiza];
    Navigation.setOrigin(location);
  });
  
  Geolocate.trigger();
});


//AGREGAR BARRA DE ZOOM
map.addControl(new mapboxgl.NavigationControl());

//AGREAR BOTÓN DE FULL SCREEN
map.addControl(new mapboxgl.FullscreenControl());

//AGREGAR CUADRO PARA MOSTRAR ESCALA DEL MAPA
map.addControl(new mapboxgl.ScaleControl());

/*AGREGAR MARCAS O PUNTOS A LA VISTA DEL USUARIO DE LOS CENTROS DE SALUD, VAN 23 CENTROS ENTRE HOSPITALES 
Y CLÍNICAS, LAS MARCAS AZULES SON HOSPITALES 10, Y LAS MARCAS NEGRAS CLÍNICAS 13*/

//HOSPITAL DE LA POLICÍA: CENTRO MEDICO POLICIAL SANIPEZ
const marker1 = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([-71.61832622364449, 10.723704756426379]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOSPITAL DR. ADOLFO PONS
const marker2 = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([-71.6216860378375, 10.718074778184363]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOSPITAL MILITAR MARACAIBO
const marker3 = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([-71.62284971853596, 10.711434463183632]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CLINICA DR. ADOLFO DEMPAIRE
const marker4 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.6174083038698, 10.663212037985513]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CLINICA PARAÍSO
const marker5 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.6158536957068, 10.684183653030622]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CLINICA ZULIA
const marker6 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.63617967097093, 10.631660089599306]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CLINICA FALCÓN
const marker7 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.60838054466065, 10.656734545946373]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOSPITAL DE NIÑOS DE VERITAS, NO SE VISUALIZA EN MAPBOX, PERO ES LA UBICACIÓN REAL, SI ESTA AHI
const marker8 = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([-71.60962256012877, 10.647645019356643]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOSPITAL CLÍNICO
const marker9 = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([-71.62629293630013, 10.686114815734268]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//IECTAS
const marker10 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.63173676212203, 10.675326433187134]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOSPITAL UNIVERSITARIO DE MARACAIBO
const marker11 = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([-71.62832189238746, 10.673226302627862]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOSPITAL CASTILLO PLAZA
const marker12 = new mapboxgl.Marker() // initialize a new marker
  .setLngLat([-71.63247453524819, 10.671511157737354]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CLINICA SAN LUCAS, NO SE VISUALIZA EN MAPBOX, PERO ES LA UBICACIÓN REAL, SI ESTA AHI
const marker13 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.62651245487856, 10.668551395268135]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CLINICA DE OJOS, NO SE VISUALIZA EN MAPBOX, PERO ES LA UBICACIÓN REAL, SI ESTA AHI
const marker14 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.61072975587612, 10.66946388795776]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CRUZ ROJA ZULIA
const marker15 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.61242824841412, 10.659305094387163]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//POLICLINICA MARACAIBO
const marker16 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.61041658850367, 10.671776127897276]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CENTRO MÉDICO DE OCCIDENTE
const marker17 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.60965282951364, 10.667183180551365]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOSPITAL COROMOTO
const marker18 = new mapboxgl.Marker({}) // initialize a new marker
  .setLngLat([-71.59639767454324, 10.677390770746635]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOGAR CLINICA SAN RAFAEL
const marker19 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.6041167599401, 10.680064811510979]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CENTRO MÉDICO DOCENTE MARÍA AUXILIADORA
const marker20 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.62915450984002, 10.667299334228327]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//CLINICA IZOT
const marker21 = new mapboxgl.Marker({ color: "black" }) // initialize a new marker
  .setLngLat([-71.62162854457277, 10.67305914169676]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOSPITAL CHIQUINQUIRÁ
const marker22 = new mapboxgl.Marker({}) // initialize a new marker
  .setLngLat([-71.61621315970943, 10.642507916687984]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

//HOSPITAL CENTRAL DE MARACAIBO
const marker23 = new mapboxgl.Marker({}) // initialize a new marker
  .setLngLat([-71.605544292028813, 10.642008624526426]) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map

/*PERMITIR QUE LOS USUARIOS SOLO DEN CLICK, A LOS PUNTOS DE SALUD (MARCAS), YA ESTABLECIDOS EN EL SISTEMA, PARA QUE
NO HAYA COMPLICACIONES CON LA INTERFAZ DE ESTE MISMO Y SEA MAS FÁCIL LA INTERACCIÓN*/

//HOSPITAL DE LA POLICÍA: CENTRO MEDICO POLICIAL SANIPEZ
marker1.getElement().addEventListener("click", () => {
  var lngLat = marker1.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOSPITAL DR. ADOLFO PONS
marker2.getElement().addEventListener("click", () => {
  var lngLat = marker2.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOSPITAL MILITAR MARACAIBO
marker3.getElement().addEventListener("click", () => {
  var lngLat = marker3.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CLINICA DR. ADOLFO DEMPAIRE
marker4.getElement().addEventListener("click", () => {
  var lngLat = marker4.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CLINICA PARAÍSO
marker5.getElement().addEventListener("click", () => {
  var lngLat = marker5.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CLINICA ZULIA
marker6.getElement().addEventListener("click", () => {
  var lngLat = marker6.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CLINICA FALCÓN
marker7.getElement().addEventListener("click", () => {
  var lngLat = marker7.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOSPITAL DE NIÑOS DE VERITAS, NO SE VISUALIZA EN MAPBOX, PERO ES LA UBICACIÓN REAL, SI ESTA AHI
marker8.getElement().addEventListener("click", () => {
  var lngLat = marker8.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOSPITAL CLÍNICO
marker9.getElement().addEventListener("click", () => {
  var lngLat = marker9.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//IECTAS
marker10.getElement().addEventListener("click", () => {
  var lngLat = marker10.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOSPITAL UNIVERSITARIO DE MARACAIBO
marker11.getElement().addEventListener("click", () => {
  var lngLat = marker11.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOSPITAL CASTILLO PLAZA
marker12.getElement().addEventListener("click", () => {
  var lngLat = marker12.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CLINICA SAN LUCAS, NO SE VISUALIZA EN MAPBOX, PERO ES LA UBICACIÓN REAL, SI ESTA AHI
marker13.getElement().addEventListener("click", () => {
  var lngLat = marker13.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CLINICA DE OJOS, NO SE VISUALIZA EN MAPBOX, PERO ES LA UBICACIÓN REAL, SI ESTA AHI
marker14.getElement().addEventListener("click", () => {
  var lngLat = marker14.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CRUZ ROJA ZULIA
marker15.getElement().addEventListener("click", () => {
  var lngLat = marker15.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//POLICLINICA MARACAIBO
marker16.getElement().addEventListener("click", () => {
  var lngLat = marker16.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CENTRO MÉDICO DE OCCIDENTE
marker17.getElement().addEventListener("click", () => {
  var lngLat = marker17.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOSPITAL COROMOTO
marker18.getElement().addEventListener("click", () => {
  var lngLat = marker18.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOGAR CLINICA SAN RAFAEL
marker19.getElement().addEventListener("click", () => {
  var lngLat = marker19.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CENTRO MÉDICO DOCENTE MARÍA AUXILIADORA
marker20.getElement().addEventListener("click", () => {
  var lngLat = marker20.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//CLINICA IZOT
marker21.getElement().addEventListener("click", () => {
  var lngLat = marker21.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOSPITAL CHIQUINQUIRÁ
marker22.getElement().addEventListener("click", () => {
  var lngLat = marker22.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

//HOSPITAL CENTRAL DE MARACAIBO
marker23.getElement().addEventListener("click", () => {
  var lngLat = marker23.getLngLat();
  Navigation.setDestination([lngLat["lng"], lngLat["lat"]]);
});

// AGREGAR EDIFICIOS 3D
map.on("style.load", () => {
  const layers = map.getStyle().layers;
  const labelLayerId = layers.find(
    (layer) => layer.type === "symbol" && layer.layout["text-field"]
  ).id;

  map.addLayer(
    {
      id: "add-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.6,
      },
    },
    labelLayerId
  );
});

//PERMITIR METER COORDENADAS EN EL CUADRO DE BÚSQUEDA, PRIMERO LOS NÚMEROS POSITIVOS
const coordinatesGeocoder = function (query) {
  // Match anything which looks like
  // decimal degrees coordinate pair.
  const matches = query.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  );
  if (!matches) {
    return null;
  }

  function coordinateFeature(lng, lat) {
    return {
      center: [lng, lat],
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      place_name: "Lat: " + lat + " Lng: " + lng,
      place_type: ["coordinate"],
      properties: {},
      type: "Feature",
    };
  }

  const coord1 = Number(matches[1]);
  const coord2 = Number(matches[2]);
  const geocodes = [];

  if (coord1 < -90 || coord1 > 90) {
    // must be lng, lat
    geocodes.push(coordinateFeature(coord1, coord2));
  }

  if (coord2 < -90 || coord2 > 90) {
    // must be lat, lng
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  if (geocodes.length === 0) {
    // else could be either lng, lat or lat, lng
    geocodes.push(coordinateFeature(coord1, coord2));
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  return geocodes;
};

/*MOSTRAR UNA VENTANA EMERGENTE AL PASAR (HOVER) EL MOUSE EN CADA MARCA DE LOS CENTROS EN EL MAPA PARA MOSTRAR LOS NOMBRES
YA NO SE QUITA SOLA, AHORA SE MANTIENE EL NOMBRE, HASTA QUE PASE EL MOUSE EN OTRO CENTRO, HAGA CLICK EN LA X, QUE SE
ENCUENTRA EN LA PARTE SUPERIOR DERECHA, O DE CLICK EN CUALQUIER LUGAR DEL PARTE FUERA DEL NOMBRE DEL CENTRO*/
map.on("style.load", () => {
  map.addSource("places", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            description:
              "<strong>HOSPITAL DE LA POLICÍA: CENTRO MEDICO POLICIAL SANIPEZ</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.61832622364449, 10.723704756426379],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOSPITAL DR. ADOLFO PONS</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.6216860378375, 10.718074778184363],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOSPITAL MILITAR MARACAIBO</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.62284971853596, 10.711434463183632],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>CLÍNICA DR. ADOLFO DEMPAIRE</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.6174083038698, 10.663212037985513],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>CLÍNICA PARAÍSO</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.6158536957068, 10.684183653030622],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>CLÍNICA ZULIA</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.63617967097093, 10.631660089599306],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>CLÍNICA FALCÓN</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.60838054466065, 10.656734545946373],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOSPITAL DE NIÑOS DE VERITAS</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.60962256012877, 10.647645019356643],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOSPITAL CLÍNICO</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.62629293630013, 10.686114815734268],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>IECTAS</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.63173676212203, 10.675326433187134],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOSPITAL UNIVERSITARIO DE MARACAIBO</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.62832189238746, 10.673226302627862],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOSPITAL CASTILLO PLAZA</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.63247453524819, 10.671511157737354],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>CLÍNICA SAN LUCAS</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.62651245487856, 10.668551395268135],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>CLÍNICA DE OJOS</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.61072975587612, 10.66946388795776],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>CRUZ ROJA ZULIA</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.61242824841412, 10.659305094387163],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>POLICLÍNICA MARACAIBO</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.61041658850367, 10.671776127897276],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>CENTRO MEDICO DE OCCIDENTE</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.60965282951364, 10.667183180551365],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOSPITAL COROMOTO</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.59639767454324, 10.677390770746635],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOGAR CLÍNICO SAN RAFAEL</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.6041167599401, 10.680064811510979],
          },
        },

        {
          type: "Feature",
          properties: {
            description:
              "<strong>CENTRO MÉDICO DOCENTE MARÍA AUXILIADORA</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.62915450984002, 10.667299334228327],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>CLINICA IZOT </strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.62162854457277, 10.67305914169676],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOSPITAL CHIQUINQUIRÁ</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.61621315970943, 10.642507916687984],
          },
        },

        {
          type: "Feature",
          properties: {
            description: "<strong>HOSPITAL CENTRAL DE MARACAIBO</strong>",
          },
          geometry: {
            type: "Point",
            coordinates: [-71.605544292028813, 10.642008624526426],
          },
        },
      ],
    },
  });
  // Add a layer showing the HOSPITAL DE LA POLICÍA: CENTRO MEDICO POLICIAL SANIPEZplaces.
  map.addLayer({
    id: "places",
    type: "circle",
    source: "places",
    paint: {
      "circle-color": "#4264fb",
      "circle-radius": 6,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true,
    focusAfterOpen: false,
  });

  map.on("mouseenter", "places", (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set itsfge coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });

  map.on("mouseleave", "places", () => {
    map.getCanvas().style.cursor = "";
  });
});
