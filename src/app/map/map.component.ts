import { Component } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Heatmap as HeatmapLayer } from 'ol/layer';  // Capa para el mapa de calor


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export default class MapComponent {
  map: Map | undefined;
  mapCalor: Map | undefined;

  private apiUrl = '/ubication.json';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarMapa();
    this.cargarMapaCalor();

    this.cargarUbicaciones().subscribe(ubicaciones => {
      this.agregarMarcadores(ubicaciones);
      this.agregarMapaCalor(ubicaciones);

    });
  }

  cargarMapa(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-3.70379, 40.416775]), //Madrid
        zoom: 6,
      }),
    });
  }

  cargarUbicaciones(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  cargarMapaCalor(): void {
    // Configuración del mapa para el heatmap
    this.mapCalor = new Map({
      target: 'mapa-calor',  // ID del div para el mapa de calor
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-3.70379, 40.416775]), // Coordenadas de Madrid
        zoom: 6,
      }),
    });
  }


  agregarMarcadores(ubicaciones: any[]): void {
    const vectorSource = new VectorSource();
    
    ubicaciones.forEach(ubicacion => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([ubicacion.longitude, ubicacion.latitude])),
        name: ubicacion.nombre,
      });

      feature.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/red-dot.png',
        }),
      }));

      vectorSource.addFeature(feature);

    
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map?.addLayer(vectorLayer);
  }


  agregarMapaCalor(ubicaciones: any[]): void {
    const vectorSource = new VectorSource();

    // Crea un feature por cada ubicación y agrégalo al vectorSource
    ubicaciones.forEach(ubicacion => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([ubicacion.longitude, ubicacion.latitude])),
      });
      vectorSource.addFeature(feature);
    });

    // Configura la capa de Heatmap
    const heatmapLayer = new HeatmapLayer({
      source: vectorSource,
      blur: 30,  // Ajusta el nivel de difuminado (más alto es más suave)
      radius: 20,  // Ajusta el radio de influencia de cada marcador
      weight: (feature) => {
        // Puedes ajustar el peso de cada marcador aquí si es necesario
        return 2;
      }
    });

    this.mapCalor?.addLayer(heatmapLayer);
  }

}
