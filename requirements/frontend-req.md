# Overview
Upload linkedin banner photo, and this tool creates a speech bubble at the position of the profile image to write text in the banner.
The final image is then the banner with the speech bubble. The standard text is:
 "100% AI generated
 RealFakePhotos.com"



# Features
- Use next.js, and nice ui with shadcn/ui
- Upload image and display directly
- Insert speech bubble which is moveable
- Write text in speech bubble
- Download image with text & speech bubble


# File Structure
TEXT-IN-BANNER
├── .next
├── app
│   ├── fonts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
├── components
│   └── ui
├── lib
├── node_modules
├── requirements
│   └── frontend-req.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json


# Rules
- All new components should go in /components and be named like example-component.tsx unless otherwise specified
- ALL new pages goin /app