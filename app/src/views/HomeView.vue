<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import twemoji from 'twemoji';
import { HELLO_MESSAGES } from '@/lib/constants';
import ZennArticleCard from '@/components/ZennArticleCard.vue';
import WebLinkCard from '@/components/WebLinkCard.vue';

const now = ref(new Date());
const infoSection = ref(null);
const bootReady = ref(false);
const shouldPlayBoot = ref(window.sessionStorage.getItem('home-boot-played') !== '1');
let bootTimerId = null;
/** @type { id: Number, mmdd: String, lifespan: String, name: String, profile: String } */
const birthday = ref(null);
const weather = ref(null);
const temperature = ref(null);

const today = computed(() =>
  now.value.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }),
);

const message = computed(() => HELLO_MESSAGES[Math.floor(Math.random() * HELLO_MESSAGES.length)]);

onMounted(async () => {
  if (shouldPlayBoot.value) {
    bootTimerId = window.setTimeout(() => {
      bootReady.value = true;
      shouldPlayBoot.value = false;
      window.sessionStorage.setItem('home-boot-played', '1');
    }, 4200);
  } else {
    bootReady.value = true;
  }

  const mmdd = new Intl.DateTimeFormat('ja-JP', { month: '2-digit', day: '2-digit' }).format(now.value).replace(/\//g, '');
  const birthdayResponse = await fetch(`/whatistoday/index.cgi/v3/famousbirthday/${mmdd}`);
  if (birthdayResponse.ok) {
    birthday.value = await birthdayResponse.json();
  }

  // 天気情報を取得
  const weatherResponse = await fetch('/open-meteo/v1/forecast?latitude=35.69&longitude=139.75&current_weather=true&timezone=Asia%2FTokyo');
  if (weatherResponse.ok) {
    const weatherData = await weatherResponse.json();
    const code = weatherData.current_weather.weathercode;
    if (code <= 1) {
      weather.value = '晴れ';
    } else if (code <= 3 || code === 45 || code === 48) {
      weather.value = '曇り';
    } else if (code >= 51) {
      weather.value = '雨';
    }

    temperature.value = weatherData.current_weather.temperature;
  }

  if (infoSection.value) {
    twemoji.parse(infoSection.value, {
      folder: 'svg',
      ext: '.svg',
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
    });
  }
});

onUnmounted(() => {
  if (bootTimerId !== null) {
    window.clearTimeout(bootTimerId);
  }
});
</script>

<template>
  <div class="home-view">
    <section v-if="shouldPlayBoot" class="boot-console" aria-hidden="true">
      <div class="boot-console__frame">
        <div class="boot-console__titlebar">
          <span>portfolio@localhost</span>
          <span>boot sequence</span>
        </div>
        <div class="boot-console__content">
          <p class="boot-console__lead">
            <span class="boot-console__prompt">$</span>
            systemctl start profile.service
          </p>
          <p class="boot-console__line" style="--line-delay: 0.34s">&gt; init portfolio shell</p>
          <p class="boot-console__line" style="--line-delay: 0.74s">&gt; load profile data</p>
          <p class="boot-console__line" style="--line-delay: 1.14s">&gt; connect api / timeline / works</p>
          <p class="boot-console__line" style="--line-delay: 1.54s">&gt; ready</p>
          <p class="boot-console__line boot-console__line--cursor" style="--line-delay: 1.86s">
            <span class="boot-console__prompt">&gt;</span>
            waiting for input
          </p>
        </div>
      </div>
    </section>

    <Transition name="boot-reveal">
      <div v-if="bootReady" class="post-boot-content">
        <div class="keyvisual">
          <img src="/img/me.png" alt="プロフィール写真" />
          <div>
            <p>こんにちは</p>
            <p>細田佳希のポートフォリオです</p>
            <p>今日は "{{ today }}" ですね</p>
            <p v-if="birthday !== null">{{ birthday.profile }}、{{ birthday.name }}の誕生日だそうです</p>
            <p v-if="weather !== null">今の東京都千代田区の天気は{{ weather }}で、{{ temperature }}°Cです</p>
            <p>{{ message }}</p>
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
                <span> The 19th International Conference on P2P, Parallel, Grid, Cloud and Internet Computing </span>
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
                <span> 大規模言語モデルによるプロトコル実装コードからの状態機械抽出における入力表現の影響評価 </span>
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
          <WebLinkCard name="GitHub" href="https://github.com/proxaxis" description="bbsfish has many repositories available. Follow their code on GitHub." icon="https://github.githubassets.com/assets/pinned-octocat-093da3e6fa40.svg" />
          <WebLinkCard name="Zenn" href="https://zenn.dev/bbsfish" description="フロントエンド、バックエンド、いろいろ勉強中です" icon="https://static.zenn.studio/images/logo-transparent.png" />
        </nav>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as var;

.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  min-height: 100vh;
}

