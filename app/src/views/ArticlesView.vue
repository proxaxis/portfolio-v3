<script setup>
import { ref } from 'vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ZennArticleCard from '@/components/ZennArticleCard.vue';

const isZennArticlesLoading = ref(true);
</script>

<template>
  <div class="articles-view">
    <h1>Zenn の投稿記事一覧</h1>
    <LoadingSpinner text="読み込み中" v-if="isZennArticlesLoading" />
    <ZennArticleCard v-show="!isZennArticlesLoading" :limit="50" @onload="isZennArticlesLoading = false" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as var;

.articles-view {
  margin: 0 auto;
  @include var.narrow() {
    width: 60%;
  }
  section {
    img {
      width: 100%;
      max-width: 40rem;
    }
  }
}
</style>
