import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from pydantic import BaseModel

security = HTTPBearer()

class CurrentUser(BaseModel):
    id: str
    email: str

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> CurrentUser:
    token = credentials.credentials
    try:
        # Supabase JWTs are signed with the project JWT secret
        payload = jwt.decode(
            token, 
            settings.SUPABASE_JWT_SECRET, 
            algorithms=["HS256"], 
            audience="authenticated"
        )
        user_id: str = payload.get("sub")
        email: str = payload.get("email", "")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return CurrentUser(id=user_id, email=email)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def require_authenticated_user(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    return user
