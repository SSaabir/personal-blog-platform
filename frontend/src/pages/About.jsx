const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-accent-500 mb-8">About BlogSpace</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <section>
          <h2 className="text-3xl font-bold text-secondary-500 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            BlogSpace is a modern platform designed to empower writers, creators, and thinkers to share their ideas with the world. 
            We believe that everyone has a unique story to tell, and we're here to provide the tools and community to make that happen.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-secondary-500 mb-4">What We Offer</h2>
          <ul className="space-y-3 text-gray-700 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-secondary-500 font-bold">✓</span>
              <span>A clean, distraction-free writing environment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary-500 font-bold">✓</span>
              <span>Powerful tagging and search capabilities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary-500 font-bold">✓</span>
              <span>Engagement through likes and comments</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary-500 font-bold">✓</span>
              <span>Content moderation to maintain a respectful community</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary-500 font-bold">✓</span>
              <span>Customizable profiles with avatars and bios</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-secondary-500 mb-4">Our Values</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We're committed to fostering a community built on respect, creativity, and meaningful discourse. 
            BlogSpace is a place where diverse perspectives are welcomed, and constructive dialogue is encouraged.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-secondary-500 mb-4">Get in Touch</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Have questions, feedback, or suggestions? We'd love to hear from you. Reach out to us at{' '}
            <a href="mailto:support@blogspace.com" className="text-secondary-500 font-semibold hover:underline">
              support@blogspace.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
