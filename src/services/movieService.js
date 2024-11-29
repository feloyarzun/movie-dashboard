import axios from 'axios'

const API_KEY = 'e972240368838aaa380d9c51f82082f0'
const BASE_URL = 'https://api.themoviedb.org/3'

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
})

export const movieService = {
  async getPopularMovies(page = 1) {
    const response = await api.get('/movie/popular', { params: { page } })
    return response.data
  },

  async searchQuery(query, page = 1) {
    const response = await api.get('/search/movie', {
      params: { query, page },
    })
    return response.data
  },

  async discoverMoviesByYear(params = {}, page = 1) {
    const response = await api.get('/discover/movie', {
      params: { ...params, page },
    })
    return response.data
  },

  async getGenres() {
    const response = await api.get('/genre/movie/list')
    return response.data
  },

  async getMovieDetails(movieId) {
    const response = await api.get(`/movie/${movieId}`)
    return response.data
  },

  async getMovieCredits(movieId) {
    const response = await api.get(`/movie/${movieId}/credits`)
    return response.data
  },

  async getMovieImages(movieId) {
    const response = await api.get(`/movie/${movieId}/images`)
    return response.data
  },

  async getMovieReviews(movieId) {
    const response = await api.get(`/movie/${movieId}/reviews`)
    return response.data
  },

  async getRecommendations(movieId) {
    const response = await api.get(`/movie/${movieId}/recommendations`)
    return response.data
  },

  async getMovieVideos(movieId) {
    const response = await api.get(`/movie/${movieId}/videos`)
    return response.data
  },
}
