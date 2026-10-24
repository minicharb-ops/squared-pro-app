import json

with open("src/data/RedSeal/blueprints.json", "r") as f:
    data = json.load(f)

for bp in data:
    if bp["id"] == "bp-04":
        bp["keyTakeaways"].append({
            "element": "DRILLING STUDS FOR WIRING",
            "explanation": "When drilling through load-bearing framing members for wire or pipe runs, the hole diameter cannot exceed 1/3 the depth of the stud, and must leave at least 50mm (2\") of solid wood on the edge."
        })
    elif bp["id"] == "bp-05":
        bp["keyTakeaways"].append({
            "element": "FLOOR OPENINGS (TRIMMERS/HEADERS)",
            "explanation": "Openings in floor framing exceeding 1.2m (4') in width require doubled header joists and doubled trimmer joists to properly transfer the interrupted load."
        })
    elif bp["id"] == "bp-06":
        bp["keyTakeaways"].append({
            "element": "SURFACE DRAINAGE (GRADING)",
            "explanation": "NBC requires the building site to be graded so that water drains away from the foundation. The minimum required slope is 10% for the first 2 meters (approx. 8 inches of fall over 6 feet)."
        })

with open("src/data/RedSeal/blueprints.json", "w") as f:
    json.dump(data, f, indent=2)
