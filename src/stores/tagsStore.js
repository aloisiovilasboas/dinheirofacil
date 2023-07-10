import { defineStore } from 'pinia'

export const useTagsStore = defineStore('tags', {
  state: () => {
    return { tags: [{ nomeTag: 'Geral', tagsFontes: [], filtros: [] }] }
  },
  actions: {
    setTags(tags) {
      this.tags = tags
    },
    addTag(tag) {
      this.tags.push(tag)
    }
  },
  getters: {
    tagsNames: (state) => {
      state.tags
    }
  }
})
