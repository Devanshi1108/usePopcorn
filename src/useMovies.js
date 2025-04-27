import { use, useEffect, useRef, useState } from "react";
const API_KEY = "4ab94c0c";

export function useMovies(searchQuery) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  useEffect(
    function () {
      //callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading("true");
          setIsError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
        } catch (err) {
          //console.error(err);
          setIsError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (searchQuery.length <= 3) {
        setMovies([]);
        setIsError("");
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [searchQuery]
  );

  return { movies, isLoading, isError };
}
