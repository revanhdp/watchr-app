<script setup lang="ts">
import { useVideoStore } from '~/stores/video'
import { usePlayerStore } from '~/stores/player'

const route = useRoute()
const videoStore = useVideoStore()
const playerStore = usePlayerStore()

// Get film from store based on route param id
const filmId = computed(() => (route.params.id as string) || '1')
const film = computed(() => videoStore.getFilmById(filmId.value))

// Sync active film with player store
watch(film, (newFilm) => {
  if (newFilm) {
    playerStore.setActiveFilm(newFilm)
  }
}, { immediate: true })

// Theater mode: dims everything else to focus exclusively on the glowing screen
const isTheaterLightsOff = ref(false)

function toggleLights() {
  isTheaterLightsOff.value = !isTheaterLightsOff.value
}

// Next films in sequence
const nextFilms = computed(() => videoStore.films.filter(f => f.id !== film.value.id))

onMounted(async () => {
  // Hide mini player while in the theater room
  playerStore.hideMiniPlayer()

  if (filmId.value) {
    const loaded = await videoStore.fetchFilmById(filmId.value)
    if (loaded) {
      playerStore.setActiveFilm(loaded)
    }
    videoStore.trackView(filmId.value)
  }
})

// When leaving the theater room, if playback is active, dock to mini player
onUnmounted(() => {
  if (playerStore.isPlaying) {
    playerStore.showMiniPlayer()
  }
})
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-400 selection:text-black">
    <!-- Top Minimalist Theater Bar -->
    <header
      class="sticky top-0 z-40 w-full border-b transition-all duration-300 px-6 sm:px-12 py-3.5 flex items-center justify-between"
      :class="[
        isTheaterLightsOff
          ? 'bg-zinc-950/40 border-zinc-900 opacity-20 hover:opacity-100'
          : 'bg-zinc-950/90 border-zinc-800/80 backdrop-blur-md'
      ]"
    >
      <!-- Back to Catalog & Brand -->
      <div class="flex items-center gap-5">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors bg-zinc-900/90 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800"
        >
          <UIcon name="i-lucide-arrow-left" class="w-3.5 h-3.5" />
          <span>Arsip Kuratorial</span>
        </NuxtLink>

        <div class="hidden sm:flex items-center gap-2">
          <span class="text-sm font-black tracking-tight text-white">Watchr</span>
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span class="text-[11px] font-mono text-zinc-500 pl-2 border-l border-zinc-800">
            Theater Room
          </span>
        </div>
      </div>

      <!-- Theater Mode Controls -->
      <div class="flex items-center gap-3">
        <!-- Lights Off Ambient Toggle -->
        <button
          @click="toggleLights"
          class="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all"
          :class="[
            isTheaterLightsOff
              ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
          ]"
        >
          <UIcon :name="isTheaterLightsOff ? 'i-lucide-sun' : 'i-lucide-moon'" class="w-3.5 h-3.5" />
          <span>{{ isTheaterLightsOff ? 'Nyalakan Lampu' : 'Lampu Bioskop' }}</span>
        </button>

        <div class="hidden md:flex items-center gap-2 text-[11px] font-mono text-zinc-400 bg-zinc-900/60 border border-zinc-800 px-2.5 py-1 rounded-md">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>4K HLS BIT-PERFECT</span>
        </div>
      </div>
    </header>

    <!-- Main Screen Stage -->
    <main class="max-w-7xl mx-auto px-4 sm:px-12 py-8 flex flex-col gap-10">
      <!-- Player Canvas with Ambient Backlight Bloom -->
      <div class="relative w-full flex flex-col items-center">
        <!-- Ambient Projection Glow (Ambilight effect from film's palette) -->
        <div
          class="absolute -inset-4 sm:-inset-8 rounded-3xl blur-3xl opacity-30 transition-all duration-1000 pointer-events-none -z-10"
          :style="{
            background: `radial-gradient(circle at center, ${film.colorPalette[1] || '#d97706'} 0%, ${film.colorPalette[0] || '#1e3a8a'} 60%, transparent 100%)`
          }"
        ></div>

        <!-- Video Player Frame -->
        <div class="w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 bg-zinc-950">
          <ClientOnly>
            <VideoPlayer
              :key="film.src"
              :title="film.title"
              :src="film.src"
              :poster="film.backdrop"
            />
            <template #fallback>
              <div class="w-full aspect-video rounded-2xl bg-zinc-900 animate-pulse flex items-center justify-center border border-zinc-800">
                <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-amber-400" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Below Player: Technical Specifications & Editorial Film Note (Hidden if Lights are off) -->
      <div
        class="transition-opacity duration-500 grid grid-cols-1 lg:grid-cols-12 gap-10"
        :class="{ 'opacity-10 pointer-events-none': isTheaterLightsOff }"
      >
        <!-- Left: Film Metadata & Critique (8 Cols) -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          <!-- Title & Director Bar -->
          <div>
            <div class="flex items-center gap-2.5 text-xs font-mono text-amber-400 mb-1">
              <span>{{ film.year }}</span>
              <span>•</span>
              <span>{{ film.aspectRatio }}</span>
              <span>•</span>
              <span>{{ film.duration }}</span>
              <span>•</span>
              <span class="text-zinc-400">{{ film.audioFormat }}</span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {{ film.title }}
            </h1>

            <p class="text-xs sm:text-sm text-zinc-400 mt-1.5 font-medium">
              Sebuah karya oleh <span class="text-zinc-200 font-semibold">{{ film.director }}</span> — {{ film.studio }}
            </p>
          </div>

          <!-- Color Grading Palette Strip -->
          <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Color Profile:
              </span>
              <span class="text-xs font-mono text-zinc-200 font-semibold">
                {{ film.colorGrade }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <div
                v-for="(hex, idx) in film.colorPalette"
                :key="idx"
                class="w-6 h-6 rounded-md border border-zinc-700/80 shadow-sm flex items-center justify-center text-[9px] font-mono text-white/70"
                :style="{ backgroundColor: hex }"
                :title="hex"
              ></div>
            </div>
          </div>

          <!-- Curator Critique Note -->
          <div class="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-3">
            <span class="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <UIcon name="i-lucide-quote" class="w-3 h-3" />
              Catatan Kuratorial Watchr
            </span>
            <p class="text-sm sm:text-base text-zinc-300 italic leading-relaxed">
              {{ film.curatorQuote }}
            </p>
            <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-2 border-t border-zinc-800/80">
              {{ film.synopsis }}
            </p>
          </div>

          <!-- Awards / Official Selections -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(award, idx) in film.awards"
              :key="idx"
              class="text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg"
            >
              ✦ {{ award }}
            </span>
          </div>

          <!-- Scene / Chapter Navigator -->
          <SceneNavigator :chapters="film.chapters" class="mt-2" />
        </div>

        <!-- Right: Sequence Queue / Next Curated Reels (4 Cols) -->
        <aside class="lg:col-span-4 flex flex-col gap-4">
          <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-2">
              <UIcon name="i-lucide-film" class="w-4 h-4 text-amber-400" />
              Koleksi Berikutnya
            </h2>
            <span class="text-[11px] font-mono text-zinc-500">{{ nextFilms.length }} Arsip</span>
          </div>

          <!-- Reel List -->
          <div class="flex flex-col gap-3">
            <NuxtLink
              v-for="item in nextFilms"
              :key="item.id"
              :to="`/watch/${item.id}`"
              class="group flex gap-3 p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer"
            >
              <!-- Thumbnail -->
              <div class="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-zinc-950">
                <img
                  :src="item.backdrop"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span class="absolute bottom-1 right-1 bg-zinc-950/90 text-[9px] font-mono text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-800">
                  {{ item.duration }}
                </span>
              </div>

              <!-- Metadata -->
              <div class="flex flex-col justify-between py-0.5 min-w-0 flex-1">
                <div>
                  <span class="text-[10px] font-mono text-amber-400/90 truncate block">
                    {{ item.aspectRatio }}
                  </span>
                  <h3 class="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {{ item.title }}
                  </h3>
                  <p class="text-[11px] text-zinc-500 truncate mt-0.5">
                    {{ item.director }}
                  </p>
                </div>

                <div class="flex items-center gap-1 pt-1">
                  <div
                    v-for="(hex, idx) in item.colorPalette.slice(0, 3)"
                    :key="idx"
                    class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: hex }"
                  ></div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>
