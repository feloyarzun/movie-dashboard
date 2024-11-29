<template>
  <div class="movie-dashboard">
    <div class="filters-container">
      <div class="search-bar">
        <input
          v-model="searchInput"
          @input="debouncedSearch"
          placeholder="Buscar películas..."
          class="search-input"
        />
      </div>
      <div class="filter-options">
        <select v-model="yearFilter" @change="applyYearFilter" class="filter-select">
          <option value="">Año</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <select v-model="genreFilter" @change="applyGenreFilter" class="filter-select">
          <option value="">Genero</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
        <button @click="resetFilters" class="reset-button">Resetear filtros</button>
      </div>
    </div>

    <div class="movie-list">
      <div v-if="movieStore.loading" class="loading">Cargando...</div>
      <div v-else-if="movieStore.movies.length === 0" class="no-results">
        No se encontraron películas
      </div>
      <div v-else class="movie-cards">
        <MovieCard v-for="movie in movieStore.movies" :key="movie.id" :movie="movie" />
      </div>
    </div>

    <div class="pagination" v-if="movieStore.totalPages > 1">
      <button @click="prevPage" :disabled="movieStore.currentPage === 1">Anterior</button>
      <span>Página {{ movieStore.currentPage }} de {{ movieStore.totalPages }}</span>
      <button @click="nextPage" :disabled="movieStore.currentPage === movieStore.totalPages">
        Siguiente
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useMovieStore } from '@/stores/movieStore'
import { movieService } from '@/services/movieService'
import MovieCard from '@/components/MovieCard.vue'

export default {
  components: { MovieCard },
  setup() {
    const movieStore = useMovieStore()
    const searchInput = ref('')
    const yearFilter = ref('')
    const genreFilter = ref('')
    const genres = ref([])

    const fetchGenres = async () => {
      const response = await movieService.getGenres()
      genres.value = response.genres
    }

    const years = computed(() => {
      const currentYear = new Date().getFullYear()
      return Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i)
    })

    const debouncedSearch = (() => {
      let timeoutId
      return () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          movieStore.setSearchQuery(searchInput.value)
        }, 500)
      }
    })()

    const applyYearFilter = () => {
      movieStore.setYearFilter(yearFilter.value)
    }

    const applyGenreFilter = () => {
      movieStore.setGenreFilter(genreFilter.value)
    }

    const resetFilters = () => {
      searchInput.value = ''
      yearFilter.value = ''
      genreFilter.value = ''
      movieStore.resetFilters()
    }

    const prevPage = () => {
      if (movieStore.currentPage > 1) {
        movieStore.setPage(movieStore.currentPage - 1)
      }
    }

    const nextPage = () => {
      if (movieStore.currentPage < movieStore.totalPages) {
        movieStore.setPage(movieStore.currentPage + 1)
      }
    }

    onMounted(() => {
      movieStore.fetchMovies()
      fetchGenres()
    })

    return {
      movieStore,
      searchInput,
      yearFilter,
      genreFilter,
      genres,
      years,
      debouncedSearch,
      applyYearFilter,
      applyGenreFilter,
      resetFilters,
      prevPage,
      nextPage,
    }
  },
}
</script>

<style scoped>
.movie-dashboard {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.search-bar {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-bar input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border-color: #007bff;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  background-color: #fff;
  min-width: 100px;
}

.filter-select:focus {
  border-color: #007bff;
}

.reset-button {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.reset-button:hover {
  background-color: #e9ecef;
  border-color: #b5b5b5;
}

.movie-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;
}

.loading,
.no-results {
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1400px) {
  .movie-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1100px) {
  .movie-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar,
  .filter-options {
    width: 100%;
  }

  .filter-options {
    flex-direction: column;
  }

  .filter-select,
  .reset-button {
    width: 100%;
  }

  .movie-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .movie-cards {
    grid-template-columns: 1fr;
  }
}
</style>
