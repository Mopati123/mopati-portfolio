# Mopati Ramaologa — Evidence-Native Engineering Portfolio

A responsive portfolio for systems architecture, quantum-inspired computation, algorithmic trading, governed AI, finance, and full-stack platforms.

## Design law

Every featured system exposes:

1. Problem
2. System
3. Authority boundary
4. Evidence
5. Current limitation
6. Status

The portfolio does not use subjective skill percentages or unsupported production claims.

## Local use

```bash
python3 auto_setup.py validate
python3 auto_setup.py serve --port 8080
```

Open `http://127.0.0.1:8080`.

## Publish

After creating an empty GitHub repository:

```bash
git init
git add .
git commit -m "feat: launch evidence-native engineering portfolio"
git branch -M main
git remote add origin https://github.com/Mopati123/mopati-portfolio.git
git push -u origin main
```

In the repository settings, select **Pages → Source: GitHub Actions**. The included workflow validates the portfolio before deployment.

## Content maintenance

Runtime project content is in `assets/js/projects-data.js`. Every project must preserve the evidence contract fields documented in `data/projects.json`.

## Security and privacy

- No API keys, EmailJS identifiers, analytics keys, or embedded contact secrets.
- Private repositories are labelled as controlled access.
- Trading and quantum claims include explicit truth boundaries.
- The contact form copies a structured enquiry locally and sends no data to a third party.

## Attribution

The initial design direction was informed by the MIT-licensed `shazimjaved/Portfolio` project. This implementation was rebuilt as an original evidence-native architecture. See `NOTICE`.

### Governed publication operator

With GitHub CLI authenticated:

```bash
./publish_to_github.sh
```

The operator validates first, refuses missing Git identity, creates the public repository when possible, and otherwise connects to an existing empty `Mopati123/mopati-portfolio` repository before pushing.
