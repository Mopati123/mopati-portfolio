from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
CINEMATIC = (ROOT / "assets/css/cinematic-v4.css").read_text(encoding="utf-8")


class CinematicV4ContractTests(unittest.TestCase):
    def test_cinematic_stylesheet_is_installed(self):
        self.assertIn("assets/css/cinematic-v4.css", APP)
        self.assertIn("initMotionLayer", APP)
        self.assertTrue((ROOT / "assets/css/cinematic-v4.css").is_file())

    def test_scroll_progress_is_state_driven(self):
        self.assertIn("initScrollProgress", APP)
        self.assertIn("--scroll-progress", APP)
        self.assertIn(".scroll-progress", CINEMATIC)

    def test_filter_transition_has_exit_and_enter_states(self):
        self.assertIn("grid.dataset.transition = 'exit'", APP)
        self.assertIn("grid.dataset.transition = 'enter'", APP)
        self.assertIn('[data-transition="exit"]', CINEMATIC)
        self.assertIn('[data-transition="enter"]', CINEMATIC)

    def test_interactions_include_magnetic_and_ripple_feedback(self):
        self.assertIn("initMagneticControls", APP)
        self.assertIn("--magnetic-x", APP)
        self.assertIn("is-rippling", APP)
        self.assertIn("button-ripple", CINEMATIC)

    def test_navigation_and_sections_have_observer_state(self):
        self.assertIn("initActiveNavigation", APP)
        self.assertIn("initSectionObserver", APP)
        self.assertIn("aria-current", APP)
        self.assertIn("section-observed", CINEMATIC)

    def test_dialog_close_is_animated_but_accessible(self):
        self.assertIn("closeDialogAnimated", APP)
        self.assertIn("dialog.addEventListener('cancel'", APP)
        self.assertIn("project-dialog.is-closing", CINEMATIC)
        self.assertIn("reducedMotion.matches", APP)

    def test_reduced_motion_covers_cinematic_sequences(self):
        self.assertIn("prefers-reduced-motion: reduce", CINEMATIC)
        self.assertIn("animation: none !important", CINEMATIC)


if __name__ == "__main__":
    unittest.main()
