# Quantum ThermoLedger API Documentation

## Overview

The Quantum ThermoLedger API provides RESTful endpoints for interacting with the blockchain-based quantum and thermodynamic validation system. All endpoints return JSON responses and require authentication via Bearer tokens.

**Base URL**: `https://api.quantum-thermoledger.com/v1`

## Authentication

All API requests require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_API_TOKEN
```

## Endpoints

### Quantum Energy Validation

#### GET /quantum/transitions

Retrieve quantum energy transitions from the ledger.

**Parameters:**
- `limit` (optional): Number of results to return (default: 100, max: 1000)
- `offset` (optional): Number of results to skip (default: 0)
- `series` (optional): Filter by spectral series (lyman, balmer, paschen, etc.)
- `validated` (optional): Filter by validation status (true/false)

**Response:**
```json
{
  "data": [
    {
      "id": "qt_1234567890",
      "electron_id": "H_2_1",
      "initial_energy": -3.4,
      "final_energy": -13.6,
      "photon_energy": 10.2,
      "wavelength": 121.6,
      "frequency": 2.47e15,
      "series": "lyman",
      "timestamp": 1640995200,
      "validated": true,
      "validator_id": "quantum_validator_001",
      "block_height": 12345
    }
  ],
  "total": 1247,
  "limit": 100,
  "offset": 0
}
```

#### POST /quantum/validate

Submit a quantum transition for validation.

**Request Body:**
```json
{
  "electron_id": "H_3_2",
  "initial_energy": -1.51,
  "final_energy": -3.4,
  "photon_energy": 1.89,
  "wavelength": 656.3,
  "frequency": 4.57e14
}
```

**Response:**
```json
{
  "validation_result": {
    "is_valid": true,
    "confidence_score": 0.9987,
    "error_message": null,
    "validator_consensus": ["validator_001", "validator_002", "validator_003"],
    "timestamp": 1640995260
  },
  "transaction_id": "0x1a2b3c4d5e6f...",
  "estimated_gas": 45892
}
```

### Thermodynamic State Tracking

#### GET /thermo/states

Retrieve thermodynamic states from the ledger.

**Parameters:**
- `limit` (optional): Number of results to return (default: 100)
- `substance` (optional): Filter by substance ID
- `phase` (optional): Filter by phase (solid, liquid, gas, plasma)
- `validated` (optional): Filter by validation status

**Response:**
```json
{
  "data": [
    {
      "id": "ts_1234567890",
      "substance_id": "H2O_001",
      "temperature": 373.15,
      "pressure": 101325,
      "volume": 0.001,
      "phase": "gas",
      "entropy": 188.8,
      "enthalpy": 2676000,
      "gibbs_energy": -228600,
      "internal_energy": 2574675,
      "timestamp": 1640995200,
      "validated": true,
      "block_height": 12346
    }
  ],
  "total": 892,
  "limit": 100,
  "offset": 0
}
```

#### POST /thermo/validate

Submit a thermodynamic state change for validation.

**Request Body:**
```json
{
  "substance_id": "H2O_001",
  "initial_state": {
    "temperature": 273.15,
    "pressure": 101325,
    "volume": 0.001,
    "phase": "solid",
    "entropy": 100.0,
    "enthalpy": 1000.0,
    "gibbs_energy": -500.0,
    "internal_energy": 900.0
  },
  "final_state": {
    "temperature": 273.16,
    "pressure": 101325,
    "volume": 0.001,
    "phase": "liquid",
    "entropy": 105.0,
    "enthalpy": 1334000.0,
    "gibbs_energy": -500.1,
    "internal_energy": 1233675.0
  }
}
```

**Response:**
```json
{
  "validation_result": {
    "is_valid": true,
    "confidence_score": 0.9945,
    "error_message": null,
    "validator_consensus": ["thermo_validator_001", "thermo_validator_002"],
    "timestamp": 1640995260
  },
  "transaction_id": "0x2b3c4d5e6f7a...",
  "estimated_gas": 38472
}
```

### Smart Contract Management

#### GET /contracts/deployed

List all deployed smart contracts.

**Response:**
```json
{
  "contracts": [
    {
      "id": "quantum_validator",
      "name": "Quantum Energy Validator",
      "version": "1.2.0",
      "address": "0x1234567890abcdef...",
      "status": "deployed",
      "deployment_date": "2024-12-15T10:30:00Z",
      "gas_used": 2847392,
      "abi_hash": "0xabcdef1234567890..."
    },
    {
      "id": "thermo_state_tracker",
      "name": "Thermodynamic State Tracker",
      "version": "1.1.5",
      "address": "0xabcdef1234567890...",
      "status": "deployed",
      "deployment_date": "2024-12-10T14:20:00Z",
      "gas_used": 1923847,
      "abi_hash": "0x567890abcdef1234..."
    }
  ]
}
```

#### POST /contracts/invoke

Invoke a smart contract function.

**Request Body:**
```json
{
  "contract_id": "quantum_validator",
  "function": "validate_transition",
  "parameters": {
    "transition": {
      "electron_id": "H_2_1",
      "initial_energy": -3.4,
      "final_energy": -13.6,
      "photon_energy": 10.2,
      "wavelength": 121.6,
      "frequency": 2.47e15,
      "timestamp": 1640995200,
      "validated": false,
      "validator_id": "api_client"
    }
  }
}
```

**Response:**
```json
{
  "result": {
    "is_valid": true,
    "error_message": null,
    "confidence_score": 0.9987,
    "validator_consensus": ["quantum_validator"],
    "timestamp": 1640995260
  },
  "transaction_id": "0x3c4d5e6f7a8b...",
  "gas_used": 45892,
  "block_height": 12347
}
```

### Ledger Operations

#### GET /ledger/transactions

Retrieve transaction history from the ledger.

**Parameters:**
- `limit` (optional): Number of results (default: 100)
- `type` (optional): Transaction type (quantum_transition, phase_change, energy_transfer, state_validation)
- `from_block` (optional): Starting block height
- `to_block` (optional): Ending block height

**Response:**
```json
{
  "transactions": [
    {
      "id": "tx_1234567890",
      "type": "quantum_transition",
      "energy_change": 10.2,
      "initial_state": "H_n2",
      "final_state": "H_n1",
      "validation_hash": "0x1a2b3c4d...",
      "timestamp": 1640995200,
      "block_height": 12345,
      "gas_used": 45892,
      "validator_id": "quantum_validator_001"
    }
  ],
  "total": 15678,
  "limit": 100,
  "offset": 0
}
```

### Real-time Metrics

#### GET /metrics/realtime

Get real-time system metrics.

**Response:**
```json
{
  "timestamp": 1640995260,
  "quantum_metrics": {
    "active_transitions": 1247,
    "validation_rate": 0.9987,
    "average_energy": 5.2,
    "total_validations_24h": 15678
  },
  "thermodynamic_metrics": {
    "active_states": 892,
    "phase_transitions_24h": 234,
    "entropy_compliance_rate": 0.9995,
    "average_temperature": 298.15
  },
  "network_metrics": {
    "active_validators": 42,
    "block_height": 12347,
    "transactions_per_second": 125.7,
    "network_hash_rate": "1.2 TH/s"
  },
  "contract_metrics": {
    "total_contracts": 4,
    "active_contracts": 4,
    "total_invocations_24h": 8934,
    "average_gas_price": 20
  }
}
```

## WebSocket API

For real-time updates, connect to the WebSocket endpoint:

**URL**: `wss://api.quantum-thermoledger.com/ws`

