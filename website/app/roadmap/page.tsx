'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaCircle, FaClock, FaRocket, FaChartLine, FaGlobe, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

interface Phase {
  id: string
  number: string
  name: string
  status: 'completed' | 'in-progress' | 'planned'
  timeline: string
  description: string
  objectives: string[]
  keyFeatures: string[]
  metrics: {
    label: string
    value: string
  }[]
  icon: JSX.Element
  color: string
}

export default function RoadmapPage() {
  const [selectedPhase, setSelectedPhase] = useState<string>('1.5')

  const phases: Phase[] = [
    {
      id: '1',
      number: '1',
      name: 'Core Platform',
      status: 'completed',
      timeline: 'Completed',
      description: 'Built comprehensive senior care management platform with multi-facility support, real-time monitoring, and family engagement.',
      objectives: [
        'Multi-facility management system',
        'Real-time health monitoring & alerts',
        'Family engagement portal',
        'HIPAA/DISHA compliance suite',
        'ROI analytics dashboard'
      ],
      keyFeatures: [
        '50 residents across 3 facilities (demo)',
        '30 days historical vitals tracking',
        '14-table database architecture',
        'JWT authentication with RBAC',
        'Comprehensive audit trails'
      ],
      metrics: [
        { label: 'Facilities', value: '3' },
        { label: 'Residents', value: '50' },
        { label: 'Features', value: '12+' },
        { label: 'Completion', value: '100%' }
      ],
      icon: <FaCheckCircle className="text-4xl" />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: '1.5',
      number: '1.5',
      name: 'Preventive Care + Family Engagement',
      status: 'completed',
      timeline: 'Completed',
      description: 'AI-powered preventive care engine with risk assessment and enhanced family engagement features.',
      objectives: [
        'Preventive care risk assessment engine',
        'Fall prevention analytics',
        'Family notification system',
        'Daily health updates automation',
        'Video call scheduling'
      ],
      keyFeatures: [
        '5 risk categories (falls, dehydration, isolation, medication, cardiovascular)',
        'Risk scoring 0-100 with interventions',
        'Priority-based notification system',
        'Weekly family health summaries',
        '15+ new API endpoints'
      ],
      metrics: [
        { label: 'Risk Categories', value: '5' },
        { label: 'New APIs', value: '15+' },
        { label: 'Dashboards', value: '2' },
        { label: 'Completion', value: '100%' }
      ],
      icon: <FaCheckCircle className="text-4xl" />,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: '2',
      number: '2',
      name: 'Production Ready + First Customers',
      status: 'in-progress',
      timeline: 'Weeks 3-8 (Current)',
      description: 'Fix limitations, build sales materials, and acquire first 3 paying B2B facility customers.',
      objectives: [
        'Fix multi-facility support across all dashboards',
        'Add persistent notification storage',
        'Integrate photo/document storage (S3)',
        'Build sales deck and demo environment',
        'Acquire 3 pilot customers'
      ],
      keyFeatures: [
        'WhatsApp Business API integration',
        'Email notification service',
        'Staff mobile app (PWA)',
        'Enhanced medication tracking',
        'Incident reporting workflow'
      ],
      metrics: [
        { label: 'Target Customers', value: '3' },
        { label: 'MRR Target', value: '₹1.5L' },
        { label: 'Timeline', value: '6 weeks' },
        { label: 'Progress', value: '15%' }
      ],
      icon: <FaClock className="text-4xl" />,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: '3',
      number: '3',
      name: 'Scale to 30 Facilities',
      status: 'planned',
      timeline: 'Weeks 9-20',
      description: 'Product enhancements, team expansion, and growth to 30 B2B facility customers with add-on modules.',
      objectives: [
        'Scale to 30 facility customers',
        'Launch monetization add-ons',
        'Hire sales + customer success team',
        'Partner with industry associations',
        'Achieve ₹28L MRR (₹3.36Cr ARR)'
      ],
      keyFeatures: [
        'Staff scheduling & rostering module',
        'Billing & invoicing automation',
        'Nutrition & meal planning',
        'Advanced analytics dashboard',
        'Integration API access'
      ],
      metrics: [
        { label: 'Target Facilities', value: '30' },
        { label: 'MRR Target', value: '₹28L' },
        { label: 'ARPU Increase', value: '+50%' },
        { label: 'Timeline', value: '12 weeks' }
      ],
      icon: <FaRocket className="text-4xl" />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: '4',
      number: '4',
      name: 'B2C Home Care + Scale to 50',
      status: 'planned',
      timeline: 'Months 7-12',
      description: 'Launch B2C home care for families, scale B2B to 50 facilities, and achieve Series A readiness.',
      objectives: [
        'Launch B2C home care product',
        'Scale B2B to 50 facilities',
        'Expand to Tier 2 cities',
        'Achieve ₹5.5Cr ARR',
        'Prepare for Series A funding'
      ],
      keyFeatures: [
        'Home care tracking app',
        'WhatsApp bot for daily check-ins',
        'Local language support (5+ languages)',
        'Nurse marketplace for home visits',
        'Doctor tele-consultation integration'
      ],
      metrics: [
        { label: 'B2B Facilities', value: '50' },
        { label: 'B2C Users', value: '500' },
        { label: 'Total ARR', value: '₹5.5Cr' },
        { label: 'Timeline', value: '6 months' }
      ],
      icon: <FaChartLine className="text-4xl" />,
      color: 'from-teal-500 to-blue-600'
    }
  ]

  const selectedPhaseData = phases.find(p => p.id === selectedPhase) || phases[1]

  const getStatusIcon = (status: Phase['status']) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500 text-xl" />
      case 'in-progress':
        return <FaClock className="text-orange-500 text-xl animate-pulse" />
      case 'planned':
        return <FaCircle className="text-gray-400 text-xl" />
    }
  }

  const getStatusText = (status: Phase['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'planned':
        return 'Planned'
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                Product Roadmap
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-primary-700 to-gray-900 bg-clip-text text-transparent">
                Our Journey to
              </span>
              <br />
              <motion.span
                className="inline-block mt-2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundImage: 'linear-gradient(90deg, #0ea5e9, #d946ef, #0ea5e9)',
                  backgroundSize: '200% 100%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Transforming Senior Care
              </motion.span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              From core platform to market leadership - our strategic roadmap for revolutionizing
              senior care in India's USD 12B market by 2030.
            </p>

            {/* Current Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-4 bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                <div className="text-left">
                  <p className="text-sm text-gray-500 font-medium">Currently Building</p>
                  <p className="text-lg font-bold text-gray-900">Phase 2: Production Ready + First Customers</p>
                </div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="text-left">
                <p className="text-sm text-gray-500 font-medium">Completion</p>
                <p className="text-2xl font-bold text-primary-600">15%</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Phase Timeline */}
      <section className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Desktop Timeline */}
            <div className="hidden md:flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-orange-500"
                />
              </div>

              {phases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex flex-col items-center cursor-pointer group z-10"
                  onClick={() => setSelectedPhase(phase.id)}
                >
                  {/* Phase Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative mb-6`}
                  >
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${phase.color} blur-xl ${
                      selectedPhase === phase.id ? 'opacity-60' : 'opacity-20 group-hover:opacity-40'
                    } transition-opacity`}></div>
                    <div className={`relative p-6 rounded-full bg-white shadow-lg border-4 transition-all ${
                      selectedPhase === phase.id
                        ? `border-transparent bg-gradient-to-br ${phase.color} text-white`
                        : 'border-gray-200 group-hover:border-gray-300 text-gray-600'
                    }`}>
                      {phase.icon}
                    </div>
                    {/* Status Badge */}
                    <div className="absolute -top-2 -right-2">
                      {getStatusIcon(phase.status)}
                    </div>
                  </motion.div>

                  {/* Phase Info */}
                  <div className="text-center">
                    <p className={`text-sm font-semibold mb-1 transition-colors ${
                      selectedPhase === phase.id ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      Phase {phase.number}
                    </p>
                    <p className={`font-bold mb-2 transition-colors ${
                      selectedPhase === phase.id ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {phase.name}
                    </p>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                      phase.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {getStatusText(phase.status)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden space-y-4">
              {phases.map((phase) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    selectedPhase === phase.id
                      ? 'bg-white shadow-lg scale-105'
                      : 'bg-white/50 hover:bg-white hover:shadow'
                  }`}
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${phase.color} text-white`}>
                    {getStatusIcon(phase.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">Phase {phase.number}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                        phase.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getStatusText(phase.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{phase.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phase Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Phase Header */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                <div className={`bg-gradient-to-r ${selectedPhaseData.color} p-8 text-white`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                      {selectedPhaseData.icon}
                    </div>
                    <div>
                      <p className="text-white/80 font-semibold">Phase {selectedPhaseData.number}</p>
                      <h2 className="text-3xl font-bold">{selectedPhaseData.name}</h2>
                    </div>
                  </div>
                  <p className="text-lg text-white/90 max-w-3xl">{selectedPhaseData.description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <FaClock className="text-sm" />
                    <span className="font-semibold">{selectedPhaseData.timeline}</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
                  {selectedPhaseData.metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 text-center"
                    >
                      <p className="text-3xl font-bold text-primary-600 mb-1">{metric.value}</p>
                      <p className="text-sm text-gray-600">{metric.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Objectives and Features */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Objectives */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${selectedPhaseData.color} text-white`}>
                      🎯
                    </div>
                    Objectives
                  </h3>
                  <ul className="space-y-3">
                    {selectedPhaseData.objectives.map((objective, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{objective}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${selectedPhaseData.color} text-white`}>
                      ⭐
                    </div>
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {selectedPhaseData.keyFeatures.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Us on This Journey
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Be part of transforming senior care in India's fastest-growing market
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/demo" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                  Schedule a Demo <FaArrowRight />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all">
                  Get in Touch
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
