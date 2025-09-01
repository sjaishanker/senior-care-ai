import Link from 'next/link'
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="font-bold text-xl">ElderCare AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              Transforming senior care in India through cutting-edge AI technology. 
              Ensuring dignity, safety, and quality of life for every elderly resident.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Our Solutions
                </Link>
              </li>
              <li>
                <Link href="/stakeholders" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  For Stakeholders
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                <p className="text-gray-400 text-sm">
                  Bengaluru, Karnataka<br />
                  India - 560001
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-400 flex-shrink-0" />
                <p className="text-gray-400 text-sm">+91 1800-XXX-XXXX</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400 flex-shrink-0" />
                <p className="text-gray-400 text-sm">contact@eldercare.ai</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 ElderCare AI. All rights reserved. | Made with ❤️ for India's Elderly
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer