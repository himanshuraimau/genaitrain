#!/usr/bin/env python3
"""Packs the three Kite & Co CSV files into one Excel workbook (three sheets).
Needs: pip install openpyxl.   Run after make-demo-data.js:  python3 demo-data/make-xlsx.py
Cells are written exactly as they appear in the CSV (text stays text), so the mess is preserved on purpose."""
import csv, pathlib
from openpyxl import Workbook
from openpyxl.styles import Font

root = pathlib.Path(__file__).resolve().parent.parent / "site" / "demo-data"
NUMERIC = {"quantity", "unit_price_inr", "visits", "signups", "spend_inr", "clicks"}
wb = Workbook()
wb.remove(wb.active)
for name in ("orders", "signups", "ad_spend"):
    ws = wb.create_sheet(name)
    with open(root / f"{name}.csv", newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    head = rows[0]
    ws.append(head)
    for r in rows[1:]:
        ws.append([float(v) if h in NUMERIC and v != "" else v for h, v in zip(head, r)])
    for c in ws[1]:
        c.font = Font(bold=True)
    ws.freeze_panes = "A2"
    for col in ws.columns:
        ws.column_dimensions[col[0].column_letter].width = min(34, max(10, max(len(str(c.value or "")) for c in col[:200]) + 2))
wb.save(root / "kiteco.xlsx")
print("wrote", root / "kiteco.xlsx")
