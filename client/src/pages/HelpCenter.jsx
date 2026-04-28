import { Search, HelpCircle, BookOpen, MessageCircle } from 'lucide-react';

export default function HelpCenter() {
  const faqs = [
    { q: 'How do I book a stay?', a: 'Simply browse our listings, select your dates and number of guests, and click "Reserve". You will be guided through the checkout process.' },
    { q: 'What is the cancellation policy?', a: 'Cancellation policies vary by property. You can find the specific policy for each listing on its detail page.' },
    { q: 'How do I become a host?', a: 'Click on "Become a Host" in the footer or navigation, follow the upgrade process, and then you can start listing your properties.' },
    { q: 'Are the payments secure?', a: 'Yes, all payments are processed through Stripe, a leading secure payment gateway. We do not store your card details.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help?</h1>
        <div className="relative max-w-xl mx-auto">
          <input 
            type="text" 
            placeholder="Search for articles, guides..." 
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-6 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition">
          <BookOpen className="w-8 h-8 text-brand mb-4" />
          <h3 className="font-bold mb-2">Guides</h3>
          <p className="text-sm text-gray-500">Learn how to make the most of StayHaven.</p>
        </div>
        <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition">
          <HelpCircle className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">FAQs</h3>
          <p className="text-sm text-gray-500">Quick answers to common questions.</p>
        </div>
        <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition">
          <MessageCircle className="w-8 h-8 text-green-500 mb-4" />
          <h3 className="font-bold mb-2">Support</h3>
          <p className="text-sm text-gray-500">Get in touch with our team 24/7.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
