import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import mapMarkerImg from "../images/map-marker.svg";
import happyMapIcon from "../utils/mapIcon";
import api from "../services/api";

import "../styles/pages/orphanages-map.css";

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  // executa uma ação qunado uma das [] mudarem o seu valor.
  useEffect(() => {
    console.log("oi");
    api.get("orphanages").then((response) => {
      console.log(response.data);
      setOrphanages(response.data);
    });
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="" />
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>
        <footer>
          <strong>Distrito Federal</strong>
          <span>Sobradinho</span>
        </footer>
      </aside>

      <Map
        center={[-15.642352, -47.8365942]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_TOKEN}&callback=initMap`}
        ></TileLayer>
        {orphanages.map((orphanage) => {
          return (
            <Marker
              icon={happyMapIcon}
              position={[orphanage.latitude, orphanage.longitude]}
              key={orphanage.id}
            >
              <Popup
                closeButton={false}
                minWidth={240}
                maxWidth={240}
                className="map-popup"
              >
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20} color="#FFF" />
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;
