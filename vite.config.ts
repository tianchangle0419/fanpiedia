import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: '反派影评·档案索引',
        short_name: '反派索引',
        description: '「反派影评」听友自建索引：从电影与嘉宾反查节目期数',
        lang: 'zh-CN',
        start_url: './',
        display: 'standalone',
        background_color: '#F7F5F2',
        theme_color: '#F7F5F2',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 不预缓存 HTML：导航请求始终走网络，保证发布后/回滚后拿到最新版本
        globPatterns: ['**/*.{js,css,png,webmanifest}'],
        navigateFallback: undefined,
        runtimeCaching: [],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
