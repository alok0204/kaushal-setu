import {
  DemoUser,
  CompetencyDefinition,
  AssessmentQuestion,
  IGOTResourceItem,
} from "@/types";

export const APP_CONFIG = {
  name: "Kaushal Setu",
  nameHindi: "कौशल सेतु",
  tagline: "AI-Powered Competency & Personalized Learning Platform",
  description:
    "An intelligent competency assessment and personalized capacity-building platform for India's Official Statistical System, aligned with the iGOT Karmayogi ecosystem.",
  version: "0.1.0",
  targetEcosystem: "India's Official Statistical System (MoSPI, State DES, Subordinate Cadres)",
  frameworkAlignment: "iGOT Karmayogi & Mission Karmayogi Competency Framework",
} as const;

export const TARGET_BENCHMARK = 70; // 70% National Target

export const DEMO_USERS: DemoUser[] = [
  {
    id: "usr_up_01",
    email: "officer.up@stats.gov.in",
    fullName: "Ramesh Kumar",
    cadreId: "MOSPI-UP-84920",
    role: "Statistical Officer",
    stateCode: "UP",
    stateName: "Uttar Pradesh",
    department: "Directorate of Economics & Statistics (DES), Uttar Pradesh",
  },
  {
    id: "usr_mh_02",
    email: "officer.mh@stats.gov.in",
    fullName: "Priya Patil",
    cadreId: "MOSPI-MH-71204",
    role: "Statistical Officer",
    stateCode: "MH",
    stateName: "Maharashtra",
    department: "Directorate of Economics & Statistics (DES), Maharashtra",
  },
  {
    id: "usr_ka_03",
    email: "analyst.ka@stats.gov.in",
    fullName: "Anand Rao",
    cadreId: "MOSPI-KA-38192",
    role: "Data Analyst",
    stateCode: "KA",
    stateName: "Karnataka",
    department: "Directorate of Economics & Statistics (DES), Karnataka",
  },
  {
    id: "usr_rj_04",
    email: "officer.rj@stats.gov.in",
    fullName: "Vikram Singh",
    cadreId: "MOSPI-RJ-59301",
    role: "Statistical Officer",
    stateCode: "RJ",
    stateName: "Rajasthan",
    department: "Directorate of Economics & Statistics (DES), Rajasthan",
  },
];

export const COMPETENCIES: CompetencyDefinition[] = [
  {
    id: "data_analysis",
    name: "Data Analysis",
    domain: "NSSO Schedule Scrutiny & Outlier Detection",
    mandate: "Census & Household Survey Validation",
    targetScore: TARGET_BENCHMARK,
    description: "Validation of microdata schedules, identifying outliers, and ensuring consistency across rounds.",
  },
  {
    id: "statistical_methods",
    name: "Statistical Methods",
    domain: "Standard Error Estimation & Weights Computation",
    mandate: "Stratified Sampling & Multi-stage Probability",
    targetScore: TARGET_BENCHMARK,
    description: "Application of sampling frames, probability weight computation, and hypothesis testing in official surveys.",
  },
  {
    id: "data_visualization",
    name: "Data Visualization",
    domain: "Geospatial Mapping & Administrative Infographics",
    mandate: "State Indicator Dashboards & District Profiles",
    targetScore: TARGET_BENCHMARK,
    description: "Communicating key statistical indicators, SDG district indices, and executive visual briefs.",
  },
  {
    id: "statistical_computing",
    name: "Statistical Computing",
    domain: "Scripting & Large Microdata Transformation",
    mandate: "Python / R for Microdata Automation",
    targetScore: TARGET_BENCHMARK,
    description: "Reproducible scripted pipelines, batch processing of NSSO/PLFS microdata, and automated report pipelines.",
  },
  {
    id: "ai_digital_skills",
    name: "AI & Digital Skills",
    domain: "Automated Census Imputation & ML Modeling",
    mandate: "AI/ML Assisted Official Statistics & Governance",
    targetScore: TARGET_BENCHMARK,
    description: "Application of machine learning, modern imputation algorithms, and digital security in statistical governance.",
  },
];

