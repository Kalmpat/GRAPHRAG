import os

from langchain_neo4j import Neo4jGraph
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_neo4j import Neo4jVector


DATA_PATH = r"../data"

os.makedirs(DATA_PATH, exist_ok=True)

load_dotenv()



llm = ChatGoogleGenerativeAI(
    model = "gemini-3.1-flash-lite",
    temperature = 0.0,
)


llm_transformer = LLMGraphTransformer(
    llm = llm,
    node_properties=True,
    strict_mode=False,
    additional_instructions=(
        "Extract all explicit entities, relationships, and their attributes from the text. "
        "Actively look for properties (such as dates, values, statuses, roles, quantities, or locations) "
        "and attach them to the corresponding entities whenever they appear nearby. "
        "Normalize entity names: use the most complete and specific form found in the text, "
        "and reuse the exact same form for pronouns or aliases. "
        "Name relationship types as a concise, uppercase, verb-based label in SNAKE_CASE "
        "(e.g. WORKS_AT, LOCATED_IN, PRODUCED_BY), and reuse them across chunks. "
        "Translate node labels, relationship type names, and property keys (names) into English. "
        "Do NOT translate entity names or property values; keep those in their original language."
    )
)

graph = Neo4jGraph()

loader = PyPDFDirectoryLoader(DATA_PATH)
raw_documents = loader.load()

if not raw_documents:
    print("Üres a mappa tartalma")
else:

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=300,
        length_function=len,
        is_separator_regex=False,
    )

    chunks = text_splitter.split_documents(raw_documents)
    print(f"A dokumentumok {len(chunks)} feldolgozható szövegrészletre lettek bontva.")

    graph_documents = llm_transformer.convert_to_graph_documents(chunks)

    for i, graph_doc in enumerate(graph_documents):
        print(f"\n--- {i+1}. chunk entitásai ---")
        for node in graph_doc.nodes:
            print(node)
        for relationship in graph_doc.relationships:
            print(relationship)

    graph.add_graph_documents(
        graph_documents,
        include_source=True
    )
    print("\nSikeres! Az összes PDF-ből kinyert entitás és forrásszöveg bekerült a Neo4j-be.")

    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
    )

    vector_store = Neo4jVector.from_existing_graph(
        embedding=embeddings,
        search_type="hybrid",
        node_label="Document",
        text_node_properties=["text"],
        embedding_node_property="embedding",
        index_name="document_vector_index"
    )

    graph.query("CREATE INDEX entity_id_index IF NOT EXISTS FOR (e:__Entity__) ON (e.id)")

    print("A vector index és az entitás indexek sikeresen létrejöttek!")