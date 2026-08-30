import os

from langchain_neo4j import Neo4jGraph
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()
os.getenv("GOOGLE_API_KEY")
os.getenv("NEO4J_URI")
os.getenv("NEO4J_USERNAME")
os.getenv("NEO4J_PASSWORD")

from langchain_ollama import ChatOllama

# llm = ChatOpenAI(
#     temperature = 0,
#     model_name ="gpt-4-0125-preview"
# )

# llm = ChatOllama(
#     model = "llama3.2:latest",
#     temperature=0,
# )

llm = ChatGoogleGenerativeAI(
    model = "gemini-3.1-flash-lite",
    temperature = 0,
)


llm_transformer = LLMGraphTransformer(
    llm = llm,
    allowed_nodes=[],
    allowed_relationships=[],
    node_properties=True,
    strict_mode=False,
    additional_instructions=(
        "Extract detailed attributes for each entity as node properties whenever present in the text. "
        "For example, if a person's age or occupation is mentioned, attach it as a property."
    )
)


graph = Neo4jGraph()

text = """
Olimpia, spártai egyszerűség, pankráció, triatlon – mindezt az ókori görögöktől örököltük. A sport számukra játék és versengés is volt, de ez a kis nép a modern állam létrehozásában is nagyot alkotott.
A mai Görögország területén először Kréta szigetén hoztak létre civilizációt nem görög nyelvű hajós népek. A fővárosban, Knósszoszban hatalmas, labirintusszerű palotákat építettek fürdőszobákkal, vízvezetékkel. Kréta kereskedelmi flottát hozott létre, de a virágkornak a thérai vulkánkitörés és az azt követő szökőár Kr. e. 1600 körül véget vetett. A Hellászba bevándorló hellén, azaz görög törzsek később megszállták a szigetet, a paloták elpusztultak. A szárazföldön hatalmas, kör alakú várak épültek, ahonnan a termelést, a raktárakat és a kézműves lakosságot irányították. Mükéné és a többi királyság bronzfegyverekkel vezetett közösen hadat Trója ellen. Kr. e. 1200 körül egy nagy népvándorlási hullám indult meg kelet felől. A mükénéi kultúra várai összeomlottak, a civilizáció, az írás, négyszáz évre feledésbe merült.
A központi irányítás széthullása után a földek a parasztok tulajdonába kerültek. A megközelítőleg 500 fős falvak nagyobb városokba egyesülése után körülbelül 800 független, saját törvényekkel, kormányzattal, védőistennel és ünnepekkel rendelkező városállam, polisz jött létre. A polisz polgárai saját földjeik mellett az állami földeket is vaseszközökkel művelték. A poliszok központi terén, az agorán volt a piac, amely a népgyűlés helyeként is szolgált. Letelepült idegenek és rabszolgák is éltek a poliszban. A polisz vezetői a nagyobb földdel rendelkező arisztokraták voltak, a démoszt a parasztok, a kézművesek rétege adta. Az arisztokraták harci szekerei és lovassága mellett szükség lett a gazdagabb parasztokból toborzott nehézfegyverzetű hoplitákra is. A hopliták fő fegyvere a 2-3 méter hosszú lándzsa volt, de fontos felszerelés volt a pajzs, a vért, az egyenes, kétélű kard és a hajítódárda is. A hopliták több kilométer hosszú és néhány sor mélységű csatasorba, falanxba szerveződtek. Az ókori Hellászban saját hangjelölő betűírást is kifejlesztettek. A hellén világ vallási központja, az Apollón tiszteletére emelt szentélyegyüttes az ókor legnépszerűbb jóshelye is volt. Háborút polisz nem indított Apollón papnőjének megkérdezése nélkül. Mítoszok szóltak Zeusz, Athéné, Poszeidón, Hermész, Hádész isteni kalandjairól, Héraklész félisteni hőstetteiről. A poliszok ünnepi rendezvénye a négyévenként tartott olimpia volt. Kr. e. 776-tól a futásból, távolugrásból, diszkoszvetésből, gerelyhajításból és birkózásból álló öttusa mellett az előkelők számára fogathajtóversenyt vezettek be, a szabadfogású birkózás, a pankráció pedig igazi kihívás volt. A versenyeken csak szabad férfiak vehettek részt. Olümpia ligetében a győzteseknek aranyszobrot állítottak.
A túlnépesedés következtében a Kr. e. VII. században a poliszok lakosságának egy része lakatlan területekre kezdett elvándorolni. A görög gyarmatosítás során jött létre például Barcelona, Marseille, Nápoly, Isztambul és számos város a Fekete-tenger környékén. A gyarmatvárosok általában gabonát szállítottak anyavárosuknak.
Különlegesen alakult egy, a Peloponnészosz félszigeten fekvő polisz, Spárta története. Itt a bevándorló dórok leigázták az őslakosokat. Az őslakókból lettek a helóták, a spártai állam tulajdonában lévő földművesek, akik a spártaiak mellett könnyűfegyverzetű katonaként is harcoltak. A Spárta környéki településeken éltek a polgárjog nélküli kézművesek, a körüllakók. Spártában a teljes jogú polgárok legfőbb tevékenysége a katonáskodás lett. Eleinte minden spártai polgár egyenlő részt kapott a földekből, később itt is kialakult egy gazdagabb réteg. Spártát két király kormányozta. A 28 vén és a két király, vagyis a vének tanácsa szabta meg a népgyűlés napirendi pontjait. 5 felügyelő ellenőrizte a királyokat. Spárta vezetésével létrejött egy katonai szövetség, mely az egész peloponnészoszi félszigetre kiterjedt. Az életképtelen vagy gyenge csecsemőket kitették az Apothetaira. Őket gyakran gyermektelen családok nevelték fel. A spártai fiúk állami nevelése 6 éves korukban kezdődött. A fiúkat 30 éves korukig katonai táborokban, családjuktól elválasztva nevelték. Az állandó hadgyakorlatok, a testi megpróbáltatások a spártai katonákat a görögök elit harcosaivá tették.
"""

documents = [Document(page_content=text)]
graph_documents = llm_transformer.convert_to_graph_documents(documents)

for node in graph_documents[0].nodes:
    print(node)

for relationship in graph_documents[0].relationships:
    print(relationship)

graph.add_graph_documents(graph_documents)
