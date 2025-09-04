'use client'

import { motion } from 'framer-motion'
import { FaBrain, FaHeartbeat, FaBell, FaChartLine, FaMobile, FaShieldAlt, FaUserMd, FaClock } from 'react-icons/fa'
import Link from 'next/link'

export default function Solutions() {
  const solutions = [
    {
      icon: <FaBrain className="text-4xl icon-secondary" />,
      title: "AI Health Monitoring",
      subtitle: "Predictive Analytics & Real-time Monitoring",
      features: [
        "24/7 vital signs monitoring with anomaly detection",
        "Behavior pattern analysis for early dementia detection",
        "Sleep quality tracking and disturbance alerts",
        "Mood and emotional wellbeing assessment"
      ],
      benefits: [
        "Detect health issues 72 hours before they become critical",
        "Reduce emergency hospitalizations by 35%",
        "Improve resident health outcomes by 40%"
      ]
    },
    {
      icon: <FaShieldAlt className="text-4xl icon-success" />,
      title: "Fall Detection & Prevention",
      subtitle: "Advanced Computer Vision & Predictive Analytics",
      features: [
        "Real-time fall detection with instant alerts",
        "Gait analysis and fall risk assessment",
        "Environmental hazard identification",
        "Personalized prevention recommendations"
      ],
      benefits: [
        "90% reduction in fall-related injuries",
        "5-minute average response time to falls",
        "Prevent 60% of falls through early intervention"
      ]
    },
    {
      icon: <FaUserMd className="text-4xl icon-primary" />,
      title: "Medication Management",
      subtitle: "Automated Tracking & Compliance Monitoring",
      features: [
        "Automated medication reminders and scheduling",
        "Drug interaction checking and alerts",
        "Adherence tracking with visual confirmation",
        "Prescription refill management"
      ],
      benefits: [
        "95% medication adherence rate",
        "Zero medication errors in pilot facilities",
        "30% reduction in adverse drug events"
      ]
    },
    {
      icon: <FaBell className="text-4xl icon-danger" />,
      title: "Smart Alert System",
      subtitle: "Intelligent Prioritization & Routing",
      features: [
        "AI-powered alert prioritization",
        "Role-based notification routing",
        "Alert fatigue reduction algorithms",
        "Escalation protocols for critical events"
      ],
      benefits: [
        "70% reduction in false alarms",
        "3x faster response to critical alerts",
        "50% improvement in staff efficiency"
      ]
    },
    {
      icon: <FaChartLine className="text-4xl icon-info" />,
      title: "Analytics Dashboard",
      subtitle: "Comprehensive Insights & Reporting",
      features: [
        "Real-time facility performance metrics",
        "Individual resident health trends",
        "Staff efficiency and workload analysis",
        "Customizable reports for compliance"
      ],
      benefits: [
        "Data-driven decision making",
        "Automated regulatory compliance reporting",
        "20% improvement in operational efficiency"
      ]
    },
    {
      icon: <FaMobile className="text-4xl icon-warning" />,
      title: "Family Engagement Portal",
      subtitle: "Connect Families with Real-time Updates",
      features: [
        "Secure family member access portal",
        "Real-time health status updates",
        "Video calling and messaging",
        "Care plan visibility and updates"
      ],
      benefits: [
        "95% family satisfaction rate",
        "50% reduction in family inquiries",
        "Improved transparency and trust"
      ]
    }
  ]

  const workflow = [
    {
      step: 1,
      title: "Data Collection",
      description: "Continuous monitoring through IoT sensors, wearables, and care staff inputs"
    },
    {
      step: 2,
      title: "AI Processing",
      description: "Real-time analysis using machine learning models trained on millions of data points"
    },
    {
      step: 3,
      title: "Pattern Recognition",
      description: "Identify anomalies, trends, and predict potential health events"
    },
    {
      step: 4,
      title: "Smart Alerts",
      description: "Prioritized notifications sent to appropriate caregivers based on urgency"
    },
    {
      step: 5,
      title: "Intervention",
      description: "Timely care delivery with AI-recommended action plans"
    },
    {
      step: 6,
      title: "Continuous Learning",
      description: "System improves with each interaction, becoming more accurate over time"
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
              Comprehensive <span className="gradient-text">AI Solutions</span> for Elder Care
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your care facility with our suite of AI-powered tools designed 
              specifically for the unique needs of Indian senior care centers.
            </p>
            <Link href="/demo" className="btn-primary inline-block">
              See Solutions in Action
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
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
              How Our <span className="gradient-text">AI Platform</span> Works
            </h2>
            <p className="text-xl text-gray-600">
              Seamless integration with your existing care workflows
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflow.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold ml-4">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Solutions */}
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
              Our <span className="gradient-text">Solution Suite</span>
            </h2>
            <p className="text-xl text-gray-600">
              Each solution is designed to address specific challenges in elder care
            </p>
          </motion.div>

          <div className="space-y-12">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-primary-50 to-secondary-50 p-8 flex flex-col justify-center">
                    <div className="mb-4">{solution.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{solution.title}</h3>
                    <p className="text-gray-600">{solution.subtitle}</p>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-primary-600">Key Features</h4>
                        <ul className="space-y-2">
                          {solution.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="icon-success mr-2">✓</span>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-secondary-600">Benefits</h4>
                        <ul className="space-y-2">
                          {solution.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="icon-info mr-2">→</span>
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
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
              Seamless <span className="gradient-text">Integration</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform integrates with your existing systems and workflows without disruption
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Setup</h3>
              <p className="text-gray-600">
                Go live in just 7 days with our streamlined onboarding process
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-secondary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeartbeat className="text-3xl text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Disruption</h3>
              <p className="text-gray-600">
                Works alongside your existing processes without any interruption
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl icon-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Support</h3>
              <p className="text-gray-600">
                24/7 technical support and regular training for your staff
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              Proven Return on Investment
            </h2>
            <p className="text-xl mb-12 opacity-90">
              Our clients see measurable improvements within the first month
            </p>

            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <p className="text-5xl font-bold mb-2">40%</p>
                <p className="text-lg">Reduction in operational costs</p>
              </div>
              <div>
                <p className="text-5xl font-bold mb-2">3x</p>
                <p className="text-lg">Increase in staff productivity</p>
              </div>
              <div>
                <p className="text-5xl font-bold mb-2">95%</p>
                <p className="text-lg">Family satisfaction rate</p>
              </div>
              <div>
                <p className="text-5xl font-bold mb-2">6mo</p>
                <p className="text-lg">Average payback period</p>
              </div>
            </div>

            <div className="mt-12">
              <Link href="/roi-calculator" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                Calculate Your ROI
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Care Facility?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              See how our AI solutions can improve care quality and operational efficiency
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-primary inline-block">
                Request a Personalized Demo
              </Link>
              <Link href="/contact" className="btn-secondary inline-block">
                Talk to Our Experts
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}