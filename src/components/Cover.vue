<script setup>
import { ref } from "vue";
import api from "@/api/api.js";
const props = defineProps({
  cover: {
    type: String,
  },
});
</script>

<template>
  <div class="cover">
    <img :src="api.imgUrl + '/' + cover" alt="封面" v-if="cover" />
    <img v-else src="@/assets/images/default_img.png" />
  </div>
</template>

<style scoped>
.cover {
  background: #ddd;
  display: flex;
  align-items: center;
  width: 60px;
  height: 60px;
  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
  }
}
</style>
