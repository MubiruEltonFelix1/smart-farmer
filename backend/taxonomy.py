"""
taxonomy.py — shared, dependency-free taxonomy for Smart Farmer crop diagnosis.

This module holds the PlantVillage class labels (tomato, potato, bell pepper)
plus expanded classes for Cassava, Maize, Coffee, Banana and Rice — crops
common across sub-Saharan Africa.

Both the Bedrock provider and the ONNX provider import from this module.
It must not import anything so it can be used without ML dependencies
installed.
"""

# ─── Class labels ────────────────────────────────────────────────────────────
# Original PlantVillage classes (tomato, potato, bell pepper)
# plus African-crop extensions (cassava, maize, coffee, banana, rice).
PLANTVILLAGE_CLASSES = [
    # Bell Pepper (original)
    "Pepper__bell___Bacterial_spot",                        #  0
    "Pepper__bell___healthy",                               #  1
    # Potato (original)
    "Potato___Early_blight",                                #  2
    "Potato___healthy",                                     #  3
    "Potato___Late_blight",                                 #  4
    # Tomato (original)
    "Tomato__Target_Spot",                                  #  5
    "Tomato__Tomato_mosaic_virus",                          #  6
    "Tomato__Tomato_YellowLeaf__Curl_Virus",                #  7
    "Tomato_Bacterial_spot",                                #  8
    "Tomato_Early_blight",                                  #  9
    "Tomato_healthy",                                       # 10
    "Tomato_Late_blight",                                   # 11
    "Tomato_Leaf_Mold",                                     # 12
    "Tomato_Septoria_leaf_spot",                            # 13
    "Tomato_Spider_mites_Two_spotted_spider_mite",          # 14
    # Cassava (extended)
    "Cassava_Mosaic_Disease",                               # 15
    "Cassava_Brown_Streak_Disease",                         # 16
    "Cassava_Bacterial_Blight",                             # 17
    "Cassava_Green_Mite",                                   # 18
    "Cassava_healthy",                                      # 19
    # Maize / Corn (extended)
    "Maize_Gray_Leaf_Spot",                                 # 20
    "Maize_Common_Rust",                                    # 21
    "Maize_Northern_Leaf_Blight",                           # 22
    "Maize_Fall_Armyworm",                                  # 23
    "Maize_healthy",                                        # 24
    # Coffee (extended)
    "Coffee_Leaf_Rust",                                     # 25
    "Coffee_Berry_Disease",                                 # 26
    "Coffee_Leaf_Miner",                                    # 27
    "Coffee_healthy",                                       # 28
    # Banana (extended)
    "Banana_Black_Sigatoka",                                # 29
    "Banana_Yellow_Sigatoka",                               # 30
    "Banana_Panama_Disease_Fusarium_Wilt",                  # 31
    "Banana_Xanthomonas_Wilt",                              # 32
    "Banana_healthy",                                       # 33
    # Rice (extended)
    "Rice_Blast",                                           # 34
    "Rice_Brown_Spot",                                      # 35
    "Rice_Sheath_Blight",                                   # 36
    "Rice_Bacterial_Leaf_Blight",                           # 37
    "Rice_healthy",                                         # 38
]

