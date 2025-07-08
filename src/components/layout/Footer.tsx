import { Github, ExternalLink, Atom, Thermometer } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass-effect mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Atom className="h-8 w-8 text-quantum-400" />
                <Thermometer className="h-4 w-4 text-thermo-400 absolute -bottom-1 -right-1" />
              </div>
              <span className="text-xl font-bold text-white">
                Quantum ThermoLedger
              </span>
            </div>
            <p className="text-gray-300 text-sm max-w-md">
              A blockchain-based system for validating quantum energy transitions 
              and thermodynamic state changes, combining cutting-edge physics with 
              distributed ledger technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/simulations" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Simulations
                </a>
              </li>
              <li>
                <a href="/contracts" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Smart Contracts
                </a>
              </li>
              <li>
                <a href="/docs" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/MRSA1/Quantum-ThermoLedger" 
                  className="text-gray-300 hover:text-white text-sm transition-colors flex items-center space-x-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Research Papers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Community Forum
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Quantum ThermoLedger. Licensed under MIT License.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Built with</span>
              <div className="flex items-center space-x-2">
                <span className="text-orange-400 text-sm font-medium">Rust</span>
                <span className="text-blue-400 text-sm font-medium">React</span>
                <span className="text-green-400 text-sm font-medium">Python</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer