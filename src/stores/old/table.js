import { defineStore } from 'pinia'

export const useTableStore = defineStore({
  id: 'table',
  state: () => ({
    tableData: []
  })
})