# ─── Human-readable display names ────────────────────────────────────────────
DISPLAY_NAMES = {
    # Bell Pepper
    "Pepper__bell___Bacterial_spot":               "Bacterial Spot",
    "Pepper__bell___healthy":                      "Healthy",
    # Potato
    "Potato___Early_blight":                       "Early Blight",
    "Potato___healthy":                            "Healthy",
    "Potato___Late_blight":                        "Late Blight",
    # Tomato
    "Tomato__Target_Spot":                         "Target Spot",
    "Tomato__Tomato_mosaic_virus":                 "Tomato Mosaic Virus",
    "Tomato__Tomato_YellowLeaf__Curl_Virus":       "Yellow Leaf Curl Virus",
    "Tomato_Bacterial_spot":                       "Bacterial Spot",
    "Tomato_Early_blight":                         "Early Blight",
    "Tomato_healthy":                              "Healthy",
    "Tomato_Late_blight":                          "Late Blight",
    "Tomato_Leaf_Mold":                            "Leaf Mold",
    "Tomato_Septoria_leaf_spot":                   "Septoria Leaf Spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Spider Mites (Two-spotted)",
    # Cassava
    "Cassava_Mosaic_Disease":                      "Cassava Mosaic Disease",
    "Cassava_Brown_Streak_Disease":                "Cassava Brown Streak Disease",
    "Cassava_Bacterial_Blight":                    "Bacterial Blight",
    "Cassava_Green_Mite":                          "Green Mite Infestation",
    "Cassava_healthy":                             "Healthy",
    # Maize
    "Maize_Gray_Leaf_Spot":                        "Gray Leaf Spot",
    "Maize_Common_Rust":                           "Common Rust",
    "Maize_Northern_Leaf_Blight":                  "Northern Leaf Blight",
    "Maize_Fall_Armyworm":                         "Fall Armyworm",
    "Maize_healthy":                               "Healthy",
    # Coffee
    "Coffee_Leaf_Rust":                            "Coffee Leaf Rust",
    "Coffee_Berry_Disease":                        "Coffee Berry Disease (CBD)",
    "Coffee_Leaf_Miner":                           "Coffee Leaf Miner",
    "Coffee_healthy":                              "Healthy",
    # Banana
    "Banana_Black_Sigatoka":                       "Black Sigatoka",
    "Banana_Yellow_Sigatoka":                      "Yellow Sigatoka",
    "Banana_Panama_Disease_Fusarium_Wilt":         "Panama Disease (Fusarium Wilt)",
    "Banana_Xanthomonas_Wilt":                     "Xanthomonas Wilt (BXW)",
    "Banana_healthy":                              "Healthy",
    # Rice
    "Rice_Blast":                                  "Rice Blast",
    "Rice_Brown_Spot":                             "Brown Spot",
    "Rice_Sheath_Blight":                          "Sheath Blight",
    "Rice_Bacterial_Leaf_Blight":                  "Bacterial Leaf Blight",
    "Rice_healthy":                                "Healthy",
}

# ─── Crop name mapping ───────────────────────────────────────────────────────
CROP_MAP = {
    # Bell Pepper
    "Pepper__bell___Bacterial_spot":               "Bell Pepper",
    "Pepper__bell___healthy":                      "Bell Pepper",
    # Potato
    "Potato___Early_blight":                       "Potato",
    "Potato___healthy":                            "Potato",
    "Potato___Late_blight":                        "Potato",
    # Tomato
    "Tomato__Target_Spot":                         "Tomato",
    "Tomato__Tomato_mosaic_virus":                 "Tomato",
    "Tomato__Tomato_YellowLeaf__Curl_Virus":       "Tomato",
    "Tomato_Bacterial_spot":                       "Tomato",
    "Tomato_Early_blight":                         "Tomato",
    "Tomato_healthy":                              "Tomato",
    "Tomato_Late_blight":                          "Tomato",
    "Tomato_Leaf_Mold":                            "Tomato",
    "Tomato_Septoria_leaf_spot":                   "Tomato",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Tomato",
    # Cassava
    "Cassava_Mosaic_Disease":                      "Cassava",
    "Cassava_Brown_Streak_Disease":                "Cassava",
    "Cassava_Bacterial_Blight":                    "Cassava",
    "Cassava_Green_Mite":                          "Cassava",
    "Cassava_healthy":                             "Cassava",
    # Maize
    "Maize_Gray_Leaf_Spot":                        "Maize",
    "Maize_Common_Rust":                           "Maize",
    "Maize_Northern_Leaf_Blight":                  "Maize",
    "Maize_Fall_Armyworm":                         "Maize",
    "Maize_healthy":                               "Maize",
    # Coffee
    "Coffee_Leaf_Rust":                            "Coffee",
    "Coffee_Berry_Disease":                        "Coffee",
    "Coffee_Leaf_Miner":                           "Coffee",
    "Coffee_healthy":                              "Coffee",
    # Banana
    "Banana_Black_Sigatoka":                       "Banana",
    "Banana_Yellow_Sigatoka":                      "Banana",
    "Banana_Panama_Disease_Fusarium_Wilt":         "Banana",
    "Banana_Xanthomonas_Wilt":                     "Banana",
    "Banana_healthy":                              "Banana",
    # Rice
    "Rice_Blast":                                  "Rice",
    "Rice_Brown_Spot":                             "Rice",
    "Rice_Sheath_Blight":                          "Rice",
    "Rice_Bacterial_Leaf_Blight":                  "Rice",
    "Rice_healthy":                                "Rice",
}

