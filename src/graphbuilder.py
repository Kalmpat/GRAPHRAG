import os

from langchain_neo4j import Neo4jGraph
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


DATA_PATH = r"../data"

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
        "Only extract entities and relationships that are explicitly stated in the text — "
        "never infer or guess missing information. "
        "Normalize entity names: use the most complete and specific form found in the text "
        "(e.g. full name over initials, official name over abbreviation), and always use the "
        "same normalized form if the same entity is mentioned multiple times or referred to "
        "by a pronoun or a shorter alias. "
        "Attach a property to a node only when the corresponding fact is directly stated in "
        "the text near that entity (e.g. age, occupation, date, location, quantity, status). "
        "Do not attach properties inferred from context or general knowledge. "
        "Name relationship types as a concise, uppercase, verb-based label in SNAKE_CASE "
        "(e.g. WORKS_AT, LOCATED_IN, PART_OF), and reuse the same relationship type across "
        "chunks for semantically identical connections rather than inventing near-synonyms. "
        "Prefer a small, reusable set of entity types over creating a new, overly specific "
        "type for each individual document's subject matter."
        "Only translate node labels and relationship type names into English — never translate "
        "entity names, node property values, or any other extracted text content; keep those in "
        "their original language exactly as they appear in the source. "
    )
)

graph = Neo4jGraph()

loader = PyPDFDirectoryLoader(DATA_PATH)
raw_documents = loader.load()

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