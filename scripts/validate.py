#!/usr/bin/env python3
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
subjects = json.loads((root / 'data/subjects.json').read_text())
ids = [s['id'] for s in subjects]
assert len(ids) == len(set(ids)) == 16
assert all(set(s['papers']) <= {'CS', 'DA'} and s['papers'] and s['syllabus'] for s in subjects)
for subject in subjects:
    page = root / 'subjects' / subject['id'] / 'index.html'
    assert page.is_file(), page
for route in ['index.html', 'cs/index.html', 'da/index.html', 'planner/index.html', 'practice/index.html', 'pyqs/index.html', 'resources/index.html', 'assets/app.js', 'assets/styles.css', '.github/workflows/pages.yml']:
    assert (root / route).is_file(), route
assert {'CS', 'DA'} == set(next(s for s in subjects if s['id'] == 'linear-algebra')['papers'])
assert {'CS', 'DA'} == set(next(s for s in subjects if s['id'] == 'databases')['papers'])
print('Validated 16 unique subject routes, shared subject mappings and required assets.')
