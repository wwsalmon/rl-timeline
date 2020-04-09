import spacy
from pprint import pprint

# FILE FOR TESTING NLP

nlp = spacy.load("en_core_web_sm")
doc = nlp("Fireburner leaves NRG Esports and retires from competitive play.")

descript = []

for token in doc:
    descript.append({
        "text": token.text,
        "dep": token.dep_,
        "head": token.head.text,
        "head_pos": token.head.pos_,
        "children": [child for child in token.children]}
        )

pprint(descript)