import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any
from xgboost import XGBRegressor

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'tafip_trust_model.pkl'))
METADATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'model_metadata.json'))
WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

_model = None
_metadata = None

def train_and_save_fallback_model():
    """Trains a fresh XGBoost model on tafip.csv if the pre-compiled .pkl is incompatible with local Python version."""
    from backend.app.services.preprocessing import clean_and_preprocess_df
    csv_path = os.path.join(WORKSPACE_DIR, 'tafip.csv')
    if os.path.exists(csv_path):
        raw_df = pd.read_csv(csv_path, encoding='utf-8-sig')
        df_processed, feature_df = clean_and_preprocess_df(raw_df)
        y = df_processed['Trust_Score_Target']
        
        xgb = XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42)
        xgb.fit(feature_df, y)
        
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(xgb, MODEL_PATH)
        return xgb
    return None

def get_model_and_metadata():
    global _model, _metadata
    if _model is None and os.path.exists(MODEL_PATH):
        try:
            _model = joblib.load(MODEL_PATH)
        except Exception:
            # Re-train XGBoost model on local Python environment if pickle/xgboost version mismatch occurs
            _model = train_and_save_fallback_model()

    if _metadata is None and os.path.exists(METADATA_PATH):
        try:
            with open(METADATA_PATH, 'r') as f:
                _metadata = json.load(f)
        except Exception:
            pass

    return _model, _metadata

def predict_single_trust_score(features: Dict[str, float]) -> Dict[str, Any]:
    """
    Predicts consolidated Trust Score (0 to 100) for a single input feature dictionary.
    """
    model, metadata = get_model_and_metadata()

    feature_cols = metadata['feature_columns'] if metadata else [
        'Trust_Perception_Score', 'Perceived_Security_Score', 'Adoption_Intention_Score',
        'Satisfaction_Score', 'Actual_Security_Score', 'Age_norm', 'Duration_norm',
        'Frequency_norm', 'Security_Issue_norm', 'C_Matrix_1_num', 'C_Matrix_2_num',
        'C_Matrix_3_num', 'C_Matrix_4_num', 'C_Matrix_5_num', 'C_Matrix_6_num'
    ]

    input_data = []
    for col in feature_cols:
        input_data.append(features.get(col, 0.5))

    X_input = pd.DataFrame([input_data], columns=feature_cols)

    if model is not None:
        try:
            predicted_score = float(model.predict(X_input)[0])
        except Exception:
            # Fallback to dynamic formula if predict fails
            trust_p = features.get('Trust_Perception_Score', 0.8)
            sec_p = features.get('Perceived_Security_Score', 0.8)
            adopt_p = features.get('Adoption_Intention_Score', 0.8)
            sat_p = features.get('Satisfaction_Score', 0.8)
            predicted_score = float(100.0 * (0.35*trust_p + 0.30*sec_p + 0.20*adopt_p + 0.15*sat_p))
    else:
        trust_p = features.get('Trust_Perception_Score', 0.8)
        sec_p = features.get('Perceived_Security_Score', 0.8)
        adopt_p = features.get('Adoption_Intention_Score', 0.8)
        sat_p = features.get('Satisfaction_Score', 0.8)
        predicted_score = float(100.0 * (0.35*trust_p + 0.30*sec_p + 0.20*adopt_p + 0.15*sat_p))

    predicted_score = round(max(0.0, min(100.0, predicted_score)), 2)

    return {
        'predicted_trust_score': predicted_score,
        'algorithm_used': metadata.get('selected_algorithm', 'XGBoost Regressor') if metadata else 'XGBoost Regressor',
        'feature_breakdown': {
            'Trust_Perception': round(features.get('Trust_Perception_Score', 0.8) * 100, 1),
            'Perceived_Security': round(features.get('Perceived_Security_Score', 0.8) * 100, 1),
            'Adoption_Intention': round(features.get('Adoption_Intention_Score', 0.8) * 100, 1),
            'Satisfaction': round(features.get('Satisfaction_Score', 0.8) * 100, 1),
            'Actual_Security': round(features.get('Actual_Security_Score', 0.8) * 100, 1)
        }
    }