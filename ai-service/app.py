from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AI Service")

class PredictionRequest(BaseModel):
    data: dict

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}

@app.post("/predict")
def predict(request: PredictionRequest):
    # Dummy prediction logic
    return {"prediction": "success", "confidence": 0.99, "data_received": request.data}
