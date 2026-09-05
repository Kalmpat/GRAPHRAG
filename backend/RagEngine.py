import os
from dotenv import load_dotenv
from neo4j_graphrag.embeddings import SentenceTransformerEmbeddings
from neo4j import GraphDatabase
from neo4j_graphrag.embeddings.openai import OpenAIEmbeddings
from neo4j_graphrag.retrievers import VectorCypherRetriever
from neo4j_graphrag.llm import OpenAILLM
from neo4j_graphrag.generation import GraphRAG

load_dotenv()

class GRAPHRAGEngine:
    def __init__(self):
        self.neo4j_driver = GraphDatabase.driver(
            os.getenv("NEO4J_URI"),
            auth=(os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD")),
        )

        self.embedder = SentenceTransformerEmbeddings(
                model="all-MiniLM-L6-v2",
        )

        self.retrieval_query = """
            RETURN node.text as text, score
        """

        self.retriever = VectorCypherRetriever(
            driver=self.neo4j_driver,
            neo4j_database=os.getenv("NEO4J_DATABASE", "neo4j"),
            index_name="chunkEmbedding",
            embedder=self.embedder,
            retrieval_query=self.retrieval_query,
        )

        self.llm = OpenAILLM(
            model_name="gemini-3.5-flash-lite",
            model_params={"temperature": 0.0},
            api_key=os.getenv("GOOGLE_API_KEY"),
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )

        self.rag = GraphRAG(
            retriever=self.retriever,
            llm=self.llm,
        )

    def query(self, query_text: str, top_k: int = 5, chat_history: list[dict] | None = None) -> str:
        history_context = ""
        if chat_history:
            formatted_message = []
            for message in chat_history:
                role_name = "User" if message.get("role") == "user" else "Assistant"
                formatted_message.append(f"{role_name}: {message.get('content')}")
            history_context = "\n".join(formatted_message)
        if history_context:
            full_query = f"Korábbi beszélgetés előzményei:\n{history_context}\n\nÚj kérdés: {query_text}"
        else:
            full_query = query_text



        response = self.rag.search(
            query_text=full_query,
            retriever_config={"top_k": top_k},
            return_context=True,
        )
        return response.answer

    def close(self):
        if self.neo4j_driver:
            self.neo4j_driver.close()
