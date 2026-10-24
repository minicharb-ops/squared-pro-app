import json

with open("src/data/RedSeal/blueprints.json", "r") as f:
    data = json.load(f)

for bp in data:
    if bp["id"] == "bp-01":
        bp["keyTakeaways"].append({
            "element": "LOAD BEARING WALLS",
            "explanation": "Per NBC Part 9, studs in load-bearing walls must be spaced no more than 16\" (400mm) O.C. if supporting a floor and roof, and require double top plates."
        })
    elif bp["id"] == "bp-02":
        bp["keyTakeaways"].append({
            "element": "SILL PLATE ANCHORAGE",
            "explanation": "NBC 9.23.6.1 requires minimum 12.7mm (1/2\") diameter anchor bolts spaced no more than 2.4m (8') apart, with a minimum embedment of 100mm (4\") into the concrete."
        })
    elif bp["id"] == "bp-03":
        bp["keyTakeaways"].append({
            "element": "BASE FLASHING & WEEPHOLES",
            "explanation": "Flashing must be installed at the base of the wall system to direct moisture outward. Masonry veneer requires weepholes spaced at max 800mm to allow drainage of the cavity."
        })

with open("src/data/RedSeal/blueprints.json", "w") as f:
    json.dump(data, f, indent=2)