# ─── Severity mapping ────────────────────────────────────────────────────────
SEVERITY_MAP = {
    # Bell Pepper
    "Pepper__bell___Bacterial_spot":               "High",
    "Pepper__bell___healthy":                      "Healthy",
    # Potato
    "Potato___Early_blight":                       "Moderate",
    "Potato___healthy":                            "Healthy",
    "Potato___Late_blight":                        "High",
    # Tomato
    "Tomato__Target_Spot":                         "Moderate",
    "Tomato__Tomato_mosaic_virus":                 "High",
    "Tomato__Tomato_YellowLeaf__Curl_Virus":       "High",
    "Tomato_Bacterial_spot":                       "High",
    "Tomato_Early_blight":                         "Moderate",
    "Tomato_healthy":                              "Healthy",
    "Tomato_Late_blight":                          "High",
    "Tomato_Leaf_Mold":                            "Moderate",
    "Tomato_Septoria_leaf_spot":                   "Moderate",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Moderate",
    # Cassava
    "Cassava_Mosaic_Disease":                      "High",
    "Cassava_Brown_Streak_Disease":                "High",
    "Cassava_Bacterial_Blight":                    "High",
    "Cassava_Green_Mite":                          "Moderate",
    "Cassava_healthy":                             "Healthy",
    # Maize
    "Maize_Gray_Leaf_Spot":                        "Moderate",
    "Maize_Common_Rust":                           "Moderate",
    "Maize_Northern_Leaf_Blight":                  "High",
    "Maize_Fall_Armyworm":                         "High",
    "Maize_healthy":                               "Healthy",
    # Coffee
    "Coffee_Leaf_Rust":                            "High",
    "Coffee_Berry_Disease":                        "High",
    "Coffee_Leaf_Miner":                           "Moderate",
    "Coffee_healthy":                              "Healthy",
    # Banana
    "Banana_Black_Sigatoka":                       "High",
    "Banana_Yellow_Sigatoka":                      "Moderate",
    "Banana_Panama_Disease_Fusarium_Wilt":         "High",
    "Banana_Xanthomonas_Wilt":                     "High",
    "Banana_healthy":                              "Healthy",
    # Rice
    "Rice_Blast":                                  "High",
    "Rice_Brown_Spot":                             "Moderate",
    "Rice_Sheath_Blight":                          "High",
    "Rice_Bacterial_Leaf_Blight":                  "High",
    "Rice_healthy":                                "Healthy",
}

