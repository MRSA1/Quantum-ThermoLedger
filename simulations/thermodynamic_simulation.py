#!/usr/bin/env python3
"""
Thermodynamic State Simulation

This module simulates thermodynamic processes and phase transitions,
validating them against fundamental thermodynamic laws.
"""

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from scipy import constants, optimize
from scipy.integrate import odeint
import json
from datetime import datetime
from typing import List, Dict, Tuple, Optional

class ThermodynamicSimulator:
    """Simulates thermodynamic processes and validates against physical laws."""
    
    def __init__(self):
        # Physical constants
        self.R = constants.R  # Gas constant (J/(mol⋅K))
        self.k = constants.k  # Boltzmann constant (J/K)
        self.N_A = constants.N_A  # Avogadro number (mol⁻¹)
        self.sigma = constants.Stefan_Boltzmann  # Stefan-Boltzmann constant
        
        # Standard conditions
        self.STP_T = 273.15  # K
        self.STP_P = 101325  # Pa
        
    def ideal_gas_law(self, P: float = None, V: float = None, n: float = None, 
                     T: float = None) -> float:
        """
        Calculate missing parameter using ideal gas law: PV = nRT
        
        Args:
            P: Pressure (Pa)
            V: Volume (m³)
            n: Amount of substance (mol)
            T: Temperature (K)
            
        Returns:
            Missing parameter value
        """
        known_params = sum(x is not None for x in [P, V, n, T])
        if known_params != 3:
            raise ValueError("Exactly three parameters must be provided")
        
        if P is None:
            return n * self.R * T / V
        elif V is None:
            return n * self.R * T / P
        elif n is None:
            return P * V / (self.R * T)
        elif T is None:
            return P * V / (n * self.R)
    
    def calculate_entropy_change(self, T1: float, T2: float, P1: float, P2: float,
                               Cp: float = 29.1) -> float:
        """
        Calculate entropy change for ideal gas.
        
        Args:
            T1, T2: Initial and final temperatures (K)
            P1, P2: Initial and final pressures (Pa)
            Cp: Heat capacity at constant pressure (J/(mol⋅K))
            
        Returns:
            Entropy change (J/(mol⋅K))
        """
        delta_S_T = Cp * np.log(T2 / T1)
        delta_S_P = -self.R * np.log(P2 / P1)
        return delta_S_T + delta_S_P
    
    def calculate_gibbs_energy(self, H: float, T: float, S: float) -> float:
        """
        Calculate Gibbs free energy: G = H - TS
        
        Args:
            H: Enthalpy (J/mol)
            T: Temperature (K)
            S: Entropy (J/(mol⋅K))
            
        Returns:
            Gibbs free energy (J/mol)
        """
        return H - T * S
    
    def van_der_waals_equation(self, P: float, V: float, T: float, n: float = 1.0,
                              a: float = 0.244, b: float = 2.67e-5) -> float:
        """
        Van der Waals equation of state for real gases.
        
        Args:
            P: Pressure (Pa)
            V: Volume (m³)
            T: Temperature (K)
            n: Amount of substance (mol)
            a, b: Van der Waals constants (default for CO₂)
            
        Returns:
            Pressure correction or residual
        """
        # (P + a*n²/V²)(V - nb) = nRT
        V_m = V / n  # Molar volume
        P_ideal = n * self.R * T / V
        P_correction = a * n**2 / V**2
        V_correction = n * b
        
        return P_ideal - P_correction - P * (1 - V_correction / V)
    
    def simulate_isothermal_process(self, P1: float, V1: float, V2: float, 
                                  T: float, n: float = 1.0) -> Dict:
        """
        Simulate isothermal process for ideal gas.
        
        Args:
            P1: Initial pressure (Pa)
            V1: Initial volume (m³)
            V2: Final volume (m³)
            T: Temperature (K)
            n: Amount of substance (mol)
            
        Returns:
            Process data dictionary
        """
        # For isothermal process: PV = constant
        P2 = P1 * V1 / V2
        
        # Work done: W = nRT ln(V2/V1)
        W = n * self.R * T * np.log(V2 / V1)
        
        # For isothermal process: ΔU = 0, so Q = W
        Q = W
        delta_U = 0
        
        # Entropy change
        delta_S = n * self.R * np.log(V2 / V1)
        
        return {
            'process_type': 'isothermal',
            'initial_state': {'P': P1, 'V': V1, 'T': T},
            'final_state': {'P': P2, 'V': V2, 'T': T},
            'work_done': W,
            'heat_added': Q,
            'internal_energy_change': delta_U,
            'entropy_change': delta_S,
            'temperature': T
        }
    
    def simulate_adiabatic_process(self, P1: float, V1: float, V2: float,
                                 T1: float, gamma: float = 1.4, n: float = 1.0) -> Dict:
        """
        Simulate adiabatic process for ideal gas.
        
        Args:
            P1: Initial pressure (Pa)
            V1: Initial volume (m³)
            V2: Final volume (m³)
            T1: Initial temperature (K)
            gamma: Heat capacity ratio (Cp/Cv)
            n: Amount of substance (mol)
            
        Returns:
            Process data dictionary
        """
        # For adiabatic process: PV^γ = constant, TV^(γ-1) = constant
        P2 = P1 * (V1 / V2)**gamma
        T2 = T1 * (V1 / V2)**(gamma - 1)
        
        # Work done: W = (P1V1 - P2V2) / (γ - 1)
        W = (P1 * V1 - P2 * V2) / (gamma - 1)
        
        # For adiabatic process: Q = 0
        Q = 0
        
        # Internal energy change: ΔU = nCvΔT
        Cv = self.R / (gamma - 1)
        delta_U = n * Cv * (T2 - T1)
        
        # Entropy change (should be zero for reversible adiabatic)
        delta_S = 0
        
        return {
            'process_type': 'adiabatic',
            'initial_state': {'P': P1, 'V': V1, 'T': T1},
            'final_state': {'P': P2, 'V': V2, 'T': T2},
            'work_done': W,
            'heat_added': Q,
            'internal_energy_change': delta_U,
            'entropy_change': delta_S,
            'gamma': gamma
        }
    
    def simulate_phase_transition(self, substance: str = "water", 
                                transition_type: str = "melting") -> Dict:
        """
        Simulate phase transition with thermodynamic properties.
        
        Args:
            substance: Substance name
            transition_type: Type of phase transition
            
        Returns:
            Phase transition data
        """
        # Water properties (example)
        if substance.lower() == "water":
            if transition_type == "melting":
                T_transition = 273.15  # K
                P_transition = 101325  # Pa
                delta_H = 334000  # J/kg (latent heat of fusion)
                delta_S = delta_H / T_transition  # J/(kg⋅K)
                
                initial_phase = "solid"
                final_phase = "liquid"
                
            elif transition_type == "vaporization":
                T_transition = 373.15  # K
                P_transition = 101325  # Pa
                delta_H = 2260000  # J/kg (latent heat of vaporization)
                delta_S = delta_H / T_transition  # J/(kg⋅K)
                
                initial_phase = "liquid"
                final_phase = "gas"
            else:
                raise ValueError("Unsupported transition type")
        else:
            raise ValueError("Unsupported substance")
        
        # Calculate Gibbs free energy change
        delta_G = delta_H - T_transition * delta_S
        
        return {
            'substance': substance,
            'transition_type': transition_type,
            'initial_phase': initial_phase,
            'final_phase': final_phase,
            'transition_temperature': T_transition,
            'transition_pressure': P_transition,
            'enthalpy_change': delta_H,
            'entropy_change': delta_S,
            'gibbs_energy_change': delta_G,
            'is_spontaneous': delta_G < 0
        }
    
    def carnot_cycle_efficiency(self, T_hot: float, T_cold: float) -> float:
        """
        Calculate Carnot cycle efficiency.
        
        Args:
            T_hot: Hot reservoir temperature (K)
            T_cold: Cold reservoir temperature (K)
            
        Returns:
            Efficiency (0-1)
        """
        return 1 - T_cold / T_hot
    
    def simulate_carnot_cycle(self, T_hot: float, T_cold: float, V1: float, V2: float,
                            V3: float, V4: float, n: float = 1.0, gamma: float = 1.4) -> Dict:
        """
        Simulate complete Carnot cycle.
        
        Args:
            T_hot, T_cold: Hot and cold reservoir temperatures (K)
            V1, V2, V3, V4: Volumes at cycle points (m³)
            n: Amount of substance (mol)
            gamma: Heat capacity ratio
            
        Returns:
            Carnot cycle data
        """
        # Calculate pressures at each point
        P1 = n * self.R * T_hot / V1
        P2 = n * self.R * T_hot / V2
        P3 = P2 * (V2 / V3)**gamma  # Adiabatic expansion
        P4 = P1 * (V1 / V4)**gamma  # Adiabatic compression
        
        # Process 1→2: Isothermal expansion at T_hot
        W12 = n * self.R * T_hot * np.log(V2 / V1)
        Q12 = W12
        
        # Process 2→3: Adiabatic expansion
        W23 = (P2 * V2 - P3 * V3) / (gamma - 1)
        Q23 = 0
        
        # Process 3→4: Isothermal compression at T_cold
        W34 = n * self.R * T_cold * np.log(V4 / V3)
        Q34 = W34
        
        # Process 4→1: Adiabatic compression
        W41 = (P4 * V4 - P1 * V1) / (gamma - 1)
        Q41 = 0
        
        # Total work and heat
        W_total = W12 + W23 + W34 + W41
        Q_hot = Q12
        Q_cold = -Q34  # Heat rejected (negative)
        
        # Efficiency
        efficiency = W_total / Q_hot
        carnot_efficiency = self.carnot_cycle_efficiency(T_hot, T_cold)
        
        return {
            'cycle_type': 'carnot',
            'T_hot': T_hot,
            'T_cold': T_cold,
            'states': [
                {'P': P1, 'V': V1, 'T': T_hot},
                {'P': P2, 'V': V2, 'T': T_hot},
                {'P': P3, 'V': V3, 'T': T_cold},
                {'P': P4, 'V': V4, 'T': T_cold}
            ],
            'processes': [
                {'type': 'isothermal_expansion', 'W': W12, 'Q': Q12},
                {'type': 'adiabatic_expansion', 'W': W23, 'Q': Q23},
                {'type': 'isothermal_compression', 'W': W34, 'Q': Q34},
                {'type': 'adiabatic_compression', 'W': W41, 'Q': Q41}
            ],
            'total_work': W_total,
            'heat_absorbed': Q_hot,
            'heat_rejected': Q_cold,
            'efficiency': efficiency,
            'carnot_efficiency': carnot_efficiency,
            'efficiency_ratio': efficiency / carnot_efficiency
        }
    
    def validate_thermodynamic_laws(self, process_data: Dict) -> Dict:
        """
        Validate thermodynamic laws for a given process.
        
        Args:
            process_data: Process data dictionary
            
        Returns:
            Validation results
        """
        validations = {}
        
        # First Law: ΔU = Q - W
        if all(key in process_data for key in ['heat_added', 'work_done', 'internal_energy_change']):
            Q = process_data['heat_added']
            W = process_data['work_done']
            delta_U = process_data['internal_energy_change']
            
            first_law_check = abs(delta_U - (Q - W))
            validations['first_law'] = {
                'is_valid': first_law_check < 1e-6,
                'expected_delta_U': Q - W,
                'actual_delta_U': delta_U,
                'error': first_law_check
            }
        
        # Second Law: ΔS ≥ 0 for isolated systems
        if 'entropy_change' in process_data:
            delta_S = process_data['entropy_change']
            validations['second_law'] = {
                'is_valid': delta_S >= -1e-10,  # Small tolerance for numerical errors
                'entropy_change': delta_S,
                'entropy_increases': delta_S > 0
            }
        
        return validations
    
    def plot_pv_diagram(self, cycle_data: Dict, save_path: str = None):
        """
        Plot P-V diagram for thermodynamic cycle.
        
        Args:
            cycle_data: Cycle data dictionary
            save_path: Optional path to save the plot
        """
        if 'states' not in cycle_data:
            raise ValueError("Cycle data must contain 'states' information")
        
        states = cycle_data['states']
        pressures = [state['P'] for state in states] + [states[0]['P']]  # Close the loop
        volumes = [state['V'] for state in states] + [states[0]['V']]
        
        plt.figure(figsize=(10, 8))
        plt.plot(volumes, pressures, 'b-', linewidth=2, marker='o', markersize=8)
        
        # Label states
        for i, (V, P) in enumerate(zip(volumes[:-1], pressures[:-1])):
            plt.annotate(f'State {i+1}\nP={P:.0f} Pa\nV={V:.4f} m³', 
                        xy=(V, P), xytext=(10, 10), textcoords='offset points',
                        bbox=dict(boxstyle='round,pad=0.3', facecolor='yellow', alpha=0.7))
        
        # Add process labels
        if 'processes' in cycle_data:
            processes = cycle_data['processes']
            for i, process in enumerate(processes):
                mid_V = (volumes[i] + volumes[i+1]) / 2
                mid_P = (pressures[i] + pressures[i+1]) / 2
                plt.text(mid_V, mid_P, process['type'].replace('_', '\n'), 
                        ha='center', va='center', fontsize=8,
                        bbox=dict(boxstyle='round,pad=0.2', facecolor='lightblue', alpha=0.7))
        
        plt.xlabel('Volume (m³)')
        plt.ylabel('Pressure (Pa)')
        plt.title(f'{cycle_data.get("cycle_type", "Thermodynamic").title()} Cycle P-V Diagram')
        plt.grid(True, alpha=0.3)
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        
        plt.show()
    
    def export_simulation_data(self, data: Dict, filename: str):
        """
        Export simulation data to JSON file.
        
        Args:
            data: Simulation data dictionary
            filename: Output filename
        """
        export_data = {
            'timestamp': datetime.now().isoformat(),
            'simulation_type': 'thermodynamic_processes',
            'data': data
        }
        
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2, default=str)
        
        print(f"Simulation data exported to {filename}")

