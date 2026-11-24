import os, sys
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.seed import seed

@pytest.fixture(scope="session", autouse=True)
def _db():
    if os.path.exists("test.db"): os.remove("test.db")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal(); seed(db); db.close()
    yield
    if os.path.exists("test.db"): os.remove("test.db")

@pytest.fixture()
def client():
    return TestClient(app)

@pytest.fixture()
def auth_client(client):
    r = client.post("/auth/register", json={"email": "t1@example.com", "username": "t1user", "password": "secret123"})
    assert r.status_code in (201, 400)
    r = client.post("/auth/login", json={"email": "t1@example.com", "password": "secret123"})
    token = r.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client

@pytest.fixture()
def admin_client(client):
    r = client.post("/auth/login", json={"email": "admin@drawpath.app", "password": "admin123"})
    token = r.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
