from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILE = (ROOT / "github-profile" / "README.md").read_text(encoding="utf-8")
BANNER = (ROOT / "github-profile" / "assets" / "quantum-profile-banner.svg").read_text(encoding="utf-8")
PUBLISHER = (ROOT / "scripts" / "publish_github_profile.sh").read_text(encoding="utf-8")


class GitHubProfileOperatingContracts(unittest.TestCase):
    def test_special_profile_repository_contract(self):
        self.assertIn('PROFILE_REPO="${OWNER}/${OWNER}"', PUBLISHER)
        self.assertIn('gh repo create "${PROFILE_REPO}"', PUBLISHER)
        self.assertIn('git push origin HEAD:main', PUBLISHER)

    def test_profile_identity_and_positioning(self):
        self.assertIn("Mopati Ramaologa", PROFILE)
        self.assertIn("Quantum Computing Researcher", PROFILE)
        self.assertIn("Algorithmic Trading Engineer", PROFILE)
        self.assertIn("Governed AI Builder", PROFILE)
        self.assertIn("Gaborone, Botswana", PROFILE)

    def test_profile_links_to_evidence_surface(self):
        self.assertIn("https://mopati123.github.io/mopati-portfolio/", PROFILE)
        self.assertIn("https://github.com/Mopati123/hpl-spec", PROFILE)
        self.assertIn("https://github.com/Mopati123/universal-hamiltonian-framework", PROFILE)
        self.assertIn("https://github.com/Mopati123/duma-boko-contradiction-engine-v2", PROFILE)

    def test_truth_boundaries_are_explicit(self):
        self.assertIn("not a demonstrated physical quantum computer", PROFILE)
        self.assertIn("no claim of guaranteed profitability", PROFILE.lower())
        self.assertIn("private systems", PROFILE.lower())

    def test_banner_is_local_and_accessible(self):
        self.assertIn("./assets/quantum-profile-banner.svg", PROFILE)
        self.assertIn("<title", BANNER)
        self.assertIn("<desc", BANNER)
        self.assertNotIn("<script", BANNER.lower())

    def test_profile_has_no_secret_bearing_configuration(self):
        forbidden = [
            r"AIza[0-9A-Za-z_-]{20,}",
            r"ghp_[0-9A-Za-z]{20,}",
            r"sk-[0-9A-Za-z]{20,}",
            r"BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY",
        ]
        combined = PROFILE + BANNER + PUBLISHER
        for pattern in forbidden:
            self.assertIsNone(re.search(pattern, combined), pattern)

    def test_publisher_aligns_profile_and_public_repo_metadata(self):
        self.assertIn("gh api --method PATCH user", PUBLISHER)
        self.assertIn("repos/${OWNER}/${repo}/topics", PUBLISHER)
        for repository in (
            "mopati-portfolio",
            "hpl-spec",
            "universal-hamiltonian-framework",
            "duma-boko-contradiction-engine-v2",
            "codebase-prompting",
        ):
            self.assertIn(f'set_repo "{repository}"', PUBLISHER)


if __name__ == "__main__":
    unittest.main()
