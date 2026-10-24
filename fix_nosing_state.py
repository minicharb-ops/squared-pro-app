import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Add nosingOverhang state
state_old = "const [deflectionLimit, setDeflectionLimit] = useState<any>('L360');"
state_new = "const [deflectionLimit, setDeflectionLimit] = useState<any>('L360');\n  const [nosingOverhang, setNosingOverhang] = useState<any>('0.75');"
content = content.replace(state_old, state_new)

# 2. Add to useEffect dependency array
dep_old = "headerWallType, deflectionLimit, woodGrade, isWetService"
dep_new = "headerWallType, deflectionLimit, nosingOverhang, woodGrade, isWetService"
content = content.replace(dep_old, dep_new)

# 3. Replace in calculation
calc_old = "const nosing = parseFloat(deflectionLimit) || 0;"
calc_new = "const nosing = parseFloat(nosingOverhang) || 0;"
content = content.replace(calc_old, calc_new)

# 4. Replace in UI select
ui_old = """                      <select value={deflectionLimit} onChange={(e) => setDeflectionLimit(e.target.value)}"""
ui_new = """                      <select value={nosingOverhang} onChange={(e) => setNosingOverhang(e.target.value)}"""
content = content.replace(ui_old, ui_new)

with open("src/App.tsx", "w") as f:
    f.write(content)
