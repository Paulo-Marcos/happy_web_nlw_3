import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import "../styles/pages/landing.css";

import logoImg from "../images/Logo.svg";
import api from "../services/api";

interface Coordenates {
  latitude: number;
  longitude: number;
}

function Landing() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [coordinates, setCoordinates] = useState<Coordenates>({
    latitude: -15.6367684,
    longitude: -47.8438988,
  });

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
        setCity(response.data.city);
        setState(response.data.state);
      });
  }, []);

  return (
    <div id="page-landing">
      <div className="content-wrapper">
        <img src={logoImg} alt="Happy" />
        <main>
          <h1>Leve Felicidade para o mundo.</h1>
          <p>Visite orfanatos e mude o dia de muitas crianças.</p>
        </main>
        <div className="location">
          <strong>
            {city} - {state}
          </strong>
        </div>
        <Link to="/app" className="enter-app">
          <FiArrowRight size={26} color="rgba(0,0,0,0.6)" />
        </Link>
      </div>
    </div>
  );
}

export default Landing;
