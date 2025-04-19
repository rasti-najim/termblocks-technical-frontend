# TermBlocks Checklist Builder

A modern web application for creating, managing, and sharing custom checklists with file upload capabilities.

## Overview

TermBlocks Checklist Builder is a full-stack application that allows users to create customizable checklists with categories and items. Users can share checklists via public links, and recipients can complete them by uploading files without modifying the structure.

## Features

- **Checklist Creation**: Build checklists with categories and items
- **File Upload Support**: Configure items to accept single or multiple file uploads
- **Persistent Storage**: All checklists are stored in a database
- **Cloning**: Duplicate existing checklists to create new ones
- **Editing**: Modify checklist structure by adding, removing, or renaming categories and items
- **Sharing**: Share checklists via public links that allow others to upload files

## Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form with Zod validation

### Backend

- Python-based API (FastAPI/Django)
- PostgreSQL database
- Docker for containerization

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Docker and Docker Compose (for backend services)

### Installation

1. Clone the repository

   ```
   git clone <repository-url>
   cd termblocks-technical-frontend
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Start the development server

   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```
npm run build
npm start
```

## Project Structure

- `/src/app`: Next.js application routes
- `/src/components`: Reusable React components
- `/src/contexts`: React context providers
- `/src/schemas`: Zod validation schemas

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