# ─── Status mapping ──────────────────────────────────────────────────────────
STATUS_MAP = {
    # Bell Pepper
    "Pepper__bell___Bacterial_spot":               "Affected",
    "Pepper__bell___healthy":                      "Healthy",
    # Potato
    "Potato___Early_blight":                       "Potentially affected",
    "Potato___healthy":                            "Healthy",
    "Potato___Late_blight":                        "Affected",
    # Tomato
    "Tomato__Target_Spot":                         "Potentially affected",
    "Tomato__Tomato_mosaic_virus":                 "Affected",
    "Tomato__Tomato_YellowLeaf__Curl_Virus":       "Affected",
    "Tomato_Bacterial_spot":                       "Affected",
    "Tomato_Early_blight":                         "Potentially affected",
    "Tomato_healthy":                              "Healthy",
    "Tomato_Late_blight":                          "Affected",
    "Tomato_Leaf_Mold":                            "Potentially affected",
    "Tomato_Septoria_leaf_spot":                   "Potentially affected",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Potentially affected",
    # Cassava
    "Cassava_Mosaic_Disease":                      "Affected",
    "Cassava_Brown_Streak_Disease":                "Affected",
    "Cassava_Bacterial_Blight":                    "Affected",
    "Cassava_Green_Mite":                          "Potentially affected",
    "Cassava_healthy":                             "Healthy",
    # Maize
    "Maize_Gray_Leaf_Spot":                        "Potentially affected",
    "Maize_Common_Rust":                           "Potentially affected",
    "Maize_Northern_Leaf_Blight":                  "Affected",
    "Maize_Fall_Armyworm":                         "Affected",
    "Maize_healthy":                               "Healthy",
    # Coffee
    "Coffee_Leaf_Rust":                            "Affected",
    "Coffee_Berry_Disease":                        "Affected",
    "Coffee_Leaf_Miner":                           "Potentially affected",
    "Coffee_healthy":                              "Healthy",
    # Banana
    "Banana_Black_Sigatoka":                       "Affected",
    "Banana_Yellow_Sigatoka":                      "Potentially affected",
    "Banana_Panama_Disease_Fusarium_Wilt":         "Affected",
    "Banana_Xanthomonas_Wilt":                     "Affected",
    "Banana_healthy":                              "Healthy",
    # Rice
    "Rice_Blast":                                  "Affected",
    "Rice_Brown_Spot":                             "Potentially affected",
    "Rice_Sheath_Blight":                          "Affected",
    "Rice_Bacterial_Leaf_Blight":                  "Affected",
    "Rice_healthy":                                "Healthy",
}

