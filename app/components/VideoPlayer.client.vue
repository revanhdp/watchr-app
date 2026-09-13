<script setup lang="ts">
import 'vidstack/player'
import 'vidstack/player/ui'
import 'vidstack/player/layouts/default'
import 'vidstack/player/styles/default/theme.css'
import 'vidstack/player/styles/default/layouts/video.css'

defineProps<{
  src: string
  title: string
  poster?: string
}>()
</script>

<template>
  <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-950 shadow-2xl border border-neutral-800">
    <media-player
      :key="src"
      :title="title"
      :src="src"
      :poster="poster"
      playsinline
      crossorigin
      class="w-full h-full"
    >
      <media-provider></media-provider>
      <media-video-layout></media-video-layout>
    </media-player>
  </div>
</template>
