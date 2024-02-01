import pathlib
import textwrap
from dotenv import load_dotenv
import  google.generativeai as genai
import google.ai.generativelanguage as glm
import os 
from IPython.display import display
from IPython.display import Markdown
from datetime import datetime
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Any, Dict

load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)


# model = genai.GenerativeModel('gemini-pro')
# def to_markdown(text):
#   text = text.replace('•', '  *')
#   return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))
# response = model.generate_content("What is the meaning of life?", stream=True)
# for chunk in response:
#   print(chunk.text)


def return_home():
    print("Robot is returning home")
    return "Robot has returned home."

def now():
    return datetime.now().strftime("%Y-%m-%d")


functiondict = {
    'now' : (now,"Today's date") ,
    'Return_robot_home' : ( return_home, "Robot is returning home")
}
tools = glm.Tool(
    function_declarations=[
      glm.FunctionDeclaration(
        name='now',
        description="Returns the current UTC date and time."
      ),
      glm.FunctionDeclaration(
        name='Return_robot_home',
        description="Calls a function that will return the robot to its home position."
      )
    ]
)
model = genai.GenerativeModel(
    'gemini-pro',
    tools=[tools])
chat = model.start_chat()

def process_llm_input(input: str) -> Dict[str, Any]:
  response = chat.send_message(
      input,
  )
  try:
    functionname = response.candidates[0].content.parts[0].function_call.name
    if functionname in functiondict:
      function_called, function_prompt = functiondict[functionname]
      response = chat.send_message(
        glm.Content(
          parts=[glm.Part(
              function_response = glm.FunctionResponse(
                name=functionname,
                response={function_prompt: function_called()}
              )
          )]
        )
      )
    else:
      print('function call not found')
  except:
    print('no function call')
  print(response.parts)
  return response.text

app = FastAPI()

class PredictionRequest(BaseModel):
    input: str

class PredictionResponse(BaseModel):
    response: Dict[str, Any]

@app.post("/predict/", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    print(request)
    print(request.input)
    processed_input = process_llm_input(request.input)
    print(processed_input)
    return PredictionResponse(response={'message':processed_input})
