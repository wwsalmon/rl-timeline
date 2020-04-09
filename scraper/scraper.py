from os import path
import mwparserfromhell as mw
import requests
from pprint import pprint

API_URL = "https://liquipedia.net/rocketleague/api.php"

def fetch_timeline(name, force_overwrite = False):
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
        data = str(mw.parse(text).get_sections(matches="Timeline")[0].filter_templates(matches="tabs")[0])

        with open("data/" + name + ".txt", "w", encoding="utf-8") as file:
            file.write(data)

        print("file created")

def parse_timeline(name):
    fetch_timeline(name) # check to make sure local copy of data exists
    with open("data/" + name + ".txt", "r", encoding="utf-8") as file:
        text = file.read()

    return mw.parse(text).filter_templates(matches="tabs")[0]

def get_team_events(name):
    events = []

    tabs = parse_timeline(name)

    for param in tabs.params:
        if param.name[:7] == "content":
            value = str(param.value).replace("\n", "")
            this_events = value.split("*")
            for event in this_events[1:]:
                event = mw.parse(event)

                descript = event.strip_code()
                # process this using NLP

                refs = event.filter_tags(matches="ref") # gives all references as mwparser tag objects

                ref_urls = []
                date = ""
                for ref in refs:
                    cite = ref.contents.filter_templates(matches="cite")
                    cite = cite[0]
                    date = cite.get("date").value
                    url = cite.get("url").value
                    ref_urls.append(url)

                events.append({"descript": descript, "date": date, "ref_urls": ref_urls})

    return events

def main():
    pprint(get_team_events("Gale_Force_eSports"))

if __name__ == "__main__":
    main()