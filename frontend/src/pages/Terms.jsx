const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-accent-500 mb-8">Terms of Service</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <p className="text-gray-600 text-sm">Last Updated: November 25, 2025</p>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using BlogSpace, you agree to be bound by these Terms of Service and all applicable 
            laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">User Accounts</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="font-semibold min-w-fit">•</span>
              <span>You must provide accurate and complete information when creating an account</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold min-w-fit">•</span>
              <span>You are responsible for maintaining the security of your account credentials</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold min-w-fit">•</span>
              <span>You must be at least 13 years old to use this platform</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold min-w-fit">•</span>
              <span>One person may not maintain more than one account</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Content Guidelines</h2>
          <p className="text-gray-700 leading-relaxed mb-3">Users agree not to post content that:</p>
          <ul className="space-y-2 text-gray-700 ml-6 list-disc">
            <li>Is illegal, harmful, threatening, abusive, or harassing</li>
            <li>Violates any copyright, trademark, or other intellectual property rights</li>
            <li>Contains spam, advertisements, or promotional material</li>
            <li>Impersonates any person or entity</li>
            <li>Contains viruses or malicious code</li>
            <li>Infringes on the privacy of others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Intellectual Property</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="font-semibold min-w-fit">•</span>
              <span>You retain ownership of content you create and post on BlogSpace</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold min-w-fit">•</span>
              <span>By posting content, you grant us a license to display and distribute it on our platform</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold min-w-fit">•</span>
              <span>The BlogSpace name, logo, and platform design are our property</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Content Moderation</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to remove or restrict access to any content that violates these terms or is deemed 
            inappropriate. Users who repeatedly violate our guidelines may have their accounts suspended or terminated.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            BlogSpace is provided "as is" without warranties of any kind. We are not liable for any damages arising 
            from your use of the platform, including but not limited to direct, indirect, incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Termination</h2>
          <p className="text-gray-700 leading-relaxed">
            We may terminate or suspend your account at any time, without prior notice, for conduct that we believe 
            violates these Terms of Service or is harmful to other users, us, or third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of BlogSpace after changes 
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Contact Information</h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@blogspace.com" className="text-secondary-500 font-semibold hover:underline">
              legal@blogspace.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