# ─── Recommendations ─────────────────────────────────────────────────────────
RECOMMENDATIONS = {
    # ── Bell Pepper ──────────────────────────────────────────────────────────
    "Pepper__bell___Bacterial_spot": [
        "Remove and destroy infected leaves and fruit immediately.",
        "Avoid overhead irrigation — water at the base of the plant.",
        "Apply copper-based bactericide (e.g., copper hydroxide) as a preventive spray.",
        "Rotate crops — do not plant peppers in the same spot for at least 2 years.",
        "Disinfect tools between plants to prevent spreading the bacteria.",
    ],
    "Pepper__bell___healthy": [
        "Your bell pepper plant appears healthy — keep up current practices.",
        "Continue regular scouting for early signs of bacterial spot or anthracnose.",
        "Maintain adequate spacing for good air circulation.",
        "Keep a record of this diagnosis for your farm history.",
    ],

    # ── Potato ───────────────────────────────────────────────────────────────
    "Potato___Early_blight": [
        "Remove and dispose of infected lower leaves to slow spread.",
        "Apply a fungicide containing chlorothalonil or mancozeb every 7–10 days.",
        "Avoid wetting foliage when irrigating — use drip irrigation if possible.",
        "Ensure plants receive adequate potassium to strengthen resistance.",
        "Rotate potatoes with non-solanaceous crops each season.",
    ],
    "Potato___healthy": [
        "Your potato plant appears healthy — maintain current practices.",
        "Monitor regularly for early signs of late blight, especially after rain.",
        "Hill soil around stems to prevent tuber greening and reduce disease entry.",
        "Keep a record of this diagnosis for your farm history.",
    ],
    "Potato___Late_blight": [
        "Act immediately — late blight can destroy an entire crop within days.",
        "Remove and destroy all visibly infected plant parts; do not compost them.",
        "Apply a systemic fungicide (e.g., metalaxyl or cymoxanil) without delay.",
        "Avoid working in the field when foliage is wet to prevent further spread.",
        "Notify your local agricultural extension office — late blight spreads to neighbouring farms.",
        "Consider harvesting tubers early if infection is severe.",
    ],

    # ── Tomato ───────────────────────────────────────────────────────────────
    "Tomato__Target_Spot": [
        "Remove heavily infected leaves and dispose of them away from the field.",
        "Improve air circulation by pruning suckers and spacing plants adequately.",
        "Apply a fungicide containing chlorothalonil or azoxystrobin at first sign.",
        "Avoid overhead watering; irrigate at the base of the plant.",
        "Rotate tomatoes with non-solanaceous crops each season.",
    ],
    "Tomato__Tomato_mosaic_virus": [
        "Remove and destroy all infected plants — there is no cure for mosaic virus.",
        "Wash hands thoroughly with soap before handling healthy plants.",
        "Disinfect tools with 10% bleach solution between uses.",
        "Control aphids and other sap-sucking insects that spread the virus.",
        "Use certified virus-free seed or resistant varieties for the next planting.",
        "Do not smoke near plants — tobacco mosaic virus can contaminate hands.",
    ],
    "Tomato__Tomato_YellowLeaf__Curl_Virus": [
        "Remove and destroy infected plants immediately to reduce virus spread.",
        "Control whitefly populations with yellow sticky traps and insecticides.",
        "Apply insecticidal soap or neem oil to reduce whitefly numbers.",
        "Use reflective mulch to deter whiteflies from landing on plants.",
        "Plant resistant tomato varieties (TYLCV-resistant) in future seasons.",
        "Create physical barriers (insect-proof netting) for seedlings.",
    ],
    "Tomato_Bacterial_spot": [
        "Remove infected leaves and fruit; do not leave debris on the soil.",
        "Apply copper-based bactericide every 7–10 days during warm, wet weather.",
        "Avoid overhead irrigation and working with plants when they are wet.",
        "Use disease-free transplants and certified seed for future crops.",
        "Rotate tomatoes with non-solanaceous crops for at least 2 years.",
    ],
    "Tomato_Early_blight": [
        "Remove and destroy lower infected leaves at first sign of the disease.",
        "Apply a fungicide (chlorothalonil, mancozeb, or copper-based) every 7–10 days.",
        "Mulch around the base of plants to prevent soil splash onto leaves.",
        "Water at the base of the plant to keep foliage dry.",
        "Ensure adequate plant nutrition — nitrogen deficiency worsens early blight.",
    ],
    "Tomato_healthy": [
        "Your tomato plant appears healthy — continue current management practices.",
        "Scout regularly for early signs of blight, bacterial spot, or viral symptoms.",
        "Maintain consistent watering to avoid blossom-end rot.",
        "Keep a record of this diagnosis for your farm history.",
    ],
    "Tomato_Late_blight": [
        "Act immediately — late blight can collapse a tomato crop within a week.",
        "Remove and destroy all infected plant material; do not compost it.",
        "Apply a systemic fungicide (metalaxyl or cymoxanil) as soon as possible.",
        "Avoid wetting foliage; irrigate at the base of the plant.",
        "Notify neighbouring growers — late blight spreads rapidly via wind-borne spores.",
        "Consider early harvest of any marketable fruit before infection worsens.",
    ],
    "Tomato_Leaf_Mold": [
        "Improve ventilation in the growing area — leaf mold thrives in humid, enclosed conditions.",
        "Remove and destroy infected leaves to reduce fungal spore load.",
        "Apply a fungicide (chlorothalonil or copper-based) at first sign of symptoms.",
        "Keep foliage dry by watering at the base and spacing plants for airflow.",
        "Use resistant tomato varieties in future plantings if leaf mold is a recurring problem.",
    ],
    "Tomato_Septoria_leaf_spot": [
        "Remove infected leaves immediately, starting from the bottom of the plant.",
        "Apply a fungicide (chlorothalonil, mancozeb, or copper) every 7–10 days.",
        "Mulch the soil surface to prevent spore splash from the soil to leaves.",
        "Avoid overhead watering and working with wet plants.",
        "Rotate tomatoes away from this plot for at least 2 years.",
    ],
    "Tomato_Spider_mites_Two_spotted_spider_mite": [
        "Inspect the underside of leaves for tiny mites and fine webbing.",
        "Spray plants forcefully with water to knock mites off leaves.",
        "Apply neem oil, insecticidal soap, or an approved miticide (e.g., abamectin).",
        "Avoid over-fertilising with nitrogen — lush growth attracts spider mites.",
        "Introduce predatory mites (Phytoseiidae) as a biological control if available.",
        "Monitor weekly and reapply treatment after rain or irrigation.",
    ],

    # ── Cassava ──────────────────────────────────────────────────────────────
    "Cassava_Mosaic_Disease": [
        "Remove and destroy all plants showing mosaic symptoms — there is no chemical cure.",
        "Use clean, certified virus-free stem cuttings for replanting.",
        "Control whitefly populations with neem oil or approved insecticides — they spread the virus.",
        "Plant resistant or tolerant cassava varieties (e.g., TME 419, NASE 14).",
        "Avoid moving planting material from infected fields to healthy ones.",
        "Report severe outbreaks to your local agricultural extension officer.",
    ],
    "Cassava_Brown_Streak_Disease": [
        "Rogue out and burn all infected plants immediately — do not compost them.",
        "Use only certified, disease-tested stem cuttings from reputable sources.",
        "Inspect roots before harvest; brown streaking inside the root confirms infection.",
        "Control whitefly vectors with sticky traps and appropriate insecticides.",
        "Plant resistant varieties where available (e.g., Narocass 1, Kiroba).",
        "Do not replant cassava in a field with a known CBD history without a season's break.",
    ],
    "Cassava_Bacterial_Blight": [
        "Remove and destroy wilted shoots and infected stems — do not leave debris in the field.",
        "Use disease-free planting material; avoid cuttings from symptomatic plants.",
        "Apply copper-based bactericides to slow spread during the wet season.",
        "Avoid working in the field when plants are wet to reduce mechanical spread.",
        "Rotate cassava with non-host crops (e.g., maize or legumes) for one season.",
        "Improve field drainage — waterlogged soils worsen bacterial blight.",
    ],
    "Cassava_Green_Mite": [
        "Inspect the undersides of young leaves for tiny green mites and leaf distortion.",
        "Apply neem-based acaricides or sulphur dust to affected plants.",
        "Introduce predatory mites (Typhlodromalus aripo) if available — highly effective biocontrol.",
        "Avoid planting cassava during the dry season when mite populations peak.",
        "Intercrop cassava with taller crops to reduce the dry, dusty microclimate mites prefer.",
        "Remove and destroy heavily infested shoot tips.",
    ],
    "Cassava_healthy": [
        "Your cassava plant appears healthy — maintain current practices.",
        "Scout regularly for early signs of mosaic disease (leaf distortion, yellow patches).",
        "Monitor for whitefly populations, especially during the dry season.",
        "Harvest at the right maturity stage (8–24 months depending on variety) to maximise yield.",
        "Keep a record of this diagnosis for your farm history.",
    ],

    # ── Maize ────────────────────────────────────────────────────────────────
    "Maize_Gray_Leaf_Spot": [
        "Remove and destroy infected crop residues after harvest — the fungus overwinters on debris.",
        "Apply fungicides containing strobilurins (e.g., azoxystrobin) at tasselling if infection is moderate.",
        "Plant tolerant or resistant maize varieties recommended for your region.",
        "Rotate maize with legumes or other non-grass crops for at least one season.",
        "Improve air circulation through wider row spacing to reduce leaf wetness.",
        "Avoid excessive nitrogen fertilisation, which promotes dense canopy and high humidity.",
    ],
    "Maize_Common_Rust": [
        "Scout fields regularly from V6 onwards; early detection limits yield loss.",
        "Apply a triazole or strobilurin fungicide at first sign of pustules if the crop is at risk.",
        "Plant rust-resistant hybrid varieties — the most cost-effective long-term solution.",
        "Ensure balanced nutrition; potassium strengthens cell walls against rust penetration.",
        "Avoid late planting dates, which expose crops to peak rust-spore periods.",
        "Remove volunteer maize plants that can harbour rust between seasons.",
    ],
    "Maize_Northern_Leaf_Blight": [
        "Apply fungicide (mancozeb, propiconazole, or azoxystrobin) at tasselling when lesions appear.",
        "Use resistant hybrid varieties certified for your agro-ecological zone.",
        "Remove and incorporate or burn crop residues after harvest to reduce inoculum.",
        "Rotate maize with soybean, cowpea, or other broad-leaf crops for one season.",
        "Avoid overhead irrigation late in the day — wet leaves overnight favour infection.",
        "Monitor the lower canopy first; northern leaf blight typically starts on older leaves.",
    ],
    "Maize_Fall_Armyworm": [
        "Act immediately — fall armyworm can destroy a maize field within days.",
        "Scout at least twice a week from seedling emergence; check the whorl for frass and feeding damage.",
        "Apply approved insecticides (e.g., emamectin benzoate, spinetoram) directly into the whorl.",
        "Use biopesticides (Bacillus thuringiensis, Spodoptera-specific NPV) as an eco-friendly option.",
        "Encourage natural enemies by minimising broad-spectrum insecticide use.",
        "Intercrop with repellent crops (e.g., desmodium) or attract-and-kill border strips.",
        "Report large infestations to your local agricultural extension officer.",
    ],
    "Maize_healthy": [
        "Your maize plant appears healthy — maintain current practices.",
        "Scout weekly from emergence for fall armyworm, rust, and blight symptoms.",
        "Ensure timely top-dressing with nitrogen at V6 for strong yield potential.",
        "Maintain field hygiene by removing volunteer plants and crop residues.",
        "Keep a record of this diagnosis for your farm history.",
    ],

    # ── Coffee ───────────────────────────────────────────────────────────────
    "Coffee_Leaf_Rust": [
        "Apply copper-based or systemic fungicides (e.g., triadimefon, tebuconazole) at first sign.",
        "Prune overcrowded branches to improve airflow and reduce humidity inside the canopy.",
        "Remove and destroy heavily infected leaves to lower spore load.",
        "Avoid excessive nitrogen fertilisation, which produces soft, rust-susceptible foliage.",
        "Plant rust-resistant varieties (e.g., Ruiru 11, Batian) where available.",
        "Maintain complete fungicide spray schedules — rust can spread rapidly during wet weather.",
    ],
    "Coffee_Berry_Disease": [
        "Harvest all ripe and overripe berries promptly — do not leave them on the tree or ground.",
        "Apply copper fungicides or systemic products (e.g., carbendazim) at berry formation.",
        "Prune to open up the canopy and reduce moisture retention around berries.",
        "Remove and destroy mummified berries remaining from the previous season.",
        "Plant CBD-resistant varieties (e.g., Ruiru 11) on new plots.",
        "Keep accurate records of spray timing and disease incidence for future planning.",
    ],
    "Coffee_Leaf_Miner": [
        "Remove and destroy mined leaves to break the pest life cycle.",
        "Apply systemic insecticides (e.g., imidacloprid as a soil drench) for severe infestations.",
        "Use yellow sticky traps to monitor adult fly populations.",
        "Encourage parasitoid wasps by avoiding broad-spectrum insecticide use where possible.",
        "Maintain shade trees — moderate shade reduces leaf miner pressure.",
        "Scout monthly; economic damage thresholds are reached when more than 30% of leaves are mined.",
    ],
    "Coffee_healthy": [
        "Your coffee plant appears healthy — maintain current practices.",
        "Scout monthly for leaf rust orange pustules and CBD brown lesions on berries.",
        "Prune annually after harvest to maintain canopy structure and airflow.",
        "Apply balanced fertiliser (NPK + micronutrients) according to soil test results.",
        "Keep a record of this diagnosis for your farm history.",
    ],

    # ── Banana ───────────────────────────────────────────────────────────────
    "Banana_Black_Sigatoka": [
        "Apply systemic fungicides (e.g., propiconazole, trifloxystrobin) on a regular schedule.",
        "Remove and destroy infected leaves — do not leave them on the soil.",
        "Deleaf aggressively: remove any leaf showing more than 50% necrosis.",
        "Ensure adequate spacing between plants for airflow and reduced canopy humidity.",
        "Maintain plant nutrition — deficiencies in potassium and nitrogen increase susceptibility.",
        "Black Sigatoka can evolve resistance to fungicides; rotate chemical groups each season.",
    ],
    "Banana_Yellow_Sigatoka": [
        "Remove affected lower leaves and destroy them away from the plantation.",
        "Apply copper-based or systemic fungicides at first sign of streaking.",
        "Improve drainage — waterlogged soils and humid conditions accelerate disease spread.",
        "Maintain balanced fertilisation, especially potassium, to strengthen leaf tissue.",
        "Monitor plant spacing; overcrowding raises humidity and worsens Sigatoka.",
    ],
    "Banana_Panama_Disease_Fusarium_Wilt": [
        "There is no chemical cure for Panama disease — act to stop its spread.",
        "Uproot and destroy infected plants, including the corm and roots; do not compost.",
        "Quarantine the affected area and prevent movement of soil, tools, or water from it.",
        "Disinfect footwear, tools, and machinery with 5% formalin or bleach solution.",
        "Plant TR4-resistant varieties (e.g., FHIA-17, Pisang Awak) on new plots.",
        "Notify your agricultural authority immediately — Fusarium wilt TR4 is a regulated disease.",
    ],
    "Banana_Xanthomonas_Wilt": [
        "Rogue out all infected plants immediately, including the corm — bury or burn them.",
        "Disinfect tools with 20% bleach or heat between every cut — the bacteria spread on blades.",
        "Remove male buds with a forked stick (not a knife) to prevent insect transmission.",
        "Do not use suckers from infected plants for replanting.",
        "Prevent movement of infected planting material between farms.",
        "After clearance, leave the land fallow for at least 6 months before replanting.",
    ],
    "Banana_healthy": [
        "Your banana plant appears healthy — maintain current practices.",
        "Scout monthly for Sigatoka streaking on leaves and wilting that may indicate Fusarium.",
        "De-sucker regularly, leaving only the mother plant and one follower.",
        "Apply mulch around the base to conserve moisture and suppress weeds.",
        "Keep a record of this diagnosis for your farm history.",
    ],

    # ── Rice ─────────────────────────────────────────────────────────────────
    "Rice_Blast": [
        "Apply systemic fungicides (e.g., tricyclazole, isoprothiolane) at tillering and booting.",
        "Avoid excessive nitrogen application — high nitrogen produces blast-susceptible tissue.",
        "Use certified blast-resistant varieties recommended for your region.",
        "Drain fields periodically to interrupt the humid conditions blast requires.",
        "Remove and destroy infected plant debris after harvest.",
        "Early morning scouting helps detect neck blast before it girdles the panicle.",
    ],
    "Rice_Brown_Spot": [
        "Apply fungicides (mancozeb, iprodione, or propiconazole) at early infection.",
        "Improve soil fertility — brown spot is strongly linked to potassium and silicon deficiency.",
        "Use certified, treated seed to prevent seed-borne infection.",
        "Ensure uniform water management; drought stress predisposes plants to brown spot.",
        "Rotate rice with legumes to break the disease cycle and restore soil nutrients.",
    ],
    "Rice_Sheath_Blight": [
        "Apply fungicides (e.g., hexaconazole, propiconazole, validamycin) at tillering.",
        "Reduce plant density — sheath blight thrives in dense, humid canopies.",
        "Avoid excessive nitrogen fertilisation, which promotes dense tillering.",
        "Maintain proper water management; avoid prolonged flooding that keeps sheaths wet.",
        "Remove and destroy crop debris after harvest to reduce soil-borne inoculum.",
    ],
    "Rice_Bacterial_Leaf_Blight": [
        "Remove and destroy infected plant material — there is no effective chemical cure.",
        "Drain fields immediately when kresek (seedling wilt) symptoms appear.",
        "Avoid high nitrogen rates, which increase susceptibility.",
        "Use resistant varieties certified for your agro-ecological zone.",
        "Disinfect transplanting tools and equipment between fields.",
        "Avoid flooding nursery beds from infected field water sources.",
    ],
    "Rice_healthy": [
        "Your rice plant appears healthy — maintain current practices.",
        "Scout weekly from tillering onwards for blast lesions, sheath blight, and leaf blight.",
        "Manage water levels carefully — alternate wetting and drying saves water and reduces disease.",
        "Apply fertiliser according to a soil test to avoid over- or under-nutrition.",
        "Keep a record of this diagnosis for your farm history.",
    ],
}
