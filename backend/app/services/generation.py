from app.services.llm import LLMProvider, MockProvider
from typing import Dict, Any, Optional

class PromptBuilder:
    @staticmethod
    def build_script_prompt(
        creator_dna: Dict[str, Any], 
        opportunity: Optional[Dict[str, Any]], 
        project: Dict[str, Any],
        request: str
    ) -> str:
        return f"""
        [SYSTEM RULES]
        Generate a structured video script.
        
        [CREATOR DNA]
        {creator_dna}
        
        [OPPORTUNITY]
        {opportunity}
        
        [PROJECT]
        {project}
        
        [USER REQUEST]
        {request}
        """

class GenerationService:
    def __init__(self, provider: LLMProvider = None):
        self.provider = provider or MockProvider()
        
    async def generate_script(
        self, 
        creator_dna: Dict[str, Any], 
        opportunity: Optional[Dict[str, Any]], 
        project: Dict[str, Any], 
        request: str
    ) -> Dict[str, Any]:
        prompt = PromptBuilder.build_script_prompt(creator_dna, opportunity, project, request)
        
        schema = {
            "title": "string",
            "content": "string",
            "sections": [{"heading": "string", "text": "string"}]
        }
        
        try:
            result = await self.provider.generate_structured(prompt, schema)
            # Output validation would occur here natively via pydantic
            return {
                "structured_content": result,
                "metadata": {
                    "provider": self.provider.get_provider_name(),
                    "model": self.provider.get_model_name(),
                    "prompt_version": "v1-script"
                }
            }
        except Exception as e:
            # Handle failures cleanly without destroying the previous revision
            raise Exception(f"AI Generation Failed: {str(e)}")
