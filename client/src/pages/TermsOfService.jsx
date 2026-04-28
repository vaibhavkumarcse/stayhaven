export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose prose-slate max-w-none space-y-8 text-gray-600">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p>By using StayHaven, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. You must be at least 18 years old to use our services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bookings and Payments</h2>
          <p>All bookings are subject to availability. Payments are processed through our secure payment provider. You agree to provide accurate and complete information for all purchases.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Host Responsibilities</h2>
          <p>Hosts are responsible for providing accurate descriptions of their properties and ensuring they comply with local laws and safety regulations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
          <p>StayHaven is not liable for any direct, indirect, or incidental damages arising from your use of the platform or your stays at listed properties.</p>
        </section>

        <div className="border-t border-gray-100 pt-8 mt-12 text-center">
          <p className="text-sm text-gray-400 font-medium">© 2026 StayHaven. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
