export function checkFAQ(message) {
  const faqs = [
    { q: "how to pay dialog bill", a: "📱 Use Dialog app, website, or *555# USSD." },
    { q: "how to apply for passport", a: "🛂 Dept. of Immigration or e-passport portal." },
  ];
  const lower = message.toLowerCase();
  const match = faqs.find(f => lower.includes(f.q.toLowerCase()));
  return match ? match.a : null;
}
