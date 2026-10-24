import json

with open("src/data/RedSeal/blueprints.json", "r") as f:
    data = json.load(f)

data.extend([
    {
        "id": "bp-06",
        "title": "Site Plan & Elevations",
        "keyTakeaways": [
            {
                "element": "Batter Boards",
                "explanation": "Batter boards are horizontal boards set back from the excavation corners. They hold string lines to mark the building's exterior perimeter. Builders use the 3-4-5 triangulation method (Pythagorean theorem) on these string lines to ensure the foundation is perfectly square before digging."
            },
            {
                "element": "Building Setback",
                "explanation": "The required minimum distance between the property line and the building footprint. Governed by municipal zoning bylaws and NBC spatial separation requirements to limit fire spread between adjacent buildings."
            },
            {
                "element": "Benchmark Elevation",
                "explanation": "A fixed reference point for vertical control. It can be a geodetic benchmark (true elevation above sea level) or an assumed benchmark (e.g., 100.00m set on a nearby manhole or fire hydrant) used to establish foundation depths and floor heights."
            }
        ]
    },
    {
        "id": "bp-07",
        "title": "Roof Framing Plan",
        "keyTakeaways": [
            {
                "element": "Ridge Board",
                "explanation": "The horizontal structural member at the peak of the roof where common rafters meet. NBC 9.23.14.8 requires the ridge board to be at least one commercial size larger than the mating rafters (e.g., 2x8 rafters require a 2x10 ridge board)."
            },
            {
                "element": "Collar Ties",
                "explanation": "Horizontal lumber members installed in the upper third of the attic space. They prevent the rafters from separating at the ridge during high wind uplift events (NBC 9.23.14.10)."
            },
            {
                "element": "Birdsmouth Cut",
                "explanation": "A structural notch cut into the bottom of a rafter to provide a flat bearing surface on the top wall plate. It consists of a vertical plumb cut and a horizontal seat cut. NBC specifies minimum bearing lengths (e.g. 38mm) without over-notching the rafter depth."
            }
        ]
    },
    {
        "id": "bp-08",
        "title": "Stair Layout & Geometry",
        "keyTakeaways": []
    },
    {
        "id": "bp-09",
        "title": "HVAC & Mechanical Layout",
        "keyTakeaways": []
    }
])

with open("src/data/RedSeal/blueprints.json", "w") as f:
    json.dump(data, f, indent=2)
