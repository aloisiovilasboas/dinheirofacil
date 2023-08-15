import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContasStore = defineStore('contas', () => {
  const contas = ref({contascorrente:[{nome:'BB'},], cartoes:[{nome:'BB'},{nome:'XP'}]})

  //pra usar local storage pra guardar as tags:
  /*   if (localStorage.getItem("tagsval")){
    tags.value = JSON.parse(localStorage.getItem("tagsval"))
  }

  watch(
    tags,
    (tagsval)=> {
      localStorage.setItem('tagsval',JSON.stringify(tagsval))
    },
    {deep: true}
  ) */
  return {
    contas
  }
})
