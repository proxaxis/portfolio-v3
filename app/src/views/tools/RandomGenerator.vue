<script setup>
import { onMounted, ref, watch } from 'vue'
import AppSnackbar from '@/components/AppSnackbar.vue'
import IconClipboard from '@/components/icons/IconClipboard.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import IconCircleQuestion from '@/components/icons/IconCircleQuestion.vue'

const SAVED_PRESETS_KEY = 'saved_password_presets'

const vmUseUppercase = ref(true)
const vmUseLowercase = ref(true)
const vmUseNumbers = ref(true)
const vmUseSymbols = ref(true)
const vmPasswordLength = ref(12)
const vmPasswordCount = ref(5)
const vmAvoidSimilar = ref(false)
const vmNoDuplicates = ref(false)
const vmRequireEachCharSet = ref(true)
const vmPresetName = ref('')
const vmSelectedPresetName = ref('')
const rfSnackbar = ref(null)
const currentCharSet = ref('')
const savedPresets = ref([])
const generatedPasswords = ref([])
const copiedIndex = ref(null)
let copyFeedbackTimer = null
const cryptoRandom = globalThis.crypto

function normalizePasswordLength(value) {
  const length = Number(value)

  if (!Number.isFinite(length)) {
    return 4
  }

  return Math.min(512, Math.max(4, Math.trunc(length)))
}

function normalizePasswordCount(value) {
  const count = Number(value)

  if (!Number.isFinite(count)) {
    return 1
  }

  return Math.min(100, Math.max(1, Math.trunc(count)))
}

function getRandomInt(max) {
  if (!cryptoRandom || max <= 0) {
    return 0
  }

  const limit = Math.floor(0x100000000 / max) * max
  const buffer = new Uint32Array(1)

  while (true) {
    cryptoRandom.getRandomValues(buffer)
    const value = buffer[0]

    if (value < limit) {
      return value % max
    }
  }
}

function getInitialSymbols() {
  const allSymbolChars = '!"@#$\'%^&*/()_+-={}`[]|;:,~.<>?'
  return allSymbolChars.split('').map((char) => ({ char, checked: false }))
}

const symbols = ref(getInitialSymbols())

