'use client'

import Link from 'next/link'
import { FaRobot, FaHeartbeat, FaShieldAlt, FaChartLine, FaBell, FaUserMd, FaUsers, FaMobile } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function Home() {
  const features = [
    {
      icon: <FaRobot className="text-4xl text-primary-600" />,
      title: "AI-Powered Monitoring",
      description: "24/7 intelligent monitoring using advanced machine learning algorithms to detect anomalies and predict health issues before they become critical."
    },
    {
      icon: <FaHeartbeat className="text-4xl text-red-500" />,
      title: "Predictive Health Analytics",
      description: "Analyze patterns in vital signs, behavior, and medical history to predict potential health risks up to 72 hours in advance."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-500" />,
      title: "Fall Detection & Prevention",
      description: "Real-time fall detection with immediate alerts and predictive analytics to identify fall risks and prevent accidents."
    },
    {
      icon: <FaBell className="text-4xl text-yellow-500" />,
      title: "Smart Alert System",
      description: "Intelligent alert prioritization ensuring critical issues reach the right caregivers immediately while reducing alert fatigue."
    },
    {
      icon: <FaUserMd className="text-4xl text-purple-500" />,
      title: "Medication Management",
      description: "Automated medication reminders, interaction checking, and adherence tracking to ensure proper medication compliance."
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-500" />,
      title: "Comprehensive Analytics",
      description: "Real-time dashboards and detailed reports providing insights into facility operations, resident health trends, and care quality metrics."
    }
  ]

  const stats = [
    { value: "50,000+", label: "Seniors Monitored" },
    { value: "98%", label: "Alert Accuracy" },
    { value: "35%", label: "Reduction in Emergencies" },
    { value: "24/7", label: "Continuous Care" }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Revolutionizing <span className="gradient-text">Senior Care</span> in India with AI
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Empowering care facilities with cutting-edge artificial intelligence to ensure 
                dignified, proactive, and personalized care for every elderly resident.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo" className="btn-primary inline-block text-center">
                  Schedule Free Demo
                </Link>
                <Link href="/solutions" className="btn-secondary inline-block text-center">
                  Explore Solutions
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-8">
                <div>
                  <p className="text-3xl font-bold text-primary-600">500+</p>
                  <p className="text-sm text-gray-600">Care Facilities</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">₹2.5Cr+</p>
                  <p className="text-sm text-gray-600">Costs Saved</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">4.9/5</p>
                  <p className="text-sm text-gray-600">User Rating</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-4">
                <img 
                  src="/dashboard-preview.svg" 
                  alt="ElderCare AI Dashboard"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-full filter blur-3xl opacity-30"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-secondary-200 rounded-full filter blur-3xl opacity-30"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
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
              The Challenge of <span className="gradient-text">Elder Care in India</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With over 140 million elderly citizens and limited caregiving resources, 
              India faces an unprecedented challenge in providing quality senior care.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-red-500 text-3xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Staff Shortage</h3>
              <p className="text-gray-600">1:40 caregiver-to-resident ratio leads to missed health issues and delayed responses</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-yellow-500 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Reactive Care</h3>
              <p className="text-gray-600">70% of health emergencies could be prevented with early detection and intervention</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-blue-500 text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Rising Costs</h3>
              <p className="text-gray-600">Healthcare costs increase by 45% due to preventable complications and hospital readmissions</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              Comprehensive <span className="gradient-text">AI-Powered Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with healthcare expertise 
              to deliver unprecedented care quality and operational efficiency.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg card-hover border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Proven Impact Across India
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Our AI platform is already transforming senior care facilities across the nation
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-lg opacity-90">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
              Trusted by <span className="gradient-text">Leading Care Facilities</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <FaUsers className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold">Dr. Rajesh Kumar</p>
                  <p className="text-sm text-gray-600">Director, Sunset Care Homes</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "ElderCare AI has transformed how we deliver care. The predictive analytics 
                helped us prevent 3 major health crises last month alone. It's not just 
                technology; it's a lifesaver."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mr-3">
                  <FaUserMd className="text-secondary-600" />
                </div>
                <div>
                  <p className="font-semibold">Priya Sharma</p>
                  <p className="text-sm text-gray-600">Head Nurse, Golden Years Mumbai</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The AI alerts are incredibly accurate. We can now focus on providing care 
                rather than constantly monitoring. Staff efficiency has improved by 40% 
                since implementation."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <FaMobile className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Amit Patel</p>
                  <p className="text-sm text-gray-600">Son of Resident</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The family portal gives me peace of mind. I can check on my father anytime, 
                see his health trends, and communicate with caregivers instantly. It's like 
                being there even when I can't be."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Senior Care Facility?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of facilities across India already delivering exceptional care with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                Get Free Demo
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-block">
                Contact Sales Team
              </Link>
            </div>
            <p className="mt-6 text-sm opacity-75">
              No credit card required • Free 30-day trial • Full support included
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}