//! Thermodynamic State Tracker Smart Contract
//! 
//! Tracks and validates thermodynamic state changes and phase transitions

use crate::types::{ThermodynamicState, PhaseState, ValidationResult, PhysicalConstants};
use serde::{Deserialize, Serialize};
use fabric_contract_api::contract::Contract;
use fabric_contract_api::info::Info;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ThermoValidationError {
    #[error("Second law violation: entropy decreased from {initial} to {final}")]
    EntropyDecrease { initial: f64, final: f64 },
    #[error("Invalid phase transition from {from:?} to {to:?}")]
    InvalidPhaseTransition { from: PhaseState, to: PhaseState },
    #[error("Gibbs free energy violation: ΔG = {delta_g} > 0")]
    GibbsFreeEnergyViolation { delta_g: f64 },
    #[error("Temperature below absolute zero: {temperature} K")]
    TemperatureBelowAbsoluteZero { temperature: f64 },
    #[error("Invalid pressure: {pressure} Pa")]
    InvalidPressure { pressure: f64 },
}

#[derive(Info)]
pub struct ThermoStateTracker {
    entropy_tolerance: f64,
    gibbs_tolerance: f64,
}

impl Contract for ThermoStateTracker {
    fn new() -> Self {
        ThermoStateTracker {
            entropy_tolerance: 1e-6, // J/K
            gibbs_tolerance: 1e-3,   // J
        }
    }
}

impl ThermoStateTracker {
    /// Validates a thermodynamic state change
    pub fn validate_state_change(
        &self,
        initial_state: &ThermodynamicState,
        final_state: &ThermodynamicState,
    ) -> Result<ValidationResult, ThermoValidationError> {
        // Validate basic physical constraints
        self.validate_physical_constraints(final_state)?;
        
        // Check second law of thermodynamics
        self.validate_entropy_increase(initial_state, final_state)?;
        
        // Validate phase transition
        self.validate_phase_transition(&initial_state.phase, &final_state.phase)?;
        
        // Check Gibbs free energy for spontaneous processes
        self.validate_gibbs_free_energy(initial_state, final_state)?;
        
        // Calculate confidence score
        let confidence = self.calculate_confidence_score(initial_state, final_state);
        
        Ok(ValidationResult {
            is_valid: true,
            error_message: None,
            confidence_score: confidence,
            validator_consensus: vec!["thermo_state_tracker".to_string()],
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        })
    }
    
    /// Validates basic physical constraints
    fn validate_physical_constraints(
        &self,
        state: &ThermodynamicState,
    ) -> Result<(), ThermoValidationError> {
        // Temperature must be above absolute zero
        if state.temperature < 0.0 {
            return Err(ThermoValidationError::TemperatureBelowAbsoluteZero {
                temperature: state.temperature,
            });
        }
        
        // Pressure must be positive
        if state.pressure < 0.0 {
            return Err(ThermoValidationError::InvalidPressure {
                pressure: state.pressure,
            });
        }
        
        Ok(())
    }
    
    /// Validates entropy increase (Second Law of Thermodynamics)
    fn validate_entropy_increase(
        &self,
        initial: &ThermodynamicState,
        final: &ThermodynamicState,
    ) -> Result<(), ThermoValidationError> {
        let entropy_change = final.entropy - initial.entropy;
        
        // For isolated systems, entropy must increase or stay constant
        if entropy_change < -self.entropy_tolerance {
            return Err(ThermoValidationError::EntropyDecrease {
                initial: initial.entropy,
                final: final.entropy,
            });
        }
        
        Ok(())
    }
    
    /// Validates phase transitions
    fn validate_phase_transition(
        &self,
        from: &PhaseState,
        to: &PhaseState,
    ) -> Result<(), ThermoValidationError> {
        use PhaseState::*;
        
        let valid_transitions = match from {
            Solid => vec![Liquid, Gas, Plasma], // Melting, sublimation, or extreme heating
            Liquid => vec![Solid, Gas, SuperCritical], // Freezing, vaporization, or critical point
            Gas => vec![Liquid, Solid, Plasma, SuperCritical], // Condensation, deposition, ionization, or critical point
            Plasma => vec![Gas], // Recombination
            SuperCritical => vec![Gas, Liquid], // Expansion or cooling
            BoseEinsteinCondensate => vec![Solid, Liquid, Gas], // Heating
        };
        
        if from != to && !valid_transitions.contains(to) {
            return Err(ThermoValidationError::InvalidPhaseTransition {
                from: from.clone(),
                to: to.clone(),
            });
        }
        
        Ok(())
    }
    
    /// Validates Gibbs free energy for spontaneous processes
    fn validate_gibbs_free_energy(
        &self,
        initial: &ThermodynamicState,
        final: &ThermodynamicState,
    ) -> Result<(), ThermoValidationError> {
        // Calculate Gibbs free energy change: ΔG = ΔH - TΔS
        let delta_h = final.enthalpy - initial.enthalpy;
        let delta_s = final.entropy - initial.entropy;
        let avg_temp = (initial.temperature + final.temperature) / 2.0;
        let delta_g = delta_h - avg_temp * delta_s;
        
        // For spontaneous processes at constant T and P, ΔG ≤ 0
        if delta_g > self.gibbs_tolerance {
            return Err(ThermoValidationError::GibbsFreeEnergyViolation { delta_g });
        }
        
        Ok(())
    }
    
