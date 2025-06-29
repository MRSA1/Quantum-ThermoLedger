# Quantum ThermoLedger Deployment Guide

This guide provides comprehensive instructions for deploying the Quantum ThermoLedger system in production environments.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Deployment](#deployment)
6. [Monitoring](#monitoring)
7. [Maintenance](#maintenance)
8. [Troubleshooting](#troubleshooting)

## System Requirements

### Hardware Requirements

#### Minimum Requirements
- **CPU**: 4 cores, 2.5 GHz
- **RAM**: 16 GB
- **Storage**: 500 GB SSD
- **Network**: 100 Mbps connection

#### Recommended Requirements
- **CPU**: 8+ cores, 3.0+ GHz (Intel Xeon or AMD EPYC)
- **RAM**: 32+ GB DDR4
- **Storage**: 1+ TB NVMe SSD
- **Network**: 1+ Gbps connection with low latency

#### Production Requirements
- **CPU**: 16+ cores, 3.5+ GHz
- **RAM**: 64+ GB DDR4 ECC
- **Storage**: 2+ TB NVMe SSD (RAID 1 recommended)
- **Network**: 10+ Gbps connection
- **Redundancy**: Multiple nodes for high availability

### Software Requirements

#### Operating System
- **Linux**: Ubuntu 20.04+ LTS, CentOS 8+, RHEL 8+
- **Container**: Docker 20.10+ with Docker Compose 2.0+

#### Runtime Dependencies
- **Rust**: 1.70+ (for smart contracts)
- **Node.js**: 18+ LTS (for frontend and API)
- **Python**: 3.9+ (for simulations)
- **PostgreSQL**: 14+ (for data storage)
- **Redis**: 6.2+ (for caching and sessions)
- **NGINX**: 1.20+ (for reverse proxy and load balancing)

#### Blockchain Platform
- **Hyperledger Fabric**: 2.4+
- **Hyperledger Fabric CA**: 1.5+
- **CouchDB**: 3.1+ (for state database)

## Prerequisites

### 1. Install Docker and Docker Compose

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustup update
```

### 3. Install Node.js

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 4. Install Python and Dependencies

```bash
sudo apt-get update
sudo apt-get install -y python3.9 python3.9-pip python3.9-venv
python3.9 -m pip install --upgrade pip
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MRSA1/Quantum-ThermoLedger.git
cd Quantum-ThermoLedger
```

### 2. Build Smart Contracts

```bash
cd contracts
cargo build --release
cargo test
cd ..
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
npm run build
cd ..
```

### 4. Setup Python Environment

```bash
cd simulations
python3.9 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 5. Create Directory Structure

```bash
mkdir -p {config,data,logs,certs,scripts}
mkdir -p data/{postgres,redis,fabric}
mkdir -p logs/{api,contracts,simulations}
```

## Configuration

### 1. Environment Configuration

Create `.env` file in the project root:

```bash
# Network Configuration
QUANTUM_NETWORK=mainnet
FABRIC_NETWORK_NAME=quantum-thermoledger
FABRIC_CHANNEL_NAME=quantum-channel

# API Configuration
API_HOST=0.0.0.0
API_PORT=8080
API_SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Database Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=quantum_thermoledger
POSTGRES_USER=qtl_user
POSTGRES_PASSWORD=secure_password_here

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_here

# Blockchain Configuration
FABRIC_CA_URL=https://ca.quantum-thermoledger.com:7054
FABRIC_PEER_URL=grpc://peer0.quantum-thermoledger.com:7051
FABRIC_ORDERER_URL=grpc://orderer.quantum-thermoledger.com:7050

# Monitoring Configuration
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
LOG_LEVEL=info

# Security Configuration
TLS_ENABLED=true
CERT_PATH=/opt/quantum-thermoledger/certs
```

### 2. Hyperledger Fabric Configuration

Create `config/fabric-network.yaml`:

```yaml
name: quantum-thermoledger-network
version: 1.0.0

channels:
  quantum-channel:
    orderers:
      - orderer.quantum-thermoledger.com
    peers:
      peer0.org1.quantum-thermoledger.com:
        endorsingPeer: true
        chaincodeQuery: true
        ledgerQuery: true
        eventSource: true
      peer0.org2.quantum-thermoledger.com:
        endorsingPeer: true
        chaincodeQuery: true
        ledgerQuery: true
        eventSource: true

organizations:
  Org1:
    mspid: Org1MSP
    peers:
      - peer0.org1.quantum-thermoledger.com
    certificateAuthorities:
      - ca.org1.quantum-thermoledger.com
    adminPrivateKeyPEM:
      path: crypto-config/peerOrganizations/org1.quantum-thermoledger.com/users/Admin@org1.quantum-thermoledger.com/msp/keystore/admin_sk
    signedCertPEM:
      path: crypto-config/peerOrganizations/org1.quantum-thermoledger.com/users/Admin@org1.quantum-thermoledger.com/msp/signcerts/Admin@org1.quantum-thermoledger.com-cert.pem

  Org2:
    mspid: Org2MSP
    peers:
      - peer0.org2.quantum-thermoledger.com
    certificateAuthorities:
      - ca.org2.quantum-thermoledger.com

orderers:
  orderer.quantum-thermoledger.com:
    url: grpc://orderer.quantum-thermoledger.com:7050
    grpcOptions:
      ssl-target-name-override: orderer.quantum-thermoledger.com

peers:
  peer0.org1.quantum-thermoledger.com:
    url: grpc://peer0.org1.quantum-thermoledger.com:7051
    grpcOptions:
      ssl-target-name-override: peer0.org1.quantum-thermoledger.com
  
  peer0.org2.quantum-thermoledger.com:
    url: grpc://peer0.org2.quantum-thermoledger.com:7051
    grpcOptions:
      ssl-target-name-override: peer0.org2.quantum-thermoledger.com

certificateAuthorities:
  ca.org1.quantum-thermoledger.com:
    url: https://ca.org1.quantum-thermoledger.com:7054
    caName: ca-org1
    tlsCACerts:
      path: crypto-config/peerOrganizations/org1.quantum-thermoledger.com/ca/ca.org1.quantum-thermoledger.com-cert.pem
```

### 3. Database Configuration

Create `config/postgres.conf`:

```conf
# PostgreSQL Configuration for Quantum ThermoLedger

# Connection Settings
listen_addresses = '*'
port = 5432
max_connections = 200

# Memory Settings
shared_buffers = 8GB
effective_cache_size = 24GB
work_mem = 256MB
maintenance_work_mem = 2GB

# Checkpoint Settings
checkpoint_completion_target = 0.9
wal_buffers = 64MB
default_statistics_target = 500

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = '/var/log/postgresql'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'mod'
log_min_duration_statement = 1000

# Performance
random_page_cost = 1.1
effective_io_concurrency = 200
```

### 4. NGINX Configuration

Create `config/nginx.conf`:

```nginx
upstream api_backend {
    server api:8080;
    keepalive 32;
}

upstream frontend_backend {
    server frontend:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name quantum-thermoledger.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name quantum-thermoledger.com;

    ssl_certificate /etc/nginx/certs/quantum-thermoledger.com.crt;
    ssl_certificate_key /etc/nginx/certs/quantum-thermoledger.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Frontend
    location / {
        proxy_pass http://frontend_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api/ {
        proxy_pass http://api_backend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }

    # WebSocket
    location /ws {
        proxy_pass http://api_backend/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

## Deployment

### 1. Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Database Services
  postgres:
    image: postgres:14
    container_name: qtl-postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./config/postgres.conf:/etc/postgresql/postgresql.conf
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:6.2-alpine
    container_name: qtl-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - ./data/redis:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Hyperledger Fabric Services
  orderer:
    image: hyperledger/fabric-orderer:2.4
    container_name: qtl-orderer
    environment:
      - FABRIC_LOGGING_SPEC=INFO
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_BOOTSTRAPMETHOD=file
      - ORDERER_GENERAL_BOOTSTRAPFILE=/var/hyperledger/orderer/orderer.genesis.block
      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP
      - ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp
    volumes:
      - ./config/genesis.block:/var/hyperledger/orderer/orderer.genesis.block
      - ./crypto-config/ordererOrganizations/quantum-thermoledger.com/orderers/orderer.quantum-thermoledger.com/msp:/var/hyperledger/orderer/msp
      - ./data/fabric/orderer:/var/hyperledger/production/orderer
    ports:
      - "7050:7050"
    restart: unless-stopped

  peer0-org1:
    image: hyperledger/fabric-peer:2.4
    container_name: qtl-peer0-org1
    environment:
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=quantum-thermoledger_default
      - FABRIC_LOGGING_SPEC=INFO
      - CORE_PEER_ID=peer0.org1.quantum-thermoledger.com
      - CORE_PEER_ADDRESS=peer0.org1.quantum-thermoledger.com:7051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:7051
      - CORE_PEER_CHAINCODEADDRESS=peer0.org1.quantum-thermoledger.com:7052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:7052
      - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org1.quantum-thermoledger.com:7051
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org1.quantum-thermoledger.com:7051
      - CORE_PEER_LOCALMSPID=Org1MSP
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb0:5984
    volumes:
      - /var/run/:/host/var/run/
      - ./crypto-config/peerOrganizations/org1.quantum-thermoledger.com/peers/peer0.org1.quantum-thermoledger.com/msp:/etc/hyperledger/fabric/msp
      - ./data/fabric/peer0-org1:/var/hyperledger/production
    ports:
      - "7051:7051"
    depends_on:
      - orderer
      - couchdb0
    restart: unless-stopped

  couchdb0:
    image: couchdb:3.1
    container_name: qtl-couchdb0
    environment:
      - COUCHDB_USER=admin
      - COUCHDB_PASSWORD=adminpw
    volumes:
      - ./data/fabric/couchdb0:/opt/couchdb/data
    ports:
      - "5984:5984"
    restart: unless-stopped

  # Application Services
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: qtl-api
    environment:
      - NODE_ENV=production
      - API_PORT=${API_PORT}
      - POSTGRES_HOST=${POSTGRES_HOST}
      - POSTGRES_PORT=${POSTGRES_PORT}
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    volumes:
      - ./logs/api:/app/logs
      - ./config:/app/config
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
      - peer0-org1
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: qtl-frontend
    environment:
      - NODE_ENV=production
      - REACT_APP_API_URL=https://quantum-thermoledger.com/api
    ports:
      - "3000:3000"
    depends_on:
      - api
    restart: unless-stopped

  nginx:
    image: nginx:1.20-alpine
    container_name: qtl-nginx
    volumes:
      - ./config/nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
      - ./logs/nginx:/var/log/nginx
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
      - frontend
    restart: unless-stopped

  # Monitoring Services
  prometheus:
    image: prom/prometheus:latest
    container_name: qtl-prometheus
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./data/prometheus:/prometheus
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: qtl-grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./data/grafana:/var/lib/grafana
      - ./config/grafana:/etc/grafana/provisioning
    ports:
      - "3001:3000"
    depends_on:
      - prometheus
    restart: unless-stopped

networks:
  default:
    name: quantum-thermoledger_default
```

### 2. Deploy the System

```bash
# Generate crypto materials for Hyperledger Fabric
./scripts/generate-crypto.sh

# Start the services
docker-compose up -d

# Wait for services to be ready
./scripts/wait-for-services.sh

# Deploy smart contracts
./scripts/deploy-contracts.sh

# Initialize database
./scripts/init-database.sh

# Verify deployment
./scripts/verify-deployment.sh
```

### 3. SSL Certificate Setup

```bash
# Using Let's Encrypt (recommended for production)
sudo apt-get install certbot
sudo certbot certonly --standalone -d quantum-thermoledger.com

# Copy certificates
sudo cp /etc/letsencrypt/live/quantum-thermoledger.com/fullchain.pem ./certs/quantum-thermoledger.com.crt
sudo cp /etc/letsencrypt/live/quantum-thermoledger.com/privkey.pem ./certs/quantum-thermoledger.com.key
sudo chown $USER:$USER ./certs/*

# Restart nginx
docker-compose restart nginx
```

## Monitoring

### 1. Prometheus Configuration

Create `config/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'quantum-thermoledger-api'
    static_configs:
      - targets: ['api:8080']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  - job_name: 'fabric-peer'
    static_configs:
      - targets: ['peer0-org1:9443']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### 2. Grafana Dashboards

Create monitoring dashboards for:
- System metrics (CPU, memory, disk, network)
- Application metrics (API response times, error rates)
- Blockchain metrics (transaction throughput, block height)
- Business metrics (quantum validations, thermodynamic processes)

### 3. Log Management

```bash
# Configure log rotation
sudo tee /etc/logrotate.d/quantum-thermoledger << EOF
/opt/quantum-thermoledger/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 qtl qtl
    postrotate
        docker-compose restart api frontend
    endscript
}
EOF
```

## Maintenance

### 1. Backup Strategy

```bash
#!/bin/bash
# backup.sh - Daily backup script

BACKUP_DIR="/backup/quantum-thermoledger/$(date +%Y-%m-%d)"
mkdir -p $BACKUP_DIR

# Database backup
docker exec qtl-postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_DIR/database.sql

# Blockchain data backup
docker exec qtl-peer0-org1 tar -czf - /var/hyperledger/production > $BACKUP_DIR/blockchain-data.tar.gz

# Configuration backup
tar -czf $BACKUP_DIR/config.tar.gz config/

# Upload to cloud storage (AWS S3, Google Cloud, etc.)
aws s3 sync $BACKUP_DIR s3://quantum-thermoledger-backups/$(date +%Y-%m-%d)/

# Cleanup old backups (keep 30 days)
find /backup/quantum-thermoledger -type d -mtime +30 -exec rm -rf {} \;
```

### 2. Update Procedure

```bash
#!/bin/bash
# update.sh - System update script

# Backup current state
./scripts/backup.sh

# Pull latest code
git pull origin main

# Update smart contracts
cd contracts
cargo build --release
cd ..

# Update frontend
cd frontend
npm install
npm run build
cd ..

# Update containers
docker-compose pull
docker-compose up -d --force-recreate

# Verify deployment
./scripts/verify-deployment.sh
```

### 3. Health Checks

```bash
#!/bin/bash
# health-check.sh - System health monitoring

# Check API health
curl -f http://localhost:8080/health || echo "API health check failed"

# Check database connectivity
docker exec qtl-postgres pg_isready -U $POSTGRES_USER || echo "Database health check failed"

# Check blockchain network
docker exec qtl-peer0-org1 peer channel list || echo "Blockchain health check failed"

# Check disk space
df -h | awk '$5 > 80 {print "Disk usage warning: " $0}'

# Check memory usage
free -m | awk 'NR==2{printf "Memory usage: %s/%sMB (%.2f%%)\n", $3,$2,$3*100/$2 }'
```

## Troubleshooting

### Common Issues

#### 1. Smart Contract Deployment Fails

```bash
# Check peer logs
docker logs qtl-peer0-org1

# Verify chaincode package
peer lifecycle chaincode queryinstalled

# Reinstall chaincode
./scripts/deploy-contracts.sh --force
```

#### 2. Database Connection Issues

```bash
# Check PostgreSQL logs
docker logs qtl-postgres

# Test connection
docker exec qtl-postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 1;"

# Reset database
docker-compose down postgres
docker volume rm quantum-thermoledger_postgres_data
docker-compose up -d postgres
./scripts/init-database.sh
```

#### 3. High Memory Usage

```bash
# Check container memory usage
docker stats

# Optimize PostgreSQL settings
# Edit config/postgres.conf and restart
docker-compose restart postgres

# Clear Redis cache
docker exec qtl-redis redis-cli FLUSHALL
```

#### 4. SSL Certificate Issues

```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Update certificate in containers
sudo cp /etc/letsencrypt/live/quantum-thermoledger.com/* ./certs/
docker-compose restart nginx
```

### Performance Tuning

#### 1. Database Optimization

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_quantum_transitions_timestamp ON quantum_transitions(timestamp);
CREATE INDEX idx_thermo_states_substance_id ON thermodynamic_states(substance_id);
CREATE INDEX idx_ledger_entries_block_height ON energy_ledger_entries(block_height);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM quantum_transitions WHERE timestamp > NOW() - INTERVAL '1 day';
```

#### 2. API Performance

```javascript
// Enable compression
app.use(compression());

// Implement caching
const redis = require('redis');
const client = redis.createClient();

app.get('/api/quantum/transitions', cache(300), async (req, res) => {
  // Cached for 5 minutes
});
```

#### 3. Blockchain Performance

```yaml
# Optimize Hyperledger Fabric configuration
CORE_PEER_GOSSIP_USELEADERELECTION: true
CORE_PEER_GOSSIP_ORGLEADER: false
CORE_PEER_PROFILE_ENABLED: true
CORE_LEDGER_STATE_COUCHDBCONFIG_MAXRETRIES: 3
```

For additional support, please refer to the [API Documentation](API.md) or contact the development team.