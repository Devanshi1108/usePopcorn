import { use, useEffect, useRef, useState } from "react";
import StarRating from "./StarRating.js";
import { useMovies } from "./useMovies.js";
import { useLocalStorageState } from "./useLocalStrorageState.js";
import { useKey } from "./useKey.js";

const API_KEY = "4ab94c0c";

function average(arr) {
  let sum = 0;
  arr.forEach((element) => {
    sum += element;
  });
  return sum / arr.length;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectMovieID, setSelectedMovieID] = useState(null);

  const { movies, isLoading, isError } = useMovies(searchQuery);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(movieID) {
    setSelectedMovieID((id) =>
      movieID === selectMovieID ? setSelectedMovieID(null) : (id = movieID)
    );
  }

  function handleCloseMovie() {
    setSelectedMovieID(null);
  }

  function handleAddWatched(movieObj) {
    setWatched((arr) => [...arr, movieObj]);

    handleCloseMovie();
  }

  function handleDeleteWatched(movieID) {
    setWatched((watched) => watched.filter((el) => el.imdbID !== movieID));
  }

  return (
    <div>
      <Nav>
        <SearchBar setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
        <NumResults movies={movies} />
      </Nav>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {isError && <ErrorMessage msg={isError} />}
        </Box>

        <Box>
          {selectMovieID ? (
            <MovieDetails
              movieID={selectMovieID}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched}></WatchedSummary>
              <WatchedMovieList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              ></WatchedMovieList>
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}

function ErrorMessage({ msg }) {
  return <p className="error">{msg}</p>;
}
function Loader() {
  return <p className="loader">Loading..</p>;
}

function Nav({ children }) {
  return (
    <div className="nav-bar">
      <Logo />
      {children}
    </div>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function SearchBar({ searchQuery, setSearchQuery }) {
  const inputEl = useRef(null);

  useKey("enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setSearchQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={searchQuery}
      onChange={(e) => setSearchQuery((movie) => e.target.value)}
      ref={inputEl}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Main({ children }) {
  return <div className="main">{children}</div>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  function handleIsOpen() {
    setIsOpen(!isOpen);
  }
  return (
    <div className="box">
      <button className="btn-toggle" onClick={handleIsOpen}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen ? children : null}
    </div>
  );
}

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies.map((el) => (
        <Movie
          movie={el}
          key={el.imdbID}
          handleSelectMovie={handleSelectMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectMovie }) {
  return (
    <li onClick={() => handleSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
// function WatchedMovies() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen, setIsOpen] = useState(true);
//   function handleIsOpen() {
//     setIsOpen(!isOpen);
//   }
//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={handleIsOpen}>
//         {isOpen ? "-" : "+"}
//       </button>
//       {isOpen ? (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       ) : (
//         ""
//       )}
//     </div>
//   );
// }

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{watched.length === 0 ? 0 : avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{watched.length === 0 ? 0 : avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{watched.length === 0 ? 0 : avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovieList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((el) => (
        <WatchedMovie
          movie={el}
          key={el.imdbID}
          handleDeleteWatched={handleDeleteWatched}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, handleDeleteWatched }) {
  return (
    <li>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime}</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

function MovieDetails({ movieID, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((el) => el.imdbID).includes(movieID);
  const watchedUserRating = watched.find(
    (el) => el.imdbID === movieID
  )?.userRating;

  useKey("escape", onCloseMovie);

  useEffect(
    function () {
      async function selectMovie() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieID}`
          );
          if (!res.ok)
            throw new Error(
              "Something went wrong with fetching movies details"
            );

          const data = await res.json();
          setMovie(data);
          setIsLoading(false);
        } catch (err) {
          console.err(err);
        }
      }
      selectMovie();
    },
    [movieID]
  );

  useEffect(
    function () {
      if (!movie.Title) return;
      document.title = `Movie | ${movie.Title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [movie.Title]
  );

  function onAddWatchedLocal() {
    const newmovieObj = {
      ...movie,
      userRating: Number(userRating),
      imdbRating: Number(movie.imdbRating),
      Runtime: Number(movie.Runtime.split(" ").at(0)),
    };
    onAddWatched(newmovieObj);
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              ←
            </button>
            <img src={movie.Poster} alt={movie.Title} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Year} • {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={25}
                    onSetRating={(rating) => setUserRating(rating)}
                  />
                  {userRating > 0 ? (
                    <button className="btn-add" onClick={onAddWatchedLocal}>
                      + Add to list
                    </button>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <p>
                  Yoh have rated this movie <span>⭐️</span> {watchedUserRating}
                </p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
