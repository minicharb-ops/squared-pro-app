import json

with open("src/data/RedSeal/blueprints.json", "r") as f:
    data = json.load(f)

for bp in data:
    if bp["id"] == "bp-03":
        # Remove duplicate Sill Plate Anchor Bolts
        seen = set()
        new_takeaways = []
        for ta in bp["keyTakeaways"]:
            if ta["element"] == "Sill Plate Anchor Bolts":
                if "Sill Plate Anchor Bolts" in seen:
                    continue
                seen.add("Sill Plate Anchor Bolts")
            new_takeaways.append(ta)
        bp["keyTakeaways"] = new_takeaways

with open("src/data/RedSeal/blueprints.json", "w") as f:
    json.dump(data, f, indent=2)