    /// Calculates confidence score for the validation
    fn calculate_confidence_score(
        &self,
        initial: &ThermodynamicState,
        final: &ThermodynamicState,
    ) -> f64 {
        let mut score = 1.0;
        
        // Reduce score for extreme temperature changes
        let temp_change_ratio = (final.temperature - initial.temperature).abs() / initial.temperature;
        if temp_change_ratio > 2.0 {
            score *= 0.8;
        }
        
        // Reduce score for extreme pressure changes
        let pressure_change_ratio = (final.pressure - initial.pressure).abs() / initial.pressure;
        if pressure_change_ratio > 10.0 {
            score *= 0.9;
        }
        
        // Boost score for common phase transitions
        if self.is_common_phase_transition(&initial.phase, &final.phase) {
            score *= 1.1;
        }
        
        score.min(1.0).max(0.0)
    }
    
    /// Checks if this is a common phase transition
    fn is_common_phase_transition(&self, from: &PhaseState, to: &PhaseState) -> bool {
        use PhaseState::*;
        matches!(
            (from, to),
            (Solid, Liquid) | (Liquid, Solid) | (Liquid, Gas) | (Gas, Liquid)
        )
    }
    
    /// Calculates equilibrium properties for a given state
    pub fn calculate_equilibrium_properties(
        &self,
        state: &ThermodynamicState,
    ) -> ThermodynamicState {
        let mut equilibrium_state = state.clone();
        
        // Calculate internal energy using ideal gas approximation
        // U = nCvT for ideal gas
        let n_moles = 1.0; // Assume 1 mole for simplicity
        let cv = 1.5 * PhysicalConstants::GAS_CONSTANT; // Monatomic ideal gas
        equilibrium_state.internal_energy = n_moles * cv * state.temperature;
        
        // Calculate enthalpy: H = U + P V
        equilibrium_state.enthalpy = equilibrium_state.internal_energy + 
            state.pressure * state.volume;
        
        // Calculate entropy using Sackur-Tetrode equation (simplified)
        let entropy_constant = PhysicalConstants::BOLTZMANN_CONSTANT * 
            (3.0/2.0 * (2.0 * std::f64::consts::PI * PhysicalConstants::ELECTRON_MASS * 
            PhysicalConstants::BOLTZMANN_CONSTANT * state.temperature / 
            PhysicalConstants::PLANCK_CONSTANT.powi(2)).ln() + 5.0/2.0);
        equilibrium_state.entropy = entropy_constant;
        
        // Calculate Gibbs free energy: G = H - TS
        equilibrium_state.gibbs_energy = equilibrium_state.enthalpy - 
            state.temperature * equilibrium_state.entropy;
        
        equilibrium_state
    }
    
    /// Batch validate multiple state changes
    pub fn batch_validate_state_changes(
        &self,
        state_pairs: &[(ThermodynamicState, ThermodynamicState)],
    ) -> Vec<ValidationResult> {
        state_pairs
            .iter()
            .map(|(initial, final)| {
                self.validate_state_change(initial, final)
                    .unwrap_or_else(|error| ValidationResult {
                        is_valid: false,
                        error_message: Some(error.to_string()),
                        confidence_score: 0.0,
                        validator_consensus: vec![],
                        timestamp: std::time::SystemTime::now()
                            .duration_since(std::time::UNIX_EPOCH)
                            .unwrap()
                            .as_secs(),
                    })
            })
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_valid_melting_transition() {
        let tracker = ThermoStateTracker::new();
        
        let initial_state = ThermodynamicState {
            substance_id: "H2O".to_string(),
            temperature: 273.15,
            pressure: 101325.0,
            volume: 1e-3,
            phase: PhaseState::Solid,
            entropy: 100.0,
            enthalpy: 1000.0,
            gibbs_energy: -500.0,
            internal_energy: 900.0,
            timestamp: 1640995200,
            validated: false,
        };
        
        let final_state = ThermodynamicState {
            substance_id: "H2O".to_string(),
            temperature: 273.16,
            pressure: 101325.0,
            volume: 1e-3,
            phase: PhaseState::Liquid,
            entropy: 105.0, // Entropy increases
            enthalpy: 1334000.0, // Enthalpy of fusion added
            gibbs_energy: -500.1, // Slightly more negative
            internal_energy: 1233675.0,
            timestamp: 1640995260,
            validated: false,
        };
        
        let result = tracker.validate_state_change(&initial_state, &final_state);
        assert!(result.is_ok());
        assert!(result.unwrap().is_valid);
    }
    
    #[test]
    fn test_entropy_decrease_violation() {
        let tracker = ThermoStateTracker::new();
        
        let initial_state = ThermodynamicState {
            substance_id: "H2O".to_string(),
            temperature: 373.15,
            pressure: 101325.0,
            volume: 1e-3,
            phase: PhaseState::Gas,
            entropy: 200.0,
            enthalpy: 2000.0,
            gibbs_energy: -1000.0,
            internal_energy: 1800.0,
            timestamp: 1640995200,
            validated: false,
        };
        
        let final_state = ThermodynamicState {
            substance_id: "H2O".to_string(),
            temperature: 273.15,
            pressure: 101325.0,
            volume: 1e-3,
            phase: PhaseState::Liquid,
            entropy: 150.0, // Entropy decreases - violation!
            enthalpy: 1000.0,
            gibbs_energy: -500.0,
            internal_energy: 900.0,
            timestamp: 1640995260,
            validated: false,
        };
        
        let result = tracker.validate_state_change(&initial_state, &final_state);
        assert!(result.is_err());
    }
}