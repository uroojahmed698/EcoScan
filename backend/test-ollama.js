// Quick smoke-test: sends a request directly to local Ollama and prints the reply.
// Run with: node test-ollama.js
const { Ollama } = require("ollama");

const ollama = new Ollama({ host: "http://localhost:11434" });

(async () => {
  console.log("Sending test request to local Ollama (qwen2.5vl:3b)...");
  const response = await ollama.chat({
    model: "qwen2.5vl:3b",
    messages: [{ role: "user", content: "Reply with exactly: OLLAMA_OK" }],
  });
  console.log("Reply:", response.message.content);
})().catch(err => {
  console.error("Test failed:", err.message);
  process.exit(1);
});
