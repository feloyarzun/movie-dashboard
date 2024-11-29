<template>
  <div v-if="movieStore.loading" class="loading">Cargando...</div>
  <div v-else-if="movieStore.error" class="error">{{ movieStore.error }}</div>
  <div v-else class="movie-detail">
    <div class="movie-header">
      <div class="movie-backdrop">
        <img :src="backdropUrl" alt="Backdrop" class="backdrop-image" />
        <div class="backdrop-overlay">
          <div class="backdrop-content">
            <div class="poster-container">
              <img :src="posterUrl" alt="Poster" class="movie-poster" />
            </div>
            <div class="movie-info">
              <h1 class="movie-title">{{ movieStore.movie?.title || 'Sin título' }}</h1>
              <div class="movie-metadata">
                <span class="movie-release-date">{{ formattedReleaseDate }}</span>
                <span class="movie-genres">{{ genres }}</span>
                <span class="movie-runtime">{{ runtime }}</span>
              </div>
              <div class="movie-rating">
                <span class="rating-value"
                  >⭐ {{ movieStore.movie?.vote_average?.toFixed(1) || 'N/A' }}</span
                >
                <span class="rating-count">({{ movieStore.movie?.vote_count || 0 }} votos)</span>
              </div>
              <div class="movie-overview">
                <h2>Sinopsis</h2>
                <p>{{ movieStore.movie?.overview || 'No hay información disponible.' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="movie-additional-info">
      <div class="movie-cast-section">
        <div class="movie-cast">
          <h2>Reparto Principal</h2>
          <div class="cast-grid" v-if="movieStore.cast.length">
            <div v-for="actor in movieStore.cast.slice(0, 6)" :key="actor.id" class="cast-member">
              <img :src="getActorImage(actor)" alt="Actor" class="actor-image" />
              <div class="actor-info">
                <p class="actor-name">{{ actor.name }}</p>
                <p class="actor-character">{{ actor.character || 'Sin personaje asignado' }}</p>
              </div>
            </div>
          </div>
          <p v-else>No se encontró información del reparto</p>
        </div>
        <div class="movie-crew">
          <h2>Información Adicional</h2>
          <div class="crew-details">
            <div class="crew-item">
              <strong>Director:</strong>
              <span>{{ movieStore.director || 'No disponible' }}</span>
            </div>
            <div class="crew-item">
              <strong>Productora:</strong>
              <span>{{ movieStore.productionCompanies || 'No disponible' }}</span>
            </div>
            <div class="crew-item">
              <strong>País de origen:</strong>
              <span>{{ movieStore.originCountry || 'No disponible' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="movie-trailers">
        <h2>Trailers y Videos</h2>
        <div v-if="trailers.length" class="trailers-grid">
          <div v-for="video in trailers.slice(0, 2)" :key="video.id" class="trailer-item">
            <iframe
              :src="`https://www.youtube.com/embed/${video.key}`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="trailer-video"
            ></iframe>
            <p class="trailer-name">{{ video.name }}</p>
          </div>
        </div>
        <p v-else>No se encontraron trailers disponibles</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useMovieStore } from '@/stores/movieStore'
import { movieService } from '@/services/movieService'
import { useRoute } from 'vue-router'

export default {
  name: 'MovieDetailView',
  setup() {
    const movieStore = useMovieStore()
    const route = useRoute()
    const movieId = route.params.id
    const trailers = ref([])

    onMounted(async () => {
      await movieStore.fetchMovieDetails(movieId)

      try {
        const videosResponse = await movieService.getMovieVideos(movieId)
        trailers.value = videosResponse.results.filter(
          (video) =>
            video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'),
        )
      } catch (error) {
        console.error('Error al obtener videos:', error)
      }
    })

    const genres = computed(
      () => movieStore.movie?.genres?.map((genre) => genre.name).join(', ') || 'No disponible',
    )

    const formattedReleaseDate = computed(() =>
      movieStore.movie?.release_date
        ? new Date(movieStore.movie.release_date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'No disponible',
    )

    const runtime = computed(() =>
      movieStore.movie?.runtime ? `${movieStore.movie.runtime} minutos` : 'No disponible',
    )

    const posterUrl = computed(() =>
      movieStore.movie?.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieStore.movie.poster_path}`
        : '/default-poster.png',
    )

    const backdropUrl = computed(() =>
      movieStore.movie?.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movieStore.movie.backdrop_path}`
        : '/default-backdrop.png',
    )

    const getActorImage = (actor) =>
      actor.profile_path
        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
        : '/default-avatar.png'

    return {
      movieStore,
      genres,
      formattedReleaseDate,
      runtime,
      posterUrl,
      backdropUrl,
      getActorImage,
      trailers,
    }
  },
}
</script>

<style scoped>
.movie-detail {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f4f4f4;
}

.movie-header {
  position: relative;
  color: white;
}

.movie-backdrop {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.backdrop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
}

.backdrop-content {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  gap: 2rem;
}

.poster-container {
  width: 300px;
  flex-shrink: 0;
}

.movie-poster {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.movie-info {
  flex-grow: 1;
}

.movie-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.movie-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.movie-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.rating-value {
  font-size: 1.5rem;
  color: #f1c40f;
}

.movie-overview {
  max-width: 800px;
}

.movie-additional-info {
  padding: 2rem;
  background-color: white;
}

.movie-cast-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.cast-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.cast-member {
  text-align: center;
}

.actor-image {
  width: 100%;
  border-radius: 8px;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.actor-info {
  margin-top: 0.5rem;
}

.actor-name {
  font-weight: bold;
}

.actor-character {
  color: #666;
  font-size: 0.9rem;
}

.crew-details {
  display: grid;
  gap: 0.5rem;
}

.crew-item {
  display: flex;
  gap: 0.5rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.movie-trailers {
  grid-column: span 2;
}

.trailers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.trailer-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
}

.trailer-name {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

@media (max-width: 1200px) {
  .backdrop-content {
    padding: 0 1rem;
  }

  .poster-container {
    width: 250px;
  }

  .movie-title {
    font-size: 2rem;
  }
}

@media (max-width: 992px) {
  .movie-backdrop {
    height: auto;
  }

  .backdrop-content {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }

  .poster-container {
    width: 200px;
    margin-bottom: 1rem;
  }

  .movie-metadata {
    justify-content: center;
  }

  .movie-cast-section {
    grid-template-columns: 1fr;
  }

  .cast-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .trailers-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .movie-title {
    font-size: 1.5rem;
  }

  .movie-metadata {
    flex-direction: column;
    align-items: center;
  }

  .cast-grid {
    grid-template-columns: 1fr;
  }

  .movie-additional-info {
    padding: 1rem;
  }
}
</style>
