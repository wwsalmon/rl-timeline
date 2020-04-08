from os import path
import mwparserfromhell as mw
import requests
from pprint import pprint

API_URL = "https://liquipedia.net/rocketleague/api.php"

def fetch_page_text(name, force_overwrite):
    if path.isfile("data/" + name + ".txt") and not force_overwrite:
        print("no change")
    else:
        # this code from GitHub https://github.com/earwig/mwparserfromhell/
        params = {
            "action": "query",
            "prop": "revisions",
            "rvprop": "content",
            "rvslots": "main",
            "rvlimit": 1,
            "titles": name,
            "format": "json",
            "formatversion": "2",
        }
        headers = {"User-Agent": "rl-timeline/0.1 (https://github.com/wwsalmon/rl-timeline)"}
        req = requests.get(API_URL, headers=headers, params=params)
        res = req.json()
        text = res["query"]["pages"][0]["revisions"][0]["content"]

        with open("data/" + name + ".txt", "w", encoding="utf-8") as file:
            file.write(text)

        print("file created")

def parse(name):
    fetch_page_text(name, False) # check to make sure local copy of data exists
    with open("data/" + name + ".txt", "r", encoding="utf-8") as file:
        text = file.read()

    return mw.parse(text)

def main():
    events = []

    tabs = parse("NRG_Esports").get_sections(matches="Timeline")[0].filter_templates(matches="tabs")[0]

    for param in tabs.params:
        if param.name[:7] == "content":
            value = str(param.value).replace("\n", "")
            this_events = value.split("*")
            for event in this_events[1:]:
                # eventually, process the event here and push a nicer thing
                events.append(event)

    print(events)

if __name__ == "__main__":
    main()