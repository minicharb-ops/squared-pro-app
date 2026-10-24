import json

with open("src/data/RedSeal/blueprints.json", "r") as f:
    data = json.load(f)

for bp in data:
    if bp["id"] == "bp-01":
        bp["keyTakeaways"].extend([
            {
                "element": "Window Rough Opening",
                "explanation": "Header span limits for exterior bearing walls must comply with NBC 9.23.12. R.O. requires precision for window fitment and shimming tolerances."
            },
            {
                "element": "Stair Rise & Run",
                "explanation": "NBC 9.8.4 dictates safe stair geometries. Maximum rise is 200mm (7 7/8\") and minimum run is 210mm (8 1/4\") for private dwelling stairs."
            }
        ])
    elif bp["id"] == "bp-02":
        bp["keyTakeaways"].extend([
            {
                "element": "Rebar Spacing",
                "explanation": "Reinforcing steel (15M) spacing must adhere to NBC minimum concrete cover and lap splice rules to ensure structural integrity against lateral soil pressure."
            },
            {
                "element": "Damp-proofing",
                "explanation": "NBC 9.13 requirements for foundation drainage and bituminous coatings applied to the exterior face of foundation walls to prevent soil moisture ingress."
            }
        ])

with open("src/data/RedSeal/blueprints.json", "w") as f:
    json.dump(data, f, indent=2)
