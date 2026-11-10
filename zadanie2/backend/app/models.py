from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    username: str

class UserRow(BaseModel):
    id: int
    username: str
    password: str

class UsersResponse(BaseModel):
    rows: list[UserRow]
