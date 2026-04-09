<script setup>
import { ref, computed, onMounted } from 'vue'
import twemoji from 'twemoji'
import ZennArticleCard from '@/components/ZennArticleCard.vue'
import WebLinkCard from '@/components/WebLinkCard.vue'

const now = ref(new Date())
const infoSection = ref(null)
/** @type { id: Number, mmdd: String, lifespan: String, name: String, profile: String } */
const birthday = ref(null)
const weather = ref(null)
const temperature = ref(null)

const today = computed(() =>
  now.value.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }),
)

onMounted(async () => {
  const mmdd = new Intl.DateTimeFormat('ja-JP', { month: '2-digit', day: '2-digit' })
    .format(now.value)
    .replace(/\//g, '')
  const birthdayResponse = await fetch(`/whatistoday/index.cgi/v3/famousbirthday/${mmdd}`)
  if (birthdayResponse.ok) {
    birthday.value = await birthdayResponse.json()
  }

  // 天気情報を取得
  const weatherResponse = await fetch('/open-meteo/v1/forecast?latitude=35.69&longitude=139.75&current_weather=true&timezone=Asia%2FTokyo')
  if (weatherResponse.ok) {
    const weatherData = await weatherResponse.json()
    const code = weatherData.current_weather.weathercode
    if (code <= 1) {
      weather.value = '晴れ';
    }
    else if (code <= 3 || code === 45 || code === 48) {
      weather.value = '曇り';
    }
    else if (code >= 51) {
      weather.value = '雨';
    }

    temperature.value = weatherData.current_weather.temperature
  }

  if (infoSection.value) {
    twemoji.parse(infoSection.value, {
      folder: 'svg',
      ext: '.svg',
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
    })
  }
})

function head() {
  return {
    title: this.$route.meta.title,
    meta: [
      {
        name: 'description',
        content: this.$route.meta.description,
      },
      {
        property: 'og:title',
        content: this.$route.meta.og_title,
      },
      {
        property: 'og:description',
        content: this.$route.meta.og_description,
      },
    ],
  }
}
</script>

<template>
  <div class="home-view">

    <div id="keyvisual">
      <img src="/img/me.png" alt="プロフィール写真" />
      <div class="kv-hello">
        <div>
          <p>こんにちは</p>
          <p>細田佳希のポートフォリオです</p>
          <p>今日は「{{ today }}」ですね</p>
          <p v-if="birthday !== null">
            {{ birthday.profile }}、{{ birthday.name }}の誕生日だそうです
          </p>
          <p v-if="weather !== null">
            今の東京都千代田区の天気は{{ weather }}で、{{ temperature }}°Cです
          </p>
        </div>
      </div>
    </div>

    <section id="info" ref="infoSection">
      <details>
        <summary><span class="info-summary-icon" aria-hidden="true">🏅</span>資格</summary>
        <ul class="info-list info-list--timeline">
          <li>
            <span>情報処理安全確保支援士試験合格</span>
            <span>2025年12月</span>
          </li>
          <li>
            <span>TOEIC Score: 705</span>
            <span>2024年2月</span>
          </li>
          <li>
            <span>基本情報技術者試験合格</span>
            <span>2022年5月</span>
          </li>
          <li>
            <span>ITパスポート</span>
            <span>2021年10月</span>
          </li>
          <li>
            <span>実用英語技術検定2級</span>
            <span>2019年10月</span>
          </li>
        </ul>
      </details>
      <details>
        <summary><span class="info-summary-icon" aria-hidden="true">🏆</span>実績</summary>
        <ul class="info-list info-list--timeline">
          <li>
            <span>CODE BLUE 2025 スタッフ</span>
            <span>2025年11月</span>
          </li>
          <li>
            <span>セキュリティキャンプ 2025 コネクト</span>
            <span>2025年9月</span>
          </li>
          <li>
            <span>CRYPTRECシンポジウム 2025</span>
            <span>2025年7月</span>
          </li>
          <li>
            <span
              >The 19th International Conference on P2P, Parallel, Grid, Cloud and Internet
              Computing</span
            >
            <span>2024年 11月、イタリア</span>
          </li>
          <li>
            <span>第 56 回サイバーワールド研究会</span>
            <span>2024年 3月、宮古島</span>
          </li>
          <li>
            <span>The 26th International Conference on Network-Based Information Systems</span>
            <span>2023年 9月、タイ</span>
          </li>
        </ul>
      </details>
      <details>
        <summary><span class="info-summary-icon" aria-hidden="true">💻</span>言語</summary>
        <ul class="info-list info-list--icon">
          <li>
            <span>🟨</span>
            <span>JavaScript</span>
          </li>
          <li>
            <span>🐍</span>
            <span>Python</span>
          </li>
          <li>
            <span>⚙️</span>
            <span>C/C++</span>
          </li>
          <li>
            <span>🐘</span>
            <span>PHP</span>
          </li>
        </ul>
      </details>
      <details>
        <summary><span class="info-summary-icon" aria-hidden="true">🛠️</span>開発</summary>
        <ul class="info-list info-list--icon">
          <li>
            <span>🔗</span>
            <span>Git/GitHub</span>
          </li>
          <li>
            <span>☁️</span>
            <span>GCP (Compute Engine, App Engine, Firebase 等)</span>
          </li>
          <li>
            <span>📄</span>
            <span>Google App Script</span>
          </li>
          <li>
            <span>🐳</span>
            <span>Docker</span>
          </li>
          <li>
            <span>🖧</span>
            <span>ウェブサーバ (Apache2)</span>
          </li>
          <li>
            <span>✉️</span>
            <span>メールサーバ (Postfix)</span>
          </li>
        </ul>
      </details>
      <details>
        <summary><span class="info-summary-icon" aria-hidden="true">🔬</span>研究</summary>
        <ul class="info-list info-list--icon">
          <li>
            <span>🤖</span>
            <span
              >大規模言語モデルによるプロトコル実装コードからの状態機械抽出における入力表現の影響評価</span
            >
          </li>
          <li>
            <span>🖥️</span>
            <span>個人情報をローカルで取り扱うシングルサインオンシステム構築</span>
          </li>
        </ul>
      </details>
    </section>

    <h1 id="articles">記事</h1>
    <section>
      <ZennArticleCard :limit="3" />
      <router-link to="/articles" class="AllArticlesButton">すべて表示</router-link>
    </section>

    <h1 id="weblink">ウェブリンク</h1>
    <nav>
      <WebLinkCard
        name="GitHub"
        href="https://github.com/proxaxis"
        description="bbsfish has many repositories available. Follow their code on GitHub."
        icon="https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg"
      />
      <WebLinkCard
        name="Zenn"
        href="https://zenn.dev/bbsfish"
        description="フロントエンド、バックエンド、いろいろ勉強中です"
        icon="https://static.zenn.studio/images/logo-transparent.png"
      />
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as var;

.home-view {
  margin: 0 auto;
  @include var.narrow() {
    width: 60%;
  }
}

#keyvisual {
  text-align: center;
  margin: 5rem 0;
  img {
    height: 10rem;
  }
  @include var.narrow() {
    display: flex;
    justify-content: center;
    .kv-hello {
      display: flex;
      align-items: center;
      height: 10rem;
    }
  }
}

