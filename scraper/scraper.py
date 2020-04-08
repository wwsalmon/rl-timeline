from os import path
import mwparserfromhell as mw
import requests

API_URL = "https://liquipedia.net/rocketleague/api.php"

def get_page_text(playername, force_overwrite):
    if path.isfile(playername + '.txt'):
        return "no change"
    else:
        # this code from GitHub https://github.com/earwig/mwparserfromhell/
        params = {
            "action": "query",
            "prop": "revisions",
            "rvprop": "content",
            "rvslots": "main",
            "rvlimit": 1,
            "titles": playername,
            "format": "json",
            "formatversion": "2",
        }
        headers = {"User-Agent": "rl-timeline/0.1 (https://github.com/wwsalmon/rl-timeline)"}
        req = requests.get(API_URL, headers=headers, params=params)
        res = req.json()
        text = res["query"]["pages"][0]["revisions"][0]["content"]

        file = open(playername + ".txt", "w")
        file.write(text)
        file.close()

        return "file created"

print(get_page_text("Turbopolsa", False))