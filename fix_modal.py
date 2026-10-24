import re

with open("src/components/PresetsMenu.tsx", "r") as f:
    content = f.read()

old_wrapper = 'className="relative w-full max-w-sm h-full bg-white dark:bg-[#121417] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"'
new_wrapper = 'className="relative w-full max-w-sm h-full bg-white dark:bg-[#121417] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"'

old_scroll = '        <div className="flex-1 overflow-y-auto p-4 space-y-4">'
new_scroll = '        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[calc(8rem+env(safe-area-inset-bottom))]">'

old_inner = '            <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh]">'
new_inner = '            <div className="flex flex-col gap-3">'

if old_wrapper in content:
    content = content.replace(old_wrapper, new_wrapper)
    print("Replaced wrapper")

if old_scroll in content:
    content = content.replace(old_scroll, new_scroll)
    print("Replaced scroll container")

if old_inner in content:
    content = content.replace(old_inner, new_inner)
    print("Replaced inner div")

with open("src/components/PresetsMenu.tsx", "w") as f:
    f.write(content)
