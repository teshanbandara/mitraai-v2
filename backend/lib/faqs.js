export const faqs = [
  {
    keywords: ['hello', 'hi', 'hey', 'ayubowan', 'හෙලෝ', 'හායි'],
    answer: 'ආයුබෝවන්! Hello! I\'m MitraAI. 🇱🇰\n\n**I can help with:**\n✅ Passport applications\n✅ Pay bills (Dialog, Mobitel, CEB, Water)\n✅ Government services (GN, DS office)\n✅ NIC & Driving License\n\nWhat do you need? / ඔබට මොනවද ඕන?'
  },
  {
    keywords: ['passport', 'apply passport', 'get passport'],
    answer: `**Sri Lankan Passport Application:**

📝 **Online:** www.immigration.gov.lk
💰 Fee: LKR 3,000 (normal) / 10,000 (express)
⏱️ Time: 3-4 weeks / 1 day
📄 Need: Birth certificate, NIC, 2 photos

තව විස්තර ඕනද?`
  },
  {
    keywords: ['dialog bill', 'pay dialog', 'dialog payment'],
    answer: `**Pay Dialog Bill:**

📱 MyAccount App
💻 www.dialog.lk
💳 mCash: #678#
🏦 Bank apps

උදව්වක් ඕනද?`
  },
  {
    keywords: ['electricity bill', 'ceb bill', 'leco bill', 'විදුලි බිල'],
    answer: `**Pay Electricity Bill:**

💻 www.ceb.lk / www.leco.lk
🏦 Bank apps
💳 eZ Cash/mCash: #678#
🏪 CEB offices, Post offices

තව උදව්වක් ඕනද?`
  },
  {
    keywords: ['mobitel bill', 'pay mobitel'],
    answer: `**Pay Mobitel Bill:**

📱 Mobitel Self Care app
💻 www.mobitel.lk
💳 eZ Cash/mCash: #678#

උදව්වක් ඕනද?`
  },
  {
    keywords: ['thank', 'thanks', 'ස්තූතියි'],
    answer: 'You\'re welcome! ඔයාව සාදරයෙන් පිළිගන්නවා! 😊'
  }
];

export function checkFAQ(message) {
  if (!message) return null;
  
  const lowerMessage = message.toLowerCase().trim();
  
  console.log('🔍 Checking FAQ for:', lowerMessage);
  
  for (const faq of faqs) {
    for (const keyword of faq.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        console.log('✅ FAQ MATCH! Keyword:', keyword);
        return faq.answer;
      }
    }
  }
  
  console.log('❌ No FAQ match');
  return null;
}