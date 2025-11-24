const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-accent-500 mb-8">Privacy Policy</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <p className="text-gray-600 text-sm">Last Updated: November 25, 2025</p>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            At BlogSpace, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Information We Collect</h2>
          <h3 className="text-xl font-semibold text-accent-500 mb-2 mt-4">Personal Information</h3>
          <ul className="space-y-2 text-gray-700 ml-6 list-disc">
            <li>Username and email address (required for registration)</li>
            <li>Profile information (bio, avatar)</li>
            <li>Posts, comments, and interactions you create</li>
          </ul>

          <h3 className="text-xl font-semibold text-accent-500 mb-2 mt-4">Usage Data</h3>
          <ul className="space-y-2 text-gray-700 ml-6 list-disc">
            <li>IP address and browser information</li>
            <li>Pages visited and actions taken on the platform</li>
            <li>Time and date of your visits</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">How We Use Your Information</h2>
          <ul className="space-y-2 text-gray-700 ml-6 list-disc">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To enforce our Terms of Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your personal information. However, 
            no method of transmission over the Internet is 100% secure. We use password hashing, JWT authentication, 
            and secure data storage practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
          <ul className="space-y-2 text-gray-700 ml-6 list-disc">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Object to processing of your data</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience. You can control cookie 
            settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary-500 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@blogspace.com" className="text-secondary-500 font-semibold hover:underline">
              privacy@blogspace.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
