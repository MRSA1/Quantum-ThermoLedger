import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  FileText, 
  Download,
  Copy,
  ExternalLink
} from 'lucide-react'

const ContractsPage = () => {
  const [selectedContract, setSelectedContract] = useState('quantum_validator')
  const [deploymentStatus, setDeploymentStatus] = useState('deployed')

  const contracts = [
    {
      id: 'quantum_validator',
      name: 'Quantum Energy Validator',
      description: 'Validates quantum energy transitions using Planck\'s equation and energy conservation laws',
      language: 'Rust',
      version: '1.2.0',
      status: 'deployed',
      gasUsed: '2,847,392',
      lastUpdated: '2025-01-02'
    },
    {
      id: 'thermo_state_tracker',
      name: 'Thermodynamic State Tracker',
      description: 'Tracks phase transitions and ensures compliance with thermodynamic laws',
      language: 'Rust',
      version: '1.1.5',
      status: 'deployed',
      gasUsed: '1,923,847',
      lastUpdated: '2024-12-28'
    },
    {
      id: 'energy_ledger',
      name: 'Energy Ledger Manager',
      description: 'Manages the immutable ledger of all energy state changes and validations',
      language: 'Rust',
      version: '2.0.1',
      status: 'testing',
      gasUsed: '3,456,789',
      lastUpdated: '2025-01-01'
    },
    {
      id: 'consensus_validator',
      name: 'Consensus Validator',
      description: 'Implements consensus mechanism for peer-to-peer validation of state changes',
      language: 'Rust',
      version: '1.0.8',
      status: 'deployed',
      gasUsed: '1,234,567',
      lastUpdated: '2024-12-30'
    }
  ]

  const contractCode: Record<string, string> = {
    quantum_validator: `use serde::{Deserialize, Serialize};
use fabric_contract_api::contract::Contract;
use fabric_contract_api::info::Info;

#[derive(Serialize, Deserialize, Debug)]
pub struct QuantumTransition {
    pub electron_id: String,
    pub initial_energy: f64,
    pub final_energy: f64,
    pub photon_energy: f64,
    pub timestamp: u64,
    pub validated: bool,
}

#[derive(Info)]
pub struct QuantumValidator;

impl Contract for QuantumValidator {
    fn new() -> Self {
        QuantumValidator
    }
}

impl QuantumValidator {
    /// Validates quantum energy transition using Planck's equation
    /// E = hf where h is Planck's constant and f is frequency
    pub fn validate_transition(
        &self,
        transition: &QuantumTransition
    ) -> Result<bool, String> {
        const PLANCK_CONSTANT: f64 = 6.62607015e-34; // J⋅s
        const SPEED_OF_LIGHT: f64 = 299792458.0; // m/s
        
        // Calculate expected photon energy
        let energy_diff = (transition.final_energy - transition.initial_energy).abs();
        
        // Validate energy conservation
        let tolerance = 1e-15; // eV
        if (transition.photon_energy - energy_diff).abs() > tolerance {
            return Err("Energy conservation violation".to_string());
        }
        
        // Validate quantum selection rules
        if !self.check_selection_rules(transition) {
            return Err("Quantum selection rules violated".to_string());
        }
        
        Ok(true)
    }
    
    fn check_selection_rules(&self, transition: &QuantumTransition) -> bool {
        // Implement quantum selection rules (Δl = ±1, Δj = 0, ±1)
        // Simplified validation for demonstration
        transition.initial_energy > 0.0 && transition.final_energy > 0.0
    }
}`,
    thermo_state_tracker: `use serde::{Deserialize, Serialize};
use fabric_contract_api::contract::Contract;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum PhaseState {
    Solid,
    Liquid,
    Gas,
    Plasma,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ThermodynamicState {
    pub substance_id: String,
    pub temperature: f64, // Kelvin
    pub pressure: f64,    // Pascal
    pub phase: PhaseState,
    pub entropy: f64,     // J/K
    pub enthalpy: f64,    // J
    pub gibbs_energy: f64, // J
    pub timestamp: u64,
}

pub struct ThermoStateTracker;

impl Contract for ThermoStateTracker {
    fn new() -> Self {
        ThermoStateTracker
    }
}

impl ThermoStateTracker {
    /// Validates thermodynamic state transition
    pub fn validate_state_change(
        &self,
        initial_state: &ThermodynamicState,
        final_state: &ThermodynamicState
    ) -> Result<bool, String> {
        // Check second law of thermodynamics (entropy increase)
        if final_state.entropy < initial_state.entropy {
            return Err("Second law violation: entropy decrease".to_string());
        }
        
        // Validate Gibbs free energy for phase transitions
        if !self.validate_gibbs_energy(initial_state, final_state) {
            return Err("Invalid Gibbs free energy change".to_string());
        }
        
        // Check phase transition validity
        if !self.is_valid_phase_transition(&initial_state.phase, &final_state.phase) {
            return Err("Invalid phase transition".to_string());
        }
        
        Ok(true)
    }
    
    fn validate_gibbs_energy(
        &self,
        initial: &ThermodynamicState,
        final: &ThermodynamicState
    ) -> bool {
        // G = H - TS
        let initial_g = initial.enthalpy - initial.temperature * initial.entropy;
        let final_g = final.enthalpy - final.temperature * final.entropy;
        
        // For spontaneous processes, ΔG < 0
        (final_g - initial_g) <= 0.0
    }
    
    fn is_valid_phase_transition(&self, from: &PhaseState, to: &PhaseState) -> bool {
        match (from, to) {
            (PhaseState::Solid, PhaseState::Liquid) => true,  // Melting
            (PhaseState::Liquid, PhaseState::Solid) => true,  // Freezing
            (PhaseState::Liquid, PhaseState::Gas) => true,    // Vaporization
            (PhaseState::Gas, PhaseState::Liquid) => true,    // Condensation
            (PhaseState::Solid, PhaseState::Gas) => true,     // Sublimation
            (PhaseState::Gas, PhaseState::Solid) => true,     // Deposition
            (PhaseState::Gas, PhaseState::Plasma) => true,    // Ionization
            (PhaseState::Plasma, PhaseState::Gas) => true,    // Recombination
            _ => from == to, // Same phase is always valid
        }
    }
}`
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const handleDeploy = () => {
    // Simulate deployment
    setDeploymentStatus('deploying')
    setTimeout(() => {
      setDeploymentStatus('deployed')
    }, 3000)
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
          <h1 className="text-4xl font-bold text-white mb-2">Smart Contracts</h1>
          <p className="text-gray-300">Rust-powered smart contracts for quantum and thermodynamic validation</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contract List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-effect p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Deployed Contracts
            </h3>

            <div className="space-y-4">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  onClick={() => setSelectedContract(contract.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedContract === contract.id
                      ? 'bg-quantum-600/20 border border-quantum-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">{contract.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      contract.status === 'deployed' 
                        ? 'bg-green-500/20 text-green-400'
                        : contract.status === 'testing'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {contract.status}
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{contract.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{contract.language} v{contract.version}</span>
                    <span>{contract.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contract Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contract Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-effect p-6 rounded-xl"
            >
              {(() => {
                const contract = contracts.find(c => c.id === selectedContract)
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-semibold text-white">{contract?.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          contract?.status === 'deployed' 
                            ? 'bg-green-500/20 text-green-400'
                            : contract?.status === 'testing'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {contract?.status === 'deployed' && <CheckCircle className="inline h-4 w-4 mr-1" />}
                          {contract?.status === 'testing' && <AlertTriangle className="inline h-4 w-4 mr-1" />}
                          {contract?.status}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6">{contract?.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{contract?.language}</div>
                        <div className="text-gray-400 text-sm">Language</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">v{contract?.version}</div>
                        <div className="text-gray-400 text-sm">Version</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{contract?.gasUsed}</div>
                        <div className="text-gray-400 text-sm">Gas Used</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{contract?.lastUpdated}</div>
                        <div className="text-gray-400 text-sm">Last Updated</div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleDeploy()}
                        disabled={deploymentStatus === 'deploying' || contract?.status === 'deployed'}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                          deploymentStatus === 'deploying' || contract?.status === 'deployed'
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {deploymentStatus === 'deploying' ? 'Deploying...' : (contract?.status === 'deployed' ? 'Deployed' : 'Deploy')}
                      </button>
                      <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">
                        <FileText className="mr-2 h-4 w-4" />
                        View ABI
                      </button>
                      <button className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Explorer
                      </button>
                    </div>
                  </>
                )
              })()}
            </motion.div>

            {/* Contract Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-effect p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Contract Source Code
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopyCode(contractCode[selectedContract])}
                    className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-all"
                  >
                    <Copy className="mr-1 h-4 w-4" />
                    Copy
                  </button>
                  <button className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-all">
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{contractCode[selectedContract] || '// Contract code not available'}</code>
                </pre>
              </div>
            </motion.div>

            {/* Contract Interactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-effect p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Recent Interactions</h3>
              <div className="space-y-3">
                {[
                  { method: 'validate_transition', caller: '0x1a2b3c...', gas: '45,892', status: 'success', time: '2 min ago' },
                  { method: 'validate_state_change', caller: '0x4d5e6f...', gas: '38,472', status: 'success', time: '5 min ago' },
                  { method: 'check_selection_rules', caller: '0x7g8h9i...', gas: '12,345', status: 'failed', time: '8 min ago' },
                  { method: 'validate_gibbs_energy', caller: '0xjklmno...', gas: '29,876', status: 'success', time: '12 min ago' }
                ].map((interaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        interaction.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <div>
                        <div className="text-white font-medium text-sm">{interaction.method}</div>
                        <div className="text-gray-400 text-xs">{interaction.caller}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">{interaction.gas} gas</div>
                      <div className="text-gray-400 text-xs">{interaction.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractsPage