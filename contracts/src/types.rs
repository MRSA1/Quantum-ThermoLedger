//! Common types used across smart contracts

use serde::{Deserialize, Serialize};

/// Represents a quantum energy transition
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct QuantumTransition {
    pub electron_id: String,
    pub initial_energy: f64,  // eV
    pub final_energy: f64,    // eV
    pub photon_energy: f64,   // eV
    pub wavelength: f64,      // nm
    pub frequency: f64,       // Hz
    pub timestamp: u64,
    pub validated: bool,
    pub validator_id: String,
}

/// Thermodynamic phase states
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum PhaseState {
    Solid,
    Liquid,
    Gas,
    Plasma,
    SuperCritical,
    BoseEinsteinCondensate,
}

/// Represents a thermodynamic state
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ThermodynamicState {
    pub substance_id: String,
    pub temperature: f64,     // Kelvin
    pub pressure: f64,        // Pascal
    pub volume: f64,          // m³
    pub phase: PhaseState,
    pub entropy: f64,         // J/K
    pub enthalpy: f64,        // J
    pub gibbs_energy: f64,    // J
    pub internal_energy: f64, // J
    pub timestamp: u64,
    pub validated: bool,
}

/// Energy ledger entry
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EnergyLedgerEntry {
    pub id: String,
    pub entry_type: EntryType,
    pub energy_change: f64,   // J
    pub initial_state: String,
    pub final_state: String,
    pub validation_hash: String,
    pub timestamp: u64,
    pub block_height: u64,
}

/// Types of ledger entries
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum EntryType {
    QuantumTransition,
    PhaseChange,
    EnergyTransfer,
    StateValidation,
}

/// Validation result
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ValidationResult {
    pub is_valid: bool,
    pub error_message: Option<String>,
    pub confidence_score: f64,
    pub validator_consensus: Vec<String>,
    pub timestamp: u64,
}

/// Physical constants
pub struct PhysicalConstants;

impl PhysicalConstants {
    pub const PLANCK_CONSTANT: f64 = 6.62607015e-34;      // J⋅s
    pub const SPEED_OF_LIGHT: f64 = 299792458.0;          // m/s
    pub const BOLTZMANN_CONSTANT: f64 = 1.380649e-23;     // J/K
    pub const GAS_CONSTANT: f64 = 8.314462618;            // J/(mol⋅K)
    pub const AVOGADRO_NUMBER: f64 = 6.02214076e23;       // mol⁻¹
    pub const ELECTRON_CHARGE: f64 = 1.602176634e-19;     // C
    pub const ELECTRON_MASS: f64 = 9.1093837015e-31;      // kg
    pub const PROTON_MASS: f64 = 1.67262192369e-27;       // kg
}