export const INITIAL_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // 1. Data Analysis (Q1 & Q2)
  {
    id: "q_da_1",
    competencyId: "data_analysis",
    question: "In NSSO household consumer expenditure surveys, what is the standard protocol for handling extreme outlier consumption values before data release?",
    options: [
      "Automatically replace all extreme values with zero without verification",
      "Conduct field schedule verification, check item units, and apply Winsorization/trimmed imputation if erroneous",
      "Delete the entire household sample record from the dataset",
      "Multiply extreme values by the district average weight",
    ],
    correctAnswer: 1,
    explanation: "Standard statistical protocol requires scrutiny of recorded item units and manual schedule verification, followed by bounded imputation or Winsorization rather than blind deletion.",
  },
  {
    id: "q_da_2",
    competencyId: "data_analysis",
    question: "When validating Periodic Labour Force Survey (PLFS) microdata, which cross-validation check is essential for household activity status?",
    options: [
      "Ensuring principal activity status is consistent with recorded age and educational attendance",
      "Ensuring all members have identical industry codes",
      "Checking that rural households have zero non-agricultural earnings",
      "Verifying that household expenditure equals exact monthly wage earnings",
    ],
    correctAnswer: 0,
    explanation: "Demographic consistency between age, school attendance, and labor force participation codes is a fundamental sanity check in official labor surveys.",
  },

  // 2. Statistical Methods (Q3 & Q4)
  {
    id: "q_sm_1",
    competencyId: "statistical_methods",
    question: "In a two-stage stratified sampling design (e.g. NSS rounds with Census villages as First Stage Units and households as Second Stage Units), how is the design multiplier (base weight) defined?",
    options: [
      "The sample standard deviation divided by the total population",
      "The inverse of the joint inclusion probability of the sample unit",
      "The ratio of urban population to rural population in the district",
      "A fixed constant equal to 100 for all sample units",
    ],
    correctAnswer: 1,
    explanation: "Under Horvitz-Thompson estimation principles, design weights are calculated as the inverse of the inclusion probability of the sampling unit across both stages.",
  },
  {
    id: "q_sm_2",
    competencyId: "statistical_methods",
    question: "Which method is standard in official sample survey analytics to compute accurate standard errors under complex multi-stage cluster designs?",
    options: [
      "Simple Random Sampling (SRS) standard deviation formulas",
      "Linearized Taylor Series or Jackknife/Bootstrap cluster variance estimation",
      "Arbitrary percentage margin addition (+/- 5%)",
      "Dividing the variance by the number of survey investigators",
    ],
    correctAnswer: 1,
    explanation: "Official statistics standards (MoSPI / UN Statistics Division) mandate Taylor series linearization or balanced repeated replication (Jackknife/BRR) to account for clustering and stratification.",
  },

  // 3. Data Visualization (Q5 & Q6)
  {
    id: "q_dv_1",
    competencyId: "data_visualization",
    question: "When presenting district-level SDG scores across a State Directorate of Economics and Statistics report, which visualization technique is most effective?",
    options: [
      "A 3D pie chart with exploding slices",
      "A choropleth thematic map categorized into standard performance tiers alongside sorted bar rankings",
      "A continuous rainbow line chart with 75 overlapping district lines",
      "A word cloud of district names",
    ],
    correctAnswer: 1,
    explanation: "Choropleth maps combined with sorted horizontal bar charts provide immediate spatial context and rank clarity without misleading visual distortion.",
  },
  {
    id: "q_dv_2",
    competencyId: "data_visualization",
    question: "Why is it critical to normalize regional demographic counts into rates or per-capita indicators before geospatial comparison?",
    options: [
      "To avoid merely reproducing a population density distribution map",
      "Because software cannot plot raw numbers on maps",
      "Because smaller districts are legally prohibited from displaying counts",
      "To artificially compress all differences to zero",
    ],
    correctAnswer: 0,
    explanation: "Mapping raw counts usually shows where people live rather than the underlying indicator intensity; normalization into rates per 100k or percentages gives true comparative insight.",
  },

  // 4. Statistical Computing (Q7 & Q8)
  {
    id: "q_sc_1",
    competencyId: "statistical_computing",
    question: "When processing large official microdata files (several gigabytes) in Python/R, which practice is recommended to ensure reproducible and robust computation?",
    options: [
      "Modifying raw source CSV files manually in desktop spreadsheet software",
      "Using scripted pipelines with chunked/lazy loading, immutable raw data directories, and version-controlled scripts",
      "Copy-pasting data columns into text files",
      "Skipping data types validation to speed up memory ingestion",
    ],
    correctAnswer: 1,
    explanation: "Best practice in statistical computing involves scripted end-to-end data pipelines that preserve immutable raw inputs and maintain versioned reproducible transformations.",
  },
  {
    id: "q_sc_2",
    competencyId: "statistical_computing",
    question: "In R or Python, what is the primary benefit of vectorization over explicit nested loops for computing survey aggregate statistics?",
    options: [
      "Vectorization prevents any syntax errors from occurring",
      "Vectorization delegates operations to optimized low-level C/Fortran routines, drastically improving speed and code maintainability",
      "Vectorization increases file storage size on disk",
      "Vectorization requires internet access for execution",
    ],
    correctAnswer: 1,
    explanation: "Vectorized operations run in compiled C/C++ backends, reducing runtime from minutes to milliseconds on multi-million row microdata files.",
  },

  // 5. AI & Digital Skills (Q9 & Q10)
  {
    id: "q_ai_1",
    competencyId: "ai_digital_skills",
    question: "In applying Machine Learning for missing value imputation in official surveys, what safeguard must statistical officers maintain?",
    options: [
      "No documentation of the algorithm used",
      "Transparent audit trails, flag indicators for imputed values, and validation of distributional variance preservation",
      "Imputing only based on social media trends",
      "Overwriting original response flags so users cannot tell which values were imputed",
    ],
    correctAnswer: 1,
    explanation: "Official statistical governance standards mandate explicit imputation flags, algorithmic transparency, and verification that imputed distributions do not distort survey estimates.",
  },
  {
    id: "q_ai_2",
    competencyId: "ai_digital_skills",
    question: "How does satellite remote sensing combined with convolutional neural networks assist State statistical departments in agricultural estimates?",
    options: [
      "It completely eliminates the need for crop classification standards",
      "It provides objective, high-frequency crop acreage and NDVI yield forecasts to augment crop cutting experiments (CCEs)",
      "It generates random agricultural tax assessments",
      "It replaces all national weather forecasting systems",
    ],
    correctAnswer: 1,
    explanation: "AI-driven remote sensing complements field Crop Cutting Experiments (CCEs) by providing spatial coverage, acreage estimation, and vegetation anomaly detection.",
  },
];

