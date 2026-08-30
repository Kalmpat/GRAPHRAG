import os

from langchain_neo4j import Neo4jGraph
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


DATA_PATH = r"data"

os.makedirs(DATA_PATH, exist_ok=True)

load_dotenv()


llm = ChatGoogleGenerativeAI(
    model = "gemini-3.1-flash-lite",
    temperature = 0,
)


llm_transformer = LLMGraphTransformer(
    llm = llm,
    node_properties=True,
    strict_mode=False,
    additional_instructions=(
        "Extract detailed attributes for each entity as node properties whenever present in the text. "
        "For example, if a person's age or occupation is mentioned, attach it as a property."
    )
)

graph = Neo4jGraph()

loader = PyPDFDirectoryLoader(DATA_PATH)
raw_documents = loader.load()
print(f"Összesen {len(raw_documents)} oldal/dokumentum lett beolvasva.")

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1200,
    chunk_overlap=300,
    length_function=len,
    is_separator_regex=False,
)

chunks = text_splitter.split_documents(raw_documents)
print(f"A dokumentumok {len(chunks)} feldolgozható szövegrészletre lettek bontva.")
if not raw_documents:
    print("Üres a mappa tartalma")
else:
    graph_documents = llm_transformer.convert_to_graph_documents(chunks)

    for i, graph_doc in enumerate(graph_documents):
        print(f"\n--- {i+1}. chunk entitásai ---")
        for node in graph_doc.nodes:
            print(node)
        for relationship in graph_doc.relationships:
            print(relationship)

    graph.add_graph_documents(graph_documents)
    print("\nSikeres! Az összes PDF-ből kinyert entitás és forrásszöveg bekerült a Neo4j-be.")