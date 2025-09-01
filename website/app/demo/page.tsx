'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendar, FaClock, FaVideo, FaCheckCircle } from 'react-icons/fa'

export default function Demo() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    email: '',
    phone: '',
    organization: '',
    // Step 2: Facility Details
    facilityType: '',
    numberOfResidents: '',
    currentChallenges: [],
    // Step 3: Schedule
    preferredDate: '',
    preferredTime: '',
    timezone: 'IST',
    demoType: 'video'
  })

  const challenges = [
    'Staff shortage',
    'High operational costs',
    'Medication errors',
    'Fall incidents',
    'Emergency response time',
    'Family communication',
    'Regulatory compliance',
    'Data management'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleChallengeToggle = (challenge: string) => {
    setFormData({
      ...formData,
      currentChallenges: formData.currentChallenges.includes(challenge)
        ? formData.currentChallenges.filter(c => c !== challenge)
        : [...formData.currentChallenges, challenge]
    })
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Demo request submitted:', formData)
    setStep(4) // Go to success step
  }

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
              Schedule Your <span className="gradient-text">Personalized Demo</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how ElderCare AI can transform your facility in just 30 minutes. 
              Get a customized demonstration tailored to your specific needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo Benefits */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <FaVideo className="text-3xl text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Live Demonstration</h3>
              <p className="text-sm text-gray-600">See the platform in action with real scenarios</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <FaCalendar className="text-3xl text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Personalized Consultation</h3>
              <p className="text-sm text-gray-600">Discuss your specific challenges and needs</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <FaClock className="text-3xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">ROI Analysis</h3>
              <p className="text-sm text-gray-600">Get estimated savings for your facility</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <FaCheckCircle className="text-3xl text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No Commitment</h3>
              <p className="text-sm text-gray-600">Free demo with no obligations</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Multi-Step Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          {step < 4 && (
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step >= i 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {i}
                    </div>
                    {i < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        step > i ? 'bg-primary-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600">Basic Info</span>
                <span className="text-sm text-gray-600">Facility Details</span>
                <span className="text-sm text-gray-600">Schedule</span>
              </div>
            </div>
          )}

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Let's Get Started</h2>
                <div className="space-y-6">
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
                      Work Email *
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
                      Organization Name *
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
                  <button
                    onClick={handleNext}
                    className="w-full btn-primary"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Tell Us About Your Facility</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility Type *
                    </label>
                    <select
                      name="facilityType"
                      required
                      value={formData.facilityType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="assisted-living">Assisted Living</option>
                      <option value="nursing-home">Nursing Home</option>
                      <option value="memory-care">Memory Care</option>
                      <option value="independent-living">Independent Living</option>
                      <option value="ccrc">CCRC</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Residents *
                    </label>
                    <select
                      name="numberOfResidents"
                      required
                      value={formData.numberOfResidents}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Range</option>
                      <option value="1-25">1-25</option>
                      <option value="26-50">26-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-200">101-200</option>
                      <option value="200+">200+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Challenges (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {challenges.map((challenge) => (
                        <label key={challenge} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.currentChallenges.includes(challenge)}
                            onChange={() => handleChallengeToggle(challenge)}
                            className="mr-2"
                          />
                          <span className="text-sm">{challenge}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleBack}
                      className="flex-1 btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 btn-primary"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6">Schedule Your Demo</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      required
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      name="preferredTime"
                      required
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demo Type *
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="demoType"
                          value="video"
                          checked={formData.demoType === 'video'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Video Call (Recommended)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="demoType"
                          value="onsite"
                          checked={formData.demoType === 'onsite'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        On-site Visit
                      </label>
                    </div>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-primary-800">
                      <strong>What to expect:</strong> Our product expert will walk you through 
                      the platform, demonstrate features relevant to your challenges, and answer 
                      all your questions. The demo typically lasts 30-45 minutes.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      Schedule Demo
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="text-center py-12">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Demo Scheduled Successfully!</h2>
                <p className="text-gray-600 mb-8">
                  Thank you for scheduling a demo with ElderCare AI. We've sent a confirmation 
                  email to {formData.email} with all the details.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold mb-3">Demo Details:</h3>
                  <p className="text-gray-700">Date: {formData.preferredDate}</p>
                  <p className="text-gray-700">Time: {formData.preferredTime} IST</p>
                  <p className="text-gray-700">Type: {formData.demoType === 'video' ? 'Video Call' : 'On-site Visit'}</p>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Our product expert will reach out to you within 24 hours to confirm the 
                  meeting details and share any preparation materials.
                </p>
                <a href="/" className="btn-primary inline-block">
                  Return to Home
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* What Happens Next */}
      {step < 4 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Happens <span className="gradient-text">After the Demo?</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Free Trial</h3>
                <p className="text-gray-600">
                  Start your 30-day free trial immediately after the demo
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Setup & Training</h3>
                <p className="text-gray-600">
                  Our team helps with installation and trains your staff
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Go Live</h3>
                <p className="text-gray-600">
                  Start improving care quality within 7 days
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}