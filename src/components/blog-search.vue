<template>
  <div class="blog-search">
    <!-- Search Icon Trigger -->
    <button
      @click="openPanel"
      class="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
      aria-label="Buscar artigos"
    >
      <svg class="size-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>

    <!-- Floating Panel Overlay -->
    <Transition name="fade">
      <div
        v-if="isPanelOpen"
        class="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-20 px-4"
        @click.self="closePanel"
      >
        <div class="bg-surface-dark w-full max-w-4xl rounded-4xl shadow-2xl max-h-[80vh] flex flex-col">
          <!-- Panel Header -->
          <div class="p-6 border-b border-gray-700 shrink-0">
            <div class="relative">
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Buscar artigos..."
                class="w-full px-6 py-3 pr-24 bg-gray-200 text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-base"
                @input="handleSearch"
              />
              <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span v-if="searchQuery" class="text-gray-500 text-sm">
                  {{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }}
                </span>
                <button
                  @click="closePanel"
                  class="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Fechar"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Panel Content (Scrollable) -->
          <div class="overflow-y-auto flex-1 p-6">
            <!-- Search Results -->
            <div v-if="searchQuery && results.length > 0" class="space-y-6">
              <article
                v-for="post in results"
                :key="post.slug"
                class="bg-gray-800 text-white rounded-3xl p-4 md:p-6 hover:bg-gray-700 transition-colors"
              >
                <div class="flex flex-col md:flex-row gap-4">
                  <div
                    v-if="post.image"
                    class="w-full md:w-48 h-32 md:h-40 rounded-2xl bg-white overflow-hidden shrink-0"
                  >
                    <img
                      :src="post.image"
                      :alt="post.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 class="font-bold text-lg md:text-xl mb-2">
                        {{ post.title }}
                      </h3>
                      <p class="text-gray-300 text-sm line-clamp-2">
                        {{ post.excerpt }}
                      </p>
                    </div>
                    <div class="flex items-center justify-between gap-2 mt-3">
                      <a
                        :href="`/blog/${post.slug}`"
                        class="inline-block bg-secondary text-white font-bold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                      >
                        Saiba mais
                      </a>
                      <span v-if="post.date" class="text-xs text-gray-400">
                        {{ formatDate(post.date) }}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="searchQuery && results.length === 0"
              class="text-center text-gray-400 py-12"
            >
              <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p class="text-lg">Nenhum resultado encontrado para "{{ searchQuery }}"</p>
              <p class="text-sm mt-2">Tente buscar com outras palavras-chave</p>
            </div>

            <!-- Initial State -->
            <div v-else class="text-center text-gray-400 py-12">
              <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p class="text-lg">Digite para começar a buscar artigos</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import Fuse from 'fuse.js'

interface BlogPost {
  slug: string
  title: string
  date: string | null
  image: string | null
  content: string
  excerpt: string
}

const searchQuery = ref('')
const results = ref<BlogPost[]>([])
const allPosts = ref<BlogPost[]>([])
const isPanelOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
let fuse: Fuse<BlogPost> | null = null

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'content', weight: 0.3 },
    { name: 'excerpt', weight: 0.2 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
}

onMounted(async () => {
  try {
    const response = await fetch('/blog-search-index')
    allPosts.value = await response.json()
    fuse = new Fuse(allPosts.value, fuseOptions)
  } catch (error) {
    console.error('Error loading blog search index:', error)
  }
})

// Close panel on Escape key
watch(isPanelOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when panel is open
    document.body.style.overflow = 'hidden'
    // Focus search input
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closePanel()
  }
}

function openPanel() {
  isPanelOpen.value = true
}

function closePanel() {
  isPanelOpen.value = false
  searchQuery.value = ''
  results.value = []
}

function handleSearch() {
  if (!searchQuery.value.trim() || !fuse) {
    results.value = []
    return
  }

  const searchResults = fuse.search(searchQuery.value)
  results.value = searchResults.map(result => result.item)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active > div {
  transition: transform 0.3s ease;
}

.fade-enter-from > div {
  transform: scale(0.95);
}
</style>
