import { configureStore, createSlice } from "@reduxjs/toolkit";

// Load bookmarks from localStorage
const loadBookmarks = () => {
  try {
    const serializedState = localStorage.getItem('netflixBookmarks');
    if (serializedState === null) {
      return {
        bookmarkedMovies: [],
        bookmarkedTvSeries: []
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Failed to load bookmarks from localStorage', err);
    return {
      bookmarkedMovies: [],
      bookmarkedTvSeries: []
    };
  }
};

// Save bookmarks to localStorage
const saveBookmarks = ({ bookmarkedMovies, bookmarkedTvSeries }) => {
  try {
    const serializedState = JSON.stringify({ bookmarkedMovies, bookmarkedTvSeries });
    localStorage.setItem('netflixBookmarks', serializedState);
  } catch (err) {
    console.warn('Failed to save bookmarks to localStorage', err);
  }
};

const savedBookmarks = loadBookmarks();

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
  bookmarkedMovies: savedBookmarks.bookmarkedMovies || [],
  bookmarkedTvSeries: savedBookmarks.bookmarkedTvSeries || [],
  tvSeriesList: [],
  movieList: [] 
};

const NetflixSlice = createSlice({
  name: "Netflix",
  initialState,
  reducers: {
    setGenres: (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    },
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
    setTVSeries: (state, action) => {
      state.tvSeriesList = action.payload; // Add setTVSeries reducer
    },
    setMovieSeries: (state, action) => {
      state.movieList = action.payload; // moviesSeries reducer
    },
    addBookmark: (state, action) => {
      state.bookmarkedMovies.push(action.payload);
      saveBookmarks(state);
    },
    addTvSeriesBookmark: (state, action) => {
      state.bookmarkedTvSeries.push(action.payload);
      saveBookmarks(state);
    },
    removeBookmark: (state, action) => {
      state.bookmarkedMovies = state.bookmarkedMovies.filter(
        (movie) => movie.id !== action.payload
      );
      saveBookmarks(state);
    },
    removeTvSeriesBookmark: (state, action) => {
      state.bookmarkedTvSeries = state.bookmarkedTvSeries.filter(
        (tvSeries) => tvSeries.id !== action.payload
      );
      saveBookmarks(state);
    },
  },
});

export const {
  setGenres,
  setMovies,
  setTVSeries,
  setMovieSeries,
  addBookmark,
  addTvSeriesBookmark,
  removeBookmark,
  removeTvSeriesBookmark,
} = NetflixSlice.actions;

export const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});