### Events

#### quantum_transition
Emitted when a new quantum transition is validated.

```json
{
  "event": "quantum_transition",
  "data": {
    "id": "qt_1234567890",
    "electron_id": "H_3_1",
    "energy_change": 12.09,
    "series": "lyman",
    "validated": true,
    "timestamp": 1640995260
  }
}
```

#### thermo_state_change
Emitted when a thermodynamic state change is recorded.

```json
{
  "event": "thermo_state_change",
  "data": {
    "id": "ts_1234567890",
    "substance_id": "H2O_001",
    "phase_transition": "liquid_to_gas",
    "temperature": 373.15,
    "validated": true,
    "timestamp": 1640995260
  }
}
```

#### validation_result
Emitted when a validation is completed.

```json
{
  "event": "validation_result",
  "data": {
    "transaction_id": "0x1a2b3c4d...",
    "type": "quantum_transition",
    "is_valid": true,
    "confidence_score": 0.9987,
    "validator_id": "quantum_validator_001",
    "timestamp": 1640995260
  }
}
```

## Error Handling

All API endpoints use standard HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses include detailed information:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Energy conservation violation: expected 10.2 eV, got 9.8 eV",
    "details": {
      "expected_energy": 10.2,
      "actual_energy": 9.8,
      "tolerance": 1e-15
    },
    "timestamp": 1640995260
  }
}
```

## Rate Limits

API requests are rate-limited per API key:

- **Standard tier**: 1,000 requests per hour
- **Premium tier**: 10,000 requests per hour
- **Enterprise tier**: Unlimited

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640998800
```

## SDK Examples

### JavaScript/Node.js

```javascript
const QuantumThermoLedger = require('@quantum-thermoledger/sdk');

const client = new QuantumThermoLedger({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.quantum-thermoledger.com/v1'
});

// Validate quantum transition
const result = await client.quantum.validateTransition({
  electronId: 'H_2_1',
  initialEnergy: -3.4,
  finalEnergy: -13.6,
  photonEnergy: 10.2,
  wavelength: 121.6,
  frequency: 2.47e15
});

console.log('Validation result:', result);
```

### Python

```python
from quantum_thermoledger import Client

client = Client(api_key='your-api-key')

# Get recent quantum transitions
transitions = client.quantum.get_transitions(limit=10, series='balmer')

for transition in transitions:
    print(f"Transition: {transition.electron_id}, Energy: {transition.photon_energy} eV")
```

### Rust

```rust
use quantum_thermoledger::Client;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new("your-api-key");
    
    let metrics = client.get_realtime_metrics().await?;
    println!("Active quantum transitions: {}", metrics.quantum_metrics.active_transitions);
    
    Ok(())
}
```

## Support

For API support and questions:

- **Documentation**: https://docs.quantum-thermoledger.com
- **GitHub Issues**: https://github.com/MRSA1/Quantum-ThermoLedger/issues
- **Email**: api-support@quantum-thermoledger.com
- **Discord**: https://discord.gg/quantum-thermoledger