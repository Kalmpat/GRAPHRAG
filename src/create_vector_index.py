import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()


def create_vector_index(driver, database_name="neo4j"):
    query = """
    CREATE VECTOR INDEX chunkEmbedding IF NOT EXISTS
    FOR (n:Chunk)
    ON (n.embedding)
    OPTIONS {indexConfig: {
      `vector.dimensions`: 384,
      `vector.similarity_function`: 'cosine'
    }};
    """
    with driver.session(database=database_name) as session:
        session.run(query)
    print("Vektor index sikeresen létrehozva/ellenőrizve (384 dimenzió).")


if __name__ == "__main__":
    driver = GraphDatabase.driver(
        os.getenv("NEO4J_URI"),
        auth=(os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD")),
    )
    driver.verify_connectivity()

    db_name = os.getenv("NEO4J_DATABASE", "neo4j")
    create_vector_index(driver, db_name)
    driver.close()