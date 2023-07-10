import { defineStore } from 'pinia'
import {ref, watch} from 'vue'

export const useTagsStore = defineStore('tags',()=>{
  const tags = ref(
    [{ nomeTag: 'Geral', tagsFontes: [], filtros: [] }] 
  );

  if (localStorage.getItem("tagsval")){
    tags.value = JSON.parse(localStorage.getItem("tagsval"))
  }

  watch(
    tags,
    (tagsval)=> {
      localStorage.setItem('tagsval',JSON.stringify(tagsval))
    },
    {deep: true}
  )
  return {
    tags
  }
})