function readSavedPresets() {
  try {
    const raw = localStorage.getItem(SAVED_PRESETS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeSavedPresets(presets) {
  localStorage.setItem(SAVED_PRESETS_KEY, JSON.stringify(presets))
}

function collectCurrentSettings() {
  return {
    useUppercase: vmUseUppercase.value,
    useLowercase: vmUseLowercase.value,
    useNumbers: vmUseNumbers.value,
    useSymbols: vmUseSymbols.value,
    passwordLength: vmPasswordLength.value,
    passwordCount: vmPasswordCount.value,
    avoidSimilar: vmAvoidSimilar.value,
    noDuplicates: vmNoDuplicates.value,
    requireEachCharSet: vmRequireEachCharSet.value,
    selectedSymbols: symbols.value.filter((s) => s.checked).map((s) => s.char),
  }
}

function applyPresetSettings(settings) {
  vmUseUppercase.value = settings.useUppercase
  vmUseLowercase.value = settings.useLowercase
  vmUseNumbers.value = settings.useNumbers
  vmUseSymbols.value = settings.useSymbols
  vmPasswordLength.value = normalizePasswordLength(settings.passwordLength)
  vmPasswordCount.value = normalizePasswordCount(settings.passwordCount)
  vmAvoidSimilar.value = settings.avoidSimilar
  vmNoDuplicates.value = settings.noDuplicates
  vmRequireEachCharSet.value = settings.requireEachCharSet ?? true

  const selected = new Set(settings.selectedSymbols || [])
  symbols.value.forEach((symbol) => {
    symbol.checked = selected.has(symbol.char)
  })
}

function saveCurrentPreset() {
  const name = vmPresetName.value.trim()
  if (!name) {
    rfSnackbar.value?.alert('失敗: プリセット名を入力してください')
    return
  }

  const presets = [...savedPresets.value]
  const existingIndex = presets.findIndex((p) => p.name === name)
  const nextPreset = {
    name,
    settings: collectCurrentSettings(),
  }

  if (existingIndex >= 0) {
    const overwrite = window.confirm(`プリセット「${name}」は既に存在します。上書きしますか？`)
    if (!overwrite) {
      return
    }
    presets[existingIndex] = nextPreset
  } else {
    presets.push(nextPreset)
  }

  savedPresets.value = presets
  writeSavedPresets(presets)
  vmSelectedPresetName.value = name
}

function applySelectedPreset() {
  if (!vmSelectedPresetName.value) {
    return
  }

  const preset = savedPresets.value.find((p) => p.name === vmSelectedPresetName.value)
  if (!preset) {
    return
  }

  applyPresetSettings(preset.settings)
  rfSnackbar.value?.message(`プリセット「${preset.name}」を適用しました`)
}

function deleteSelectedPreset() {
  if (!vmSelectedPresetName.value) {
    return
  }

  const confirmed = window.confirm(
    `プリセット「${vmSelectedPresetName.value}」を削除します。よろしいですか？`,
  )

  if (!confirmed) {
    return
  }

  const filtered = savedPresets.value.filter((p) => p.name !== vmSelectedPresetName.value)
  savedPresets.value = filtered
  writeSavedPresets(filtered)
  vmSelectedPresetName.value = ''
  rfSnackbar.value?.message('プリセットを削除しました')
}

// 記号のチェック状態を一括設定
function setSymbols(type) {
  symbols.value.forEach((symbol) => {
    switch (type) {
      case 'none':
        symbol.checked = false
        break
      case 'all':
        symbol.checked = true
        break
    }
  })
}

// 使用する文字セットを構築
function buildCharSets() {
  let baseChars = ''
  const guaranteedChars = []

  const sets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: symbols.value
      .filter((s) => s.checked)
      .map((s) => s.char)
      .join(''),
  }

  if (vmAvoidSimilar.value) {
    const similarChars = /[Il1O0]/g
    sets.uppercase = sets.uppercase.replace(similarChars, '')
    sets.lowercase = sets.lowercase.replace(similarChars, '')
    sets.numbers = sets.numbers.replace(similarChars, '')
  }

  if (vmUseUppercase.value && sets.uppercase) {
    baseChars += sets.uppercase
    guaranteedChars.push(sets.uppercase[getRandomInt(sets.uppercase.length)])
  }
  if (vmUseLowercase.value && sets.lowercase) {
    baseChars += sets.lowercase
    guaranteedChars.push(sets.lowercase[getRandomInt(sets.lowercase.length)])
  }
  if (vmUseNumbers.value && sets.numbers) {
    baseChars += sets.numbers
    guaranteedChars.push(sets.numbers[getRandomInt(sets.numbers.length)])
  }
  if (vmUseSymbols.value && sets.symbols) {
    baseChars += sets.symbols
    guaranteedChars.push(sets.symbols[getRandomInt(sets.symbols.length)])
  }

  return { base: baseChars.split(''), guaranteed: guaranteedChars }
}

// 文字列をシャッフル
function shuffleString(str) {
  const arr = str.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

// パスワード生成ロジック
function generatePasswords() {
  generatedPasswords.value = []
  currentCharSet.value = buildCharSets()
  const passwordCount = normalizePasswordCount(vmPasswordCount.value)
  const passwordLength = normalizePasswordLength(vmPasswordLength.value)

  if (currentCharSet.value.base.length === 0) {
    rfSnackbar.value?.alert('失敗: 使用する文字種を1つ以上選択してください')
    return
  }

  for (let i = 0; i < passwordCount; i++) {
    let password = ''
    let availableChars = currentCharSet.value.base

    if (vmRequireEachCharSet.value) {
      // 各文字セットから最低1文字を確実に含める
      currentCharSet.value.guaranteed.forEach((char) => {
        password += char
      })
    }

    for (let j = password.length; j < passwordLength; j++) {
      if (vmNoDuplicates.value) {
        availableChars = availableChars.filter((c) => !password.includes(c))
      }
      if (availableChars.length === 0) {
        break
      }

      const randomIndex = getRandomInt(availableChars.length)
      password += availableChars[randomIndex]
    }

    generatedPasswords.value.push(shuffleString(password))
  }

  rfSnackbar.value?.message('パスワードを生成しました')
}

function clearGeneratedPasswords() {
  generatedPasswords.value = []
  currentCharSet.value = ''
  copiedIndex.value = null
}

async function copyPassword(password, index) {
  try {
    await navigator.clipboard.writeText(password)
    copiedIndex.value = index
    if (copyFeedbackTimer) {
      clearTimeout(copyFeedbackTimer)
    }
    copyFeedbackTimer = setTimeout(() => {
      copiedIndex.value = null
      copyFeedbackTimer = null
    }, 1500)
    rfSnackbar.value?.message('パスワードをコピーしました')
  } catch (error) {
    console.error('Failed to copy password:', error)
    rfSnackbar.value?.alert('失敗: コピーに失敗しました')
  }
}

onMounted(() => {
  savedPresets.value = readSavedPresets()
})

watch(vmPasswordCount, (value) => {
  const normalized = normalizePasswordCount(value)

  if (normalized !== value) {
    vmPasswordCount.value = normalized
  }
})

watch(vmPasswordLength, (value) => {
  const normalized = normalizePasswordLength(value)

  if (normalized !== value) {
    vmPasswordLength.value = normalized
  }
})
</script>

<template>
  <div class="random-generator">
    <h1 class="page-title">パスワード生成</h1>

    <div class="settings-grid">
      <!-- プリセット -->
      <section class="setting-card">
        <h2>プリセット</h2>
        <div class="preset-form">
          <input
            type="text"
            class="ui-control"
            v-model="vmPresetName"
            placeholder="プリセット名を入力"
          />
          <button type="button" class="ui-button ui-button--outline" @click="saveCurrentPreset">
            保存
          </button>
        </div>
        <div class="preset-form" v-if="savedPresets.length > 0">
          <select class="ui-control" v-model="vmSelectedPresetName">
            <option value="">プリセットを選択</option>
            <option v-for="preset in savedPresets" :key="preset.name" :value="preset.name">
              {{ preset.name }}
            </option>
          </select>
          <div class="preset-actions">
            <button type="button" class="ui-button ui-button--outline" @click="applySelectedPreset">
              読込
            </button>
            <button
              type="button"
              class="ui-button ui-button--outline danger"
              @click="deleteSelectedPreset"
            >
              削除
            </button>
          </div>
        </div>
      </section>

      <!-- 使用文字 -->
      <section class="setting-card">
        <h2>使用文字</h2>
        <div class="checkbox-group">
          <label class="ui-checkbox-item"
            ><input
              class="ui-checkbox"
              type="checkbox"
              v-model="vmUseUppercase"
            />大文字(A-Z)</label
          >
          <label class="ui-checkbox-item"
            ><input
              class="ui-checkbox"
              type="checkbox"
              v-model="vmUseLowercase"
            />小文字(a-z)</label
          >
          <label class="ui-checkbox-item"
            ><input class="ui-checkbox" type="checkbox" v-model="vmUseNumbers" />数字(0-9)</label
          >
          <label class="ui-checkbox-item"
            ><input class="ui-checkbox" type="checkbox" v-model="vmUseSymbols" />記号</label
          >
        </div>
      </section>

      <!-- パスワード長 -->
      <section class="setting-card">
        <h2>パスワード長: {{ vmPasswordLength }}</h2>
        <div class="length-inputs">
          <input type="range" min="4" max="64" v-model.number="vmPasswordLength" class="slider" />
          <input
            type="number"
            class="ui-control length-number-input"
            v-model.number="vmPasswordLength"
          />
        </div>
      </section>

      <!-- 生成するパスワードの個数 -->
      <section class="setting-card">
        <h2>生成するパスワードの個数</h2>
        <input
          type="number"
          class="ui-control"
          min="1"
          max="100"
          v-model.number="vmPasswordCount"
        />
      </section>

      <!-- オプション -->
      <section class="setting-card">
        <h2>オプション</h2>
        <div class="checkbox-group">
          <label class="ui-checkbox-item"
            ><input class="ui-checkbox" type="checkbox" v-model="vmAvoidSimilar" />
            似通った英数字を使わない (I, l, 1, O, 0など)</label
          >
          <label class="ui-checkbox-item"
            ><input class="ui-checkbox" type="checkbox" v-model="vmNoDuplicates" />
            同じ文字は使わない</label
          >
          <label class="ui-checkbox-item"
            ><input class="ui-checkbox" type="checkbox" v-model="vmRequireEachCharSet" />
            各文字セットから最低1文字を含める</label
          >
        </div>
      </section>
    </div>

    <!-- 使用する記号 -->
    <section class="symbols-settings" v-if="vmUseSymbols">
      <h2>使用する記号</h2>
      <div class="symbol-buttons">
        <button type="button" class="ui-button ui-button--outline" @click="setSymbols('none')">
          使用しない
        </button>
        <button type="button" class="ui-button ui-button--outline" @click="setSymbols('all')">
          全て
        </button>
      </div>
      <div class="symbols-grid">
        <label v-for="symbol in symbols" :key="symbol.char">
          <input class="ui-checkbox" type="checkbox" v-model="symbol.checked" />
          <code>{{ symbol.char }}</code>
        </label>
      </div>
    </section>

    <!-- アクションボタン -->
    <div class="action-buttons">
      <button
        class="ui-button ui-button--primary generate-button"
        type="button"
        @click="generatePasswords"
      >
        生成
      </button>
      <button
        class="ui-button ui-button--danger clear-button"
        type="button"
        @click="clearGeneratedPasswords"
      >
        削除
      </button>
    </div>

    <!-- 生成されたパスワード -->
    <section class="results" v-if="generatedPasswords.length > 0">
      <h2>使用した文字セット</h2>
      <code>{{ currentCharSet.base.join('') }}</code>
      <h2>保障文字セット</h2>
      <code v-if="vmRequireEachCharSet">{{ currentCharSet.guaranteed.join('') }}</code>
      <p v-else>文字保障なし</p>
      <h2>生成されたパスワード</h2>
      <ul>
        <li v-for="(password, index) in generatedPasswords" :key="index">
          <div class="password-item">
            <code>{{ password }}</code>
            <button
              class="ui-button copy-button"
              :class="{ copied: copiedIndex === index }"
              @click="copyPassword(password, index)"
              :aria-label="copiedIndex === index ? 'コピー済み' : 'パスワードをコピー'"
            >
              <IconCheck v-if="copiedIndex === index" />
              <IconClipboard v-else />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <AppSnackbar ref="rfSnackbar" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as var;

.random-generator {
  margin: 0 auto;

  .page-title {
    text-align: center;
  }
}

code {
  font-family: 'DM Mono', monospace;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.setting-card {
  background: var(--bg-1);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 6px var(--shadow);

  h2 {
    font-size: 1.1rem;
    margin: 0 0 1rem;
    border-bottom: 2px solid var(--border);
    padding-bottom: 0.5rem;
  }
}

.preset-form {
  display: flex;
  gap: 0.5rem;

  + .preset-form {
    margin-top: 0.75rem;
  }

  input,
  select {
    flex: 1;
  }
}

.preset-actions {
  display: flex;
  gap: 0.5rem;

  .danger {
    border-color: var(--danger);
    color: var(--danger);

    &:hover {
      background-color: var(--danger);
      color: var(--text-0);
    }
  }
}

.preset-feedback {
  margin: 0.75rem 0 0;
  padding: 0.55rem 0.7rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 600;

  &.success {
    background: var(--bg-2);
    border: 1px solid var(--border);
    color: var(--text-1);
  }
}

.ui-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  font-size: 1rem;
  box-sizing: border-box;
  background: var(--bg-0);
  color: var(--text-0);
}

.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--bg-1);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;

  &:hover {
    opacity: 0.95;
  }
}

.ui-button--outline {
  border-color: var(--primary);
  color: var(--primary);

  &:hover {
    background-color: var(--primary);
    color: var(--text-0);
    opacity: 0.95;
  }
}

.ui-button--primary {
  background-color: var(--primary);
  border-color: transparent;
}

.ui-button--danger {
  background-color: var(--danger);
  border-color: transparent;
}

.ui-checkbox-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.ui-checkbox {
  margin-right: 0.5rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

input[type='text'],
select,
input[type='number'] {
  @extend .ui-control;
}

.slider {
  width: 100%;
}

.length-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .slider {
    flex: 1;
  }

  .length-number-input {
    width: 7rem;
    border-radius: var(--border-radius);
  }
}

.symbols-settings {
  background: var(--bg-1);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  box-shadow: 0 2px 6px var(--shadow);

  .symbol-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .symbols-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
    gap: 0.75rem;

    label {
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      border: 1px solid var(--border);
      border-radius: var(--border-radius);
      cursor: pointer;

      input {
        margin-right: 0.5rem;
      }
    }
  }
}

.action-buttons {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.generate-button {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: var(--border-radius);
  flex-grow: 1;
}

.clear-button {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: var(--border-radius);
}

.results {
  h2 {
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  li + li {
    margin-top: 0.75rem;
  }

  .password-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.75rem 1rem;

    code {
      font-size: 1rem;
      overflow-wrap: anywhere;
    }

    .copy-button {
      width: 2.25rem;
      height: 2.25rem;
      padding: 0;
      fill: var(--text-0);

      &:hover {
        background: var(--bg-2);
      }
    }
  }
}

</style>
