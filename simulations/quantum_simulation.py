#!/usr/bin/env python3
"""
Quantum Energy Transition Simulation

This module simulates quantum energy transitions for various atomic systems
and validates them against theoretical predictions.
"""

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from scipy import constants
from scipy.optimize import minimize
import json
from datetime import datetime
from typing import List, Dict, Tuple, Optional

class QuantumSimulator:
    """Simulates quantum energy transitions and validates against physical laws."""
    
    def __init__(self):
        # Physical constants
        self.h = constants.h  # Planck constant (J⋅s)
        self.c = constants.c  # Speed of light (m/s)
        self.e = constants.e  # Elementary charge (C)
        self.me = constants.m_e  # Electron mass (kg)
        self.k = constants.k  # Boltzmann constant (J/K)
        
        # Conversion factors
        self.eV_to_J = constants.eV
        self.nm_to_m = 1e-9
        
    def hydrogen_energy_levels(self, n: int) -> float:
        """
        Calculate energy levels for hydrogen atom.
        
        Args:
            n: Principal quantum number
            
        Returns:
            Energy in eV
        """
        # Rydberg constant for hydrogen
        R_H = 13.6057  # eV
        return -R_H / (n**2)
    
    def calculate_transition_energy(self, n_initial: int, n_final: int) -> float:
        """
        Calculate energy of photon emitted/absorbed in transition.
        
        Args:
            n_initial: Initial quantum number
            n_final: Final quantum number
            
        Returns:
            Photon energy in eV
        """
        E_initial = self.hydrogen_energy_levels(n_initial)
        E_final = self.hydrogen_energy_levels(n_final)
        return abs(E_final - E_initial)
    
    def energy_to_wavelength(self, energy_eV: float) -> float:
        """
        Convert photon energy to wavelength.
        
        Args:
            energy_eV: Photon energy in eV
            
        Returns:
            Wavelength in nm
        """
        energy_J = energy_eV * self.eV_to_J
        wavelength_m = self.h * self.c / energy_J
        return wavelength_m / self.nm_to_m
    
    def energy_to_frequency(self, energy_eV: float) -> float:
        """
        Convert photon energy to frequency.
        
        Args:
            energy_eV: Photon energy in eV
            
        Returns:
            Frequency in Hz
        """
        energy_J = energy_eV * self.eV_to_J
        return energy_J / self.h
    
    def simulate_hydrogen_spectrum(self, max_n: int = 6) -> pd.DataFrame:
        """
        Simulate hydrogen emission spectrum.
        
        Args:
            max_n: Maximum principal quantum number to consider
            
        Returns:
            DataFrame with transition data
        """
        transitions = []
        
        for n_initial in range(2, max_n + 1):
            for n_final in range(1, n_initial):
                energy = self.calculate_transition_energy(n_initial, n_final)
                wavelength = self.energy_to_wavelength(energy)
                frequency = self.energy_to_frequency(energy)
                
                # Determine series name
                if n_final == 1:
                    series = "Lyman"
                elif n_final == 2:
                    series = "Balmer"
                elif n_final == 3:
                    series = "Paschen"
                elif n_final == 4:
                    series = "Brackett"
                else:
                    series = "Pfund"
                
                transitions.append({
                    'n_initial': n_initial,
                    'n_final': n_final,
                    'series': series,
                    'energy_eV': energy,
                    'wavelength_nm': wavelength,
                    'frequency_Hz': frequency,
                    'E_initial': self.hydrogen_energy_levels(n_initial),
                    'E_final': self.hydrogen_energy_levels(n_final)
                })
        
        return pd.DataFrame(transitions)
    
    def validate_energy_conservation(self, transition_data: Dict) -> Dict:
        """
        Validate energy conservation for a transition.
        
        Args:
            transition_data: Dictionary with transition parameters
            
        Returns:
            Validation result dictionary
        """
        expected_energy = abs(transition_data['E_final'] - transition_data['E_initial'])
        actual_energy = transition_data['photon_energy']
        
        tolerance = 1e-10  # eV
        energy_diff = abs(expected_energy - actual_energy)
        
        is_valid = energy_diff < tolerance
        
        return {
            'is_valid': is_valid,
            'expected_energy': expected_energy,
            'actual_energy': actual_energy,
            'energy_difference': energy_diff,
            'tolerance': tolerance,
            'relative_error': energy_diff / expected_energy if expected_energy > 0 else float('inf')
        }
    
    def simulate_quantum_tunneling(self, barrier_height: float, barrier_width: float, 
                                 particle_energy: float, mass: float = None) -> float:
        """
        Simulate quantum tunneling probability.
        
        Args:
            barrier_height: Potential barrier height (eV)
            barrier_width: Barrier width (nm)
            particle_energy: Particle energy (eV)
            mass: Particle mass (kg), defaults to electron mass
            
        Returns:
            Tunneling probability
        """
        if mass is None:
            mass = self.me
        
        # Convert units
        V0 = barrier_height * self.eV_to_J
        E = particle_energy * self.eV_to_J
        a = barrier_width * self.nm_to_m
        
        if E >= V0:
            return 1.0  # Classical case - particle goes over barrier
        
        # Quantum tunneling coefficient
        kappa = np.sqrt(2 * mass * (V0 - E)) / constants.hbar
        
        # Transmission probability (rectangular barrier)
        T = 1 / (1 + (V0**2 * np.sinh(kappa * a)**2) / (4 * E * (V0 - E)))
        
        return T
    
    def simulate_harmonic_oscillator(self, n_levels: int = 10, omega: float = 1e14) -> Dict:
        """
        Simulate quantum harmonic oscillator energy levels.
        
        Args:
            n_levels: Number of energy levels to calculate
            omega: Angular frequency (rad/s)
            
        Returns:
            Dictionary with energy levels and transition data
        """
        # Energy levels: E_n = ℏω(n + 1/2)
        hbar_omega = constants.hbar * omega
        energy_levels = [(n + 0.5) * hbar_omega / self.eV_to_J for n in range(n_levels)]
        
        # Calculate allowed transitions (Δn = ±1)
        transitions = []
        for n in range(1, n_levels):
            energy_diff = energy_levels[n] - energy_levels[n-1]
            transitions.append({
                'n_initial': n,
                'n_final': n-1,
                'energy_eV': energy_diff,
                'wavelength_nm': self.energy_to_wavelength(energy_diff),
                'frequency_Hz': self.energy_to_frequency(energy_diff)
            })
        
        return {
            'energy_levels': energy_levels,
            'transitions': transitions,
            'omega': omega,
            'hbar_omega_eV': hbar_omega / self.eV_to_J
        }
    
    def plot_hydrogen_spectrum(self, spectrum_data: pd.DataFrame, save_path: str = None):
        """
        Plot hydrogen emission spectrum.
        
        Args:
            spectrum_data: DataFrame with spectrum data
            save_path: Optional path to save the plot
        """
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
        
        # Energy level diagram
        series_colors = {
            'Lyman': 'purple',
            'Balmer': 'red',
            'Paschen': 'green',
            'Brackett': 'blue',
            'Pfund': 'orange'
        }
        
        # Plot energy levels
        n_values = range(1, 7)
        energies = [self.hydrogen_energy_levels(n) for n in n_values]
        
        ax1.hlines(energies, 0, 1, colors='black', linewidth=2)
        for i, (n, E) in enumerate(zip(n_values, energies)):
            ax1.text(1.05, E, f'n={n}\nE={E:.2f} eV', va='center', fontsize=10)
        
        # Plot transitions
        for _, row in spectrum_data.iterrows():
            E_i = row['E_initial']
            E_f = row['E_final']
            color = series_colors.get(row['series'], 'gray')
            ax1.arrow(0.5, E_i, 0, E_f - E_i, head_width=0.02, head_length=0.2, 
                     fc=color, ec=color, alpha=0.7)
        
        ax1.set_xlim(-0.1, 1.5)
        ax1.set_ylabel('Energy (eV)')
        ax1.set_title('Hydrogen Energy Levels and Transitions')
        ax1.grid(True, alpha=0.3)
        
        # Spectrum plot
        for series in spectrum_data['series'].unique():
            series_data = spectrum_data[spectrum_data['series'] == series]
            color = series_colors.get(series, 'gray')
            ax2.scatter(series_data['wavelength_nm'], series_data['energy_eV'], 
                       c=color, label=f'{series} series', s=50, alpha=0.8)
        
        ax2.set_xlabel('Wavelength (nm)')
        ax2.set_ylabel('Photon Energy (eV)')
        ax2.set_title('Hydrogen Emission Spectrum')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        
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
        # Convert numpy arrays to lists for JSON serialization
        def convert_numpy(obj):
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif isinstance(obj, dict):
                return {key: convert_numpy(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_numpy(item) for item in obj]
            else:
                return obj
        
        export_data = {
            'timestamp': datetime.now().isoformat(),
            'simulation_type': 'quantum_energy_transitions',
            'data': convert_numpy(data)
        }
        
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"Simulation data exported to {filename}")

