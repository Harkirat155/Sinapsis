"""
SYNAPSE Feedback API - FastAPI REST Interface

Exposes the learning engine for recording outcomes and generating recommendations.
"""

from typing import Optional
import os

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from learning_engine import feedback_loop, TestResult


app = FastAPI(
    title="SYNAPSE Feedback API",
    description="Learning loop and recommendation engine for SYNAPSE",
    version="0.1.0",
)

cors_origins_raw = os.getenv("CORS_ALLOW_ORIGINS", "*")
allow_origins = ["*"] if cors_origins_raw == "*" else [o.strip() for o in cors_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "service": "SYNAPSE Feedback API",
        "status": "operational",
        "version": "0.1.0",
    }


@app.post("/tests")
async def record_test(result: TestResult):
    try:
        feedback_loop.record_test(result)
        return {
            "success": True,
            "message": "Test result recorded",
            "total_tests": len(feedback_loop.test_results),
            "patterns_discovered": len(feedback_loop.patterns),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/recommendations")
async def recommendations(
    user_id: str = Query(..., description="User ID"),
    problem_type: str = Query(..., description="Problem type, e.g. sorting"),
):
    try:
        recs = feedback_loop.get_recommendations(user_id=user_id, problem_type=problem_type)
        return {
            "success": True,
            "recommendations": recs,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/insights")
async def insights():
    try:
        return {
            "success": True,
            "insights": feedback_loop.get_insights(),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8003"))
    uvicorn.run(app, host="0.0.0.0", port=port)
