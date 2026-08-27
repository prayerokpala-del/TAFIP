import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.model_selection import KFold, cross_validate
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app.services.preprocessing import clean_and_preprocess_df
from backend.app.services.nlp_engine import process_all_interviews

def run_ml_pipeline():
    workspace_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    csv_path = os.path.join(workspace_dir, 'tafip.csv')

    # Step 1: Preprocess raw survey data
    raw_df = pd.read_csv(csv_path, encoding='utf-8-sig')
    df_100, feature_df = clean_and_preprocess_df(raw_df)

    print(f"Data ingested and filtered: {len(df_100)} total samples.")
    print(f"Parkway samples: {sum(df_100['Target_App'] == 'Parkway')}")
    print(f"Revolut samples: {sum(df_100['Target_App'] == 'Revolut')}")

    X = feature_df
    y = df_100['Trust_Score_Target']

    # Step 2: NLP Analysis on 6 Interviews
    print("\n--- Processing 6 Qualitative Interview Transcripts ---")
    nlp_results = process_all_interviews(workspace_dir)
    print(f"NLP Summary: {json.dumps(nlp_results['summary'], indent=2)}")

    # Step 3: Train & Benchmark Algorithms (Random Forest vs XGBoost)
    print("\n--- Evaluating Predictive Models (5-Fold Cross Validation) ---")
    kf = KFold(n_splits=5, shuffle=True, random_state=42)

    rf_model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    xgb_model = XGBRegressor(n_estimators=100, max_depth=4, learning_rate=0.05, random_state=42)

    rf_scores = cross_validate(rf_model, X, y, cv=kf, scoring=['r2', 'neg_mean_absolute_error', 'neg_root_mean_squared_error'])
    xgb_scores = cross_validate(xgb_model, X, y, cv=kf, scoring=['r2', 'neg_mean_absolute_error', 'neg_root_mean_squared_error'])

    rf_metrics = {
        'r2': round(float(np.mean(rf_scores['test_r2'])), 4),
        'mae': round(float(-np.mean(rf_scores['test_neg_mean_absolute_error'])), 4),
        'rmse': round(float(-np.mean(rf_scores['test_neg_root_mean_squared_error'])), 4)
    }

    xgb_metrics = {
        'r2': round(float(np.mean(xgb_scores['test_r2'])), 4),
        'mae': round(float(-np.mean(xgb_scores['test_neg_mean_absolute_error'])), 4),
        'rmse': round(float(-np.mean(xgb_scores['test_neg_root_mean_squared_error'])), 4)
    }

    print(f"Random Forest Performance: R2={rf_metrics['r2']}, MAE={rf_metrics['mae']}, RMSE={rf_metrics['rmse']}")
    print(f"XGBoost Performance:       R2={xgb_metrics['r2']}, MAE={xgb_metrics['mae']}, RMSE={xgb_metrics['rmse']}")

    # Select Best Model
    if rf_metrics['r2'] >= xgb_metrics['r2']:
        best_name = "Random Forest Regressor"
        best_model = rf_model
        best_metrics = rf_metrics
    else:
        best_name = "XGBoost Regressor"
        best_model = xgb_model
        best_metrics = xgb_metrics

    print(f"\nWinner Algorithm: {best_name}")

    # Fit best model on entire dataset
    best_model.fit(X, y)

    # Feature Importance
    importances = best_model.feature_importances_
    feat_imp = sorted(zip(X.columns, importances), key=lambda x: x[1], reverse=True)
    feat_imp_dict = {col: round(float(imp), 4) for col, imp in feat_imp}

    print("\nFeature Importance Rankings:")
    for col, imp in feat_imp[:8]:
        print(f"  {col:30s}: {imp:.4f}")

    # Export Artifacts
    models_dir = os.path.join(workspace_dir, 'backend', 'app', 'models')
    processed_dir = os.path.join(workspace_dir, 'data', 'processed')
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(processed_dir, exist_ok=True)

    # Save Model File
    model_path = os.path.join(models_dir, 'tafip_trust_model.pkl')
    joblib.dump(best_model, model_path)
    print(f"\nExported trained model to {model_path}")

    # Save Metadata JSON
    metadata = {
        'selected_algorithm': best_name,
        'metrics': {
            'random_forest': rf_metrics,
            'xgboost': xgb_metrics,
            'selected': best_metrics
        },
        'feature_importances': feat_imp_dict,
        'feature_columns': list(X.columns)
    }
    meta_path = os.path.join(models_dir, 'model_metadata.json')
    with open(meta_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Exported metadata to {meta_path}")

    # Save processed CSV and NLP JSON
    csv_out = os.path.join(processed_dir, 'cleaned_tafip_100.csv')
    df_100.to_csv(csv_out, index=False)
    print(f"Exported cleaned dataset to {csv_out}")

    nlp_out = os.path.join(processed_dir, 'nlp_interview_features.json')
    with open(nlp_out, 'w') as f:
        json.dump(nlp_results, f, indent=2)
    print(f"Exported NLP insights to {nlp_out}")

if __name__ == '__main__':
    run_ml_pipeline()
