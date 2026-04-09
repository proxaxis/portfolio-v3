import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductsView from '@/views/ProductsView.vue'
import ArticlesView from '@/views/ArticlesView.vue'
import ToolsView from '@/views/ToolsView.vue'
import ContactView from '@/views/ContactView.vue'
import RandomGenerator from '@/views/tools/RandomGenerator.vue'

const DEFAULT_TITLE = 'YSKのポートフォリオ'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Home',
      component: HomeView,
      path: '/',
      meta: {
        title: 'ホーム',
      },
    },
    {
      name: 'Products',
      component: ProductsView,
      path: '/products',
      meta: {
        title: '制作物',
      },
    },
    {
      name: 'Articles',
      component: ArticlesView,
      path: '/articles',
      meta: {
        title: '記事',
      },
    },
    {
      path: '/tools',
      children: [
        {
          name: 'RandomGenerator',
          component: RandomGenerator,
          path: 'random-generator',
          meta: {
            title: '乱数ジェネレーター',
          },
        },
        {
          name: 'Tools',
          component: ToolsView,
          path: '',
          meta: {
            title: 'ツール',
          },
        },
      ],
    },
    {
      name: 'Contact',
      component: ContactView,
      path: '/contact',
      meta: {
        title: 'お問い合わせ',
      },
    },
  ],
})

router.afterEach((to) => {
  const pageTitle = to.meta?.title
  document.title = pageTitle ? `${pageTitle} | ${DEFAULT_TITLE}` : DEFAULT_TITLE
})

export default router