.boot-console {
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(16, 22, 28, 0.96), rgba(6, 10, 16, 0.98)), radial-gradient(circle at top, rgba(0, 255, 180, 0.12), transparent 55%);
  box-shadow:
    0 24px 50px -28px rgba(0, 0, 0, 0.65),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent 18%), repeating-linear-gradient(to bottom, transparent 0, transparent 1.8rem, rgba(255, 255, 255, 0.03) 1.8rem, rgba(255, 255, 255, 0.03) 1.9rem);
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0.8;
  }

  p {
    color: #eaeaea;
  }

  .boot-console__frame {
    position: relative;
    z-index: 1;
    padding: 1rem 1.1rem 1.15rem;
    color: #a7f3d0;
    font-family: 'DM Mono', 'Ubuntu Mono', monospace;
  }

  .boot-console__titlebar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.82rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(191, 255, 231, 0.8);
    margin-bottom: 0.9rem;
  }

  .boot-console__content {
    display: grid;
    gap: 0.45rem;
    font-size: clamp(0.95rem, 2vw, 1.05rem);
    line-height: 1.6;
  }

  .boot-console__lead,
  .boot-console__line {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.45rem;
    opacity: 0;
    transform: translateY(0.55rem);
    animation: boot-line-in 0.45s ease forwards;
  }

  .boot-console__lead {
    color: #d1fae5;
    animation-delay: 0.05s;
  }

  .boot-console__line {
    animation-delay: var(--line-delay);
  }

  .boot-console__line--cursor {
    width: fit-content;
    margin-top: 0.15rem;

    &::after {
      content: '';
      width: 0.6em;
      height: 1.05em;
      margin-left: 0.2rem;
      background: currentColor;
      border-radius: 2px;
      animation: boot-cursor 0.95s steps(1) infinite;
    }
  }

  .boot-console__prompt {
    color: #4ade80;
  }
}

.post-boot-content {
  display: grid;
  gap: 1.5rem;
  @include var.narrow() {
    grid-template-columns: repeat(auto-fill, minmax(var(--vw-min-width), 1fr));
  }
}

.boot-reveal-enter-active {
  transition:
    opacity 360ms ease,
    transform 360ms ease;
}

.boot-reveal-enter-from {
  opacity: 0;
  transform: translateY(0.75rem);
}

.boot-reveal-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.keyvisual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.25rem 1rem;
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 55%);
  border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  box-shadow: 0 18px 34px -28px var(--shadow);
  animation: hero-rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s both;

  p {
    text-align: center;
  }

  img {
    height: 10rem;
    animation: hero-float 5.5s ease-in-out infinite;
  }

  @include var.narrow() {
    flex-direction: column;
  }
}

#info {
  display: grid;
  gap: 1rem;
  animation: hero-rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) 0.25s both;

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

h1,
section,
nav {
  animation: hero-rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

h1:nth-of-type(1) {
  animation-delay: 0.35s;
}

section:nth-of-type(2) {
  animation-delay: 0.45s;
}

h1:nth-of-type(2) {
  animation-delay: 0.6s;
}

nav {
  animation-delay: 0.7s;
}

@keyframes boot-line-in {
  from {
    opacity: 0;
    transform: translateY(0.55rem);
    filter: blur(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes boot-cursor {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(1rem);
    filter: blur(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes hero-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-0.35rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .boot-console__lead,
  .boot-console__line,
  .keyvisual,
  .keyvisual img,
  #info,
  h1,
  section,
  nav {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    filter: none !important;
    opacity: 1 !important;
  }

  .boot-reveal-enter-active,
  .boot-reveal-leave-active {
    transition: none !important;
  }

  .boot-console__line--cursor::after {
    animation: none !important;
  }
}
</style>
