import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# Let's fix the extra BEDROOM EGRESS WINDOWS at the end of LEGEND_ITEMS
bad_legend = """  },
  {
    title: "BEDROOM EGRESS WINDOWS",
    description: "NBC 9.9.10.1 requires every bedroom to have at least one outside window openable from the inside. It must provide an unobstructed opening of not less than 0.35 m² (3.77 sq. ft.), with no dimension less than 380mm (15\\").",
    code: "NBC 9.9.10.1",
    examFocus: "Memorize the minimum dimensions for egress windows in bedrooms."
  }
];

const MOCK_FALLBACK_BLUEPRINTS = ["""

good_legend = """  }
];

const MOCK_FALLBACK_BLUEPRINTS = ["""

if bad_legend in content:
    content = content.replace(bad_legend, good_legend)
    print("Fixed extra BEDROOM EGRESS WINDOWS in LEGEND_ITEMS")

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

