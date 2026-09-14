<script setup lang="ts">
import { usePlayerStore } from '~/stores/player'

const router = useRouter()
const route = useRoute()
const playerStore = usePlayerStore()

// Mini player is active when enabled AND user is not currently in theater room
const isVisible = computed(() => {
  const isWatchPage = route.path.startsWith('/watch')
  return playerStore.isMiniPlayerVisible && !isWatchPage && Boolean(playerStore.activeFilm)
})

const film = computed(() => playerStore.activeFilm)

const progressPercent = computed(() => {
  if (playerStore.duration <= 0) return 0
  return Math.min(100, Math.max(0, (playerStore.currentTime / playerStore.duration) * 100))
})

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function expandToTheater() {
  if (film.value) {
    playerStore.hideMiniPlayer()
    router.push(`/watch/${film.value.id}`)
  }
}

function handleClose() {
  playerStore.closeMiniPlayer()
}

function togglePlayback() {
  playerStore.togglePlay()
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-10 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-10 scale-95"
  >
    <div
      v-if="isVisible && film"
      class="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl bg-zinc-950/95 border border-zinc-800 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-white/10 flex flex-col group"
    >
      <!-- Media Preview Frame -->
      <div class="relative w-full aspect-video bg-zinc-900 overflow-hidden cursor-pointer" @click="expandToTheater">
        <img
          :src="film.backdrop"
          :alt="film.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

        <!-- Top Right Mini Close & Expand Controls -->
        <div class="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          <button
            @click.stop="expandToTheater"
            class="w-7 h-7 rounded-full bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-800 backdrop-blur-md transition-colors shadow-lg"
            title="Buka Bioskop Penuh"
          >
            <UIcon name="i-lucide-maximize-2" class="w-3.5 h-3.5" />
          </button>

          <button
            @click.stop="handleClose"
            class="w-7 h-7 rounded-full bg-zinc-950/80 hover:bg-red-950/80 hover:text-red-300 text-zinc-400 flex items-center justify-center border border-zinc-800 backdrop-blur-md transition-colors shadow-lg"
            title="Tutup Mini Player"
          >
            <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Play/Pause Centered Clickable Overlay -->
        <button
          @click.stop="togglePlayback"
          class="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
        >
          <div class="w-12 h-12 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-2xl transform active:scale-90 transition-transform">
            <UIcon
              :name="playerStore.isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
              class="w-5 h-5 fill-current ml-0.5"
            />
          </div>
        </button>

        <!-- Aspect Ratio & Live Duration Badge -->
        <div class="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <span class="bg-zinc-950/90 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-zinc-800">
            {{ film.aspectRatio }}
          </span>
          <span class="bg-zinc-950/90 text-zinc-300 font-mono text-[10px] px-2 py-0.5 rounded border border-zinc-800">
            {{ formatTime(playerStore.currentTime) }}
          </span>
        </div>
      </div>

      <!-- Playback Progress Strip -->
      <div class="w-full h-1 bg-zinc-800 overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>

      <!-- Bottom Bar: Metadata & Quick Expand Action -->
      <div class="p-3.5 flex items-center justify-between gap-3 bg-zinc-950/90">
        <div class="min-w-0 flex-1 cursor-pointer" @click="expandToTheater">
          <h4 class="text-xs font-bold text-zinc-100 truncate group-hover:text-amber-300 transition-colors">
            {{ film.title }}
          </h4>
          <p class="text-[11px] text-zinc-400 truncate mt-0.5">
            {{ film.director }} — <span class="text-amber-400 font-mono">Mini-Player</span>
          </p>
        </div>

        <button
          @click="expandToTheater"
          class="flex-shrink-0 flex items-center gap-1.5 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-2.5 py-1.5 rounded-lg border border-zinc-800 transition-colors"
        >
          <UIcon name="i-lucide-monitor" class="w-3.5 h-3.5 text-amber-400" />
          <span>Kembali</span>
        </button>
      </div>
    </div>
  </Transition>
</template>
