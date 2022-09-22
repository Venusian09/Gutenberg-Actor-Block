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

  const url =
    "http://wordpress-theme-dev.local/wp-json/my-custom-route/v1/opt/?option_name=actor-api";
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
    fetch(
      `http://api.tmdb.org/3/search/person?api_key=641c817ede6c9d5c917319692aeac468&language=pl-PL&query=${props.name}+${props.lastName}`
    )
      .then((response) => response.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setItem(data.results);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [apiKey]);
  if (error) {
    return <p>Błąd API</p>;
  } else if (!isLoaded) {
    return <div>Loading</div>;
  } else {
    return (
      <>
        {item.map((result) => {
          return (
            <>
              <img
                src={`https://image.tmdb.org/t/p/original/${result.profile_path}`}
              />
              <h1>{result.name}</h1>
              <ul>
                <p>Know for:</p>
                {result.known_for.map((movie) => {
                  <li>{movie.name}</li>;
                })}
              </ul>
            </>
          );
        })}
      </>
    );
  }
}
