import Anthropic from "@anthropic-ai/sdk";

// Fast, low-cost model — this endpoint is hit on every dashboard load/refresh.
const MODEL = "claude-haiku-4-5-20251001";

const AI_STOCKS = [
  "NVDA", "MSFT", "GOOGL", "META", "AMZN", "AMD", "INTC",
  "PLTR", "CRM", "SNOW", "AI", "SMCI", "AVGO", "ORCL",
];

const json = (statusCode, body) => ({
  statusCode,
  headers: { "content-type": "application/json", "cache-control": "no-store" },
  body: JSON.stringify(body),
});

// Force a schema-valid JSON response via tool use.
async function structured(client, { prompt, toolName, schema, maxTokens = 3072 }) {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    tools: [{ name: toolName, description: "Return the requested structured data.", input_schema: schema }],
    tool_choice: { type: "tool", name: toolName },
    messages: [{ role: "user", content: prompt }],
  });
  const block = msg.content.find((c) => c.type === "tool_use");
  if (!block) throw new Error("Model did not return structured data");
  return block.input;
}

export const handler = async (event) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json(500, { error: "ANTHROPIC_API_KEY is not set on the server." });
  }

  const client = new Anthropic({ apiKey });
  const type = event.queryStringParameters?.type;

  try {
    if (type === "stocks") {
      const data = await structured(client, {
        toolName: "return_stocks",
        maxTokens: 3072,
        prompt:
          `You are a financial data assistant. Provide current, realistic approximate stock data for these ` +
          `AI-related companies: ${AI_STOCKS.join(", ")}.\n` +
          `For each: symbol, name (full company name), price (USD), change (today's dollar change, may be ` +
          `negative), change_percent (percent, may be negative), market_cap (e.g. "3.2T" or "450B"), ` +
          `volume (e.g. "45M" or "1.2B"). Make values realistic and internally consistent.`,
        schema: {
          type: "object",
          properties: {
            stocks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  name: { type: "string" },
                  price: { type: "number" },
                  change: { type: "number" },
                  change_percent: { type: "number" },
                  market_cap: { type: "string" },
                  volume: { type: "string" },
                },
                required: ["symbol", "name", "price", "change", "change_percent", "market_cap", "volume"],
              },
            },
          },
          required: ["stocks"],
        },
      });
      const stocks = (data.stocks || []).map((s) => ({
        ...s,
        buy_url: `https://robinhood.com/stocks/${s.symbol}`,
      }));
      return json(200, { stocks });
    }

    if (type === "news") {
      const data = await structured(client, {
        toolName: "return_news",
        maxTokens: 4096,
        prompt:
          `You are an AI news aggregator. Provide 10 important, recent-sounding AI-related news stories ` +
          `spanning: company earnings & announcements (OpenAI, Google, Microsoft, NVIDIA, Meta, etc.), ` +
          `AI regulation/policy, new model releases & breakthroughs, industry deals/partnerships, and AI ` +
          `stock movements.\nFor each: title (compelling headline), summary (2-3 sentences), source (outlet ` +
          `name such as Reuters, Bloomberg, CNBC, TechCrunch, The Verge), category (exactly one of: ` +
          `Earnings, Regulation, AI Chips, LLM Software, Markets, Deals, Research), time_ago (e.g. "2h ago").`,
        schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  source: { type: "string" },
                  category: { type: "string" },
                  time_ago: { type: "string" },
                },
                required: ["title", "summary", "source", "category", "time_ago"],
              },
            },
          },
          required: ["articles"],
        },
      });
      return json(200, { articles: data.articles || [] });
    }

    if (type === "summary") {
      let titles = [];
      try {
        titles = JSON.parse(event.body || "{}").titles || [];
      } catch {
        titles = [];
      }
      if (!titles.length) return json(200, { bullets: [] });

      const data = await structured(client, {
        toolName: "return_summary",
        maxTokens: 1024,
        prompt:
          `Here are today's top AI news headlines:\n${titles.join("\n")}\n\n` +
          `Summarize the 3 most important stories into concise, punchy bullet points (1 sentence each). ` +
          `Focus on what matters most to an investor or tech enthusiast.`,
        schema: {
          type: "object",
          properties: { bullets: { type: "array", items: { type: "string" } } },
          required: ["bullets"],
        },
      });
      return json(200, { bullets: data.bullets || [] });
    }

    return json(400, { error: "Unknown type. Use ?type=stocks|news|summary" });
  } catch (e) {
    console.error("market-data error:", e);
    return json(502, { error: e?.message || "Upstream model error" });
  }
};
