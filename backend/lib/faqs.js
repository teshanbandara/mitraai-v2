export function checkFAQ(message) {
  const faqs = [
    { q: "how to pay dialog bill", a: "You can pay your Dialog bill via Dialog self-care app or Dialog website." },
    { q: "how to apply for passport", a: "You can apply for a passport at the Department of Immigration in Colombo or online via e-passport service." }
    // Add more FAQ entries here
  ];

  const lowerMsg = message.toLowerCase();
  const faqMatch = faqs.find(f => lowerMsg.includes(f.q.toLowerCase()));
  return faqMatch ? faqMatch.a : null;
}


📝 **Online:**
1. www.immigration.gov.lk
2. Fill form & pay (LKR 3,000/10,000)
3. Book appointment
4. Visit with: Birth cert, NIC, photos

⏱️ **Time:** 3-4 weeks (normal) / 1 day (express)

තව විස්තර ඕනද?`
  },
  {
    keywords: ['dialog bill', 'pay dialog', 'dialog payment'],
    answer: `**Pay Dialog Bill:**

📱 MyAccount App
💻 www.dialog.lk
💳 mCash: #678#
🏦 Bank apps → Bill Payment

Quick & easy!`
  },
  {
    keywords: ['electricity bill', 'ceb bill', 'leco bill', 'විදුලි බිල'],
    answer: `**Pay Electricity Bill:**

💻 www.ceb.lk / www.leco.lk
🏦 Bank apps → Bill Payment
💳 eZ Cash/mCash: #678#
🏪 CEB offices, Post offices

තව උදව්වක් ඕනද?`
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'ස්තූතියි'],
    answer: 'You\'re welcome! ඔයාව සාදරයෙන් පිළිගන්නවා! 😊\n\nAlways happy to help! තව කිසිවක් ඕනද?'
  }
];

export function checkFAQ(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const faq of faqs) {
    for (const keyword of faq.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return faq.answer;
      }
    }
  }
  
  return null;
}