def main():
    """Main simulation runner."""
    print("Starting Quantum Energy Transition Simulation...")
    
    # Initialize simulator
    sim = QuantumSimulator()
    
    # Simulate hydrogen spectrum
    print("\n1. Simulating hydrogen emission spectrum...")
    hydrogen_spectrum = sim.simulate_hydrogen_spectrum(max_n=6)
    print(f"Generated {len(hydrogen_spectrum)} transitions")
    print(hydrogen_spectrum.head())
    
    # Plot spectrum
    sim.plot_hydrogen_spectrum(hydrogen_spectrum, 'hydrogen_spectrum.png')
    
    # Validate some transitions
    print("\n2. Validating energy conservation...")
    sample_transitions = hydrogen_spectrum.head(5)
    for _, transition in sample_transitions.iterrows():
        validation = sim.validate_energy_conservation({
            'E_initial': transition['E_initial'],
            'E_final': transition['E_final'],
            'photon_energy': transition['energy_eV']
        })
        print(f"Transition {transition['n_initial']}→{transition['n_final']}: "
              f"Valid={validation['is_valid']}, "
              f"Error={validation['relative_error']:.2e}")
    
    # Simulate quantum tunneling
    print("\n3. Simulating quantum tunneling...")
    tunneling_probs = []
    energies = np.linspace(0.1, 2.0, 20)  # eV
    barrier_height = 1.5  # eV
    barrier_width = 1.0   # nm
    
    for energy in energies:
        prob = sim.simulate_quantum_tunneling(barrier_height, barrier_width, energy)
        tunneling_probs.append(prob)
    
    # Plot tunneling probability
    plt.figure(figsize=(10, 6))
    plt.plot(energies, tunneling_probs, 'b-', linewidth=2)
    plt.axvline(barrier_height, color='r', linestyle='--', 
                label=f'Barrier height = {barrier_height} eV')
    plt.xlabel('Particle Energy (eV)')
    plt.ylabel('Tunneling Probability')
    plt.title('Quantum Tunneling Probability vs Particle Energy')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig('quantum_tunneling.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    # Simulate harmonic oscillator
    print("\n4. Simulating quantum harmonic oscillator...")
    oscillator_data = sim.simulate_harmonic_oscillator(n_levels=10)
    print(f"Energy level spacing: {oscillator_data['hbar_omega_eV']:.6f} eV")
    
    # Export all data
    print("\n5. Exporting simulation data...")
    all_data = {
        'hydrogen_spectrum': hydrogen_spectrum.to_dict('records'),
        'tunneling_simulation': {
            'energies': energies.tolist(),
            'probabilities': tunneling_probs,
            'barrier_height': barrier_height,
            'barrier_width': barrier_width
        },
        'harmonic_oscillator': oscillator_data
    }
    
    sim.export_simulation_data(all_data, 'quantum_simulation_results.json')
    
    print("\nQuantum simulation completed successfully!")

if __name__ == "__main__":
    main()