#info {
  display: grid;
  gap: 1rem;
  details {
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    background: var(--bg-0);
    box-shadow: 0 10px 22px -18px var(--shadow);
    overflow: hidden;
    transition:
      box-shadow 0.35s ease,
      transform 0.35s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 28px -20px var(--shadow);
    }

    &[open] {
      box-shadow: 0 18px 32px -22px var(--shadow);
    }

    summary {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.85rem 1rem;
      font-size: 1.04rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      cursor: pointer;
      border-bottom: 1px solid transparent;
      color: var(--text-0);

      &::-webkit-details-marker {
        display: none;
      }
    }

    &[open] summary {
      border-bottom-color: var(--border);
    }

    ul {
      margin: 0;
      padding: 0.7rem 1rem 1rem;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    li {
      line-height: 1.5;
    }

    .info-list--timeline li {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.4rem 1rem;
      align-items: center;

      span:last-child {
        font-size: 0.9rem;
        color: var(--text-0);
      }
    }

    .info-list--icon li {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.4rem 0.7rem;
      align-items: start;

      span:first-child {
        line-height: 1.2;
      }

      span:last-child {
        font-size: 1rem;
        color: var(--text-0);
        overflow-wrap: anywhere;
      }
    }
  }

  .info-summary-icon {
    font-size: 1.25rem;
    line-height: 1;
  }

  :deep(img.emoji) {
    width: 1.2em;
    height: 1.2em;
    margin: 0 0.08em;
    vertical-align: -0.2em;
  }

  @include var.narrow() {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
