import os
from dotenv import load_dotenv
import asyncio
from neo4j import GraphDatabase
from neo4j_graphrag.llm import OpenAILLM
from neo4j_graphrag.embeddings import SentenceTransformerEmbeddings
from neo4j_graphrag.experimental.pipeline.kg_builder import SimpleKGPipeline
from neo4j_graphrag.experimental.components.text_splitters.fixed_size_splitter import FixedSizeSplitter


load_dotenv()


DATA_PATH = r"../data"

os.makedirs(DATA_PATH, exist_ok=True)

neo4j_driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI"),
    auth=(os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD")),
)

neo4j_driver.verify_connectivity()

llm = OpenAILLM(
    model_name="gemini-3.5-flash-lite",
    model_params={"temperature": 0.0},
    api_key = os.getenv("GOOGLE_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

embedder = SentenceTransformerEmbeddings(
    model="all-MiniLM-L6-v2",
)

text_splitter = FixedSizeSplitter(
    chunk_size=1200,
    chunk_overlap=300
)

kg_builder = SimpleKGPipeline(
    llm=llm,
    driver=neo4j_driver,
    neo4j_database=os.getenv("NEO4J_DATABASE", "neo4j"),
    embedder=embedder,
    from_pdf=True,
    #text_splitter=text_splitter,
)

async def process_pdf_folder(folder_path):
    pdf_files = [
        os.path.join(folder_path, file)
        for file in os.listdir(folder_path)
        if file.endswith(".pdf")
    ]

    if not pdf_files:
        print("Nincs feldolgozható PDF fájl a mappában")
        return

    for pdf_file in pdf_files:
        print(f"Feldolgozás alatt: {pdf_file}")
        result = await kg_builder.run_async(file_path=pdf_file)
        print(f"Kész: {pdf_file}")

    neo4j_driver.close()

if __name__ == "__main__":
    asyncio.run(process_pdf_folder(DATA_PATH))