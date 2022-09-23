import { TextControl } from "@wordpress/components";
import React, { useState, useEffect } from "react";
function Edit(props) {
  const [item, setItem] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(null);
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
  if (fetchError) {
    return <p>API Key error</p>;
  } else {
    return (
      <div className="actor-details">
        <TextControl
          label="Please insert actor name"
          value={props.attributes.name}
          onChange={(newValue) => props.setAttributes({ name: newValue })}
        />
        <TextControl
          label="Please insert actor lastname"
          value={props.attributes.lastName}
          onChange={(newValue) => props.setAttributes({ lastName: newValue })}
        />
      </div>
    );
  }
}

export default Edit;
