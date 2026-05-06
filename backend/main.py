"""
RSE — Knowledge Engine

FastAPI application entry point.
Registers all API routes and configures CORS for frontend communication.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.routes import query, claims, relations, focus, archive, synthesis, chat

# ── Application ──────────────────────────────────────────────────────────────

app = FastAPI(
    title="RSE Knowledge Engine",
    description="Research State Engine — transforms research queries into structured intelligence",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────

app.include_router(query.router, prefix="/api", tags=["Query"])
app.include_router(claims.router, prefix="/api", tags=["Claims"])
app.include_router(relations.router, prefix="/api", tags=["Relations"])
app.include_router(focus.router, prefix="/api", tags=["Focus"])
app.include_router(archive.router, prefix="/api", tags=["Archive"])
app.include_router(synthesis.router, prefix="/api", tags=["Synthesis"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])


# ── Health Check ─────────────────────────────────────────────────────────────

@app.get("/api/health", tags=["System"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "operational",
        "engine": "RSE Knowledge Engine",
        "mode": "dynamic",
    }
