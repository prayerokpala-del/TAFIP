import json
import os

notebook_content = {
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# TAFIP Framework: Machine Learning & NLP Sentiment Training Engine\n",
    "\n",
    "**Project Title**: Investigating the Role of Trust and Security in Fintech Product Adoption and Developing a Trust Assessment Dashboard: A Comparative Study of Parkway (Nigeria) and Revolut (UK).\n",
    "\n",
    "This notebook performs:\n",
    "1. **Data Ingestion & Preprocessing**: Clean `tafip.csv`, extract 100 responses (50 Parkway, 50 Revolut), Likert mapping, reverse scoring for risk items.\n",
    "2. **NLP Sentiment & Frustration Engine**: Parse 6 interview transcripts (`.docx`) for VADER sentiment scores and Frustration metrics.\n",
    "3. **Predictive Model Training**: Benchmark **Random Forest Regressor** vs **XGBoost Regressor** predicting consolidated Trust Score (0-100).\n",
    "4. **Export Artifacts**: Save winning `.pkl` model, metadata JSON, and processed datasets."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "import sys, os, json, joblib\n",
    "import pandas as pd\n",
    "import numpy as np\n",
    "from sklearn.ensemble import RandomForestRegressor\n",
    "from xgboost import XGBRegressor\n",
    "from sklearn.model_selection import KFold, cross_validate\n",
    "\n",
    "sys.path.append('..')\n",
    "from backend.app.services.preprocessing import clean_and_preprocess_df\n",
    "from backend.app.services.nlp_engine import process_all_interviews"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1. Load Survey Dataset and Execute 50/50 Partition"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "csv_path = '../tafip.csv'\n",
    "raw_df = pd.read_csv(csv_path, encoding='utf-8-sig')\n",
    "df_100, X = clean_and_preprocess_df(raw_df)\n",
    "y = df_100['Trust_Score_Target']\n",
    "\n",
    "print(f'Ingested shape: {df_100.shape}')\n",
    "print(f'Parkway count: {sum(df_100[\"Target_App\"] == \"Parkway\")}')\n",
    "print(f'Revolut count: {sum(df_100[\"Target_App\"] == \"Revolut\")}')\n",
    "df_100[['Target_App', 'Trust_Perception_Score', 'Perceived_Security_Score', 'Trust_Score_Target']].head()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 2. Qualitative Interview NLP Sentiment Engine"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "nlp_results = process_all_interviews('..')\n",
    "print('NLP Sentiment Summary across 6 Interview Transcripts:')\n",
    "print(json.dumps(nlp_results['summary'], indent=2))"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 3. Algorithm Training & Cross-Validation Benchmark (Random Forest vs XGBoost)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "kf = KFold(n_splits=5, shuffle=True, random_state=42)\n",
    "\n",
    "rf_model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)\n",
    "xgb_model = XGBRegressor(n_estimators=100, max_depth=4, learning_rate=0.05, random_state=42)\n",
    "\n",
    "rf_scores = cross_validate(rf_model, X, y, cv=kf, scoring=['r2', 'neg_mean_absolute_error', 'neg_root_mean_squared_error'])\n",
    "xgb_scores = cross_validate(xgb_model, X, y, cv=kf, scoring=['r2', 'neg_mean_absolute_error', 'neg_root_mean_squared_error'])\n",
    "\n",
    "print('Random Forest Scores:')\n",
    "print(f'  R2:   {np.mean(rf_scores[\"test_r2\"]):.4f}')\n",
    "print(f'  MAE:  {-np.mean(rf_scores[\"test_neg_mean_absolute_error\"]):.4f}')\n",
    "print(f'  RMSE: {-np.mean(rf_scores[\"test_neg_root_mean_squared_error\"]):.4f}')\n",
    "\n",
    "print('\\nXGBoost Scores:')\n",
    "print(f'  R2:   {np.mean(xgb_scores[\"test_r2\"]):.4f}')\n",
    "print(f'  MAE:  {-np.mean(xgb_scores[\"test_neg_mean_absolute_error\"]):.4f}')\n",
    "print(f'  RMSE: {-np.mean(xgb_scores[\"test_neg_root_mean_squared_error\"]):.4f}')"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 4. Model Selection & Export Artifacts"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "best_model = rf_model if np.mean(rf_scores['test_r2']) >= np.mean(xgb_scores['test_r2']) else xgb_model\n",
    "best_model.fit(X, y)\n",
    "\n",
    "os.makedirs('../backend/app/models', exist_ok=True)\n",
    "joblib.dump(best_model, '../backend/app/models/tafip_trust_model.pkl')\n",
    "print('Model exported successfully!')"
   ]
  }
 ],
 "metadata": {
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}

with open('notebooks/tafip_ml_pipeline.ipynb', 'w') as f:
    json.dump(notebook_content, f, indent=2)

print("Generated notebooks/tafip_ml_pipeline.ipynb")
