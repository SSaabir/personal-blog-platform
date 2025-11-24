import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-accent-500 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">BlogSpace</h3>
            <p className="text-accent-200">Share your thoughts with the world</p>
          </div>

          <div className="flex gap-8">
            <div>
              <h4 className="font-semibold mb-3 text-primary-300">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-accent-200 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-accent-200 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-accent-200 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-accent-400 mt-6 pt-6 text-center">
          <p className="text-accent-200">
            © 2025 <span className="font-semibold text-white">SiraajSaabir</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
