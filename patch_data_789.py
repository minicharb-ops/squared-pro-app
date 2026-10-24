import json

with open("src/data/RedSeal/blueprints.json", "r") as f:
    data = json.load(f)

for bp in data:
    if bp["id"] == "bp-07":
        bp["keyTakeaways"].append({
            "element": "ATTIC VENTILATION",
            "explanation": "Unheated attics require unobstructed ventilation (like soffit vents). The total net free venting area must be at least 1/300 of the insulated ceiling area, distributed evenly between the eaves and the ridge."
        })
    elif bp["id"] == "bp-08":
        bp["keyTakeaways"].append({
            "element": "EAVES PROTECTION",
            "explanation": "Ice and water shield (eaves protection) must extend from the edge of the roof to a line not less than 900mm (36\") up the roof slope, to prevent water ingress from ice damming."
        })
    elif bp["id"] == "bp-09":
        # Check if already present to avoid duplicates, or replace Handrail Height?
        # The prompt says: Title: "GUARDS & HANDRAILS". Text: ...
        # Let's remove the old "Handrail Height" if it exists, or just append "GUARDS & HANDRAILS".
        bp["keyTakeaways"].append({
            "element": "GUARDS & HANDRAILS",
            "explanation": "Interior stairs require a handrail if there are more than 2 risers. Guards must be a minimum of 900mm (36\") high, or 1070mm (42\") high if the drop exceeds 10 meters."
        })

with open("src/data/RedSeal/blueprints.json", "w") as f:
    json.dump(data, f, indent=2)

