✅ Overview
Goal: Build a Custom Checklist Builder web application with a React + TypeScript frontend and a Python-based backend (FastAPI/Django/etc.), using a relational database (PostgreSQL suggested), and Docker for containerization.

📦 Core Functional Requirements
You need to support:

1. Checklist Creation
   Checklists are made of categories.

Each category has items.

Each item can optionally be a file upload field.

Items may accept single or multiple files.

2. Checklist Persistence
   Store created checklists in a database.

3. Cloning
   Ability to duplicate an existing checklist to start a new one.

4. Editing
   Edit existing checklists: Add, remove, rename categories and items.

5. Sharing
   Share checklists via a public link.

Third parties can upload files but cannot change the structure.
