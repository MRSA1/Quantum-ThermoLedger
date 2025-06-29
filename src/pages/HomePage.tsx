import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Atom, 
  Thermometer, 
  Shield, 
  Zap, 
  Database, 
  GitBranch,
  ArrowRight,
  Play,
  Code,
  BarChart3
} from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: Atom,
      title: 'Quantum Energy Validation',
      description: 'Track electron transitions and validate photon absorption/emission using Planck\'s equation.',
      color: 'text-quantum-400'
    },
    {
      icon: Thermometer,
      title: 'Thermodynamic State Tracking',
      description: 'Record phase transitions and ensure compliance with thermodynamic laws.',
      color: 'text-thermo-400'
    },
    {
      icon: Shield,
      title: 'Rust-Powered Smart Contracts',
      description: 'Mathematical models ensuring energy/state changes follow scientific laws.',
      color: 'text-orange-400'
    },
    {
      icon: Database,
      title: 'Decentralized Verification',
      description: 'Hyperledger Fabric for peer-to-peer validation with cryptographic security.',
      color: 'text-green-400'
    }
  ]

  const stats = [
    { label: 'Quantum Transitions Validated', value: '1,247,892', icon: Zap },
    { label: 'Thermodynamic States Tracked', value: '89,432', icon: Thermometer },
    { label: 'Smart Contracts Deployed', value: '156', icon: Code },
    { label: 'Network Nodes Active', value: '42', icon: GitBranch }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Atom className="h-20 w-20 text-quantum-400 quantum-pulse" />
                  <Thermometer className="h-10 w-10 text-thermo-400 absolute -bottom-2 -right-2 float-animation" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Quantum
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-thermo-400">
                  {' '}ThermoLedger
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Blockchain-based validation of quantum energy transitions and thermodynamic 
                state changes, bridging physics and distributed ledger technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-quantum-600 to-quantum-500 text-white font-semibold rounded-lg hover:from-quantum-700 hover:to-quantum-600 transition-all duration-300 quantum-glow"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/simulations"
                className="inline-flex items-center px-8 py-4 glass-effect text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Run Simulations
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-quantum-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-thermo-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect p-6 rounded-xl text-center"
              >
                <stat.icon className="h-8 w-8 text-quantum-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Combining quantum mechanics, thermodynamics, and blockchain technology 
              to create an immutable ledger for scientific validation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="glass-effect p-8 rounded-xl hover:bg-white/15 transition-all duration-300"
              >
                <feature.icon className={`h-12 w-12 ${feature.color} mb-6`} />
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leveraging the best tools and frameworks for quantum computing, 
              blockchain, and scientific simulation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="glass-effect p-8 rounded-xl text-center"
            >
              <div className="text-orange-400 text-6xl font-bold mb-4">Rust</div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Contracts</h3>
              <p className="text-gray-300">High-performance, memory-safe smart contracts for Hyperledger Fabric</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-effect p-8 rounded-xl text-center"
            >
              <div className="text-blue-400 text-6xl font-bold mb-4">React</div>
              <h3 className="text-xl font-semibold text-white mb-2">Frontend</h3>
              <p className="text-gray-300">Modern, responsive interface for data visualization and interaction</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-effect p-8 rounded-xl text-center"
            >
              <div className="text-green-400 text-6xl font-bold mb-4">Python</div>
              <h3 className="text-xl font-semibold text-white mb-2">Simulations</h3>
              <p className="text-gray-300">Scientific computing and quantum/thermodynamic modeling</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-effect p-12 rounded-2xl"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Explore Quantum Blockchain?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the future of scientific validation with our cutting-edge platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/simulations"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-quantum-600 to-quantum-500 text-white font-semibold rounded-lg hover:from-quantum-700 hover:to-quantum-600 transition-all duration-300 quantum-glow"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Simulation
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center px-8 py-4 glass-effect text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <Code className="mr-2 h-5 w-5" />
                View Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage