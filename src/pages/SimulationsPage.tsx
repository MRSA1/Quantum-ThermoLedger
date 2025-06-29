import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings, Download, Zap, Thermometer } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const SimulationsPage = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [simulationType, setSimulationType] = useState('quantum')
  const [simulationData, setSimulationData] = useState([])
  const [parameters, setParameters] = useState({
    temperature: 298,
    pressure: 1.0,
    energyLevel: 1,
    particleCount: 1000
  })

  // Simulate quantum transitions
  const generateQuantumData = () => {
    const data = []
    for (let i = 0; i < 100; i++) {
      const time = i * 0.1
      const energy = Math.sin(time * 2) * Math.exp(-time * 0.1) + Math.random() * 0.1
      const probability = Math.abs(energy) * 0.8 + 0.2
      data.push({
        time: time.toFixed(1),
        energy: energy.toFixed(3),
        probability: probability.toFixed(3),
        transitions: Math.floor(Math.random() * 50) + 10
      })
    }
    return data
  }

  // Simulate thermodynamic states
  const generateThermoData = () => {
    const data = []
    for (let i = 0; i < 100; i++) {
      const time = i * 0.1
      const temp = parameters.temperature + Math.sin(time * 0.5) * 50 + Math.random() * 10
      const entropy = Math.log(temp / 273) + Math.random() * 0.1
      const enthalpy = temp * 0.1 + Math.random() * 5
      data.push({
        time: time.toFixed(1),
        temperature: temp.toFixed(1),
        entropy: entropy.toFixed(3),
        enthalpy: enthalpy.toFixed(2)
      })
    }
    return data
  }

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        if (simulationType === 'quantum') {
          setSimulationData(generateQuantumData())
        } else {
          setSimulationData(generateThermoData())
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRunning, simulationType, parameters])

  const handleStart = () => {
    setIsRunning(true)
    if (simulationType === 'quantum') {
      setSimulationData(generateQuantumData())
    } else {
      setSimulationData(generateThermoData())
    }
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSimulationData([])
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(simulationData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${simulationType}_simulation_${Date.now()}.json`
    link.click()
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
          <h1 className="text-4xl font-bold text-white mb-2">Quantum & Thermodynamic Simulations</h1>
          <p className="text-gray-300">Run advanced physics simulations to validate energy transitions</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-effect p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Simulation Controls
            </h3>

            {/* Simulation Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Simulation Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSimulationType('quantum')}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    simulationType === 'quantum'
                      ? 'bg-quantum-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Zap className="h-4 w-4 mx-auto mb-1" />
                  Quantum
                </button>
                <button
                  onClick={() => setSimulationType('thermo')}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    simulationType === 'thermo'
                      ? 'bg-thermo-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Thermometer className="h-4 w-4 mx-auto mb-1" />
                  Thermodynamic
                </button>
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temperature (K)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={parameters.temperature}
                  onChange={(e) => setParameters(prev => ({ ...prev, temperature: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-white text-sm mt-1">{parameters.temperature} K</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pressure (atm)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={parameters.pressure}
                  onChange={(e) => setParameters(prev => ({ ...prev, pressure: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-white text-sm mt-1">{parameters.pressure} atm</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Energy Level
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={parameters.energyLevel}
                  onChange={(e) => setParameters(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-white text-sm mt-1">n = {parameters.energyLevel}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Particle Count
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={parameters.particleCount}
                  onChange={(e) => setParameters(prev => ({ ...prev, particleCount: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-white text-sm mt-1">{parameters.particleCount.toLocaleString()}</div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              <button
                onClick={isRunning ? handleStop : handleStart}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                  isRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Stop Simulation
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start Simulation
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </button>

              {simulationData.length > 0 && (
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export Data
                </button>
              )}
            </div>
          </motion.div>

          {/* Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-effect p-4 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-white font-medium">
                    {isRunning ? 'Simulation Running' : 'Simulation Stopped'}
                  </span>
                </div>
                <div className="text-gray-300 text-sm">
                  {simulationType === 'quantum' ? 'Quantum Mechanics' : 'Thermodynamics'}
                </div>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-effect p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {simulationType === 'quantum' ? 'Quantum Energy States' : 'Thermodynamic Properties'}
              </h3>
              
              {simulationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={simulationData}>
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
                    {simulationType === 'quantum' ? (
                      <>
                        <Line 
                          type="monotone" 
                          dataKey="energy" 
                          stroke="#0ea5e9" 
                          strokeWidth={2}
                          name="Energy (eV)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="probability" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Probability"
                        />
                      </>
                    ) : (
                      <>
                        <Line 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          name="Temperature (K)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="entropy" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          name="Entropy (J/K)"
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-400 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p>Start a simulation to see real-time data visualization</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Results Summary */}
            {simulationData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass-effect p-6 rounded-xl"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Simulation Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {simulationType === 'quantum' ? (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-quantum-400">
                          {simulationData[simulationData.length - 1]?.energy || '0'}
                        </div>
                        <div className="text-gray-300 text-sm">Energy (eV)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {simulationData[simulationData.length - 1]?.probability || '0'}
                        </div>
                        <div className="text-gray-300 text-sm">Probability</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {simulationData[simulationData.length - 1]?.transitions || '0'}
                        </div>
                        <div className="text-gray-300 text-sm">Transitions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {simulationData.length}
                        </div>
                        <div className="text-gray-300 text-sm">Data Points</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-thermo-400">
                          {simulationData[simulationData.length - 1]?.temperature || '0'}
                        </div>
                        <div className="text-gray-300 text-sm">Temperature (K)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {simulationData[simulationData.length - 1]?.entropy || '0'}
                        </div>
                        <div className="text-gray-300 text-sm">Entropy (J/K)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {simulationData[simulationData.length - 1]?.enthalpy || '0'}
                        </div>
                        <div className="text-gray-300 text-sm">Enthalpy (kJ)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {simulationData.length}
                        </div>
                        <div className="text-gray-300 text-sm">Data Points</div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimulationsPage