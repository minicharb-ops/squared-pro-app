import json

with open("src/data/RedSeal/blueprints.json", "r") as f:
    data = json.load(f)

for bp in data:
    if bp["id"] == "bp-03":
        bp["keyTakeaways"].extend([
            {
                "element": "6-mil Poly Vapour Barrier",
                "explanation": "NBC 9.25.4 mandates a vapour barrier on the warm-in-winter side of the building envelope to prevent moisture diffusion into the insulated cavity."
            },
            {
                "element": "OSB Nailing Pattern",
                "explanation": "Standard wall sheathing nailing: 150mm (6\") on edges, 300mm (12\") in the field to provide required shear strength (NBC 9.23.3.5)."
            },
            {
                "element": "Sill Plate Anchor Bolts",
                "explanation": "1/2\" diameter bolts spaced at 2.4m O.C. connecting the sill plate to the foundation, resisting uplift and lateral loads."
            }
        ])
    elif bp["id"] == "bp-04":
        bp["keyTakeaways"].extend([
            {
                "element": "Joist Penetration",
                "explanation": "NBC 9.23.5.1: Holes drilled in framing members cannot exceed 1/4 the depth of the member unless properly engineered."
            }
        ])
    elif bp["id"] == "bp-05":
        bp["keyTakeaways"].extend([
            {
                "element": "Cross-Bridging",
                "explanation": "NBC 9.23.9.4 requires lateral support (cross-bridging or solid blocking) for joists exceeding 2.1m spans to prevent twisting."
            }
        ])

with open("src/data/RedSeal/blueprints.json", "w") as f:
    json.dump(data, f, indent=2)
