import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const firebaseStub = fileURLToPath(
  new URL("./tests/mocks/firebase-stub.js", import.meta.url)
);

const reporters = ['default'];
if (process.env.TESTOMATIO) {
  reporters.push(['@testomatio/reporter/vitest', { apiKey: process.env.TESTOMATIO }]);
}

export default defineConfig({
  resolve: {
    alias: [
      { find: /^https:\/\/www\.gstatic\.com\/firebasejs\/.*$/, replacement: firebaseStub },
    ],
  },
  test: {
    include: ["tests/unit/**/*.test.js"],
    reporters: reporters,
  },
});
