// api/faqs.js
export function checkFAQ(message) {
  const faqs = [
    { q: "how to pay dialog bill", a: "📱 Pay via Dialog app, website, or *555# USSD." },
    { q: "how to apply for passport", a: "🛂 Apply at Dept. of Immigration or online e-passport service." },
    { q: "how to pay mobitel bill", a: "📱 Use Mobitel app, website, or *123# USSD." }
  ];

  const lower = message.toLowerCase();
  const match = faqs.find(f => lower.includes(f.q.toLowerCase()));
  return match ? match.a : null;
}
