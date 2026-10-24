import json

with open("src/data/RedSeal/blueprints.json", "r") as f:
    data = json.load(f)

for bp in data:
    if bp["id"] == "bp-05":
        for ta in bp["keyTakeaways"]:
            if ta["element"] == "Midspan Blocking":
                ta["element"] = "Cross-Bridging"

with open("src/data/RedSeal/blueprints.json", "w") as f:
    json.dump(data, f, indent=2)