export const IGOT_RESOURCES: IGOTResourceItem[] = [
  // Statistical Methods
  {
    id: "res_sm_01",
    title: "Foundations of Statistical Data Analysis",
    competencyId: "statistical_methods",
    difficulty: "Intermediate",
    durationHours: 4.0,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Master variance calculations, stratification algorithms, and state-level sampling frameworks co-authored by NSSTA.",
    provider: "National Statistical Systems Training Academy (NSSTA)",
    courseCode: "KRM-MOSP-2024-ST1",
    curatedTag: "Priority Fit",
  },
  {
    id: "res_sm_02",
    title: "Applied Statistical Methods & Survey Sampling",
    competencyId: "statistical_methods",
    difficulty: "Intermediate",
    durationHours: 5.5,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Builds on competency to prepare for complex state-level survey analytics, NSSO round calculations, and stratified district sampling frameworks.",
    provider: "MoSPI Central Training Division",
    courseCode: "KRM-MOSP-2024-ST2",
    curatedTag: "Standard Track",
  },
  {
    id: "res_sm_03",
    title: "Advanced Sampling Designs & Weight Computation",
    competencyId: "statistical_methods",
    difficulty: "Advanced",
    durationHours: 6.0,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Multi-stage cluster probability, non-response adjustments, and Jackknife variance estimation.",
    provider: "iGOT Karmayogi / MoSPI",
    courseCode: "KRM-MOSP-2024-ST3",
  },

  // Data Analysis
  {
    id: "res_da_01",
    title: "NSSO Schedule Scrutiny & Microdata Validation",
    competencyId: "data_analysis",
    difficulty: "Intermediate",
    durationHours: 3.5,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Official procedures for data cleaning, logic checks, household roster consistency, and schedule audit rules.",
    provider: "National Statistical Office (NSO)",
    courseCode: "KRM-MOSP-2024-DA1",
    curatedTag: "Core Mandate",
  },
  {
    id: "res_da_02",
    title: "Economic Census & Enterprise Survey Diagnostics",
    competencyId: "data_analysis",
    difficulty: "Intermediate",
    durationHours: 4.5,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Auditing enterprise surveys, ASI microdata, and national accounts input validation.",
    provider: "National Statistical Systems Training Academy",
    courseCode: "KRM-MOSP-2024-DA2",
  },

  // Data Visualization
  {
    id: "res_dv_01",
    title: "Data Visualization for Government & Official Statistics",
    competencyId: "data_visualization",
    difficulty: "Beginner",
    durationHours: 2.5,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Principles of executive statistical chart construction, geospatial thematic cartography, and avoiding misleading visuals.",
    provider: "DoPT / iGOT Karmayogi",
    courseCode: "KRM-MOSP-2024-DV1",
    curatedTag: "Standard Track",
  },
  {
    id: "res_dv_02",
    title: "GIS & Spatial Analytics for State DES Officers",
    competencyId: "data_visualization",
    difficulty: "Intermediate",
    durationHours: 4.0,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "QGIS and web dashboards for visualizing district-level SDG indicators and administrative boundaries.",
    provider: "Indian Institute of Remote Sensing (IIRS)",
    courseCode: "KRM-MOSP-2024-DV2",
  },

  // Statistical Computing
  {
    id: "res_sc_01",
    title: "Python for Official Statistics & Microdata Processing",
    competencyId: "statistical_computing",
    difficulty: "Intermediate",
    durationHours: 5.0,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Automate large survey processing, extract NSS unit-level datasets, and generate reproducible State DES indicators.",
    provider: "iGOT Karmayogi Digital Cadre",
    courseCode: "KRM-MOSP-2024-SC1",
    curatedTag: "High Demand",
  },
  {
    id: "res_sc_02",
    title: "R Programming for Statistical Estimation & Tabulation",
    competencyId: "statistical_computing",
    difficulty: "Intermediate",
    durationHours: 4.5,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Survey package in R, complex sample designs, and official publication-ready cross-tabulations.",
    provider: "National Statistical Systems Training Academy",
    courseCode: "KRM-MOSP-2024-SC2",
  },

  // AI & Digital Skills
  {
    id: "res_ai_01",
    title: "AI & Emerging Technologies in Official Statistics",
    competencyId: "ai_digital_skills",
    difficulty: "Advanced",
    durationHours: 6.0,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Machine learning paradigms for automated household survey validation, imputation algorithms, and ethics in public data.",
    provider: "Mission Karmayogi Digital Academy",
    courseCode: "KRM-MOSP-2024-AI1",
    curatedTag: "Emerging Tech",
  },
  {
    id: "res_ai_02",
    title: "AI Ethics & Data Governance for Civil Servants",
    competencyId: "ai_digital_skills",
    difficulty: "Beginner",
    durationHours: 2.0,
    igotUrl: "https://igotkarmayogi.gov.in/",
    description: "Responsible AI guidelines, data protection standards, and auditability in government analytics.",
    provider: "DoPT / Capacity Building Commission (CBC)",
    courseCode: "KRM-MOSP-2024-AI2",
  },
];
