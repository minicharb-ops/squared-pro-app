import json

with open("src/data/RedSeal/blueprints.json", "r") as f:
    data = json.load(f)

for bp in data:
    if bp["id"] == "bp-08":
        bp["title"] = "Exterior Elevation"
        bp["keyTakeaways"].extend([
            {
                "element": "Step Flashing",
                "explanation": "NBC 9.26.4 requires flashing where a roof intersects a wall, installed step-by-step with each shingle course to divert water away from the wall assembly."
            },
            {
                "element": "Finished Grade Clearance",
                "explanation": "NBC 9.27.2.4 mandates a minimum 200mm (8\") clearance from the bottom of untreated wood or vulnerable cladding to the finished ground level to prevent rot and termite access."
            },
            {
                "element": "Window Drip Cap",
                "explanation": "NBC 9.27.3.8 requires head flashing (drip cap) over window and door openings to shed water outwards, preventing it from pooling on the window frame and rotting the header."
            }
        ])
    elif bp["id"] == "bp-09":
        bp["title"] = "Dedicated Stair Section"
        bp["keyTakeaways"].extend([
            {
                "element": "Headroom Clearance",
                "explanation": "NBC 9.8.2 requires a minimum clear headroom of 1950mm (6'-5\") measured vertically from a line drawn through the outer edges of the nosings."
            },
            {
                "element": "Stringer Attachment",
                "explanation": "NBC 9.8.9 dictates that wooden stair stringers must be securely fastened to headers and trimmers. Minimum effective depth of a cut stringer must not be less than 90mm (3.5\")."
            },
            {
                "element": "Handrail Height",
                "explanation": "NBC 9.8.7 states handrails must be installed at a height between 865mm (34\") and 1070mm (42\") above the stair nosing."
            }
        ])

with open("src/data/RedSeal/blueprints.json", "w") as f:
    json.dump(data, f, indent=2)
