<template>
  <div class="movie-card" @click="navigateToDetail">
    <img :src="posterUrl" :alt="movie.title" class="movie-poster" />
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p class="movie-overview">{{ limitedDescription }}</p>
      <div class="movie-details">
        <span class="movie-rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
        <span class="movie-release">{{ formatReleaseDate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()

    const navigateToDetail = () => {
      router.push({ name: 'MovieDetail', params: { id: props.movie.id } })
    }

    return {
      navigateToDetail,
    }
  },

  computed: {
    posterUrl() {
      return this.movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
        : '/default-poster.png'
    },
    limitedDescription() {
      return this.movie.overview.length > 135
        ? `${this.movie.overview.slice(0, 135)}..`
        : this.movie.overview
    },
    formatReleaseDate() {
      return new Date(this.movie.release_date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
}
</script>

<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  max-width: 100%;
  width: 100%;
}

.movie-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.movie-poster {
  width: 100%;
  height: auto;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.movie-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  text-align: center;
  width: 100%;
}

.movie-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.movie-overview {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10px;
  max-height: 55px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 5px;
}

.movie-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
  gap: 10px;
  margin-top: auto;
  height: 30px;
  align-items: center;
}

.movie-rating {
  color: #f39c12;
}

.movie-release {
  font-style: italic;
}

@media (max-width: 1200px) {
  .movie-poster {
    height: auto;
  }
}

@media (max-width: 768px) {
  .movie-title {
    font-size: 0.9rem;
  }

  .movie-overview {
    font-size: 0.8rem;
    max-height: 45px;
  }

  .movie-details {
    font-size: 0.75rem;
    height: 25px;
  }
}
</style>
