'use client'

import { motion } from 'framer-motion'
import { FaBuilding, FaUserMd, FaUsers, FaChartLine, FaHandshake, FaHospital } from 'react-icons/fa'
import Link from 'next/link'

export default function Stakeholders() {
  const stakeholders = [
    {
      icon: <FaBuilding className="text-5xl icon-primary" />,
      title: "For Care Facility Owners",
      subtitle: "Maximize Efficiency & Profitability",
      painPoints: [
        "High operational costs with limited budgets",
        "Staff shortage and high turnover rates",
        "Regulatory compliance challenges",
        "Difficulty in scaling operations"
      ],
      solutions: [
        "Reduce operational costs by 40% through AI automation",
        "Multiply staff effectiveness by 10x with smart monitoring",
        "Automated compliance reporting and documentation",
        "Scalable cloud-based platform that grows with you"
      ],
      metrics: [
        "₹50 lakhs average annual savings",
        "30% increase in facility occupancy",
        "90% reduction in compliance violations"
      ],
      cta: "Calculate Your Savings"
    },
    {
      icon: <FaUserMd className="text-5xl icon-success" />,
      title: "For Healthcare Providers",
      subtitle: "Deliver Superior Care with AI Assistance",
      painPoints: [
        "Overwhelming patient load",
        "Missing early warning signs",
        "Documentation burden",
        "Alert fatigue from false alarms"
      ],
      solutions: [
        "AI prioritizes tasks based on urgency and risk",
        "Predictive analytics catch issues 72 hours early",
        "Automated documentation and care notes",
        "98% accurate alerts reduce false positives"
      ],
      metrics: [
        "3 hours saved per shift",
        "50% reduction in emergency events",
        "95% staff satisfaction rate"
      ],
      cta: "See How It Works"
    },
    {
      icon: <FaUsers className="text-5xl icon-secondary" />,
      title: "For Family Members",
      subtitle: "Peace of Mind Through Transparency",
      painPoints: [
        "Worry about parent's wellbeing",
        "Limited visibility into daily care",
        "Difficulty staying connected",
        "Concerns about care quality"
      ],
      solutions: [
        "Real-time health status updates",
        "Daily activity reports and photos",
        "Video calling and messaging features",
        "Transparent care plans and progress tracking"
      ],
      metrics: [
        "24/7 access to loved one's status",
        "95% family satisfaction rate",
        "50% reduction in anxiety levels"
      ],
      cta: "Learn About Family Portal"
    },
    {
      icon: <FaHospital className="text-5xl icon-danger" />,
      title: "For Hospital Networks",
      subtitle: "Reduce Readmissions & Improve Outcomes",
      painPoints: [
        "High readmission rates",
        "Poor post-discharge monitoring",
        "Lack of continuity of care",
        "Limited bed availability"
      ],
      solutions: [
        "Continuous monitoring prevents readmissions",
        "Seamless care transitions with data sharing",
        "Early intervention for at-risk patients",
        "Better bed management through prevention"
      ],
      metrics: [
        "45% reduction in readmissions",
        "₹2 crores saved annually",
        "20% improvement in patient outcomes"
      ],
      cta: "Partner With Us"
    },
    {
      icon: <FaChartLine className="text-5xl icon-primary" />,
      title: "For Investors",
      subtitle: "Invest in India's Elder Care Revolution",
      painPoints: [
        "Massive untapped market opportunity",
        "140M elderly population growing rapidly",
        "Limited technology adoption in sector",
        "High demand for quality care solutions"
      ],
      solutions: [
        "Proven business model with 6-month payback",
        "500+ facilities already onboarded",
        "50% YoY growth rate",
        "Expanding to Southeast Asian markets"
      ],
      metrics: [
        "₹500Cr addressable market",
        "3x revenue growth in 2 years",
        "85% customer retention rate"
      ],
      cta: "View Investment Deck"
    },
    {
      icon: <FaHandshake className="text-5xl icon-warning" />,
      title: "For Government & NGOs",
      subtitle: "Scalable Solution for Public Health",
      painPoints: [
        "Limited resources for elderly care",
        "Rural areas lacking specialists",
        "Need for affordable care solutions",
        "Public health crisis prevention"
      ],
      solutions: [
        "Affordable pricing for government facilities",
        "Remote monitoring for rural areas",
        "Training programs for caregivers",
        "Population health analytics and insights"
      ],
      metrics: [
        "Serving 10,000+ BPL seniors",
        "Present in 15 states",
        "40% cost reduction vs traditional care"
      ],
      cta: "Discuss Partnership"
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
              Solutions for Every <span className="gradient-text">Stakeholder</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ElderCare AI delivers value to everyone in the elder care ecosystem - 
              from facility owners to family members, creating a win-win for all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stakeholder Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12">
            {stakeholders.map((stakeholder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}
              >
                <div className="p-8 md:p-12">
                  <div className="md:flex items-start gap-8">
                    <div className="mb-6 md:mb-0">{stakeholder.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">{stakeholder.title}</h2>
                      <p className="text-xl text-gray-600 mb-8">{stakeholder.subtitle}</p>
                      
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-danger-600">Current Challenges</h3>
                          <ul className="space-y-2">
                            {stakeholder.painPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="icon-danger mr-2 mt-1">×</span>
                                <span className="text-gray-700">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-success-600">Our Solutions</h3>
                          <ul className="space-y-2">
                            {stakeholder.solutions.map((solution, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="icon-success mr-2 mt-1">✓</span>
                                <span className="text-gray-700">{solution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {stakeholder.metrics.map((metric, idx) => (
                            <div key={idx} className="text-center">
                              <p className="font-bold text-primary-600">{metric}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Link 
                        href={stakeholder.title.includes('Investor') ? '/investors' : '/demo'} 
                        className="btn-primary inline-block"
                      >
                        {stakeholder.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
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
              Success Stories from <span className="gradient-text">Every Perspective</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <FaBuilding className="text-3xl icon-primary mr-3" />
                <div>
                  <h3 className="font-semibold">Sunrise Senior Living, Mumbai</h3>
                  <p className="text-sm text-gray-600">150-bed facility</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Within 3 months of implementing ElderCare AI, we reduced our emergency 
                hospitalizations by 40% and saved ₹45 lakhs. The predictive analytics 
                helped us intervene early for 12 residents who were developing UTIs."
              </p>
              <p className="text-sm font-semibold text-primary-600">
                - Rajesh Mehta, Facility Director
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <FaUsers className="text-3xl icon-secondary mr-3" />
                <div>
                  <h3 className="font-semibold">The Sharma Family</h3>
                  <p className="text-sm text-gray-600">Family of resident at Golden Years Delhi</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "My mother has dementia, and we live in the US. The family portal gives us 
                daily updates, photos, and health trends. Last month, the AI detected unusual 
                sleep patterns that led to early diagnosis of a UTI. We're so grateful!"
              </p>
              <p className="text-sm font-semibold text-purple-600">
                - Priya Sharma, Daughter
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <FaUserMd className="text-3xl icon-success mr-3" />
                <div>
                  <h3 className="font-semibold">Dr. Anita Patel</h3>
                  <p className="text-sm text-gray-600">Head Nurse at CarePath Bengaluru</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "The AI system is like having an extra pair of expert eyes 24/7. It caught 
                a resident's irregular heart pattern at 3 AM, allowing us to prevent a 
                cardiac event. I can now focus on care instead of constant monitoring."
              </p>
              <p className="text-sm font-semibold text-green-600">
                - Dr. Anita Patel, RN
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <FaHospital className="text-3xl icon-danger mr-3" />
                <div>
                  <h3 className="font-semibold">Apollo Hospitals Network</h3>
                  <p className="text-sm text-gray-600">Post-acute care partnership</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Partnering with ElderCare AI for post-discharge monitoring reduced our 
                30-day readmission rate from 22% to 12%. The continuous monitoring ensures 
                patients recover properly after leaving our hospital."
              </p>
              <p className="text-sm font-semibold text-red-600">
                - Dr. Vijay Kumar, Chief Medical Officer
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
              Find Out How We Can Help You
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Whatever your role in elder care, we have a solution tailored for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                Get Personalized Demo
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-block">
                Speak With Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}