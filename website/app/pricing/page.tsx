'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCheck, FaTimes } from 'react-icons/fa'
import Link from 'next/link'

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  const plans = [
    {
      name: "Starter",
      subtitle: "For small facilities",
      monthlyPrice: 25000,
      annualPrice: 250000,
      residents: "Up to 50 residents",
      features: [
        "AI Health Monitoring",
        "Fall Detection",
        "Basic Analytics Dashboard",
        "Mobile App for Staff",
        "Email Support",
        "Monthly Reports"
      ],
      notIncluded: [
        "Predictive Analytics",
        "Family Portal",
        "API Access",
        "Custom Integrations"
      ],
      cta: "Start Free Trial",
      highlighted: false
    },
    {
      name: "Professional",
      subtitle: "Most popular choice",
      monthlyPrice: 50000,
      annualPrice: 500000,
      residents: "51-200 residents",
      features: [
        "Everything in Starter",
        "Predictive Analytics (72hr)",
        "Medication Management",
        "Family Portal Access",
        "Priority Support",
        "Weekly Reports",
        "Staff Training (Quarterly)",
        "Custom Alerts"
      ],
      notIncluded: [
        "API Access",
        "Custom Integrations",
        "White Labeling"
      ],
      cta: "Start Free Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      subtitle: "For large facilities",
      monthlyPrice: 100000,
      annualPrice: 1000000,
      residents: "200+ residents",
      features: [
        "Everything in Professional",
        "Advanced Predictive Analytics",
        "API Access",
        "Custom Integrations",
        "Dedicated Account Manager",
        "24/7 Phone Support",
        "Daily Reports",
        "Monthly Staff Training",
        "Custom Features",
        "Multi-facility Management"
      ],
      notIncluded: [],
      cta: "Contact Sales",
      highlighted: false
    }
  ]

  const addOns = [
    {
      name: "Additional Residents",
      price: "₹500/resident/month",
      description: "Add more residents beyond your plan limit"
    },
    {
      name: "White Labeling",
      price: "₹25,000/month",
      description: "Custom branding for your facility"
    },
    {
      name: "Advanced Training",
      price: "₹15,000/session",
      description: "On-site training for your staff"
    },
    {
      name: "Custom Integration",
      price: "Custom Quote",
      description: "Integrate with your existing systems"
    }
  ]

  const faqs = [
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 30-day free trial for all plans. No credit card required to start."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
    },
    {
      question: "What kind of support do you provide?",
      answer: "All plans include email support. Professional plans get priority support, and Enterprise plans get 24/7 phone support with a dedicated account manager."
    },
    {
      question: "How quickly can we get started?",
      answer: "Most facilities are up and running within 7 days. Our team handles the entire setup process including hardware installation and staff training."
    },
    {
      question: "Do you provide hardware?",
      answer: "Yes, we provide all necessary IoT sensors and monitoring devices. Hardware cost is included in the setup fee."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption, comply with HIPAA standards, and store all data in secure Indian data centers."
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
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your facility. All plans include setup, 
              training, and ongoing support. No hidden fees.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white rounded-lg shadow-md p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-md transition-all ${
                  billingCycle === 'annual' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Save 17%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl ${
                  plan.highlighted 
                    ? 'shadow-2xl border-2 border-primary-500 scale-105' 
                    : 'shadow-xl border border-gray-200'
                } bg-white overflow-hidden`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-center py-2 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className={`p-8 ${plan.highlighted ? 'pt-14' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.subtitle}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      ₹{billingCycle === 'monthly' 
                        ? plan.monthlyPrice.toLocaleString('en-IN')
                        : Math.round(plan.annualPrice / 12).toLocaleString('en-IN')}
                    </span>
                    <span className="text-gray-600">/month</span>
                    {billingCycle === 'annual' && (
                      <p className="text-sm text-green-600 mt-2">
                        ₹{plan.annualPrice.toLocaleString('en-IN')}/year
                      </p>
                    )}
                  </div>
                  
                  <p className="text-primary-600 font-semibold mb-6">{plan.residents}</p>
                  
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start opacity-50">
                        <FaTimes className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    href={plan.name === 'Enterprise' ? '/contact' : '/demo'}
                    className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600">
              All plans include: One-time setup fee of ₹50,000 • Hardware included • 
              Staff training • Data migration support
            </p>
          </motion.div>
        </div>
      </section>

      {/* Add-ons Section */}
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
              Customize with <span className="gradient-text">Add-ons</span>
            </h2>
            <p className="text-xl text-gray-600">
              Enhance your plan with additional features and services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {addOns.map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{addon.name}</h3>
                    <p className="text-gray-600">{addon.description}</p>
                  </div>
                  <span className="text-primary-600 font-semibold whitespace-nowrap ml-4">
                    {addon.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Calculate Your Return on Investment
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Most facilities see ROI within 6 months. Find out how much you can save.
            </p>
            <Link href="/roi-calculator" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
              Calculate ROI
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 500+ facilities already transforming elder care with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-primary inline-block">
                Start 30-Day Free Trial
              </Link>
              <Link href="/contact" className="btn-secondary inline-block">
                Talk to Sales Team
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              No credit card required • Cancel anytime • Full support included
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}