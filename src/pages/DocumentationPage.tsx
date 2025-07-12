import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Book, 
  Code, 
  Zap, 
  Thermometer, 
  Shield, 
  Database,
  ChevronRight,
  ExternalLink,
  Download,
  Search
} from 'lucide-react'

const DocumentationPage = () => {
  const [selectedSection, setSelectedSection] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Book,
      content: {
        title: 'Quantum ThermoLedger Overview',
        description: 'A comprehensive blockchain-based system for validating quantum energy transitions and thermodynamic state changes.',
        subsections: [
          {
            title: 'What is Quantum ThermoLedger?',
            content: `Quantum ThermoLedger is a revolutionary blockchain platform that combines principles of quantum mechanics, thermodynamics, and distributed ledger technology. It provides an immutable record of energy state changes and validates them against fundamental physical laws.

The system ensures that all recorded quantum transitions and thermodynamic processes comply with conservation laws, quantum selection rules, and thermodynamic principles, creating a trustworthy scientific validation platform.`
          },
          {
            title: 'Key Features',
            content: `• **Quantum Energy Validation**: Validates electron transitions using Planck's equation
• **Thermodynamic State Tracking**: Records phase transitions with law compliance
• **Rust Smart Contracts**: High-performance, memory-safe validation logic
• **Decentralized Verification**: Peer-to-peer validation using Hyperledger Fabric
• **Immutable Ledger**: Cryptographically secured transaction history
• **Real-time Monitoring**: Live dashboard for system metrics and validations`
          }
        ]
      }
    },
    {
      id: 'quantum',
      title: 'Quantum Mechanics',
      icon: Zap,
      content: {
        title: 'Quantum Energy Validation',
        description: 'Understanding how quantum transitions are validated using fundamental physics principles.',
        subsections: [
          {
            title: 'Planck\'s Equation',
            content: `The system validates quantum energy transitions using Planck's fundamental equation:

**E = hf**

Where:
- E = Energy of the photon (Joules)
- h = Planck's constant (6.62607015 × 10⁻³⁴ J⋅s)
- f = Frequency of electromagnetic radiation (Hz)

For electron transitions between energy levels:
**ΔE = E_final - E_initial = hf**

The smart contract ensures energy conservation by validating that the photon energy exactly matches the energy difference between quantum states.`
          },
          {
            title: 'Quantum Selection Rules',
            content: `The system enforces quantum mechanical selection rules for allowed transitions:

**Orbital Angular Momentum (l)**: Δl = ±1
**Total Angular Momentum (j)**: Δj = 0, ±1 (but j = 0 ↔ j = 0 forbidden)
**Magnetic Quantum Number (m)**: Δm = 0, ±1

These rules determine which electronic transitions are allowed and which are forbidden, ensuring physical accuracy in the validation process.`
          }
        ]
      }
    },
    {
      id: 'thermodynamics',
      title: 'Thermodynamics',
      icon: Thermometer,
      content: {
        title: 'Thermodynamic State Validation',
        description: 'How the system ensures compliance with thermodynamic laws and validates phase transitions.',
        subsections: [
          {
            title: 'Laws of Thermodynamics',
            content: `The system enforces all four laws of thermodynamics:

**Zeroth Law**: Thermal equilibrium validation
**First Law**: Energy conservation (ΔU = Q - W)
**Second Law**: Entropy increase validation (ΔS ≥ 0)
**Third Law**: Absolute zero entropy reference

Each thermodynamic process is validated against these fundamental principles before being recorded on the blockchain.`
          },
          {
            title: 'Gibbs Free Energy',
            content: `Phase transitions are validated using Gibbs free energy:

**G = H - TS**

Where:
- G = Gibbs free energy
- H = Enthalpy
- T = Temperature
- S = Entropy

For spontaneous processes: **ΔG < 0**

The smart contract calculates Gibbs free energy changes and ensures thermodynamic feasibility of recorded phase transitions.`
          }
        ]
      }
    },
    {
      id: 'smart-contracts',
      title: 'Smart Contracts',
      icon: Shield,
      content: {
        title: 'Rust-Powered Smart Contracts',
        description: 'Technical details about the smart contract implementation and validation logic.',
        subsections: [
          {
            title: 'Contract Architecture',
            content: `The smart contract system consists of four main components:

**QuantumValidator**: Validates quantum energy transitions
**ThermoStateTracker**: Tracks thermodynamic state changes
**EnergyLedgerManager**: Manages the immutable energy ledger
**ConsensusValidator**: Implements peer-to-peer validation

Each contract is written in Rust for memory safety and performance, deployed on Hyperledger Fabric.`
          }
        ]
      }
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      content: {
        title: 'API Documentation',
        description: 'Complete API reference for interacting with the Quantum ThermoLedger system.',
        subsections: [
          {
            title: 'REST Endpoints',
            content: `**Base URL**: \`https://api.quantum-thermoledger.com/v1\`

**Authentication**: Bearer token required for all endpoints

\`\`\`
GET /quantum/transitions
POST /quantum/validate
GET /thermo/states
POST /thermo/validate
GET /contracts/deployed
POST /contracts/invoke
GET /ledger/transactions
GET /metrics/realtime
\`\`\`

All endpoints return JSON responses with standardized error codes and messages.`
          }
        ]
      }
    },
    {
      id: 'deployment',
      title: 'Deployment',
      icon: Database,
      content: {
        title: 'Deployment Guide',
        description: 'Instructions for deploying and configuring the Quantum ThermoLedger system.',
        subsections: [
          {
            title: 'Prerequisites',
            content: `System requirements for deployment:

**Hardware**:
- CPU: 8+ cores, 3.0+ GHz
- RAM: 32+ GB
- Storage: 1+ TB SSD
- Network: 1+ Gbps connection

**Software**:
- Rust 1.70+
- Node.js 18+
- Python 3.9+
- Docker 20.10+
- Hyperledger Fabric 2.4+`
          }
        ]
      }
    }
  ]

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentSection = sections.find(s => s.id === selectedSection)

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
          <h1 className="text-4xl font-bold text-white mb-2">Documentation</h1>
          <p className="text-gray-300">Complete guide to Quantum ThermoLedger implementation and usage</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-quantum-400 focus:border-transparent"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-effect p-6 rounded-xl h-fit"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Contents</h3>
            <nav className="space-y-2">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all ${
                    selectedSection === section.id
                      ? 'bg-quantum-600/20 text-quantum-400 border border-quantum-400/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <section.icon className="mr-3 h-4 w-4" />
                  <span className="text-sm">{section.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </button>
              ))}
            </nav>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="https://github.com/MRSA1/Quantum-ThermoLedger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  GitHub Repository
                </a>
                <button className="flex items-center text-sm text-gray-300 hover:text-white transition-colors">
                  <Download className="mr-2 h-3 w-3" />
                  Download PDF
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={selectedSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-effect p-8 rounded-xl"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">{currentSection?.content.title}</h2>
                <p className="text-xl text-gray-300">{currentSection?.content.description}</p>
              </div>

              <div className="space-y-8">
                {currentSection?.content.subsections.map((subsection, index) => (
                  <div key={index} className="border-l-4 border-quantum-400 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-4">{subsection.title}</h3>
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {subsection.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
                <div>
                  {(() => {
                    const currentIndex = sections.findIndex(s => s.id === selectedSection)
                    const prevSection = sections[currentIndex - 1]
                    return prevSection ? (
                      <button
                        onClick={() => setSelectedSection(prevSection.id)}
                        className="flex items-center text-gray-300 hover:text-white transition-colors"
                      >
                        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                        Previous: {prevSection.title}
                      </button>
                    ) : null
                  })()}
                </div>
                <div>
                  {(() => {
                    const currentIndex = sections.findIndex(s => s.id === selectedSection)
                    const nextSection = sections[currentIndex + 1]
                    return nextSection ? (
                      <button
                        onClick={() => setSelectedSection(nextSection.id)}
                        className="flex items-center text-gray-300 hover:text-white transition-colors"
                      >
                        Next: {nextSection.title}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </button>
                    ) : null
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentationPage