<script setup lang="ts">
import 'vidstack/player'
import 'vidstack/player/ui'
import 'vidstack/player/layouts/default'
import 'vidstack/player/styles/default/theme.css'
import 'vidstack/player/styles/default/layouts/video.css'
import { usePlayerStore } from '~/stores/player'

const props = defineProps<{
  src: string
  title: string
  poster?: string
}>()

const playerStore = usePlayerStore()
const playerRef = ref<any>(null)

function onTimeUpdate(e: any) {
  const time = e?.detail?.currentTime ?? e?.target?.currentTime ?? 0
  const duration = e?.detail?.duration ?? e?.target?.duration ?? 0
  playerStore.updateTime(time, duration)
}

function onPlay() {
  playerStore.setPlaying(true)
}

function onPause() {
  playerStore.setPlaying(false)
}

function onCanPlay() {
  if (playerStore.currentTime > 0 && playerRef.value) {
    playerRef.value.currentTime = playerStore.currentTime
  }
}

// Watch seek target from Scene Navigator or external controls
watch(() => playerStore.seekTarget, (target) => {
  if (target !== null && playerRef.value) {
    playerRef.value.currentTime = target
    playerStore.clearSeekTarget()
  }
})
</script>

<template>
  <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-950 shadow-2xl border border-neutral-800">
    <media-player
      ref="playerRef"
      :key="src"
      :title="title"
      :src="src"
      :poster="poster"
      playsinline
      crossorigin
      class="w-full h-full"
      @time-update="onTimeUpdate"
      @play="onPlay"
      @pause="onPause"
      @can-play="onCanPlay"
    >
      <media-provider></media-provider>
      <media-video-layout></media-video-layout>
    </media-player>
  </div>
</template>
