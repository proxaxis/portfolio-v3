<template>
  <div class="tools-view">
    <h1>Tools</h1>
    <nav>
      <ul>
        <li>
          <router-link :to="{ name: 'RandomGenerator' }">Random Password Generator</router-link>
        </li>
        <li>
          <a href="https://p2p-chat.vercel.app/" target="_blank" rel="noopener noreferrer">P2P Chat - Peer to Peer Secure Online Chat</a>
        </li>
        <li>
          <a href="https://hashed-potato.vercel.app/">HASHED POTATO - Local Based SSO Client App</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.tools-view {
  nav ul {
    list-style: none;
    padding: 0;
    li {
      margin-bottom: 1rem;
      list-style: circle;
      
      a {
        font-size: 1.2em;
      }
    }
  }
}
</style>