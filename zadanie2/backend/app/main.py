from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_connection
from app.models import LoginRequest, LoginResponse, UsersResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/login/unsecure", response_model=LoginResponse)
def login_unsecure(data: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()
    query = f"SELECT username FROM users WHERE username = '{data.username}' AND password = '{data.password}'"
    try:
        cur.execute(query)
        row = cur.fetchone()
        conn.commit()
    except Exception:
        conn.rollback()
        row = None
    cur.close()
    conn.close()
    if row is None:
        raise HTTPException(status_code=401, detail="Nesprávne meno alebo heslo")
    return LoginResponse(username=row[0])

@app.post("/api/login/secure", response_model=LoginResponse)
def login_secure(data: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT username FROM users WHERE username = %s AND password = %s",
        (data.username, data.password),
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row is None:
        raise HTTPException(status_code=401, detail="Nesprávne meno alebo heslo")
    return LoginResponse(username=row[0])

@app.get("/api/users", response_model=UsersResponse)
def list_users():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, password FROM users ORDER BY id")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return UsersResponse(rows=[{"id": r[0], "username": r[1], "password": r[2]} for r in rows])
