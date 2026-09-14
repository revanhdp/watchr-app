import { defineStore } from 'pinia'
import type { FilmItem } from './video'

export const usePlayerStore = defineStore('player', () => {
  const activeFilm = ref<FilmItem | null>(null)
  const currentTime = ref<number>(0)
  const duration = ref<number>(0)
  const isPlaying = ref<boolean>(false)
  const isMuted = ref<boolean>(false)
  const isMiniPlayerVisible = ref<boolean>(false)
  const seekTarget = ref<number | null>(null)

  function setActiveFilm(film: FilmItem, autoPlay = false) {
    if (activeFilm.value?.id !== film.id) {
      activeFilm.value = film
      currentTime.value = 0
      duration.value = 0
    }
    if (autoPlay) {
      isPlaying.value = true
    }
  }

  function updateTime(time: number, totalDuration?: number) {
    currentTime.value = time
    if (totalDuration && totalDuration > 0) {
      duration.value = totalDuration
    }
  }

  function setPlaying(playing: boolean) {
    isPlaying.value = playing
  }

  function setMuted(muted: boolean) {
    isMuted.value = muted
  }

  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  function seekTo(seconds: number) {
    currentTime.value = seconds
    seekTarget.value = seconds
  }

  function clearSeekTarget() {
    seekTarget.value = null
  }

  function showMiniPlayer() {
    if (activeFilm.value && isPlaying.value) {
      isMiniPlayerVisible.value = true
    }
  }

  function hideMiniPlayer() {
    isMiniPlayerVisible.value = false
  }

  function closeMiniPlayer() {
    isMiniPlayerVisible.value = false
    isPlaying.value = false
  }

  return {
    activeFilm,
    currentTime,
    duration,
    isPlaying,
    isMuted,
    isMiniPlayerVisible,
    seekTarget,
    setActiveFilm,
    updateTime,
    setPlaying,
    setMuted,
    togglePlay,
    toggleMute,
    seekTo,
    clearSeekTarget,
    showMiniPlayer,
    hideMiniPlayer,
    closeMiniPlayer
  }
})
