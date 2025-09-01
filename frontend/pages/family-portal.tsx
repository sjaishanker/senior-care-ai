import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface Subscription {
  id: number
  subscription_type: string
  monthly_fee: number
  start_date: string
  is_active: boolean
  auto_renewal: boolean
  next_billing_date: string
}

interface FamilyPortalStats {
  total_alerts_this_month: number
  emergency_incidents: number
  medication_adherence: number
  family_satisfaction: number
  last_communication: string
}

export default function FamilyPortal() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [stats, setStats] = useState<FamilyPortalStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFamilyData()
  }, [])

  const fetchFamilyData = async () => {
    try {
      // In a real app, this would be based on authenticated user
      const [subscriptionRes, statsRes] = await Promise.all([
        axios.get('/api/compliance/family-subscriptions'),
        axios.get('/api/compliance/family-stats')
      ])
      
      if (subscriptionRes.data.length > 0) {
        setSubscription(subscriptionRes.data[0])
      }
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error fetching family data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'enterprise': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'premium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'basic': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading family portal...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Family Portal</h1>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Subscription Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Subscription Status</h2>
            {subscription && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSubscriptionColor(subscription.subscription_type)}`}>
                {subscription.subscription_type.charAt(0).toUpperCase() + subscription.subscription_type.slice(1)} Plan
              </span>
            )}
          </div>

          {subscription ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">${subscription.monthly_fee}</p>
                <p className="text-sm text-gray-600">Monthly Fee</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {subscription.is_active ? 'Active' : 'Inactive'}
                </p>
                <p className="text-sm text-gray-600">Status</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {subscription.auto_renewal ? 'Yes' : 'No'}
                </p>
                <p className="text-sm text-gray-600">Auto Renewal</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm font-bold text-orange-600">
                  {new Date(subscription.next_billing_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Next Billing</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-gray-600 mb-4">Subscribe to get premium family portal features</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Choose Subscription Plan
              </button>
            </div>
          )}
        </div>

        {/* Family Stats Dashboard */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Loved One's Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{stats.total_alerts_this_month}</p>
                <p className="text-sm text-gray-600">Alerts This Month</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{stats.emergency_incidents}</p>
                <p className="text-sm text-gray-600">Emergency Incidents</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.medication_adherence}%</p>
                <p className="text-sm text-gray-600">Medication Adherence</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.family_satisfaction}/5</p>
                <p className="text-sm text-gray-600">Care Satisfaction</p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Basic Plan */}
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Basic Plan</h3>
                <p className="text-3xl font-bold text-green-600">$10<span className="text-sm text-gray-600">/month</span></p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Daily health updates
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Basic alert notifications
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Monthly health reports
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Email communication
                </li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Choose Basic
              </button>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-blue-600 rounded-lg p-6 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Premium Plan</h3>
                <p className="text-3xl font-bold text-blue-600">$25<span className="text-sm text-gray-600">/month</span></p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="text-blue-600 mr-2">✓</span>
                  Everything in Basic
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-blue-600 mr-2">✓</span>
                  Real-time push notifications
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-blue-600 mr-2">✓</span>
                  Video calling with staff
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-blue-600 mr-2">✓</span>
                  Advanced health analytics
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-blue-600 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Choose Premium
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Enterprise Plan</h3>
                <p className="text-3xl font-bold text-purple-600">$50<span className="text-sm text-gray-600">/month</span></p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="text-purple-600 mr-2">✓</span>
                  Everything in Premium
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-purple-600 mr-2">✓</span>
                  24/7 emergency hotline
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-purple-600 mr-2">✓</span>
                  Personalized care insights
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-purple-600 mr-2">✓</span>
                  Family meeting scheduling
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-purple-600 mr-2">✓</span>
                  Custom reporting
                </li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                Choose Enterprise
              </button>
            </div>
          </div>
        </div>

        {/* Recent Communications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Communications</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium">Daily Health Update</p>
              <p className="text-sm text-gray-600">Your loved one had a good day today. All vitals are normal and they participated in afternoon activities.</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago • Nurse Sarah</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-medium">Medication Update</p>
              <p className="text-sm text-gray-600">Morning medications administered on time. No side effects observed.</p>
              <p className="text-xs text-gray-500 mt-1">Yesterday 9:00 AM • Nurse Mike</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="font-medium">Appointment Reminder</p>
              <p className="text-sm text-gray-600">Physical therapy session scheduled for tomorrow at 2:00 PM.</p>
              <p className="text-xs text-gray-500 mt-1">Yesterday 3:00 PM • Care Coordinator</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}