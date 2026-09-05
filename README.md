# GRAPHRAG

Ez a projekt a `data/` mappában elhelyezett PDF dokumentumokból épít gráfalapú tudásbázist.

## Projektstruktúra

```text
project-root/
├── backend/
│   ├── main.py                 <-- FastAPI alkalmazás belépési pontja (lifespan, CORS, routerek)
│   ├── deps.py                 <-- Központi függőségkezelő (körkörös importok elkerülése, állapottárolás)
│   ├── RagEngine.py            <-- RAG lekérdező motor (Neo4j és Gemini integráció)
│   └── routers/
│       ├── query.py            <-- RAG lekérdezések és chat history API végpontjai (`/api/v1/query`)
│       └── upload.py           <-- PDF fájlok feltöltése és kezelése (`/api/v1/uploadfile`)
├── data/                  <-- Helyezd ide a feldolgozandó PDF fájlokat
│   └── README.md
├── src/
│   ├── create_vector_index.py  <-- Vektoros indexet létrehozó szkript
│   ├── kg_builder.py           <-- Tudásgráfot (Knowledge Graph) építő szkript
│   ├── old_graphbuilder.py     <-- Korábbi graph építő szkript
│   ├── vector_cypher_rag.py    <-- Vektoros és Cypher-alapú GraphRAG lekérdező szkript
│   └── text2cypher_rag.py      <-- Text2Cypher alapú GraphRAG lekérdező
├── .env_sample            <-- Minta beállítások (_sample törlése --> .env)
├── .gitignore
├── README.md              <-- (Ez a fájl) Projekt leírása
└── requirements.txt       <-- Szükséges Python csomagok
```
# Függőségek

```commandline
pip install -r requirements.txt
```

# Backend Indítása
A backend FastAPI szerver elindításához futtasd az alábbi parancsot a backend/ könyvtárból:

```commandline
uvicorn main:app --reload
```