// react
import React, { useState, useEffect, useRef } from 'react';

// openlayers
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import Projection from 'ol/proj/Projection';
import Proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { getFeatures } from '../util/map-utils';

import "./map-wrapper.scss";

function MapWrapper(props, resources) {
  const [map, setMap] = useState()
  const [featuresLayer, setFeaturesLayer] = useState()

  const mapElement = useRef()

  useEffect(() => {
    const tooltip = document.getElementById('tooltip');
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource()
    })
    // Proj4 projection definition
    Proj4.defs('EPSG:25832', "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs ");
    register(Proj4);

    // Projection settings for Denmark
    const dkprojection = new Projection({
      code: 'EPSG:25832',
      extent: [-1877994.66, 3638086.74, 3473041.38, 9494203.2],
    });

    //Styling of the map features
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'data:image/png;base64,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',
      }),
    });

    //Get resource location objects
    let resourceData = getFeatures(resources);

    //Define feature array and apply styling
    let features = [];
    resourceData.forEach((value) => {
      let feature = new Feature({
        geometry: new Point([value.coordinates.easting, value.coordinates.northing]),
        name: value.name,
        address: value.address,
        city: value.city
      });
      feature.setStyle(iconStyle);
      features.push(feature)
    })

    const layers = [
      new TileLayer({ //Map tiles
        title: 'WMS skærmkort (DAF)',
        type: 'base',
        visible: true,
        source: new TileWMS({
          url: 'https://services.datafordeler.dk/Dkskaermkort/topo_skaermkort/1.0.0/wms?username=PUBTLJWBTM&password=erh7bqw6ajw*QVB6evk',
          params: {
            'LAYERS': 'dtk_skaermkort',
            'VERSION': '1.1.1',
            'TRANSPARENT': 'FALSE',
            'FORMAT': "image/png",
            'STYLES': ''
          },
          attributions: '<p>Kort fra <a href="https://datafordeler.dk" target="_blank">Datafordeleren</a>.'
        }),
      }),
      new VectorLayer({ //Resource features
        source: new VectorSource({
          features: features
        })
      })
    ];

    //Map view config
    const initialMap = new Map({
      layers: layers,
      target: mapElement.current,
      view: new View({
        minZoom: 2,
        maxZoom: 13,
        center: [574969.6851, 6223010.2116],
        zoom: 4,
        resolutions: [1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8, 0.4, 0.2, 0.1],
        projection: dkprojection
      }),
    });

    const overlay = new Overlay({
      element: tooltip,
      offset: [-100, -55],
      positioning: 'bottom-left'
    });

    initialMap.addOverlay(overlay);

    // display popup on click
    initialMap.on('click', function (evt) {
      
      var pixel = evt.pixel;
      var feature = initialMap.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
      console.log(feature);
      console.log(evt);
      tooltip.style.display = feature ? '' : 'none';
      if (feature) {
        console.log(feature);
        overlay.setPosition(feature.values_.geometry.flatCoordinates);
        tooltip.innerHTML = "<div class='tooltip-text'><span><b>"+feature.values_.name+"</b></span><span>"+feature.values_.address+"<br>"+feature.values_.city+"</span><a class='tooltip-btn'>Vis i kalender</a></div>";
      }
    });

    // change mouse cursor when over marker
    initialMap.on('pointermove', function (e) {
      const pixel = initialMap.getEventPixel(e.originalEvent);
      const hit = initialMap.hasFeatureAtPixel(pixel);
      initialMap.getTarget().style.cursor = hit ? 'pointer' : '';
    });


    initialMap.addOverlay(overlay);

    // save map and vector layer references to state
    setMap(initialMap)
    setFeaturesLayer(initalFeaturesLayer)
  }, [])


  return (
    <div className="map-container">
      <div ref={mapElement} className="map">
        <div id="tooltip" className="tooltip"></div>
      </div>
    </div>
  )

}

export default MapWrapper;