def main():
    """Main simulation runner."""
    print("Starting Thermodynamic Simulation...")
    
    # Initialize simulator
    sim = ThermodynamicSimulator()
    
    # Simulate isothermal process
    print("\n1. Simulating isothermal process...")
    isothermal_data = sim.simulate_isothermal_process(
        P1=101325, V1=0.001, V2=0.002, T=300, n=1.0
    )
    print(f"Isothermal expansion: W = {isothermal_data['work_done']:.2f} J")
    
    # Validate first law
    validation = sim.validate_thermodynamic_laws(isothermal_data)
    print(f"First law validation: {validation['first_law']['is_valid']}")
    
    # Simulate adiabatic process
    print("\n2. Simulating adiabatic process...")
    adiabatic_data = sim.simulate_adiabatic_process(
        P1=101325, V1=0.001, V2=0.002, T1=300, gamma=1.4, n=1.0
    )
    print(f"Adiabatic expansion: W = {adiabatic_data['work_done']:.2f} J")
    print(f"Final temperature: {adiabatic_data['final_state']['T']:.2f} K")
    
    # Simulate phase transition
    print("\n3. Simulating phase transitions...")
    melting_data = sim.simulate_phase_transition("water", "melting")
    vaporization_data = sim.simulate_phase_transition("water", "vaporization")
    
    print(f"Water melting: ΔH = {melting_data['enthalpy_change']:.0f} J/kg")
    print(f"Water vaporization: ΔH = {vaporization_data['enthalpy_change']:.0f} J/kg")
    
    # Simulate Carnot cycle
    print("\n4. Simulating Carnot cycle...")
    carnot_data = sim.simulate_carnot_cycle(
        T_hot=400, T_cold=300, 
        V1=0.001, V2=0.002, V3=0.004, V4=0.002,
        n=1.0, gamma=1.4
    )
    
    print(f"Carnot efficiency: {carnot_data['carnot_efficiency']:.3f}")
    print(f"Actual efficiency: {carnot_data['efficiency']:.3f}")
    print(f"Efficiency ratio: {carnot_data['efficiency_ratio']:.3f}")
    
    # Plot P-V diagram
    sim.plot_pv_diagram(carnot_data, 'carnot_cycle_pv.png')
    
    # Create temperature-entropy diagram
    print("\n5. Creating T-S diagram...")
    temperatures = np.linspace(250, 450, 100)
    entropies_isothermal = []
    entropies_adiabatic = []
    
    for T in temperatures:
        # Isothermal process entropy
        S_iso = sim.R * np.log(T / 300)  # Relative to reference state
        entropies_isothermal.append(S_iso)
        
        # Adiabatic process (constant entropy)
        entropies_adiabatic.append(0)
    
    plt.figure(figsize=(10, 6))
    plt.plot(entropies_isothermal, temperatures, 'r-', label='Isothermal process', linewidth=2)
    plt.axhline(y=300, color='b', linestyle='--', label='Adiabatic process', linewidth=2)
    plt.xlabel('Entropy (J/(mol⋅K))')
    plt.ylabel('Temperature (K)')
    plt.title('Temperature-Entropy Diagram')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig('temperature_entropy_diagram.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    # Export all data
    print("\n6. Exporting simulation data...")
    all_data = {
        'isothermal_process': isothermal_data,
        'adiabatic_process': adiabatic_data,
        'phase_transitions': {
            'melting': melting_data,
            'vaporization': vaporization_data
        },
        'carnot_cycle': carnot_data,
        'validations': {
            'isothermal': validation
        }
    }
    
    sim.export_simulation_data(all_data, 'thermodynamic_simulation_results.json')
    
    print("\nThermodynamic simulation completed successfully!")

if __name__ == "__main__":
    main()