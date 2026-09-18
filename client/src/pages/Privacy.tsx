export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 2026</p>
      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h3 className="font-semibold text-base mb-1">1. Introduction</h3>
          <p>The Menshes Ice Hockey League (MIHL) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">2. Information We Collect</h3>
          <p>Registration information: full name, email address, phone number, jersey number preference, jersey size, position, and payment plan selection. Account information: login credentials (email and password). Game and performance data: game attendance and results, statistics (goals, assists, penalties, saves).</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">3. How We Use Your Information</h3>
          <p>We use your information to process registrations, manage team assignments and game scheduling, communicate schedules and league updates, send approval/waitlist notifications, track payment status for administrative purposes, and enforce league rules.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">4. Email Communications</h3>
          <p>We send emails for registration status updates, approval or waitlist notifications, and league announcements. You can manage your email preferences by contacting registration@mihl.ca. We do not sell or share your email address with third parties for marketing purposes.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">5. Payment Information</h3>
          <p>We do not process or store any credit card or banking details. Payment is made directly by e-transfer to payments@mihl.ca. Payment status is recorded internally for administrative bookkeeping only and does not affect your league registration approval.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">6. Third-Party Integrations</h3>
          <p>Upon approval, you'll receive an invite link to join our Spond group, a third-party team management app used for schedule and roster communication. Spond's own privacy policy governs data you provide directly to Spond.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">7. Data Security</h3>
          <p>Passwords are hashed using industry-standard methods (bcrypt) and never stored in plain text. Session cookies are encrypted and marked HttpOnly. All data is transmitted over HTTPS. No security system is completely secure, and we cannot guarantee absolute security of your information.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">8. Data Retention</h3>
          <p>Active player registration data is retained for the duration of the season and one year after. Game statistics are retained indefinitely for league history. You can request deletion of your account and associated data by contacting registration@mihl.ca.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">9. Sharing Your Information</h3>
          <p>We do not sell or rent your personal information. We may share it with league administrators, game officials, and other players as necessary for team assignments and game participation, or with legal authorities if required by law.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">10. Public Information</h3>
          <p>Player name, team assignment, and game statistics (goals, assists, penalties) may be displayed publicly on the MIHL website. You can request to opt out of public display by contacting registration@mihl.ca.</p>
        </section>
        <section>
          <h3 className="font-semibold text-base mb-1">11. Contact</h3>
          <p>For questions about this policy or to exercise your data rights, contact registration@mihl.ca.</p>
        </section>
      </div>
    </div>
  );
}
