import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight, FiTarget, FiSearch } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { Overlay } from "react-portal-overlay";

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

interface Coordenates {
  latitude: number;
  longitude: number;
}

function OrphanagesMap() {
  const [isOpen, setIsOpen] = useState(false);
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [location, setLocation] = useState({ city: "", state: "" });
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [coordinates, setCoordinates] = useState<Coordenates>({
    latitude: -15.6367684,
    longitude: -47.8438988,
  });

  // executa uma ação qunado uma das [] mudarem o seu valor.
  useEffect(() => {
    api.get("orphanages").then((response) => {
      console.log(response.data);
      setOrphanages(response.data);
    });
  }, []);

  navigator.geolocation.getCurrentPosition((location) => {
    setCoordinates({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    console.log(coordinates);
  });

  useEffect(() => {
    api
      .get(`coordenates/${coordinates.latitude}/${coordinates.longitude}`)
      .then((response) => {
        setLocation(response.data);
        setCity(response.data.city);
        setState(response.data.state);

        console.log(city);
        console.log(state);
      });
  }, []);

  function handleCLickModal(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    event.preventDefault();
    setIsOpen(true);
  }

  function handleLocation() {
    setIsOpen(false);
    if (!city || !state) return;
    if (city !== location.city || state !== location.state) {
      api.get(`location/${city}/${state}`).then((response) => {
        const result = response.data;
        setLocation({ city: city, state: state });
        setCoordinates({
          latitude: result.latitude,
          longitude: result.longitude,
        });
      });
    }
  }

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="" />
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>
        <footer>
          <strong>{city}</strong>
          <span>{state}</span>
        </footer>
      </aside>

      <Map
        center={[coordinates.latitude, coordinates.longitude]}
        zoom={14}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url={"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"}
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
      <div id="example"></div>

      <Link to="" onClick={handleCLickModal} className="button-open-modal">
        <FiTarget size={32} color="#15c3d6" />
      </Link>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>

      <Overlay
        open={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnClick
        className="overlay"
      >
        <div className="overlay-div">
          <h1>Selecione uma localização</h1>
          <div className="input-block">
            <label htmlFor="name">Cidade</label>
            <input
              id="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </div>
          <div className="input-block">
            <label htmlFor="name">Nome</label>
            <input
              id="state"
              value={state}
              onChange={(event) => setState(event.target.value)}
            />
          </div>
          <button
            className="confirm-button"
            type="button"
            onClick={handleLocation}
          >
            Localizar
            <FiSearch size={32} color="#FFF" />
          </button>
        </div>
      </Overlay>
    </div>
  );
}

export default OrphanagesMap;
