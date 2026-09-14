<script setup lang="ts">
import { useVideoStore, type FilmItem } from '~/stores/video'
import { useWindowScroll } from '@vueuse/core'

const videoStore = useVideoStore()
const { y: scrollY } = useWindowScroll()

// Quick inspector drawer / modal
const activeInspectorFilm = ref<FilmItem | null>(null)
const isInspectorOpen = ref(false)

function openInspector(film: FilmItem) {
  activeInspectorFilm.value = film
  isInspectorOpen.value = true
}

const moods = [
  { id: 'all', label: 'Semua Koleksi' },
  { id: 'dystopia', label: 'Distopia' },
  { id: 'adrenalin', label: 'Adrenalin' },
  { id: 'kontemplatif', label: 'Kontemplatif' },
  { id: 'animasi', label: 'Visual Puisi' }
]

const hero = computed(() => videoStore.featuredFilm)

onMounted(() => {
  videoStore.fetchFilms()
})
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-400 selection:text-black">
    <!-- Top Architectural Navigation -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b px-6 sm:px-12 py-4 flex items-center justify-between"
      :class="[
        scrollY > 40
          ? 'bg-zinc-950/90 backdrop-blur-md border-zinc-800/80 shadow-xl'
          : 'bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-transparent border-transparent'
      ]"
    >
      <!-- Brand Logo -->
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center gap-1 group">
          <span class="text-2xl font-black tracking-tight text-white group-hover:text-zinc-200 transition-colors">
            Watchr
          </span>
          <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
        </NuxtLink>

        <span class="hidden lg:inline-block text-[11px] font-mono uppercase tracking-widest text-zinc-500 pl-4 border-l border-zinc-800">
          Curated Cinema Archives
        </span>
      </div>

      <!-- Curated Mood Filter (Center) -->
      <nav class="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-zinc-900/90 border border-zinc-800/80 text-xs font-medium backdrop-blur-sm">
        <button
          v-for="mood in moods"
          :key="mood.id"
          @click="videoStore.setMood(mood.id)"
          class="px-3.5 py-1.5 rounded-full transition-all duration-200"
          :class="[
            videoStore.selectedMood === mood.id
              ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          ]"
        >
          {{ mood.label }}
        </button>
      </nav>

      <!-- Right Meta Actions -->
      <div class="flex items-center gap-3">
        <div class="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-lg">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>4K MASTER STREAM</span>
        </div>

        <NuxtLink
          :to="`/watch/${hero.id}`"
          class="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs px-4 py-2 rounded-lg transition-colors shadow-lg shadow-amber-400/10 active:scale-95"
        >
          <UIcon name="i-lucide-play" class="w-3.5 h-3.5 fill-current" />
          <span>Putar Kurasi</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Hero: "The Director's Spotlight" -->
    <section class="relative w-full pt-24 sm:pt-28 pb-16 px-6 sm:px-12 max-w-7xl mx-auto">
      <div class="relative w-full rounded-2xl overflow-hidden border border-zinc-800/90 bg-zinc-900/50 shadow-2xl">
        <!-- Film Backdrop with cinematic vignette -->
        <div class="relative w-full aspect-[16/9] lg:aspect-[21/9] min-h-[440px] max-h-[640px] overflow-hidden">
          <img
            :src="hero.backdrop"
            :alt="hero.title"
            class="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.05]"
          />
          <!-- Artistic Vignette Overlays -->
          <div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent w-full md:w-3/5"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
        </div>

        <!-- Spotlight Floating Content -->
        <div class="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-3xl">
          <!-- Curatorial Metadata Header -->
          <div class="flex items-center gap-3 mb-2">
            <span class="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Koleksi Pilihan Kurator #01
            </span>
            <span class="text-zinc-600">•</span>
            <span class="text-xs font-mono text-zinc-400">{{ hero.year }}</span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
            {{ hero.title }}
          </h1>

          <!-- Director Credit Line -->
          <p class="text-xs sm:text-sm text-zinc-400 mt-2 font-medium">
            Karya <span class="text-zinc-200 font-semibold">{{ hero.director }}</span> — {{ hero.studio }}
          </p>

          <!-- Technical Specs Badges (Cinephile aesthetic) -->
          <div class="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-mono">
            <span class="px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-zinc-300 font-medium">
              {{ hero.aspectRatio }}
            </span>
            <span class="px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-zinc-300 font-medium">
              {{ hero.audioFormat }}
            </span>
            <span class="px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-zinc-300 font-medium">
              {{ hero.duration }}
            </span>
            <span class="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 font-semibold">
              4K DCP Remaster
            </span>
          </div>

          <!-- Curator Critique Quote -->
          <p class="text-xs sm:text-sm text-zinc-300 italic leading-relaxed mt-4 border-l-2 border-amber-400/80 pl-3 line-clamp-2">
            {{ hero.curatorQuote }}
          </p>

          <!-- Color Grading Palette Strip -->
          <div class="flex items-center gap-3 mt-5 pt-4 border-t border-zinc-800/80">
            <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Color Grade:
            </span>
            <div class="flex items-center gap-1.5">
              <div
                v-for="(hex, idx) in hero.colorPalette"
                :key="idx"
                class="w-5 h-5 rounded-full border border-zinc-700/80 shadow-sm transition-transform hover:scale-125"
                :style="{ backgroundColor: hex }"
                :title="hex"
              ></div>
            </div>
            <span class="text-[11px] font-mono text-zinc-400 hidden sm:inline-block ml-1">
              {{ hero.colorGrade }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3 mt-6">
            <NuxtLink
              :to="`/watch/${hero.id}`"
              class="inline-flex items-center gap-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-xl hover:shadow-zinc-100/10 active:scale-95"
            >
              <UIcon name="i-lucide-play" class="w-4 h-4 fill-current text-zinc-950" />
              <span>Mulai Menonton Film</span>
            </NuxtLink>

            <button
              @click="openInspector(hero)"
              class="inline-flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-medium px-5 py-3 rounded-xl text-sm border border-zinc-700/80 backdrop-blur-md transition-colors active:scale-95"
            >
              <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-amber-400" />
              <span>Bedah Sinema</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Curated Cinema Exhibits (Gallery Feed) -->
    <main class="max-w-7xl mx-auto px-6 sm:px-12 py-8 flex flex-col gap-16">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <span class="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Katalog Kuratorial
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Arsip Sinema Mandiri
          </h2>
        </div>
        <p class="text-xs text-zinc-400 max-w-sm leading-relaxed">
          Ditampilkan dalam rasio aspek asli, grading warna lossless, dan tata suara surround sinematik.
        </p>
      </div>

      <!-- Exhibits Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="film in videoStore.filteredFilms"
          :key="film.id"
          class="group flex flex-col rounded-2xl overflow-hidden bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl"
        >
          <!-- Frame Image with Aspect Tag -->
          <div class="relative w-full aspect-[16/9] overflow-hidden bg-zinc-950">
            <img
              :src="film.backdrop"
              :alt="film.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

            <!-- Top Floating Meta -->
            <div class="absolute top-3 left-3 flex items-center gap-2">
              <span class="bg-zinc-950/80 backdrop-blur-md text-zinc-300 text-[10px] font-mono px-2.5 py-1 rounded-md border border-zinc-800">
                {{ film.aspectRatio }}
              </span>
              <span class="bg-amber-400/90 text-zinc-950 text-[10px] font-bold px-2 py-1 rounded-md">
                {{ film.moodLabel }}
              </span>
            </div>

            <div class="absolute bottom-3 right-3 text-zinc-300 text-[11px] font-mono bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800">
              {{ film.duration }}
            </div>

            <!-- Hover Play Overlay -->
            <NuxtLink
              :to="`/watch/${film.id}`"
              class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-zinc-950/40 backdrop-blur-[2px]"
            >
              <div class="w-14 h-14 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <UIcon name="i-lucide-play" class="w-6 h-6 fill-current ml-0.5" />
              </div>
            </NuxtLink>
          </div>

          <!-- Exhibit Details -->
          <div class="p-6 flex flex-col justify-between flex-1 gap-4">
            <div>
              <div class="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>{{ film.studio }}</span>
                <span>{{ film.year }}</span>
              </div>
              <h3 class="text-xl font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
                {{ film.title }}
              </h3>
              <p class="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                {{ film.synopsis }}
              </p>
            </div>

            <!-- Color Grading Swatches -->
            <div class="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <div
                  v-for="(hex, idx) in film.colorPalette"
                  :key="idx"
                  class="w-3.5 h-3.5 rounded-full border border-zinc-800"
                  :style="{ backgroundColor: hex }"
                  :title="hex"
                ></div>
                <span class="text-[10px] font-mono text-zinc-500 ml-2">
                  5-Point Palette
                </span>
              </div>

              <button
                @click="openInspector(film)"
                class="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                <span>Detail Sinema</span>
                <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- The Cinephile Philosophy (Manifesto Section) -->
      <section class="mt-12 rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-zinc-800/90 flex flex-col gap-10">
        <div class="max-w-2xl">
          <span class="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Manifesto Kami
          </span>
          <h3 class="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2 leading-tight">
            Menghormati Gambar Bergerak Sebagaimana Mestinya.
          </h3>
          <p class="text-sm text-zinc-400 mt-3 leading-relaxed">
            Watchr didirikan atas kepedulian terhadap kualitas presentasi sinema: bebas algoritma bising, tanpa crop paksa, dan mempertahankan kejernihan suara asli.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-zinc-800">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-amber-400 font-bold">01 / RASIO ASLI</span>
            <h4 class="font-bold text-white text-base">Tanpa Crop Layar</h4>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Format 2.39:1 Scope, 1.85:1 Academy, dan 1.33:1 Klasik ditampilkan presisi hingga piksel terakhir tanpa regangan.
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-amber-400 font-bold">02 / AUDIO HIGH FIDELITY</span>
            <h4 class="font-bold text-white text-base">Tata Suara Multikanal</h4>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Dukungan audio spasial 5.1 surround diskrit yang memisahkan dialog jernih dan dentuman bass sinematik.
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-xs font-mono text-amber-400 font-bold">03 / STREAMING ADAPTIF</span>
            <h4 class="font-bold text-white text-base">Engine HLS Modern</h4>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Bertenaga Vidstack Player yang menjamin transmisi bit-perfect bebas buffering di berbagai resolusi layar.
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="mt-20 border-t border-zinc-800/80 py-12 px-6 sm:px-12 text-xs font-mono text-zinc-500">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <span class="font-black text-white text-base">Watchr.</span>
          <span>© 2026 Curated Cinema Platform.</span>
        </div>

        <div class="flex items-center gap-6 text-zinc-400">
          <a href="#" class="hover:text-white transition-colors">Manifesto</a>
          <a href="#" class="hover:text-white transition-colors">Spesifikasi Teknis</a>
          <a href="#" class="hover:text-white transition-colors">Arsip Terbuka</a>
          <a href="#" class="hover:text-white transition-colors">Kontak Kurator</a>
        </div>
      </div>
    </footer>

    <!-- Film Inspector Drawer / Modal -->
    <div
      v-if="isInspectorOpen && activeInspectorFilm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-fade-in"
      @click.self="isInspectorOpen = false"
    >
      <div class="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <!-- Close button -->
        <button
          @click="isInspectorOpen = false"
          class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors"
        >
          <UIcon name="i-lucide-x" class="w-4 h-4" />
        </button>

        <!-- Image Banner -->
        <div class="relative w-full aspect-[21/9] overflow-hidden bg-zinc-950">
          <img
            :src="activeInspectorFilm.backdrop"
            :alt="activeInspectorFilm.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
        </div>

        <!-- Inspector Content -->
        <div class="p-6 sm:p-8 flex flex-col gap-5">
          <div>
            <div class="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span>{{ activeInspectorFilm.aspectRatio }}</span>
              <span>•</span>
              <span>{{ activeInspectorFilm.duration }}</span>
              <span>•</span>
              <span>{{ activeInspectorFilm.year }}</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-black text-white mt-1">
              {{ activeInspectorFilm.title }}
            </h3>
            <p class="text-xs text-zinc-400 font-mono mt-1">
              Sutradara: {{ activeInspectorFilm.director }} ({{ activeInspectorFilm.studio }})
            </p>
          </div>

          <!-- Color Palette Strip Breakdown -->
          <div class="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col gap-2">
            <span class="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Cinematography Color Grading:
            </span>
            <div class="flex items-center gap-2 pt-1">
              <div
                v-for="(hex, idx) in activeInspectorFilm.colorPalette"
                :key="idx"
                class="flex-1 h-8 rounded flex items-center justify-center text-[10px] font-mono text-white/80 shadow-inner"
                :style="{ backgroundColor: hex }"
              >
                {{ hex }}
              </div>
            </div>
          </div>

          <!-- Synopsis -->
          <p class="text-sm text-zinc-300 leading-relaxed font-sans">
            {{ activeInspectorFilm.synopsis }}
          </p>

          <!-- Awards / Laurels -->
          <div class="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
            <span
              v-for="(award, idx) in activeInspectorFilm.awards"
              :key="idx"
              class="text-xs font-mono bg-zinc-800/70 border border-zinc-700/60 text-zinc-300 px-2.5 py-1 rounded-md"
            >
              ✦ {{ award }}
            </span>
          </div>

          <!-- Action -->
          <div class="pt-4 flex items-center justify-end gap-3">
            <button
              @click="isInspectorOpen = false"
              class="px-4 py-2.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              Tutup
            </button>
            <NuxtLink
              :to="`/watch/${activeInspectorFilm.id}`"
              class="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-amber-400/20"
            >
              <UIcon name="i-lucide-play" class="w-3.5 h-3.5 fill-current" />
              <span>Masuk ke Bioskop</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
