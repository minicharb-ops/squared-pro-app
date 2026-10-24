import json

with open('src/data/RedSeal/blueprints.json', 'r') as f:
    data = json.load(f)

# Split bp-04 into electrical and plumbing
bp4 = data[3] # bp-04
electrical_takeaways = []
plumbing_takeaways = []

for t in bp4['keyTakeaways']:
    if t['element'] in ['Stack Vent / Vent Terminal', 'Sump Pit Radon Seal', 'Joist Penetration']:
        plumbing_takeaways.append(t)
    else:
        electrical_takeaways.append(t)

new_bp4 = {
    "id": "bp-04",
    "title": "Electrical Plan",
    "description": "Electrical plans detail the location of the main service panel, lighting circuits, switches, smoke detectors, and receptacles.",
    "scale": "Scale: 1/4\" = 1'-0\"",
    "keyTakeaways": electrical_takeaways
}

new_bp5 = {
    "id": "bp-05",
    "title": "Plumbing Plan",
    "description": "Plumbing plans show the layout of the DWV (Drain, Waste, Vent) system, fixtures, traps, and radon sealed sump pits.",
    "scale": "Scale: 1/4\" = 1'-0\"",
    "keyTakeaways": plumbing_takeaways
}

new_data = data[:3] + [new_bp4, new_bp5]

for i in range(4, len(data)):
    old_bp = data[i]
    old_bp['id'] = f"bp-{i+2:02d}"
    new_data.append(old_bp)

with open('src/data/RedSeal/blueprints.json', 'w') as f:
    json.dump(new_data, f, indent=2)

