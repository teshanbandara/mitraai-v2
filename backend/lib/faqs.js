// backend/lib/faqs.js
export function checkFAQ(message) {
  const faqs = [
    {
      q: "how to pay dialog bill",
      a: "📱 You can pay your Dialog bill via Dialog self-care app, Dialog website, or using their USSD code *555#."
    },
    {
      q: "how to apply for passport",
      a: "🛂 You can apply for a passport at the Department of Immigration in Colombo or online via the e-passport service."
    },
    {
      q: "how to pay mobitel bill",
      a: "📱 Use Mobitel self-care app, Mobitel website, or USSD code *123# to pay your bill."
    },
    {
      q: "how to pay ceb bill",
      a: "💡 You can pay your CEB bill online, via your bank, or using the CEB mobile app."
    },
    {
      q: "how to pay water bill",
      a: "💧 Visit the local water board office or pay online through their official portal."
    }
  ];

  const lowerMsg = message.toLowerCase();
  const faqMatch = faqs.find(f => lowerMsg.includes(f.q.toLowerCase()));

  return faqMatch ? faqMatch.a : null;
}
