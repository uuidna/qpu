# Data Integration Setup: Real-World Validation

**Purpose:** Connect real data sources for Phase 1 automation (starting Oct 6, 2026)  
**Status:** Setup guide (ready to configure)  
**Timeline:** Complete before Oct 6 for Phase 1A health validation

---

## PHASE 1A: HEALTH DATA SOURCES

### 1. Kaggle Health Datasets

**Dataset:** Patient Risk Prediction + Health Records  
**Size:** 100K+ patient records  
**Access:** Kaggle API

**Setup:**
```bash
# Install Kaggle CLI
pip install kaggle

# Configure credentials
mkdir ~/.kaggle
cp kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json

# Download datasets
kaggle datasets download -d <dataset-id>

# Verify
ls -lh kaggle/patient-risk-prediction/
```

**Dataset IDs to download:**
- `bmihalyi/patient-risk-prediction` (100K records)
- `ncbi/gene-expression-omnibus` (health markers)
- `datafiniti/medical-prescriptions` (medication data)

**Expected:** 100K patient records with demographics, medical history, vital signs

---

### 2. MIMIC-III Clinical Database

**Dataset:** ICU records from Beth Israel Deaconess Medical Center  
**Size:** 40K+ ICU admissions  
**Access:** PhysioNet (requires registration + training)

**Setup:**
```bash
# Register at https://physionet.org
# Complete training: CITI Data or Ethics Training
# Request access to MIMIC-III

# Once approved, download:
wget -r -N -c -l inf --user=<username> --password=<password> \
  https://physionet.org/files/mimiciii/1.4/

# Extract
tar -xzf mimic-iii.tar.gz
```

**Expected:** 40K ICU records with:
- Patient demographics
- Vital signs (heart rate, blood pressure, O2 sat, temperature)
- Lab results (glucose, electrolytes, blood counts)
- Medications administered
- Outcomes (mortality, readmission, length of stay)

**Test Queries:**
```sql
-- Verify data loaded
SELECT COUNT(*) FROM admissions;  -- Should be ~40K
SELECT COUNT(*) FROM icustays;    -- Should be ~76K
SELECT COUNT(*) FROM chartevents; -- Should be ~330M rows
```

---

### 3. NHS Baseline Data (UK Health Data)

**Dataset:** UK population health statistics  
**Size:** 500K+ population sample  
**Access:** UK Data Archive (public + controlled)

**Setup:**
```bash
# Register at https://www.data.ac.uk
# Download NHS Digital datasets

# Public datasets (immediate):
# - Health Survey for England (annual, 8K+ per year)
# - National Disease Registers
# - Prescriptions in Primary Care
# - Hospital Episode Statistics (HES)

wget https://files.digital.nhs.uk/datasets/download/nhs-dataset.zip
unzip nhs-dataset.zip
```

**Expected:** Population baseline data for calibration:
- Median life expectancy: 79-81 years
- Disease prevalence (diabetes, cardiovascular, cancer)
- Medication usage patterns
- Regional variations

---

## PHASE 1B: CLIMATE DATA SOURCES

### 1. NOAA Climate Data

**Dataset:** 50+ years of climate observations  
**Access:** NOAA Global Monitoring Laboratory  
**Size:** 500+ global monitoring stations

**Setup:**
```bash
# Download NOAA climate data
wget https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_monthly_mlo.txt

# Download temperature data
wget https://www.ncei.noaa.gov/products/climate-data-records/global-temperature-monthly

# Parse and ingest
python scripts/ingest-noaa-data.py \
  --source gml.noaa.gov \
  --dataset co2_trends \
  --output data/climate/
```

**Expected:** Time-series data:
- CO2 concentration (ppm) - monthly since 1958
- Temperature anomalies (vs 1951-1980 baseline)
- Precipitation patterns
- Sea level rise
- Ice extent measurements

---

### 2. CBD Global Biodiversity Data

**Dataset:** Species distributions, conservation status  
**Access:** Convention on Biological Diversity Database  
**Size:** 1M+ species records

**Setup:**
```bash
# Download from CBD
wget https://api.cbd.int/v1/biodiversity/species-data.json

# Alternative: GBIF (Global Biodiversity Information Facility)
wget https://www.gbif.org/occurrences/download \
  --filter=country:US \
  --filter=hasCoordinate:true
```

**Expected:** Species data:
- Distribution maps (10K+ species)
- Conservation status (IUCN Red List)
- Population trends
- Habitat requirements
- Threat assessments

---

### 3. IUCN Red List API

**Dataset:** Endangered species assessments  
**Access:** IUCN API (free tier)  
**Size:** 150K+ assessed species

