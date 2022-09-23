import { data } from "jquery";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./frontend.scss";

const actorBlocks = document.querySelectorAll(".actor");
actorBlocks.forEach((actorBlock) => {
  const data = JSON.parse(actorBlock.dataset.name);
  ReactDOM.render(<Frontend {...data} />, actorBlock);
});

function Frontend(props) {
  const [item, setItem] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  const url = `${apiNonce.page_url}/wp-json/my-custom-route/v1/opt/?option_name=actor-api`;
  useEffect(() => {
    fetch(url, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "X-WP-Nonce": apiNonce.nonce,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(
        (data) => {
          setApiKey(data);
        },
        (error) => {
          setApiError(error);
        }
      );
  }, []);
  useEffect(() => {
    if (apiKey !== null) {
      fetch(
        `http://api.tmdb.org/3/search/person?api_key=${apiKey}&language=en-EN&query=${props.name}+${props.lastName}`
      )
        .then((response) => response.json())
        .then(
          (data) => {
            if (data.status_code === 7) {
              setFetchError(true);
            }
            setIsLoaded(true);
            setItem(data.results);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [apiKey]);
  if (error) {
    return <p>Błąd API</p>;
  } else if (!isLoaded) {
    return <div>Loading</div>;
  } else if (fetchError) {
    return <p>API Key error</p>;
  } else {
    return (
      <>
        {item.map((result, index) => {
          console.log(result);
          if (index === 0) {
            const knownFor = Object.values(result.known_for);
            const bgImage = result.known_for[0].backdrop_path;
            return (
              <div
                className="actor-card"
                style={{
                  backgroundImage: `linear-gradient(rgba(11, 11, 11, 0.52), rgba(52, 52, 52, 0.52)), url("https://image.tmdb.org/t/p/original${bgImage}")`,
                }}
              >
                <img
                  className="actor-card__image"
                  src={`https://image.tmdb.org/t/p/original${result.profile_path}`}
                />
                <div className="actor-card__details">
                  <h2 className="actor-card__name">{result.name}</h2>
                  <ul className="actor-card__movies-list">
                    <p>Know for:</p>
                    {knownFor.map((key) => (
                      <li>{key.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          }
        })}
      </>
    );
  }
}
