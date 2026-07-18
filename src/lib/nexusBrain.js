// Nexus Brain: live AI channel grounded in the real decision ledger.
// Provider: Google Gemini. Key-gated — without VITE_GEMINI_API_KEY every
// caller receives null and the app keeps its scripted, honest fallback
// (wifi-proof demo path).

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

export const isBrainOnline = () => Boolean(API_KEY);

export async function askNexusBrain({ command, memories = [], stats = {}, employees = [], company = 'Nexus' }) {
  if (!API_KEY) return null;

  const ledger = memories.slice(0, 40).map((m) =>
    `- [${new Date(m.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}] ${m.title} (${m.agent} agent) — why: ${m.why}`
  ).join('\n') || '(empty — no decisions recorded yet)';

  const roster = employees.map((e) => `${e.name} (${e.role})`).join(', ') || '(none)';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'x-goog-api-key': API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: "You are the reasoning core of Nexus MemoryOS, an AI business operating system. Answer the manager's request using ONLY the decision ledger and business state provided. Be specific: cite decisions and their recorded reasons when relevant. If the ledger does not contain the answer, or the request needs an action you cannot perform, say so plainly and suggest a workflow the manager can run instead (quotation, hire, meeting, invoice, report, policy question). Reply in 2-4 short sentences, plain text, no markdown."
          }]
        },
        contents: [{
          role: 'user',
          parts: [{
            text: `Company: ${company}\nBusiness state: revenue $${Number(stats.revenue || 0).toLocaleString()}, ${employees.length} employees, ${stats.salesCount ?? 0} closed deals.\nTeam: ${roster}\n\nDecision ledger (newest first):\n${ledger}\n\nManager's request: "${command}"`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.4,
          // Disable Gemini 2.5 "thinking" so responses are fast and the token
          // budget isn't consumed before any visible text is produced
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });

    if (!res.ok) throw new Error(`Nexus Brain HTTP ${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || '')
      .join('')
      .trim();
    return text || null;
  } finally {
    clearTimeout(timeout);
  }
}
