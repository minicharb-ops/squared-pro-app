import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

new_takeaways = """  },
  {
    title: "FROST DEPTH FOUNDATIONS",
    description: "NBC 9.12.2.2 requires exterior footings to be placed below the frost line to prevent frost heave, unless resting on non-frost-susceptible soil or rock. Depth varies by local climate data.",
    code: "NBC 9.12.2.2",
    examFocus: "Understand requirements for foundations and frost."
  },
  {
    title: "BIRDSMOUTH BEARING",
    description: "The horizontal cut (seat cut) of a birdsmouth must provide a minimum bearing area of 38mm (1.5\") on the top plate. The cut must not exceed 1/3 the depth of the rafter.",
    code: "NBC 9.23.14",
    examFocus: "Verify birdsmouth cutting rules for roof framing."
  },
  {
    title: "MINIMUM ROOF SLOPE",
    description: "Standard asphalt shingles require a minimum roof slope of 1:3 (4 in 12). Low-slope applications (down to 1:6 or 2 in 12) require special continuous eave protection and underlayment.",
    code: "NBC 9.26.2",
    examFocus: "Understand roofing slope minimums for specific materials."
  }
];"""

content = content.replace("  }\n];", new_takeaways, 1)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
