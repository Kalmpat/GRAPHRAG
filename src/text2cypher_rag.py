import os
from dotenv import load_dotenv
from neo4j_graphrag.embeddings import SentenceTransformerEmbeddings
from neo4j import GraphDatabase
from neo4j_graphrag.embeddings.openai import OpenAIEmbeddings
from neo4j_graphrag.retrievers import VectorCypherRetriever
from neo4j_graphrag.llm import OpenAILLM
from neo4j_graphrag.generation import GraphRAG
from neo4j_graphrag.retrievers import Text2CypherRetriever

load_dotenv()

neo4j_driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI"),
    auth=(os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD")),
)



llm = OpenAILLM(
    model_name="gemini-3.5-flash-lite",
    model_params={"temperature": 0.0},
    api_key = os.getenv("GOOGLE_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

examples = [
    "USER INPUT: 'Find a node with the name $name?' QUERY: MATCH (node) WHERE toLower(node.name) CONTAINS toLower($name) RETURN node.name AS name, labels(node) AS labels",
]

retriever = Text2CypherRetriever(
    driver=neo4j_driver,
    neo4j_database=os.getenv("NEO4J_DATABASE"),
    llm=llm,
    examples=examples,
)




rag = GraphRAG(
    retriever=retriever,
    llm=llm
)

query_text = "Mi a dokumentum fő témája?"

response = rag.search(
    query_text=query_text,
    return_context=True
)

print(response.answer)
print("CYPHER :", response.retriever_result.metadata["cypher"])
print("CONTEXT:", response.retriever_result.items)


neo4j_driver.close()