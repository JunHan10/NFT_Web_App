from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
import os
from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_core.documents import Document

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://shiny-douhua-1a10a9.netlify.app"],  # your Netlify URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# --- LangChain, Ollama, ChromaDB Setup ---
# Use llama3 as the model
LLM_MODEL = "llama3.2"
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

llm = OllamaLLM(model=LLM_MODEL, base_url=OLLAMA_BASE_URL)
embeddings = OllamaEmbeddings(model=LLM_MODEL, base_url=OLLAMA_BASE_URL)

# For demo: create a simple in-memory ChromaDB collection with a few docs
persist_directory = None  # In-memory
sample_docs = [
    Document(page_content="Our company was created by two handsome men named Jun and Andrew in 2025."),
    Document(page_content="Here, we can give you the best price for the coolest looking skins."),
]
vectorstore = Chroma.from_documents(sample_docs, embeddings, persist_directory=persist_directory)
retriever = vectorstore.as_retriever()

qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=False)

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest):
    user_message = chat_request.message
    try:
        # 1. Retrieve context from your docs
        docs = retriever.get_relevant_documents(user_message)
        context = "\n".join([doc.page_content for doc in docs])

        personality = "You are a young nigga from the hood, you are super chill. you use all the hood slangs and talks like a very native hood person."
        # 2. Combine context and user message
        prompt = f"Context:\n{context}\n\nQuestion: {user_message}\nAnswer:"
        # 3. Get answer from LLM
        answer = llm.invoke(prompt)
    except Exception as e:
        answer = f"Error: {str(e)}"
    return {"response": answer}