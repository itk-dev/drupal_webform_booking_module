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

function MapWrapper(resources) {
  const [map, setMap] = useState()
  const [featuresLayer, setFeaturesLayer] = useState()
  const initalFeaturesLayer = new VectorLayer({
    source: new VectorSource()
  })
  const [vectorLayer, setVectorLayer] = useState(null);
  const [currentFeatures, setCurrentFeatures] = useState(null);
  const mapElement = useRef();

  useEffect(() => {
    //Get resource location objects
    let resourceData = getFeatures(resources);
    let newFeatures = [];
    if (resources.resources) {
      resources.resources.forEach((value) => {
        newFeatures.push(value.id);
      })
    }

    if (resources.resources // Resources are set
      && (resources.resources.length === 0 // Number of resources are 0
        || currentFeatures // Or currentFeatures exists
        && (currentFeatures.length === resources.resources.length // And the length of currentFeatures and newFeatures are the same
          && newFeatures !== currentFeatures) // And currentFeatures and newFeatures are now equal
      )
    ) { // Match current 
      return;
    }

    //Styling of the map marker
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAlCAMAAACEemK6AAABXFBMVEUAAAAAgP8AZv8AgP8Abf8AYP8Acf8XdP8Vav8Udv8Lb/8KcP8PbP8Pcf8Ocf8Mbv8Lb/8NcP8Nb/8Nbf8Mb/8Mbf8MbvsLbfsPb/sObvsObPwNcPwNbvwMbfwObfwNbvwNbv0Mbv0Ob/0Obf0Mbf0Mbv0Mbv0Obv0Nbv0Nbf0Nbv0Nbv0Mb/0Mbv0Mbf0Obv0Ob/0Obv0Nb/0Nbf0Nbv0Nbv0Nbv0Nbv0Mbv0Mb/1ppv4Nbvwvgv4NbvwNbvwNb/y81/8Nb/2jyf4Nbf0kfP0Nbv0Nbv2PvP45if4Nbv0dd/0Nbv0Nbv0Nbv0Nbv0Nbv0Nbv1SmP4Nbv0Nbv08iv0Nb/0Nbv0Nbv32+f8Rcf3u9f8Mbv281/4Nbv2cxP4Nbv17sP4Nbv0Nbv0Xdf1foP4Nbv0Nbv0Nbv0Nbv07if1Umf5cnf6Nu/6x0P7H3f/t9P/u9f/2+f/4+//////ZrbbCAAAAaHRSTlMABAUGBwgJCwwNFxkhIiQsLjk8PT4/QURFSElQUVRZZGZrbG58fX+Ai4yNjpGSk5SWl5iam5ydoKSmv8PExcfLztLT1NTW2Nna3Nzd3t/l5+jo7O3v8PLz8/T09ff4+Pn5+vv7+/z9/kqOLf8AAAABYktHRHNBCT3OAAABKklEQVQYGW3BhVYCQQAF0CeoWBjYid2Nio2Fiig22IGCz475/3Nk2RlY2LkXSnGbPxC5jwT8rcXI5RqIUYn2u2DRFKFVpBEZ3kfmindB6qSdF2k1t7R7rEVK4QF1wk4APdTrBgqOqHdYgAZmbO3c3J0xox4jVBaF4YPKEFYoLQvTO6UlhCmtCdMXpRCuKV0I0y+la8QoXQnTD6UoNiltCNMnpXXMUtr7E4a/V0o+tFDZ/RFCfL9RaYbjlMrl8cPzE5UTBzBBvXEAFXHqJCqRskCdeRiqk7RLVCFtjnYzMJVFmS9WDqmP+XqhOIPMtV2EjLoXWiU9sPDRahpWJSFm7ZcihydJJVmPPMNUBpHPsUpTwAkb9zkN525otNPQAa0pkpPQKxwLjjqR9Q+OaxIua1fKFgAAAABJRU5ErkJggg==',
      }),
    });

    //Define feature array and apply styling
    let features = [];
    let featureIds = [];
    resourceData.forEach((value) => {
      let feature = new Feature({
        geometry: new Point([value.coordinates.easting, value.coordinates.northing]),
        name: value.name,
        address: value.address,
        city: value.city
      });
      featureIds.push(value.id);
      feature.setStyle(iconStyle);
      features.push(feature)
    })

    let vLayer = new VectorLayer({ //Resource features
      name: 'Vector',
      source: new VectorSource({
        features: features
      })
    })

    if (map) {
      setCurrentFeatures(featureIds);
      setVectorLayer(vLayer);
    }
  }, [resources, map])

  useEffect(() => {
    if (map && vectorLayer) {
      map.getLayers().getArray().forEach((value) => { // Loop vectorLayers and remove old
        if (value.get('name') === "Vector") {
          map.removeLayer(value);
        }
      })
      map.addLayer(vectorLayer); // Add newly defined vectorLayer
    }
  }, [vectorLayer, map])

  useEffect(() => {
    const tooltip = document.getElementById('tooltip');

    // Proj4 projection definition
    Proj4.defs('EPSG:25832', "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs ");
    register(Proj4);

    // Projection settings for Denmark
    const dkprojection = new Projection({
      code: 'EPSG:25832',
      extent: [-1877994.66, 3638086.74, 3473041.38, 9494203.2],
    });

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
      })
    ];

    //Map view config
    let mapChildren = mapElement.current.children;
    for (var i = 0; i < mapChildren.length; i++) {
      if (mapChildren[i].className.indexOf("ol-viewport") > -1) {
        mapChildren[i].parentNode.removeChild(mapChildren[i])
      }
    }

    //Map definition
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

    //Tooltip definition
    const overlay = new Overlay({
      element: tooltip,
      offset: [0, -55],
      positioning: 'bottom-center'
    });

    initialMap.addOverlay(overlay);

    // display popup on click
    initialMap.on('click', function (evt) {
      var pixel = evt.pixel;
      var feature = initialMap.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
      tooltip.style.display = feature ? '' : 'none';
      if (feature) {
        overlay.setPosition(feature.values_.geometry.flatCoordinates);
        tooltip.innerHTML = "<div class='tooltip-closer'>✖️</div><div class='tooltip-text'><span><b>" + feature.values_.name + "</b></span><br><a class='tooltip-btn'>Vis i kalender</a></div>";
      }
    });

    // change mouse cursor when over marker
    initialMap.on('pointermove', function (e) {
      const pixel = initialMap.getEventPixel(e.originalEvent);
      const hit = initialMap.hasFeatureAtPixel(pixel);
      initialMap.getTarget().style.cursor = hit ? 'pointer' : '';
    });

    initialMap.addOverlay(overlay);

    // Tooltip closer click event
    document.getElementById("tooltip").addEventListener("click", (event) => {
      let target = event.target.className;
      if (target === "tooltip-closer") {
        tooltip.innerHTML = "";
      }
    });

    // save map and vector layer references to state
    setMap(initialMap)
    setFeaturesLayer(initalFeaturesLayer)
  }, [])

  return (
    <div className="map-container">
      <div ref={mapElement} className="map" id="map">
        <div id="tooltip" className="tooltip"></div>
      </div>
    </div>
  )

}

export default MapWrapper;