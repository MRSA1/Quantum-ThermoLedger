import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Shield, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

const DashboardPage = () => {
  const [realTimeData, setRealTimeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate real-time data updates
  useEffect(() => {
    const generateData = () => {
      const data = []
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}:00`,
          quantumTransitions: Math.floor(Math.random() * 1000) + 500,
          thermoStates: Math.floor(Math.random() * 200) + 100,
          validations: Math.floor(Math.random() * 50) + 20
        })
      }
      return data
    }

    setRealTimeData(generateData())
    setIsLoading(false)

    const interval = setInterval(() => {
      setRealTimeData(generateData())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const metrics = [
    {
      title: 'Active Quantum States',
      value: '1,247',
      change: '+12.5%',
      icon: Zap,
      color: 'text-quantum-400',
      bgColor: 'bg-quantum-500/10'
    },
    {
      title: 'Thermodynamic Validations',
      value: '892',
      change: '+8.3%',
      icon: Thermometer,
      color: 'text-thermo-400',
      bgColor: 'bg-thermo-500/10'
    },
    {
      title: 'Smart Contracts',
      value: '156',
      change: '+5.2%',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Network Health',
      value: '99.8%',
      change: '+0.1%',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    }
  ]

  const phaseDistribution = [
    { name: 'Solid', value: 35, color: '#3b82f6' },
    { name: 'Liquid', value: 28, color: '#06b6d4' },
    { name: 'Gas', value: 25, color: '#10b981' },
    { name: 'Plasma', value: 12, color: '#f59e0b' }
  ]

  const recentTransactions = [
    {
      id: '0x1a2b3c...',
      type: 'Quantum Transition',
      energy: '2.18 eV',
      status: 'validated',
      timestamp: '2 min ago'
    },
    {
      id: '0x4d5e6f...',
      type: 'Phase Change',
      energy: '334 kJ/mol',
      status: 'pending',
      timestamp: '5 min ago'
    },
    {
      id: '0x7g8h9i...',
      type: 'Energy Validation',
      energy: '1.96 eV',
      status: 'validated',
      timestamp: '8 min ago'
    },
    {
      id: '0xjklmno...',
      type: 'State Transition',
      energy: '40.7 kJ/mol',
      status: 'failed',
      timestamp: '12 min ago'
    }
  ]

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-quantum-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading quantum data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">System Dashboard</h1>
          <p className="text-gray-300">Real-time monitoring of quantum and thermodynamic validations</p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-effect p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {metric.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-gray-300 text-sm">{metric.title}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Real-time Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-effect p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Real-time Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantumTransitions" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  name="Quantum Transitions"
                />
                <Line 
                  type="monotone" 
                  dataKey="thermoStates" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Thermo States"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Phase Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-effect p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Phase Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={phaseDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {phaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-effect p-6 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((tx, index) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    tx.status === 'validated' ? 'bg-green-500/20' :
                    tx.status === 'pending' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    {tx.status === 'validated' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : tx.status === 'pending' ? (
                      <Clock className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium">{tx.type}</div>
                    <div className="text-gray-400 text-sm">{tx.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{tx.energy}</div>
                  <div className="text-gray-400 text-sm">{tx.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage