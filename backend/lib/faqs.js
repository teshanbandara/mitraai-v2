export const faqs = [
  {
    keywords: ['hello', 'hi', 'hey', 'ayubowan', 'හෙලෝ', 'හායි', 'කොහොමද'],
    answer: 'ආයුබෝවන්! Hello! I\'m MitraAI, your Sri Lankan friend. 🇱🇰\n\nමට ඔබට උදව් කරන්න පුළුවන්:\n✅ Passport applications\n✅ Pay bills (Dialog, Mobitel, CEB)\n✅ Government services (GN, DS office)\n✅ NIC & Driving License\n\nWhat do you need? / මොනවද ඕන?'
  },
  {
    keywords: ['passport', 'apply passport', 'get passport', 'passport එක'],
    answer: `**Sri Lankan Passport Application:**

📝 **Online Method:**
1. www.immigration.gov.lk
2. Create account & fill form
3. Pay fee (LKR 3,000 normal / 10,000 express)
4. Book appointment
5. Visit with: Birth certificate, NIC, 2 photos

⏱️ **Processing Time:**
- Normal: 3-4 weeks
- Express: Next day

තව විස්තර ඕනද?`
  },
  {
    keywords: ['dialog bill', 'pay dialog', 'dialog payment', 'dialog එක'],
    answer: `**Pay Dialog Bill:**

📱 **MyAccount App** - Download & login
💻 **Website:** www.dialog.lk → My Account
💳 **mCash:** #678# → Pay Bills
🏦 **Bank Apps:** Bill Payment → Dialog

Quick & easy! තව උදව්වක් ඕනද?`
  },
  {
    keywords: ['electricity bill', 'ceb bill', 'leco bill', 'විදුලි බිල'],
    answer: `**Pay Electricity Bill (CEB/LECO):**

💻 **Online:**
- www.ceb.lk or www.leco.lk
- Bank apps → Bill Payment
- eZ Cash/mCash: #678#

🏪 **Offline:**
- CEB/LECO offices
- Post offices

තව උදව්වක් ඕනද?`
  },
  {
    keywords: ['mobitel bill', 'pay mobitel', 'mobitel payment'],
    answer: `**Pay Mobitel Bill:**

📱 "Mobitel Self Care" app
💻 www.mobitel.lk → Self Care
🏦 Bank apps → Bill Payment
💳 eZ Cash/mCash: #678#
📞 Dial: 071 0 071 071

තව උදව්වක් ඕනද?`
  },
  {
    keywords: ['grama niladhari', 'gn', 'ග්‍රාම නිලධාරි'],
    answer: `**Grama Niladhari Services:**

📄 **Certificates:**
✅ Character Certificate (චරිත සහතික)
✅ Income Certificate (ආදායම් සහතික)
✅ Resident Certificate (පදිංචි සහතික)

📝 **How:**
1. Visit GN office (8am-4pm)
2. Bring NIC
3. Fill form
4. Pay LKR 20-100
5. Collect 1-3 days

තව දැනගන්න ඕනද?`
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