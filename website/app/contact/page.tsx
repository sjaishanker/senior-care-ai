'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    facilitySize: '',
    message: '',
    contactPreference: 'email'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for contacting us! Our team will reach out within 24 hours.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const offices = [
    {
      city: "Bengaluru (Head Office)",
      address: "Electronic City Phase 1, Bengaluru, Karnataka 560100",
      phone: "+91 80-XXXX-XXXX",
      email: "bengaluru@eldercare.ai"
    },
    {
      city: "Mumbai",
      address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
      phone: "+91 22-XXXX-XXXX",
      email: "mumbai@eldercare.ai"
    },
    {
      city: "Delhi NCR",
      address: "Connaught Place, New Delhi 110001",
      phone: "+91 11-XXXX-XXXX",
      email: "delhi@eldercare.ai"
    },
    {
      city: "Chennai",
      address: "T. Nagar, Chennai, Tamil Nadu 600017",
      phone: "+91 44-XXXX-XXXX",
      email: "chennai@eldercare.ai"
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your senior care facility? Our experts are here to help 
              you every step of the way. Reach out for a consultation, demo, or partnership inquiry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Role</option>
                      <option value="facility-owner">Facility Owner</option>
                      <option value="facility-manager">Facility Manager</option>
                      <option value="healthcare-provider">Healthcare Provider</option>
                      <option value="family-member">Family Member</option>
                      <option value="investor">Investor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility Size
                    </label>
                    <select
                      name="facilitySize"
                      value={formData.facilitySize}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Size</option>
                      <option value="1-50">1-50 residents</option>
                      <option value="51-100">51-100 residents</option>
                      <option value="101-200">101-200 residents</option>
                      <option value="200+">200+ residents</option>
                      <option value="na">Not Applicable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How should we contact you?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactPreference"
                        value="email"
                        checked={formData.contactPreference === 'email'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Email
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactPreference"
                        value="phone"
                        checked={formData.contactPreference === 'phone'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Phone
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactPreference"
                        value="whatsapp"
                        checked={formData.contactPreference === 'whatsapp'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      WhatsApp
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about your needs and how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <FaPhone className="text-primary-600 text-xl mt-1" />
                  <div>
                    <p className="font-semibold">Call Us</p>
                    <p className="text-gray-600">Toll Free: 1800-XXX-XXXX</p>
                    <p className="text-gray-600">Mon-Sat, 9 AM - 6 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaEnvelope className="text-primary-600 text-xl mt-1" />
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <p className="text-gray-600">General: contact@eldercare.ai</p>
                    <p className="text-gray-600">Sales: sales@eldercare.ai</p>
                    <p className="text-gray-600">Support: support@eldercare.ai</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaWhatsapp className="icon-success text-xl mt-1" />
                  <div>
                    <p className="font-semibold">WhatsApp Support</p>
                    <p className="text-gray-600">+91 XXXXX-XXXXX</p>
                    <p className="text-gray-600">Quick responses during business hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-lg mb-3">Response Time</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="icon-success mr-2">✓</span>
                    Sales inquiries: Within 2 hours
                  </li>
                  <li className="flex items-center">
                    <span className="icon-success mr-2">✓</span>
                    Support requests: Within 4 hours
                  </li>
                  <li className="flex items-center">
                    <span className="icon-success mr-2">✓</span>
                    Demo scheduling: Same day confirmation
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Connect on Social Media</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-gray-100 p-3 rounded-lg hover:bg-primary-100 transition-colors">
                    <FaLinkedin className="text-2xl text-primary-600" />
                  </a>
                  <a href="#" className="bg-gray-100 p-3 rounded-lg hover:bg-primary-100 transition-colors">
                    <FaTwitter className="text-2xl text-primary-600" />
                  </a>
                  <a href="#" className="bg-gray-100 p-3 rounded-lg hover:bg-success-100 transition-colors">
                    <FaWhatsapp className="text-2xl icon-success" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="gradient-text">Office Locations</span>
            </h2>
            <p className="text-xl text-gray-600">
              Visit us at any of our offices across India
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <FaMapMarkerAlt className="text-primary-600 text-2xl mb-3" />
                <h3 className="font-semibold text-lg mb-2">{office.city}</h3>
                <p className="text-gray-600 text-sm mb-2">{office.address}</p>
                <p className="text-gray-600 text-sm">{office.phone}</p>
                <p className="text-gray-600 text-sm">{office.email}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}