import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-db-connection-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json', {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {     // navigating through each keys
        loadedMovies.push({          // pushing a new object for every key-value pair we got in response data
          id: key,                       // and set id = key, the unique auto-generated key in our database
          title: data[key].title,             //setting title = data for the title key. Dynamically accessing properties in JavaScript 
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }

      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch('https://react-db-connection-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),   // converting javascript object into JSON for posting it. JSON.stringify() is built in browser
      headers: {
        'Content-Type' : 'application/json'    // headers is not required in Firebase, but it will be required in most other APIs, to describe the content type
      }
    });
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
