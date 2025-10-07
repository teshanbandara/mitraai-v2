export const faqs = [
  {
    keywords: ['hello', 'hi', 'hey', 'ayubowan', 'හෙලෝ', 'හායි', 'කොහොමද'],
    answer: 'ආයුබෝවන්! Hello! I\'m MitraAI, your Sri Lankan friend. 🇱🇰\n\nමට ඔබ�?උදව�?කරන්�?පුළුවන්:\n�?Passport applications\n�?Pay bills (Dialog, Mobitel, CEB)\n�?Government services (GN, DS office)\n�?NIC & Driving License\n\nWhat do you need? / මොනව�?ඕන?'
  },
  {
    keywords: ['passport', 'apply passport', 'get passport', 'passport එක', 'ගමන් බලපත්‍ර�?],
    answer: `**Sri Lankan Passport Application:**

📝 **Online Method:**
1. www.immigration.gov.lk
2. Create account & fill form
3. Pay online: LKR 3,000 (normal) / 10,000 (express)
4. Book appointment
5. Visit with: Birth certificate, NIC, 2 photos

⏱️ **Processing:**
- Normal: 3-4 weeks
- Express: Next day

📍 **Main Office:** Battaramulla

තව විස්ත�?ඕන�? Need more details?`
  },
  {
    keywords: ['dialog bill', 'pay dialog', 'dialog payment', 'dialog එක', 'ඩයලොග්'],
    answer: `**Pay Dialog Bill:**

📱 **MyAccount App** - Download & login �?Pay

💻 **Website:** www.dialog.lk �?My Account

💳 **mCash:** #678# �?Pay Bills �?Dialog

🏦 **Bank Apps:** Bill Payment �?Dialog

Quick and easy! තව උදව්වක් ඕන�?`
  },
  {
    keywords: ['electricity bill', 'ceb bill', 'leco bill', 'විදුල�?බි�?, 'විදුලිය'],
    answer: `**Pay Electricity Bill:**

💻 **Online:**
- www.ceb.lk or www.leco.lk
- Bank apps �?Bill Payment
- eZ Cash / mCash: #678#

🏪 **Offline:**
- CEB/LECO offices
- Post offices

Account number on your bill. තව උදව්වක් ඕන�?`
  },
  {
    keywords: ['mobitel bill', 'pay mobitel', 'mobitel payment', 'මොබිටෙල්'],
    answer: `**Pay Mobitel Bill:**

📱 **App:** "Mobitel Self Care"

💻 **Web:** www.mobitel.lk

🏦 **Banks:** Any bank app �?Bill Payment

💳 **Wallets:** eZ Cash/mCash #678#

📞 **Phone:** 071 0 071 071

Easy! තව උදව්වක් ඕන�?`
  },
  {
    keywords: ['grama niladhari', 'gn', 'grama sevaka', 'ග්‍රාම නිලධාර�?, 'ග්‍රාම සේව�?],
    answer: `**Grama Niladhari Services:**

📄 **Certificates:**
�?Character (චරිත සහති�?
�?Income (ආදායම් සහති�?
�?Resident (පදිංචි සහති�?
�?Single/Married

📝 **How:**
1. Visit GN office (8am-4pm)
2. Bring NIC
3. Fill form
4. Pay LKR 20-100
5. Collect 1-3 days

Find your GN: Check electricity bill. තව දැනගන්�?ඕන�?`
  },
  {
    keywords: ['ds office', 'divisional secretariat', 'kachcheri', 'කච්චේරිය', 'ප්‍රාදේශීය ලේකම�?],
    answer: `**DS Office Services:**

📝 **Available:**
�?Birth/Death/Marriage certificates
�?Samurdhi registration
�?Land services
�?Various government services

🕐 **Hours:** 8am-4pm weekdays

📄 **Need:** NIC, relevant documents, photos

💰 **Fee:** LKR 100-500

Which service? / කුමන සේවාව�?ඕන?`
  },
  {
    keywords: ['nic', 'national id', 'identity card', 'replace nic', 'හැඳුනුම්පත'],
    answer: `**National Identity Card:**

🆕 **New (Age 18):**
- Visit DS office
- Birth certificate + 2 photos
- Fee: LKR 100
- Get in 6-8 weeks

🔄 **Replacement:**
- Police report (if lost)
- DS office with documents
- Fee: LKR 200

Need details? / විස්ත�?ඕන�?`
  },
  {
    keywords: ['driving license', 'licence', 'driving permit', 'රියදුර�?බලපත්‍ර�?],
    answer: `**Driving License:**

1️⃣ **Learner's Permit:**
- Age 18+ (16 bikes)
- Medical certificate
- Theory test at MTD
- LKR 600

2️⃣ **Practice:** 3 months minimum

3️⃣ **Driving Test:**
- Practical test
- LKR 3,000

තව උදව්වක් ඕන�?`
  },
  {
    keywords: ['water bill', 'water board', 'nwsdb', 'ජල බි�?],
    answer: `**Pay Water Bill (NWSDB):**

💻 **Online:**
- www.waterboard.lk
- Bank apps �?Bill Payment
- eZ Cash/mCash: #678#

🏪 **Offline:**
- NWSDB offices
- Post offices

Account number on bill. උදව්වක් ඕන�?`
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'ස්තූතියි', 'බොහො�?ස්තූතියි'],
    answer: 'You\'re welcome! ඔයාව සාදරයෙන් පිළිගන්නව�? 😊\n\nAlways happy to help! තව කිසිවක් ඕන�?'
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
