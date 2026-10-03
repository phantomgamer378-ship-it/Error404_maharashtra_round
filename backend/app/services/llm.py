from abc import ABC, abstractmethod
from typing import Dict, Any, List
import json

class LLMProvider(ABC):
    @abstractmethod
    async def generate_structured(self, prompt: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        pass
        
    @abstractmethod
    def get_model_name(self) -> str:
        pass

class MockProvider(LLMProvider):
    def __init__(self, model_name="mock-model"):
        self.model_name = model_name
        
    async def generate_structured(self, prompt: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        # Return a safe mock response satisfying the expected schema
        return {
            "title": "Mock Generated Output",
            "content": "This is mock content because the MockProvider is active.",
            "sections": [
                {"heading": "Hook", "text": "This is a mock hook."},
                {"heading": "Body", "text": "This is the mock body."}
            ]
        }
        
    def get_provider_name(self) -> str:
        return "mock"
        
    def get_model_name(self) -> str:
        return self.model_name

class OpenRouterProvider(LLMProvider):
    def __init__(self, api_key: str, model_name: str = "anthropic/claude-3-haiku"):
        self.api_key = api_key
        self.model_name = model_name
        
    async def generate_structured(self, prompt: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        # In a real implementation, this would use httpx to call OpenRouter API
        # with response_format={"type": "json_object"}
        raise NotImplementedError("OpenRouter integration not fully implemented for hackathon")

    def get_provider_name(self) -> str:
        return "openrouter"
        
    def get_model_name(self) -> str:
        return self.model_name
