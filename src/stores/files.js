import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFilesStore = defineStore('files', () => {
  const files = ref([])
  const addFile = (file) => {
    files.value.push(file)
  }
  const getFiles = () => {
    return files.value
  }

  return { addFile, getFiles }
})