**Setup:**
```bash
# Register for API key
# https://www.iucnredlist.org/api

# Query endangered species
curl "https://api.iucnredlist.org/api/v3/statistics" \
  --header "Authorization: Token $IUCN_API_KEY"

# Download full database
python scripts/fetch-iucn-data.py \
  --api-key $IUCN_API_KEY \
  --output data/biodiversity/iucn/
```

**Expected:** Conservation assessments:
- Species threat level (CR, EN, VU, NT, LC)
- Population trend direction
- Geographic range
- Conservation actions
- Habitat loss rates

---

## PHASE 1C: RESOURCES DATA SOURCES

### 1. World Bank Open Data

**Dataset:** Waste management, circular economy metrics  
**Access:** World Bank Open Data API  
**Size:** 300+ countries, 50-year history

**Setup:**
```bash
# World Bank API (no auth required)
curl "https://api.worldbank.org/v2/country/indicators/EN.ATM.METH.KT.CE"

# Download waste data
python scripts/fetch-worldbank-data.py \
  --indicators waste_generation waste_recycling \
  --output data/resources/
```

**Expected:** Economic data:
- Waste generation (tons/year/capita)
- Recycling rates by material type
- Waste management spending
- GDP per capita (for normalization)
- Population growth

---

### 2. Ellen MacArthur Circular Economy Data

**Dataset:** Circular economy metrics, material flows  
**Access:** Ellen MacArthur Foundation Database  
**Size:** Industry benchmarks

**Setup:**
```bash
# Ellen MacArthur reports (public PDFs)
wget https://www.ellenmacarthurfoundation.org/reports

# Parse and extract:
# - Material recovery rates
# - Circular economy ROI
# - Industry best practices
# - Regional performance

python scripts/parse-em-reports.py \
  --pdf-dir reports/ \
  --output data/resources/circular-economy/
```

**Expected:** Circular economy benchmarks:
- Recovery rates by material (plastic, metal, paper, etc.)
- Economic value of recovered materials
- Job creation potential
- Carbon savings
- Regional case studies

---

### 3. UNEP Waste Data

**Dataset:** UN Environmental Programme waste statistics  
**Access:** UNEP Data Portal  
**Size:** Global waste inventory

**Setup:**
```bash
# UNEP waste data
wget https://www.unep.org/resources/data/waste-atlas

# Process waste data
python scripts/fetch-unep-data.py \
  --source waste-atlas \
  --output data/resources/unep/
```

**Expected:** Global waste data:
- Waste type breakdown
- Management methods (landfill, incinerate, recycle, etc.)
- Hazardous waste inventories
- E-waste quantities
- Plastic waste hotspots

---

## LIVE API INTEGRATIONS

### 35+ APIs to Connect (Phase 2)

**Health Domain (10 APIs):**
1. AWS Health Forecast API
2. Google Calico (via research partnership)
3. Mayo Clinic Biomarker API
4. NIH National Library of Medicine
5. Cleveland Clinic EMR Integration
6. Stanford Health API
7. Johns Hopkins COVID Tracking
8. CDC Disease Tracking API
9. FDA Adverse Events Reporting
10. European Medicines Agency

**Climate Domain (10 APIs):**
1. NOAA Weather API
2. ECMWF Climate Data Store
3. NASA GISS Temperature
4. NSIDC Arctic Sea Ice
5. Global Forest Watch API
6. Carbon Dioxide Information Center
7. Ocean Acidification Program
8. IPCC AR6 Data Portal
9. ERA5 Reanalysis Data
10. Copernicus Climate Data Store

**Resources Domain (8 APIs):**
1. World Bank Open Data API
2. Ellen MacArthur Foundation API
3. UNEP Data Services
4. International Trade Centre
5. National Waste Registries (10+ countries)
6. Recycling Facilities Directory
7. Material Recovery Prices
8. Supply Chain Transparency (Blockchain)

**General Infrastructure (7 APIs):**
1. Kaggle API (dataset discovery)
2. PhysioNet API (clinical data)
3. Zenodo API (open science data)
4. GitHub API (code + data)
5. Hugging Face API (ML models)
6. OpenStreetMap (geo data)
7. Wikidata API (reference data)

---

## DATA VALIDATION & QUALITY

### Pre-Ingestion Checks
```python
def validate_data(df):
    checks = {
        'missing_values': df.isnull().sum() / len(df),
        'duplicates': df.duplicated().sum(),
        'data_types': df.dtypes,
        'date_range': (df['date'].min(), df['date'].max()),
        'numeric_ranges': df.describe(),
        'categorical_uniqueness': df.nunique()
    }
    
    # Flag issues
    if checks['missing_values'].max() > 0.5:
        raise DataQualityError("Too many missing values")
    if checks['duplicates'] > 0:
        log.warning(f"Found {checks['duplicates']} duplicates")
    
    return checks
```

