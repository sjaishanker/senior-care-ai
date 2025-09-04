'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaRobot, FaHeartbeat, FaShieldAlt, FaChartLine, FaBell, FaUserMd, FaArrowRight, FaPlay, FaCheck } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerContainer } from '@/hooks/useScrollAnimation'

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const { ref: featuresRef, controls: featuresControls } = useScrollAnimation()
  const { ref: statsRef, controls: statsControls } = useScrollAnimation()
  const { ref: testimonialsRef, controls: testimonialsControls } = useScrollAnimation()

  const features = [
    {
      icon: <FaRobot className="text-4xl" />,
      title: "AI-Powered Monitoring",
      description: "24/7 intelligent monitoring using advanced machine learning algorithms to detect anomalies and predict health issues before they become critical.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaHeartbeat className="text-4xl" />,
      title: "Predictive Health Analytics",
      description: "Analyze patterns in vital signs, behavior, and medical history to predict potential health risks up to 72 hours in advance.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Fall Detection & Prevention",
      description: "Real-time fall detection with immediate alerts and predictive analytics to identify fall risks and prevent accidents.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaBell className="text-4xl" />,
      title: "Smart Alert System",
      description: "Intelligent alert prioritization ensuring critical issues reach the right caregivers immediately while reducing alert fatigue.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <FaUserMd className="text-4xl" />,
      title: "Medication Management",
      description: "Automated medication reminders, interaction checking, and adherence tracking to ensure proper medication compliance.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Comprehensive Analytics",
      description: "Real-time dashboards and detailed reports providing insights into facility operations, resident health trends, and care quality metrics.",
      color: "from-teal-500 to-blue-500"
    }
  ]

  const stats = [
    { value: "50,000+", label: "Seniors Monitored", suffix: "" },
    { value: "98", label: "Alert Accuracy", suffix: "%" },
    { value: "35", label: "Reduction in Emergencies", suffix: "%" },
    { value: "24/7", label: "Continuous Care", suffix: "" }
  ]

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Director, Sunrise Senior Care",
      content: "ElderCare AI has transformed how we monitor our residents. The predictive analytics have helped us prevent numerous medical emergencies.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Administrator, Golden Years Facility",
      content: "The fall detection system alone has saved lives. We've seen a 40% reduction in fall-related injuries since implementation.",
      rating: 5
    },
    {
      name: "Sister Mary",
      role: "Head Nurse, St. Joseph's Care Home",
      content: "The medication management system ensures no resident misses their doses. It's been a game-changer for our staff efficiency.",
      rating: 5
    }
  ]

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pt-16 overflow-hidden">
      {/* Animated Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('/senior-care-bg.jpg')`,
              filter: 'brightness(0.7)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-secondary-900/80"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  🚀 Trusted by 500+ Care Facilities
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Revolutionizing{' '}
                <motion.span
                  className="gradient-text inline-block"
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
                  Senior Care
                </motion.span>{' '}
                in India with AI
              </h1>
              
              <p className="text-xl text-gray-200 mb-8">
                Empowering care facilities with cutting-edge artificial intelligence to ensure 
                dignified, proactive, and personalized care for every elderly resident.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/demo" className="btn-primary inline-flex items-center gap-2 text-center group">
                    Schedule Free Demo
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="btn-secondary inline-flex items-center gap-2 text-center"
                  >
                    <FaPlay /> Watch Demo Video
                  </button>
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "500+", label: "Care Facilities" },
                  { value: "₹2.5Cr+", label: "Costs Saved" },
                  { value: "4.9/5", label: "User Rating" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Subtle glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-3xl opacity-20 blur-2xl"></div>
              
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Browser-like header */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">ElderCare AI Dashboard</div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Residents', value: '128', color: 'blue' },
                        { label: 'Active Staff', value: '24', color: 'green' },
                        { label: 'Alerts', value: '3', color: 'orange' }
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className={`bg-white rounded-lg p-3 border border-gray-100 shadow-sm`}
                        >
                          <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                          <p className={`text-xl font-bold text-${stat.color}-600`}>
                            {stat.value}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Realistic Chart */}
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Weekly Overview</h4>
                        <span className="text-xs text-gray-400">Last 7 days</span>
                      </div>
                      
                      {/* Line chart simulation */}
                      <div className="relative h-24">
                        <svg className="w-full h-full" viewBox="0 0 300 100">
                          <motion.path
                            d="M 10,80 L 60,60 L 110,70 L 160,40 L 210,45 L 260,30 L 290,35"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, delay: 1 }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#0ea5e9" />
                              <stop offset="100%" stopColor="#d946ef" />
                            </linearGradient>
                          </defs>
                          
                          {/* Dots on the line */}
                          {[
                            { x: 10, y: 80 },
                            { x: 60, y: 60 },
                            { x: 110, y: 70 },
                            { x: 160, y: 40 },
                            { x: 210, y: 45 },
                            { x: 260, y: 30 },
                            { x: 290, y: 35 }
                          ].map((point, i) => (
                            <motion.circle
                              key={i}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill="white"
                              stroke="#0ea5e9"
                              strokeWidth="2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1.2 + i * 0.1 }}
                            />
                          ))}
                        </svg>
                      </div>
                      
                      {/* Chart labels */}
                      <div className="flex justify-between mt-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                          <span key={i} className="text-xs text-gray-400">{day}</span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Row - Key Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                        className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-3 border border-primary-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-primary-600 font-medium">Occupancy</p>
                            <p className="text-lg font-bold text-gray-800 mt-1">92%</p>
                          </div>
                          <div className="text-primary-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.9 }}
                        className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-green-600 font-medium">Health Score</p>
                            <p className="text-lg font-bold text-gray-800 mt-1">Good</p>
                          </div>
                          <div className="text-green-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 bg-gray-50" ref={featuresRef}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={featuresControls}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligent Features for <span className="gradient-text">Complete Care</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive monitoring and predictive analytics
              to ensure the highest standard of care for every resident.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature Cards */}
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInLeft}
                  whileHover={{ x: 10 }}
                  onClick={() => setActiveFeature(index)}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeFeature === index
                      ? 'bg-white shadow-xl scale-105'
                      : 'bg-white/60 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{
                        rotate: activeFeature === index ? 360 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white`}
                    >
                      {feature.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Preview */}
            <motion.div
              variants={fadeInRight}
              className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-center"
                >
                  <div className={`p-4 rounded-lg bg-gradient-to-br ${features[activeFeature].color} text-white mb-6 inline-block self-start`}>
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
                  <p className="text-gray-600 mb-6">{features[activeFeature].description}</p>
                  
                  <div className="space-y-3">
                    {['Real-time monitoring', 'Predictive analytics', 'Automated alerts'].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <FaCheck className="text-green-500" />
                        <span className="text-gray-700">{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 btn-primary inline-flex items-center gap-2 self-start"
                  >
                    Learn More <FaArrowRight />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white" ref={statsRef}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={statsControls}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Impact by the Numbers</h2>
            <p className="text-xl opacity-90">Real results from real care facilities across India</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="text-5xl font-bold mb-2"
                >
                  {stat.suffix === '%' ? (
                    <CountUp end={parseInt(stat.value)} suffix={stat.suffix} />
                  ) : (
                    stat.value
                  )}
                </motion.div>
                <p className="text-lg opacity-90">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" ref={testimonialsRef}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={testimonialsControls}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by <span className="gradient-text">Care Providers</span>
            </h2>
            <p className="text-xl text-gray-600">Hear from facilities already transforming senior care</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 + i * 0.1 }}
                      className="text-yellow-400 text-xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Care Facility?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Join hundreds of facilities already providing better care with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/demo" className="btn-primary inline-flex items-center gap-2">
                Get Started Today <FaArrowRight />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/contact" className="btn-secondary">
                Talk to Our Experts
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoModalOpen(false)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-4xl w-full"
            >
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Demo video placeholder</p>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="mt-4 btn-secondary w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Counter animation component
function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const duration = 2000
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [end])
  
  return <>{count}{suffix}</>
}

// Dashboard counter component
function CountUpDashboard({ end, suffix, decimal = false }: { end: number; suffix: string; decimal?: boolean }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const duration = 1500
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(decimal ? parseFloat(start.toFixed(1)) : Math.floor(start))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [end, decimal])
  
  return <>{decimal ? count.toFixed(1) : count}{suffix}</>
}