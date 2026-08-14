import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const firebaseStub = fileURLToPath(
  new URL("./tests/mocks/firebase-stub.js", import.meta.url)
);

// Фронтенд тягне Firebase SDK напряму з CDN (https://...), що не працює
// в ESM-лоадері Node. Для юніт-тестів підміняємо ці імпорти на локальну заглушку.
export default defineConfig({
  resolve: {
    alias: [
      { find: /^https:\/\/www\.gstatic\.com\/firebasejs\/.*$/, replacement: firebaseStub },
    ],
  },
  test: {
    include: ["tests/unit/**/*.test.js"],
  },
});