### Expected Quality Scores
- Kaggle health data: 92% quality
- MIMIC-III: 94% quality (research-grade)
- NHS baseline: 96% quality (official statistics)
- NOAA climate: 95% quality (scientific observation)
- IUCN Red List: 91% quality (peer-reviewed)
- World Bank: 93% quality (audited)

---

## AUTHENTICATION & SECRETS

### Environment Variables to Set

```bash
# Health Data
export KAGGLE_USERNAME="your-username"
export KAGGLE_API_KEY="your-api-key"
export MIMIC_USERNAME="physionet-user"
export MIMIC_PASSWORD="physionet-pass"
export NHS_API_KEY="nhs-data-key"

# Climate Data
export NOAA_API_KEY="noaa-key"
export IUCN_API_KEY="iucn-key"
export CBD_API_KEY="cbd-key"

# Resources Data
export WORLDBANK_API_KEY="wb-key"
export UNEP_API_KEY="unep-key"

# Storage
export DATA_BUCKET="s3://qpu-data-production"
export BACKUP_BUCKET="s3://qpu-data-backup"
```

### Secure Storage (AWS Secrets Manager)
```bash
aws secretsmanager create-secret \
  --name qpu/data-source/kaggle \
  --secret-string '{"api_key":"...","username":"..."}'
```

---

## DATA PIPELINE

### Ingestion Flow
```
Raw Data Source
    ↓
Download/Stream
    ↓
Validate Quality
    ↓
Normalize Format
    ↓
Remove PII
    ↓
Store (S3 + RDS)
    ↓
Index (Elasticsearch)
    ↓
Ready for Phase 1A
```

### Storage Architecture
```
s3://qpu-production/
├── health/
│   ├── kaggle/ (100GB)
│   ├── mimic-iii/ (50GB)
│   └── nhs/ (30GB)
├── climate/
│   ├── noaa/ (500GB)
│   ├── cbd/ (100GB)
│   └── iucn/ (50GB)
├── resources/
│   ├── worldbank/ (20GB)
│   ├── circular/ (10GB)
│   └── unep/ (15GB)
└── metadata/
    └── catalogs/ (ingestion logs)
```

---

## TIMELINE FOR SETUP

**By Oct 1:** Research & API access requests (IN PROGRESS)  
**By Oct 4:** Download & validate all datasets  
**By Oct 5:** Complete data pipeline setup  
**By Oct 6:** Phase 1A automation runs with real data ✅  
**By Oct 13:** Results: Real data validation complete

---

## SUCCESS METRICS

### Data Completeness
- Kaggle: 100K+ records ingested
- MIMIC-III: 40K ICU stays indexed
- NHS: 500K population sample loaded
- NOAA: 50 years climate history available
- IUCN: 150K species assessments loaded
- World Bank: 300+ countries, 50-year data

### Data Quality
- Missing values: <5% per column
- Duplicates: <1%
- Schema validation: 100% pass
- Date ranges: Complete coverage
- Geographic coverage: >95% of target regions

### Access Speed
- Kaggle queries: <100ms
- MIMIC queries: <500ms
- Climate lookups: <200ms
- Biodiversity queries: <300ms
- World Bank API: <1s

---

## FAILURE RECOVERY

If data ingestion fails:

```
1. Check API status (is service down?)
2. Verify credentials (expired tokens?)
3. Validate network (VPN issues?)
4. Check data format (schema changed?)
5. Review disk space (storage full?)
6. Fall back to cached version (use backup)
7. Alert ops team (manual intervention needed)
```

---

## NEXT STEPS

1. **Request API Access** (Days 1-3)
   - Kaggle: Immediate
   - PhysioNet (MIMIC): 2-5 days
   - NHS Data: 3-7 days
   - IUCN: Immediate

2. **Download Datasets** (Days 4-5)
   - ~600GB total data
   - Parallel downloads recommended
   - Verify checksums

3. **Validate Data** (Day 5)
   - Run quality checks
   - Fix any issues
   - Document findings

4. **Deploy Pipeline** (Day 6)
   - Ingestion scripts
   - Normalization
   - Indexing

5. **Test Automation** (Oct 5)
   - Local test run
   - Verify data is accessible
   - Confirm Phase 1A can execute

6. **Phase 1A Execution** (Oct 6)
   - GitHub Actions runs
   - Real data validation begins
   - Results published Oct 13

---

**Status:** Ready to setup  
**Timeline:** Oct 1-6 (complete before Phase 1A)  
**Investment:** $0-2K (mainly API costs)  
**Next:** Begin API access requests
