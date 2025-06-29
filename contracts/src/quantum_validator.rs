//! Quantum Energy Validator Smart Contract
//! 
//! Validates quantum energy transitions using fundamental physics principles

use crate::types::{QuantumTransition, ValidationResult, PhysicalConstants};
use serde::{Deserialize, Serialize};
use fabric_contract_api::contract::Contract;
use fabric_contract_api::info::Info;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum QuantumValidationError {
    #[error("Energy conservation violation: expected {expected}, got {actual}")]
    EnergyConservationViolation { expected: f64, actual: f64 },
    #[error("Quantum selection rules violated")]
    SelectionRulesViolation,
    #[error("Invalid energy level: {level}")]
    InvalidEnergyLevel { level: f64 },
    #[error("Frequency calculation error")]
    FrequencyCalculationError,
}

#[derive(Info)]
pub struct QuantumValidator {
    tolerance: f64,
}

impl Contract for QuantumValidator {
    fn new() -> Self {
        QuantumValidator {
            tolerance: 1e-15, // eV
        }
    }
}

impl QuantumValidator {
    /// Validates a quantum energy transition
    pub fn validate_transition(
        &self,
        transition: &QuantumTransition,
    ) -> Result<ValidationResult, QuantumValidationError> {
        // Validate energy conservation
        self.validate_energy_conservation(transition)?;
        
        // Validate quantum selection rules
        self.validate_selection_rules(transition)?;
        
        // Validate frequency-energy relationship
        self.validate_frequency_energy_relationship(transition)?;
        
        // Calculate confidence score
        let confidence = self.calculate_confidence_score(transition);
        
        Ok(ValidationResult {
            is_valid: true,
            error_message: None,
            confidence_score: confidence,
            validator_consensus: vec!["quantum_validator".to_string()],
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        })
    }
    
    /// Validates energy conservation using Planck's equation
    fn validate_energy_conservation(
        &self,
        transition: &QuantumTransition,
    ) -> Result<(), QuantumValidationError> {
        let energy_diff = (transition.final_energy - transition.initial_energy).abs();
        let photon_energy = transition.photon_energy;
        
        if (photon_energy - energy_diff).abs() > self.tolerance {
            return Err(QuantumValidationError::EnergyConservationViolation {
                expected: energy_diff,
                actual: photon_energy,
            });
        }
        
        Ok(())
    }
    
    /// Validates quantum mechanical selection rules
    fn validate_selection_rules(
        &self,
        transition: &QuantumTransition,
    ) -> Result<(), QuantumValidationError> {
        // Simplified selection rules validation
        // In a real implementation, this would check orbital angular momentum,
        // total angular momentum, and magnetic quantum number changes
        
        if transition.initial_energy <= 0.0 || transition.final_energy <= 0.0 {
            return Err(QuantumValidationError::SelectionRulesViolation);
        }
        
        // Check if transition is physically allowed
        if transition.initial_energy == transition.final_energy {
            return Err(QuantumValidationError::SelectionRulesViolation);
        }
        
        Ok(())
    }
    
    /// Validates the relationship between frequency and energy
    fn validate_frequency_energy_relationship(
        &self,
        transition: &QuantumTransition,
    ) -> Result<(), QuantumValidationError> {
        // E = hf, so f = E/h
        let expected_frequency = transition.photon_energy * 
            PhysicalConstants::ELECTRON_CHARGE / PhysicalConstants::PLANCK_CONSTANT;
        
        let frequency_diff = (transition.frequency - expected_frequency).abs();
        let frequency_tolerance = expected_frequency * 1e-10; // 0.00000001% tolerance
        
        if frequency_diff > frequency_tolerance {
            return Err(QuantumValidationError::FrequencyCalculationError);
        }
        
        // Validate wavelength-frequency relationship: c = λf
        let expected_wavelength = PhysicalConstants::SPEED_OF_LIGHT / transition.frequency * 1e9; // nm
        let wavelength_diff = (transition.wavelength - expected_wavelength).abs();
        let wavelength_tolerance = expected_wavelength * 1e-10;
        
        if wavelength_diff > wavelength_tolerance {
            return Err(QuantumValidationError::FrequencyCalculationError);
        }
        
        Ok(())
    }
    
    /// Calculates confidence score for the validation
    fn calculate_confidence_score(&self, transition: &QuantumTransition) -> f64 {
        let mut score = 1.0;
        
        // Reduce score based on energy precision
        let energy_diff = (transition.final_energy - transition.initial_energy).abs();
        let photon_energy_error = (transition.photon_energy - energy_diff).abs();
        let relative_error = photon_energy_error / energy_diff;
        
        score *= (1.0 - relative_error.min(0.1) * 10.0);
        
        // Boost score for common transitions
        if self.is_common_transition(transition) {
            score *= 1.1;
        }
        
        score.min(1.0).max(0.0)
    }
    
    /// Checks if this is a common, well-known transition
    fn is_common_transition(&self, transition: &QuantumTransition) -> bool {
        // Check for hydrogen Lyman, Balmer, or Paschen series
        let hydrogen_transitions = [
            (13.6, 3.4),   // n=1 to n=2 (Lyman alpha)
            (13.6, 1.51),  // n=1 to n=3 (Lyman beta)
            (3.4, 1.51),   // n=2 to n=3 (Balmer alpha)
        ];
        
        for (initial, final) in hydrogen_transitions.iter() {
            if (transition.initial_energy - initial).abs() < 0.1 &&
               (transition.final_energy - final).abs() < 0.1 {
                return true;
            }
        }
        
        false
    }
    
    /// Batch validate multiple transitions
    pub fn batch_validate_transitions(
        &self,
        transitions: &[QuantumTransition],
    ) -> Vec<ValidationResult> {
        transitions
            .iter()
            .map(|transition| {
                self.validate_transition(transition)
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
    fn test_valid_hydrogen_transition() {
        let validator = QuantumValidator::new();
        let transition = QuantumTransition {
            electron_id: "H1".to_string(),
            initial_energy: 13.6,
            final_energy: 3.4,
            photon_energy: 10.2,
            wavelength: 121.6,
            frequency: 2.47e15,
            timestamp: 1640995200,
            validated: false,
            validator_id: "test".to_string(),
        };
        
        let result = validator.validate_transition(&transition);
        assert!(result.is_ok());
        assert!(result.unwrap().is_valid);
    }
    
    #[test]
    fn test_energy_conservation_violation() {
        let validator = QuantumValidator::new();
        let transition = QuantumTransition {
            electron_id: "H1".to_string(),
            initial_energy: 13.6,
            final_energy: 3.4,
            photon_energy: 5.0, // Wrong photon energy
            wavelength: 121.6,
            frequency: 2.47e15,
            timestamp: 1640995200,
            validated: false,
            validator_id: "test".to_string(),
        };
        
        let result = validator.validate_transition(&transition);
        assert!(result.is_err());
    }
}