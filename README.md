# Atlas of Making — 3D Edition

A React + Vite portfolio for Priyanshu Rai, featuring a real-time 3D project universe (Three.js via React Three Fiber), project-specific detail worlds, a connected project map, and an interactive simulated CI/CD laboratory.

## Run locally

Requires a current Node.js LTS installation.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

To test a production build:

```bash
npm run build
npm run preview
```

## Deploy free with Vercel

1. Create a GitHub repository and push this folder's contents.
2. Import the repository at https://vercel.com/new.
3. Vercel should detect Vite. Build command: `npm run build`; output directory: `dist`.
4. Deploy and open the HTTPS URL. No custom domain is required.

## Before publishing

- Update `contact.email`, `contact.github`, and `contact.linkedin` in `src/main.jsx`.
- Add verified repository/demo URLs and screenshots to the project entries.
- Confirm the internship details, dates, and responsibilities.
- Check every project statement for accuracy. Do not claim demos, tests, or features that have not been verified.
- Test on mobile and desktop, keyboard navigation, and reduced-motion settings.
- The DevOps pipeline is a local animation/simulation only. It does not deploy to AWS.
- Do not commit API keys, passwords, access tokens, or other secrets.

## Testing note

The source files are generated and the JSX/CSS have been inspected for structural consistency. A full production build requires installing npm dependencies in an environment with registry access; if dependency installation is unavailable, Vite's build has not been verified. Run `npm install` then `npm run build` locally and resolve any errors before deployment.


## Planet texture attribution

The interactive universe loads equirectangular planet maps (Earth, Mars, Jupiter, Saturn, Venus, Uranus, Neptune, Earth clouds, and Saturn rings) from [Solar System Scope Textures](https://www.solarsystemscope.com/textures/). These assets are distributed under the Creative Commons Attribution 4.0 International (CC BY 4.0) license. Attribution: **Planetary textures by Solar System Scope (solarsystemscope.com), CC BY 4.0**. The textures are based on NASA and spacecraft imagery; some unmapped areas are filled artistically. The site needs an internet connection to load these remote textures.


## Portfolio contact and verified public profile

- Email: priyanshurai0211@gmail.com
- Phone: +91 98233 69865
- GitHub: https://github.com/itspriyanshurai
- Public repository confirmed from profile: https://github.com/itspriyanshurai/voicepilot-ai
- Another visible public repository: https://github.com/itspriyanshurai/Jarvis-AI-Agent

The profile currently shows four public repositories; only repository details visible on the profile should be described as verified. Confirm all project implementations and URLs before publishing case studies.
