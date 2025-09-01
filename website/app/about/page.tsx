'use client'

import { motion } from 'framer-motion'
import { FaLightbulb, FaHeart, FaRocket, FaAward } from 'react-icons/fa'

export default function About() {
  const values = [
    {
      icon: <FaHeart className="text-3xl text-red-500" />,
      title: "Compassion First",
      description: "Every feature we build starts with empathy for the elderly and their caregivers"
    },
    {
      icon: <FaLightbulb className="text-3xl text-yellow-500" />,
      title: "Innovation for Impact",
      description: "Leveraging cutting-edge AI to solve real-world healthcare challenges"
    },
    {
      icon: <FaRocket className="text-3xl text-blue-500" />,
      title: "Accessible Technology",
      description: "Making advanced care technology affordable for all Indian care facilities"
    },
    {
      icon: <FaAward className="text-3xl text-green-500" />,
      title: "Excellence in Care",
      description: "Setting new standards for quality and dignity in senior care"
    }
  ]

  const team = [
    {
      name: "Dr. Ananya Mehta",
      role: "CEO & Co-Founder",
      bio: "Former AIIMS geriatrician with 15+ years in elderly care",
      image: "/team/ceo.jpg"
    },
    {
      name: "Vikram Singh",
      role: "CTO & Co-Founder",
      bio: "IIT Delhi alumnus, Ex-Google AI researcher",
      image: "/team/cto.jpg"
    },
    {
      name: "Priya Nair",
      role: "Chief Medical Officer",
      bio: "20+ years in geriatric medicine and public health",
      image: "/team/cmo.jpg"
    },
    {
      name: "Rahul Sharma",
      role: "Head of AI",
      bio: "PhD in Machine Learning, specialized in healthcare AI",
      image: "/team/ai-head.jpg"
    }
  ]

  const milestones = [
    { year: "2021", event: "Company founded with a vision to transform elder care" },
    { year: "2022", event: "Pilot program launched in 10 facilities across Bengaluru" },
    { year: "2023", event: "Expanded to 100+ facilities across 5 major cities" },
    { year: "2024", event: "Reached 500+ facilities, serving 50,000+ seniors nationwide" }
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
              Our <span className="gradient-text">Vision</span> for Elder Care
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building a future where every elderly person in India receives dignified, 
              proactive, and personalized care through the power of artificial intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To revolutionize senior care in India by providing AI-powered solutions that 
                enable care facilities to deliver exceptional, proactive, and personalized care 
                to every elderly resident. We strive to bridge the gap between limited resources 
                and growing care needs through intelligent technology that augments human 
                compassion, not replaces it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-2xl"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To become India's leading elder care technology platform, ensuring that by 2030, 
                no senior citizen suffers from preventable health complications due to lack of 
                timely intervention. We envision a future where AI-enhanced care is the standard, 
                making quality elder care accessible and affordable for all socioeconomic segments 
                across urban and rural India.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Problem We're Solving */}
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
              Why <span className="gradient-text">ElderCare AI</span> Exists
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              India's aging population faces unique challenges that demand innovative solutions
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-primary-600">The Challenge</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>140+ million elderly citizens, expected to reach 300 million by 2050</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Severe shortage of trained caregivers (1:40 ratio)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>70% of elderly have chronic conditions requiring constant monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Limited access to specialized geriatric care in tier 2/3 cities</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-secondary-600">Our Solution</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>AI multiplies caregiver effectiveness by 10x</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>24/7 monitoring detects issues before they become critical</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Predictive analytics prevents 35% of medical emergencies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Cloud-based platform accessible from anywhere in India</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
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
              Our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide every decision we make
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
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
              Meet Our <span className="gradient-text">Leadership Team</span>
            </h2>
            <p className="text-xl text-gray-600">
              Experts passionate about transforming elder care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary-600 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
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
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl text-gray-600">
              From vision to impact - transforming elder care across India
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-200 to-secondary-200"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-1"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold z-10">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className={`bg-white p-6 rounded-lg shadow-lg ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                    <h3 className="text-xl font-semibold text-primary-600 mb-2">{milestone.year}</h3>
                    <p className="text-gray-600">{milestone.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
              Join Us in Revolutionizing Elder Care
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Partner with us to bring AI-powered care to your facility
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                Partner With Us
              </a>
              <a href="/careers" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-block">
                Join Our Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}