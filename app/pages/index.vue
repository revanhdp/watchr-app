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

function closeInspector() {
  isInspectorOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isInspectorOpen.value) {
    closeInspector()
  }
}

const moods = [
  { id: 'all', label: 'Semua' },
  { id: 'dystopia', label: 'Distopia' },
  { id: 'adrenalin', label: 'Adrenalin' },
  { id: 'kontemplatif', label: 'Kontemplatif' },
  { id: 'animasi', label: 'Visual Puisi' }
]

const hero = computed(() => videoStore.featuredFilm)

onMounted(() => {
  videoStore.fetchFilms()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-400 selection:text-black">
    <!-- Top Navigation -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 px-4 sm:px-8 lg:px-12 py-3.5 flex items-center gap-4 justify-between"
      :class="[
        scrollY > 40
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80'
          : 'bg-gradient-to-b from-zinc-950/90 to-transparent border-b border-transparent'
      ]"
    >
      <div class="flex items-center gap-4 min-w-0 shrink-0">
        <NuxtLink to="/" class="flex items-center gap-1.5">
          <span class="text-xl font-black tracking-tight text-white">Watchr</span>
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        </NuxtLink>
        <span class="hidden lg:inline text-xs text-zinc-500 pl-4 border-l border-zinc-800">
          Sinema independen, tanpa kompromi kualitas
        </span>
      </div>

      <!-- Mood Filter — scrollable so it stays usable on mobile instead of disappearing -->
      <nav class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          v-for="mood in moods"
          :key="mood.id"
          @click="videoStore.setMood(mood.id)"
          class="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
          :class="[
            videoStore.selectedMood === mood.id
              ? 'bg-zinc-100 text-zinc-950 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/70 hover:bg-zinc-800/70'
          ]"
        >
          {{ mood.label }}
        </button>
      </nav>

      <NuxtLink
        :to="`/watch/${hero.id}`"
        class="shrink-0 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-lg transition-colors active:scale-95"
      >
        <UIcon name="i-lucide-play" class="w-3.5 h-3.5 fill-current" />
        <span class="hidden sm:inline">Mulai Nonton</span>
      </NuxtLink>
    </header>

    <!-- Hero -->
    <section class="relative w-full pt-20 sm:pt-24 pb-12 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div class="relative w-full rounded-xl overflow-hidden bg-zinc-900">
        <div class="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] max-h-[600px] overflow-hidden">
          <img
            :src="hero.backdrop"
            :alt="hero.title"
            class="w-full h-full object-cover object-center"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 sm:via-zinc-950/20 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-zinc-950/95 sm:from-zinc-950/85 via-zinc-950/30 sm:via-transparent to-transparent"></div>
        </div>

        <div class="absolute inset-0 p-5 sm:p-10 lg:p-12 flex flex-col justify-end max-w-2xl">
          <span class="text-xs font-semibold text-amber-400 mb-3">Pilihan Editor</span>

          <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.05]">
            {{ hero.title }}
          </h1>

          <p class="text-sm text-zinc-300 mt-3">
            Disutradarai <span class="text-white font-medium">{{ hero.director }}</span>
            <span class="text-zinc-500"> · {{ hero.studio }} · {{ hero.year }}</span>
          </p>

          <p class="text-sm text-zinc-400 mt-4 leading-relaxed max-w-xl line-clamp-2">
            {{ hero.synopsis }}
          </p>

          <p class="text-xs text-zinc-500 mt-4">
            {{ hero.aspectRatio }} · {{ hero.audioFormat }} · {{ hero.duration }}
          </p>

          <div class="flex flex-wrap items-center gap-3 mt-6">
            <NuxtLink
              :to="`/watch/${hero.id}`"
              class="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold px-6 py-3 rounded-lg text-sm transition-colors active:scale-95"
            >
              <UIcon name="i-lucide-play" class="w-4 h-4 fill-current" />
              Tonton Sekarang
            </NuxtLink>

            <button
              @click="openInspector(hero)"
              class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-lg text-sm border border-white/10 transition-colors active:scale-95"
            >
              <UIcon name="i-lucide-info" class="w-4 h-4" />
              Detail Film
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Catalog -->
    <main class="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 flex flex-col gap-16">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span class="text-xs font-semibold text-amber-400">Katalog</span>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Jelajahi Koleksi
          </h2>
        </div>
        <p class="text-sm text-zinc-500 max-w-sm">
          Rasio aspek asli, grading warna terjaga, tanpa crop paksa.
        </p>
      </div>

      <!-- Empty state for a mood with no matches -->
      <div
        v-if="videoStore.filteredFilms.length === 0"
        class="flex flex-col items-center justify-center gap-3 py-16 text-center border border-dashed border-zinc-800 rounded-xl"
      >
        <UIcon name="i-lucide-film" class="w-8 h-8 text-zinc-600" />
        <p class="text-sm text-zinc-500">Belum ada film untuk kategori ini.</p>
        <button
          @click="videoStore.setMood('all')"
          class="text-sm text-amber-400 hover:text-amber-300 font-medium"
        >
          Lihat semua koleksi
        </button>
      </div>

      <!-- Catalog Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="film in videoStore.filteredFilms"
          :key="film.id"
          class="group flex flex-col rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700 transition-colors"
        >
          <!-- Thumbnail -->
          <div class="relative w-full aspect-video overflow-hidden bg-zinc-950">
            <img
              :src="film.backdrop"
              :alt="film.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>

            <span class="absolute top-3 left-3 bg-zinc-950/80 text-zinc-300 text-[11px] px-2 py-1 rounded-md">
              {{ film.moodLabel }}
            </span>
            <span class="absolute bottom-3 right-3 text-zinc-200 text-[11px] font-mono bg-zinc-950/80 px-2 py-0.5 rounded">
              {{ film.duration }}
            </span>

            <NuxtLink
              :to="`/watch/${film.id}`"
              class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-zinc-950/30"
            >
              <div class="w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                <UIcon name="i-lucide-play" class="w-5 h-5 fill-current ml-0.5" />
              </div>
            </NuxtLink>
          </div>

          <!-- Details -->
          <div class="p-5 flex flex-col gap-3 flex-1">
            <div>
              <div class="flex items-center justify-between text-xs text-zinc-500">
                <span>{{ film.studio }}</span>
                <span>{{ film.year }}</span>
              </div>
              <h3 class="text-lg font-bold text-white mt-1">
                {{ film.title }}
              </h3>
              <p class="text-sm text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                {{ film.synopsis }}
              </p>
            </div>

            <button
              @click="openInspector(film)"
              class="mt-auto self-start text-sm text-zinc-400 hover:text-amber-400 flex items-center gap-1 font-medium transition-colors"
            >
              <span>Detail film</span>
              <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Why Watchr -->
      <section class="pt-12 border-t border-zinc-800/80">
        <div class="max-w-xl mb-10">
          <h3 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ditonton sebagaimana filmnya dibuat
          </h3>
          <p class="text-sm text-zinc-400 mt-2 leading-relaxed">
            Tanpa crop paksa, tanpa kompresi audio berlebihan, dan streaming yang stabil di berbagai koneksi.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="flex flex-col gap-2">
            <UIcon name="i-lucide-crop" class="w-5 h-5 text-amber-400" />
            <h4 class="font-semibold text-white text-sm">Rasio aspek asli</h4>
            <p class="text-sm text-zinc-500 leading-relaxed">
              Scope, Academy, hingga format klasik ditampilkan presisi tanpa peregangan gambar.
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <UIcon name="i-lucide-headphones" class="w-5 h-5 text-amber-400" />
            <h4 class="font-semibold text-white text-sm">Audio multikanal</h4>
            <p class="text-sm text-zinc-500 leading-relaxed">
              Dukungan 5.1 surround yang menjaga kejernihan dialog dan detail suara latar.
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <UIcon name="i-lucide-gauge" class="w-5 h-5 text-amber-400" />
            <h4 class="font-semibold text-white text-sm">Streaming adaptif</h4>
            <p class="text-sm text-zinc-500 leading-relaxed">
              Ditenagai HLS modern untuk transisi kualitas yang mulus tanpa buffering.
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="mt-16 border-t border-zinc-800/80 py-10 px-4 sm:px-8 lg:px-12">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
        <div class="flex items-center gap-2">
          <span class="font-bold text-white">Watchr</span>
          <span>© 2026</span>
        </div>

        <div class="flex items-center gap-6">
          <a href="#" class="hover:text-white transition-colors">Tentang</a>
          <a href="#" class="hover:text-white transition-colors">Spesifikasi</a>
          <a href="#" class="hover:text-white transition-colors">Kontak</a>
        </div>
      </div>
    </footer>

    <!-- Film Inspector Modal -->
    <Transition name="modal">
      <div
        v-if="isInspectorOpen && activeInspectorFilm"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="activeInspectorFilm.title"
        @click.self="closeInspector"
      >
        <div class="modal-panel relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
          <button
            @click="closeInspector"
            aria-label="Tutup"
            class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <UIcon name="i-lucide-x" class="w-4 h-4" />
          </button>

          <div class="relative w-full aspect-video overflow-hidden bg-zinc-950">
            <img
              :src="activeInspectorFilm.backdrop"
              :alt="activeInspectorFilm.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
          </div>

          <div class="p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <p class="text-xs text-zinc-500">
                {{ activeInspectorFilm.aspectRatio }} · {{ activeInspectorFilm.duration }} · {{ activeInspectorFilm.year }}
              </p>
              <h3 class="text-2xl font-bold text-white mt-1">
                {{ activeInspectorFilm.title }}
              </h3>
              <p class="text-sm text-zinc-400 mt-1">
                Disutradarai {{ activeInspectorFilm.director }} · {{ activeInspectorFilm.studio }}
              </p>
            </div>

            <p class="text-sm text-zinc-300 leading-relaxed">
              {{ activeInspectorFilm.synopsis }}
            </p>

            <blockquote class="text-sm text-zinc-400 italic leading-relaxed border-l-2 border-amber-400/60 pl-3">
              {{ activeInspectorFilm.curatorQuote }}
            </blockquote>

            <div class="flex flex-col gap-2">
              <span class="text-xs text-zinc-500">Color grading — {{ activeInspectorFilm.colorGrade }}</span>
              <div class="flex items-center gap-1.5">
                <div
                  v-for="(hex, idx) in activeInspectorFilm.colorPalette"
                  :key="idx"
                  class="w-7 h-7 rounded-md"
                  :style="{ backgroundColor: hex }"
                  :title="hex"
                ></div>
              </div>
            </div>

            <div v-if="activeInspectorFilm.awards?.length" class="flex flex-wrap gap-2 pt-3 border-t border-zinc-800">
              <span
                v-for="(award, idx) in activeInspectorFilm.awards"
                :key="idx"
                class="text-xs bg-zinc-800/70 text-zinc-300 px-2.5 py-1 rounded-md"
              >
                {{ award }}
              </span>
            </div>

            <div class="pt-2 flex items-center justify-end gap-3">
              <button
                @click="closeInspector"
                class="px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Tutup
              </button>
              <NuxtLink
                :to="`/watch/${activeInspectorFilm.id}`"
                class="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                <UIcon name="i-lucide-play" class="w-4 h-4 fill-current" />
                Tonton Sekarang
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
