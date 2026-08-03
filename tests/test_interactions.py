from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
MOTION = (ROOT / "assets/css/quantum-motion.css").read_text(encoding="utf-8")
PROJECTS = (ROOT / "assets/js/projects-data.js").read_text(encoding="utf-8")


class PortfolioInteractionTests(unittest.TestCase):
    def test_filter_rebuilds_from_category_state(self):
        self.assertIn("projects.filter(project => project.category.includes(filter))", APP)
        self.assertIn("grid.innerHTML = selectedProjects.map(projectCard).join('')", APP)
        self.assertIn("grid.classList.add('is-switching')", APP)

    def test_filter_exposes_observer_feedback(self):
        self.assertIn("dataset.filterStatus", APP)
        self.assertIn("aria-pressed", APP)
        self.assertIn("observed", APP)

    def test_each_named_filter_collapses_to_a_distinct_subset(self):
        categories = [
            set(re.findall(r'"([a-z-]+)"', match))
            for match in re.findall(r'category:\s*\[([^\]]+)\]', PROJECTS)
        ]
        self.assertGreater(len(categories), 1)

        filter_counts = {
            name: sum(name in project_categories for project_categories in categories)
            for name in ("quantum", "trading", "governance", "finance", "platform")
        }

        for name, count in filter_counts.items():
            with self.subTest(filter=name):
                self.assertGreater(count, 0)
                self.assertLess(count, len(categories))

    def test_quantum_motion_layer_is_installed(self):
        self.assertIn("initMotionLayer", APP)
        self.assertIn("initQuantumField", APP)
        self.assertIn("quantum-motion.css", APP)
        self.assertIn(".quantum-particles span", MOTION)
        self.assertIn(".observer-field", MOTION)

    def test_motion_respects_accessibility_contract(self):
        self.assertIn("prefers-reduced-motion: reduce", MOTION)
        self.assertIn("reducedMotion.matches", APP)

    def test_cards_have_enter_and_tilt_states(self):
        self.assertIn(".project-card.is-visible", MOTION)
        self.assertIn("--tilt-x", MOTION)
        self.assertIn("--tilt-y", MOTION)


if __name__ == "__main__":
    unittest.main()
