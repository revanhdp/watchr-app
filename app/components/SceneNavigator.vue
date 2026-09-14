<script setup lang="ts">
import type { ChapterItem } from '~/stores/video'
import { usePlayerStore } from '~/stores/player'

const props = defineProps<{
  chapters?: ChapterItem[]
}>()

const playerStore = usePlayerStore()

// Identify currently active chapter based on playerStore.currentTime
const currentChapterIndex = computed(() => {
  if (!props.chapters || props.chapters.length === 0) return -1
  const time = playerStore.currentTime

  for (let i = props.chapters.length - 1; i >= 0; i--) {
    if (time >= props.chapters[i].seconds) {
      return i
    }
  }
  return 0
})

const activeChapter = computed(() => {
  if (currentChapterIndex.value >= 0 && props.chapters && props.chapters[currentChapterIndex.value]) {
    return props.chapters[currentChapterIndex.value]
  }
  return null
})

// Progress percentage within the current film duration
const progressPercent = computed(() => {
  if (playerStore.duration <= 0) return 0
  return Math.min(100, Math.max(0, (playerStore.currentTime / playerStore.duration) * 100))
})

function jumpToScene(chapter: ChapterItem) {
  playerStore.seekTo(chapter.seconds)
}

function formatSeconds(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <section v-if="chapters && chapters.length > 0" class="flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 shadow-xl backdrop-blur-sm">
    <!-- Header with Active Badge -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
          <UIcon name="i-lucide-clapperboard" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>Navigasi Babak Sinematik</span>
            <span class="text-xs font-mono font-normal px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
              {{ chapters.length }} Babak
            </span>
          </h2>
          <p class="text-xs text-zinc-400 mt-0.5">
            Jelajahi alur cerita & lompat langsung ke titik balik narasi film.
          </p>
        </div>
      </div>

      <!-- Active Chapter indicator pill -->
      <div v-if="activeChapter" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-mono">
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span class="font-bold">Babak Aktif:</span>
        <span class="truncate max-w-[180px]">{{ activeChapter.title }}</span>
      </div>
    </div>

    <!-- Interactive Scene Timeline Bar -->
    <div class="relative w-full py-2">
      <!-- Track Background -->
      <div class="relative w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
        <!-- Live Playhead Progress -->
        <div
          class="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 ease-out"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>

      <!-- Chapter Breakpoints Markers on the Timeline -->
      <div
        v-if="playerStore.duration > 0"
        class="absolute inset-0 pointer-events-none flex items-center"
      >
        <div
          v-for="ch in chapters"
          :key="ch.id"
          class="absolute w-3 h-3 -translate-x-1.5 rounded-full border-2 border-zinc-900 transition-transform hover:scale-125"
          :class="[
            playerStore.currentTime >= ch.seconds
              ? 'bg-amber-400 shadow-md shadow-amber-400/50'
              : 'bg-zinc-600'
          ]"
          :style="{ left: `${(ch.seconds / playerStore.duration) * 100}%` }"
          :title="`${ch.title} (${ch.timestamp})`"
        ></div>
      </div>
    </div>

    <!-- Chapter Grid Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(chapter, idx) in chapters"
        :key="chapter.id"
        @click="jumpToScene(chapter)"
        class="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer text-left select-none"
        :class="[
          currentChapterIndex === idx
            ? 'bg-amber-400/10 border-amber-400/60 shadow-lg shadow-amber-400/5 ring-1 ring-amber-400/30'
            : 'bg-zinc-950/70 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700'
        ]"
      >
        <!-- Top Bar: Index & Timestamp Button -->
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span
              class="text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded"
              :class="[
                currentChapterIndex === idx
                  ? 'bg-amber-400 text-zinc-950 font-extrabold'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              ]"
            >
              Babak {{ idx + 1 }}
            </span>

            <span v-if="currentChapterIndex === idx" class="flex items-center gap-1 text-[11px] font-mono text-amber-400 font-semibold">
              <UIcon name="i-lucide-volume-2" class="w-3.5 h-3.5 animate-pulse" />
              <span>Memutar</span>
            </span>
          </div>

          <!-- Timestamp Quick Jump Button -->
          <button
            @click.stop="jumpToScene(chapter)"
            class="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg border transition-all"
            :class="[
              currentChapterIndex === idx
                ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold shadow-md'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700/80 group-hover:border-amber-400/60 group-hover:text-amber-300'
            ]"
          >
            <UIcon name="i-lucide-play" class="w-3 h-3 fill-current" />
            <span>{{ chapter.timestamp }}</span>
          </button>
        </div>

        <!-- Title & Contextual Description -->
        <div>
          <h3
            class="text-sm sm:text-base font-bold transition-colors leading-snug"
            :class="[
              currentChapterIndex === idx
                ? 'text-white'
                : 'text-zinc-200 group-hover:text-amber-300'
            ]"
          >
            {{ chapter.title }}
          </h3>
          <p class="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans line-clamp-2">
            {{ chapter.description }}
          </p>
        </div>

        <!-- Bottom Jump Prompt -->
        <div class="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300">
          <span>Lompat ke adegan ini</span>
          <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </section>
</template>
