"""
SYNAPSE Memory API - FastAPI REST Interface

Exposes the Memory Layer as a REST API for other components.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import os

from models import Interaction, UserPreference, MemoryEntry
from memory_layer import MemoryLayer

app = FastAPI(
    title="SYNAPSE Memory API",
    description="Persistent memory and context storage for AI assistants",
    version="0.1.0"
)

# CORS configuration (comma-separated list or "*")
cors_origins_raw = os.getenv("CORS_ALLOW_ORIGINS", "*")
allow_origins = ["*"] if cors_origins_raw == "*" else [o.strip() for o in cors_origins_raw.split(",") if o.strip()]

# Enable CORS for web interface
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Memory Layer
memory = MemoryLayer()


# Request/Response Models
class StoreInteractionRequest(BaseModel):
    interaction: Interaction


class RecallRequest(BaseModel):
    query: str
    user_id: str
    limit: int = 5
    min_similarity: float = 0.5


class ContextRequest(BaseModel):
    query: str
    user_id: str
    limit: int = 5


@app.get("/")
async def root():
    """Health check"""
    return {
        "service": "SYNAPSE Memory API",
        "status": "operational",
        "version": "0.1.0"
    }


@app.get("/stats")
async def get_stats(user_id: Optional[str] = None):
    """Get memory statistics"""
    return memory.get_stats(user_id)


@app.post("/interactions")
async def store_interaction(request: StoreInteractionRequest):
    """Store a new interaction"""
    try:
        interaction_id = await memory.store_interaction(request.interaction)
        return {
            "success": True,
            "interaction_id": interaction_id,
            "message": "Interaction stored successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/interactions/recall")
async def recall_interactions(request: RecallRequest):
    """Find similar past interactions"""
    try:
        similar = await memory.recall_similar_interactions(
            query=request.query,
            user_id=request.user_id,
            limit=request.limit,
            min_similarity=request.min_similarity
        )
        return {
            "success": True,
            "count": len(similar),
            "interactions": similar
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/preferences")
async def store_preference(preference: UserPreference):
    """Store a user preference"""
    try:
        pref_id = await memory.store_preference(preference)
        return {
            "success": True,
            "preference_id": pref_id,
            "message": "Preference stored successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/preferences/{user_id}")
async def get_preferences(
    user_id: str,
    category: Optional[str] = None,
    min_confidence: float = Query(default=0.5, ge=0.0, le=1.0)
):
    """Get user preferences"""
    try:
        preferences = await memory.get_user_preferences(
            user_id=user_id,
            category=category,
            min_confidence=min_confidence
        )
        return {
            "success": True,
            "count": len(preferences),
            "preferences": preferences
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/memories")
async def store_memory(memory_entry: MemoryEntry):
    """Store a memory"""
    try:
        memory_id = await memory.store_memory(memory_entry)
        return {
            "success": True,
            "memory_id": memory_id,
            "message": "Memory stored successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/context")
async def get_context(request: ContextRequest):
    """Get relevant context for a query"""
    try:
        context = await memory.get_relevant_context(
            query=request.query,
            user_id=request.user_id,
            limit=request.limit
        )
        return {
            "success": True,
            "count": len(context),
            "context": context
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
