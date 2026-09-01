# GRAPHRAG

Ez a projekt a `data/` mappában elhelyezett PDF dokumentumokból épít gráfalapú tudásbázist.

## Projektstruktúra

```text
project-root/
├── data/                  <-- Helyezd ide a feldolgozandó PDF fájlokat
│   └── README.md
├── src/
│   ├── create_vector_index.py  <-- Vektoros indexet létrehozó szkript
│   ├── kg_builder.py           <-- Tudásgráfot (Knowledge Graph) építő szkript
│   ├── old_graphbuilder.py     <-- Korábbi graph építő szkript
│   └── vector_cypher_rag.py    <-- Vektoros és Cypher-alapú RAG lekérdező szkript
├── .env_sample            <-- Minta beállítások (_sample törlése --> .env)
├── .gitignore
├── README.md              <-- (Ez a fájl) Projekt leírása
└── requirements.txt       <-- Szükséges Python csomagok
```
# Függőségek

```commandline
pip install -r requirements.txt
```
