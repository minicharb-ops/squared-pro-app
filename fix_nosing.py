import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Change the initial state of deflectionLimit which is used for Nosing Overhang
# Wait, if deflectionLimit is used for both, maybe we should set it to '0.75' if it's stair mode?
# Actually, the requirement says "Change its initial default value to represent 3/4" (e.g., 0.75 if using decimals, or "3/4" if using strings)."

if "const [deflectionLimit, setDeflectionLimit] = useState<any>('L360');" in content:
    print("Found deflectionLimit")
else:
    print("Not found deflectionLimit")
