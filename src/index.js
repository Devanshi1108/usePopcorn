import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
//import StarRating from "./StarRating";

function Test() {
  const [movieRating, setMovieRiting] = useState(0);
  return (
    // <div>
    //   <StarRating maxRating={10} onSetRating={setMovieRiting} />
    //   <p>{movieRating}</p>
    // </div>
    <div>
      <App />
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Test />
  </React.StrictMode>
);
