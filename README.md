# GRAPHRAG

Ez a projekt a `data/` mappában elhelyezett PDF dokumentumokból épít gráfalapú tudásbázist.

## Projektstruktúra

```text
project-root/
├── data/                  <-- Helyezd ide a feldolgozandó PDF fájlokat
│   └── README.md
├── src/
│   └── graphbuilder.py    <-- Graph építő szkript
├── .env_sample            <-- Minta beállítások (_sample törlése --> .env)
├── .gitignore
├── README.md              <-- (Ez a fájl) Projekt leírása
└── requirements.txt       <-- Szükséges Python csomagok
```
# Függőségek

```commandline
pip install -r requirements.txt
```
