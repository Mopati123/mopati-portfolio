from __future__ import annotations
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
PROJECT_JS = (ROOT / "assets/js/projects-data.js").read_text(encoding="utf-8")

class PortfolioContractTests(unittest.TestCase):
    def test_required_sections_exist(self):
        for section in ("home", "quantum", "trading", "systems", "architecture", "evidence", "about", "contact"):
            self.assertIn(f'id="{section}"', HTML)

    def test_identity_is_canonical(self):
        self.assertIn("Mopati Ramaologa", HTML)
        self.assertIn("Gaborone, Botswana", HTML)
        self.assertNotIn("Shazim Javed", HTML)
        self.assertNotIn("Faisalabad", HTML)

    def test_quantum_truth_boundary_is_explicit(self):
        self.assertIn("not presented as demonstrated physical quantum speed-up", HTML)
        self.assertIn("quantum-inspired", PROJECT_JS.lower())

    def test_trading_truth_boundary_is_explicit(self):
        for phrase in ("No guarantee of profit", "broker connectivity", "live-fund performance"):
            self.assertIn(phrase, PROJECT_JS)

    def test_project_evidence_contract(self):
        ids = re.findall(r'\bid:\s*"([^"]+)"', PROJECT_JS)
        self.assertGreaterEqual(len(ids), 8)
        self.assertEqual(len(ids), len(set(ids)))
        for field in ("problem:", "system:", "authority:", "evidence:", "boundary:"):
            self.assertEqual(PROJECT_JS.count(field), len(ids), field)

    def test_internal_assets_exist(self):
        for path in re.findall(r'(?:href|src)="((?:assets/)[^"]+)"', HTML):
            self.assertTrue((ROOT / path).exists(), path)

    def test_no_embedded_secrets_or_emailjs(self):
        combined = HTML + PROJECT_JS + (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
        for token in ("emailjs", "service_n4j7jw1", "template_yjyjirc", "AIza"):
            self.assertNotIn(token, combined)

    def test_manifest_is_valid_json(self):
        manifest = json.loads((ROOT / "data/projects.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["schema_version"], "1.0")
        self.assertIn("boundary", manifest["required_fields"])

if __name__ == "__main__":
    unittest.main()
