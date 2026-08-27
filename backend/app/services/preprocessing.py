import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any, List

LIKERT_MAP = {
    'Strongly Disagree': 1,
    'Disagree': 2,
    'Neutral': 3,
    'Agree': 4,
    'Strongly Agree': 5
}

SATISFACTION_MAP = {
    'Very dissatisfied': 1,
    'Dissatisfied': 2,
    'Neutral': 3,
    'Satisfied': 4,
    'Very satisfied': 5
}

AGE_MAP = {
    '18-24': 0.2,
    '25-34': 0.4,
    '35-44': 0.6,
    '45-54': 0.8,
    '55 or above': 1.0
}

DURATION_MAP = {
    'Less than 6 months': 0.25,
    '6 months - 1 year': 0.5,
    '1-2 years': 0.75,
    'More than 2 years': 1.0
}

FREQUENCY_MAP = {
    'Rarely': 0.2,
    'A few times a month': 0.4,
    'Once a week': 0.6,
    'Several times a week': 0.8,
    'Daily': 1.0
}

SECURITY_ISSUE_MAP = {
    'Yes': 1.0,
    'I am not sure': 0.5,
    'No': 0.0
}

def clean_and_preprocess_df(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Cleans raw survey dataframe (e.g. tafip.csv or any custom survey CSV),
    dynamically detects all fintech company names in Q4 (e.g. Parkway, Revolut, Kuda, Monzo, Wise, etc.),
    encodes Likert scales, reverse-scores risk items, and calculates normalized feature columns + Target Trust Score (0-100).
    """
    # Check if header row contains metadata (Qualtrics rows 1 & 2)
    if 'StartDate' in df.columns and len(df) > 2 and ('Start Date' in str(df.iloc[0].values) or 'QID2' in str(df.iloc[1].values)):
        df_data = df.iloc[2:].copy().reset_index(drop=True)
    else:
        df_data = df.copy()

    # Dynamic column identification
    app_col = 'Q4' if 'Q4' in df_data.columns else df_data.columns[3]
    country_col = 'Q3' if 'Q3' in df_data.columns else df_data.columns[2]

    df_data['App'] = df_data[app_col].astype(str).str.strip()
    df_data['Country'] = df_data[country_col].astype(str).str.strip()

    # Filter out empty or unselected app rows
    df_data = df_data[~df_data['App'].isin(['', 'nan', 'None', 'Other (please specify)'])].copy()

    # Dynamically extract top fintech apps present in the dataset
    app_counts = df_data['App'].value_counts()
    top_apps = list(app_counts.index[:5]) # Extract top detected fintech apps

    # If dataset has Parkway and Revolut, ensure 50/50 split or handle multi-company split
    if 'Parkway' in app_counts and 'Revolut' in app_counts:
        parkway_rows = df_data[df_data['App'] == 'Parkway'].copy()
        revolut_rows = df_data[df_data['App'] == 'Revolut'].copy()

        if len(parkway_rows) < 50:
            both_parkway = df_data[(df_data['App'] == 'Both') & (df_data['Country'] == 'Nigeria')].copy()
            needed = 50 - len(parkway_rows)
            parkway_rows = pd.concat([parkway_rows, both_parkway.head(needed)], ignore_index=True)

        parkway_50 = parkway_rows.head(50).copy()
        parkway_50['Target_App'] = 'Parkway'

        revolut_50 = revolut_rows.head(50).copy()
        revolut_50['Target_App'] = 'Revolut'

        df_processed = pd.concat([parkway_50, revolut_50], ignore_index=True)
    else:
        # Dynamic multi-company mode for any uploaded CSV!
        df_data['Target_App'] = df_data['App']
        df_processed = df_data.copy()

    # Encode Likert Matrix Columns
    b_cols = [c for c in df_processed.columns if c.startswith('B_Matrix')]
    c_cols = [c for c in df_processed.columns if c.startswith('C_Matrix')]
    d_cols = [c for c in df_processed.columns if c.startswith('D_Matrix')]

    for col in b_cols:
        df_processed[f'{col}_num'] = df_processed[col].map(LIKERT_MAP).fillna(3)

    for col in c_cols:
        if col in ['C_Matrix_3', 'C_Matrix_4']:
            raw_vals = df_processed[col].map(LIKERT_MAP).fillna(3)
            df_processed[f'{col}_num'] = 6 - raw_vals
        else:
            df_processed[f'{col}_num'] = df_processed[col].map(LIKERT_MAP).fillna(3)

    for col in d_cols:
        df_processed[f'{col}_num'] = df_processed[col].map(LIKERT_MAP).fillna(3)

    sat_col = 'Q11' if 'Q11' in df_processed.columns else 'Q11'
    df_processed['Satisfaction_num'] = df_processed[sat_col].map(SATISFACTION_MAP).fillna(3) if sat_col in df_processed.columns else 3
    df_processed['Age_norm'] = df_processed['Q1'].map(AGE_MAP).fillna(0.4) if 'Q1' in df_processed.columns else 0.4
    df_processed['Duration_norm'] = df_processed['Q5'].map(DURATION_MAP).fillna(0.5) if 'Q5' in df_processed.columns else 0.5
    df_processed['Frequency_norm'] = df_processed['Q6'].map(FREQUENCY_MAP).fillna(0.6) if 'Q6' in df_processed.columns else 0.6
    df_processed['Security_Issue_norm'] = df_processed['Q9'].map(SECURITY_ISSUE_MAP).fillna(0.0) if 'Q9' in df_processed.columns else 0.0

    # Group scores normalized (0.0 to 1.0)
    df_processed['Trust_Perception_Score'] = df_processed[[f'{c}_num' for c in b_cols]].mean(axis=1) / 5.0
    df_processed['Perceived_Security_Score'] = df_processed[[f'{c}_num' for c in c_cols]].mean(axis=1) / 5.0
    df_processed['Adoption_Intention_Score'] = df_processed[[f'{c}_num' for c in d_cols]].mean(axis=1) / 5.0
    df_processed['Satisfaction_Score'] = df_processed['Satisfaction_num'] / 5.0

    df_processed['Actual_Security_Score'] = (
        df_processed['C_Matrix_1_num'] * 0.4 +
        df_processed['C_Matrix_5_num'] * 0.4 +
        (1.0 - df_processed['Security_Issue_norm']) * 5.0 * 0.2
    ) / 5.0

    # Target Trust Score (0 to 100)
    df_processed['Trust_Score_Target'] = 100.0 * (
        0.35 * df_processed['Trust_Perception_Score'] +
        0.30 * df_processed['Perceived_Security_Score'] +
        0.20 * df_processed['Adoption_Intention_Score'] +
        0.15 * df_processed['Satisfaction_Score']
    )

    feature_cols = [
        'Trust_Perception_Score', 'Perceived_Security_Score', 'Adoption_Intention_Score',
        'Satisfaction_Score', 'Actual_Security_Score', 'Age_norm', 'Duration_norm',
        'Frequency_norm', 'Security_Issue_norm', 'C_Matrix_1_num', 'C_Matrix_2_num',
        'C_Matrix_3_num', 'C_Matrix_4_num', 'C_Matrix_5_num', 'C_Matrix_6_num'
    ]

    return df_processed, df_processed[feature_cols]
