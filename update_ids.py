import json

with open('data/specialists.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, item in enumerate(data):
    item['id'] = i + 1

with open('data/specialists.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

