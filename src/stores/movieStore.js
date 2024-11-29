import { defineStore } from 'pinia'
import { movieService } from '@/services/movieService'

export const useMovieStore = defineStore('movies', {
  state: () => ({
    movies: [],
    currentPage: 1,
    totalPages: 0,
    loading: false,
    searchQuery: '',
    yearFilter: '',
    genreFilter: '',
    error: null,
    movie: null,
    cast: [],
    director: '',
    productionCompanies: '',
    originCountry: '',
  }),

  actions: {
    async fetchMovies() {
      this.loading = true
      this.error = null

      try {
        let response

        if (this.searchQuery) {
          response = await movieService.searchQuery(this.searchQuery, this.currentPage)
        } else if (this.yearFilter || this.genreFilter) {
          const params = {}
          if (this.yearFilter) params.primary_release_year = this.yearFilter
          if (this.genreFilter) params.with_genres = this.genreFilter

          response = await movieService.discoverMoviesByYear(params, this.currentPage)
        } else {
          response = await movieService.getPopularMovies(this.currentPage)
        }

        this.movies = response.results
        this.totalPages = response.total_pages
      } catch (error) {
        console.error('Error al obtener peliculas:', error)
        this.movies = []
        this.totalPages = 0
        this.error = error.message || 'Error al obtener películas'
      } finally {
        this.loading = false
      }
    },

    async fetchMovieDetails(movieId) {
      this.loading = true
      this.error = null

      try {
        const movieData = await movieService.getMovieDetails(movieId)
        this.movie = movieData

        const credits = await movieService.getMovieCredits(movieId)
        this.cast = credits.cast

        const crew = credits.crew
        const directorInfo = crew.find((member) => member.job === 'Director')
        this.director = directorInfo ? directorInfo.name : ''

        this.productionCompanies = movieData.production_companies
          .map((company) => company.name)
          .join(', ')

        this.originCountry = movieData.production_countries
          .map((country) => country.name)
          .join(', ')
      } catch (error) {
        console.error('Error al obtener detalles de la película:', error)
        this.movie = null
        this.cast = []
        this.director = ''
        this.productionCompanies = ''
        this.originCountry = ''
        this.error = error.message || 'Error al obtener detalles de la película'
      } finally {
        this.loading = false
      }
    },

    setGenreFilter(genre) {
      this.genreFilter = genre
      this.searchQuery = ''
      this.currentPage = 1
      this.fetchMovies()
    },

    setYearFilter(year) {
      this.yearFilter = year
      this.genreFilter = ''
      this.fetchMovies()
    },

    setSearchQuery(query) {
      this.searchQuery = query
      this.yearFilter = ''
      this.genreFilter = ''
      this.currentPage = 1
      this.fetchMovies()
    },

    resetFilters() {
      this.searchQuery = ''
      this.yearFilter = ''
      this.genreFilter = ''
      this.currentPage = 1
      this.fetchMovies()
    },

    setPage(page) {
      this.currentPage = page
      this.fetchMovies()
    },
  },
})
