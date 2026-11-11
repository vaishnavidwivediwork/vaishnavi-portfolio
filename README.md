# Vaishnavi Dwivedi — Personal Portfolio Website

A modern luxury editorial portfolio website built with pure semantic HTML5, CSS3, and vanilla ES6+ JavaScript. Designed with a strict two-color aesthetic: 100% pure white (`#FFFFFF`) and pure black (`#000000`).

## Directory Structure

```text
vaishnavi-portfolio/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── README-ASSETS.txt
    ├── profile.jpg             (Place your portrait photo here)
    ├── resume.pdf              (Place your CV / Resume PDF here)
    └── projects/
        ├── project-01.jpg      (Graphic Design study preview)
        ├── project-02.jpg      (Social Media Creatives preview)
        └── project-03.jpg      (Branding & Identity preview)
```

## Deployment to GitHub Pages

1. **Unzip** this archive to your local computer.
2. Add your personal media files (`profile.jpg`, `resume.pdf`, and project images) into the `assets/` directory as described in `assets/README-ASSETS.txt`.
3. Create a new GitHub repository (e.g., `portfolio` or `vaishnavidwivediwork.github.io`).
4. Commit and push all files to the `main` branch.
5. In your GitHub repository, navigate to **Settings** > **Pages**.
6. Under **Branch**, select `main` and root `/`, then click **Save**.
7. Your portfolio will be live at `https://<username>.github.io/<repo-name>/`.

## Features
- **Strict Ink & Paper Palette:** 100% solid monochrome (`#FFFFFF` and `#000000`).
- **Zero External Dependencies:** Built without any UI frameworks or third-party libraries.
- **Accessible & Responsive:** Mobile drawer navigation with dynamic viewport height handling (`100dvh`), keyboard trap, and Escape-key support.
- **Fail-Safe Media Fallbacks:** Displays editorial SVG/monogram placeholders if an asset is not yet uploaded.
