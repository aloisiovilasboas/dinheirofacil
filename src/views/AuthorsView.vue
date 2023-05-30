<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthorStore } from '../stores/author'

const { authors } = storeToRefs(useAuthorStore())
const { fetchAuthors } = useAuthorStore()

fetchAuthors()
</script>

<template>
  <div>
    <div v-if="authors.length > 0">
      <p> v-for="author in authors" :key="author.id"></p>

      <RouterLink :to="`/author/${author.username}`">{{ author.name }}</RouterLink>

    </div>
  </div>
</template>