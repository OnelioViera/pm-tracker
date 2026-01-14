# PM Tracker - Project Management Dashboard

A modern, full-stack application for tracking your work across multiple project managers. Built with Next.js 14, MongoDB, and Shadcn UI.

![PM Tracker Dashboard](https://img.shields.io/badge/Next.js-14-black) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## Features

- **Project Manager Management**: Add, view, and organize project managers with company and contact information
- **Work Item Tracking**: Create and track work items/tasks for each project manager with status updates (Pending, In Progress, Completed)
- **Job Management**: Manage jobs/projects with budget tracking and multiple status states (Active, On Hold, Completed, Cancelled)
- **Real-time Updates**: Instant status changes and CRUD operations
- **Beautiful UI**: Modern gradient design with smooth animations and distinctive typography
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **UI Components**: Shadcn UI (custom implementation)
- **Styling**: Tailwind CSS with custom theme
- **Typography**: Google Fonts (Syne + Space Mono)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   cd pm-tracker
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/pm-tracker
   ```
   
   For MongoDB Atlas, use:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pm-tracker
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## MongoDB Setup Options

### Option 1: Local MongoDB
1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service
3. Use connection string: `mongodb://localhost:27017/pm-tracker`

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string from the "Connect" button
4. Add your IP address to the whitelist
5. Create a database user
6. Use the provided connection string in your `.env` file

## Project Structure

```
pm-tracker/
├── app/
│   ├── api/                    # API routes
│   │   ├── project-managers/   # PM CRUD operations
│   │   ├── work/              # Work items API
│   │   └── jobs/              # Jobs API
│   ├── globals.css            # Global styles and theme
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main dashboard page
├── components/
│   └── ui/                    # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── badge.tsx
├── lib/
│   ├── db.ts                  # MongoDB connection
│   └── utils.ts               # Utility functions
├── models/
│   ├── ProjectManager.ts      # PM schema
│   ├── Work.ts                # Work item schema
│   └── Job.ts                 # Job schema
└── package.json
```

## Usage Guide

### Adding a Project Manager
1. Click the "+" button in the Project Managers section
2. Enter the name (required), email, and company
3. Click "Add PM"

### Managing Work Items
1. Select a project manager from the list
2. Click the "+" button in the Work Items section
3. Add task title, description, and status
4. Update status by clicking on the dropdown in each work item
5. Delete items by clicking the X icon that appears on hover

### Managing Jobs
1. Select a project manager from the list
2. Click the "+" button in the Jobs section
3. Add job title, description, budget, and status
4. Update status using the dropdown
5. Delete jobs by clicking the X icon that appears on hover

## API Endpoints

### Project Managers
- `GET /api/project-managers` - Get all project managers
- `POST /api/project-managers` - Create new project manager
- `PUT /api/project-managers/[id]` - Update project manager
- `DELETE /api/project-managers/[id]` - Delete project manager

### Work Items
- `GET /api/work?pmId=[id]` - Get work items for a PM
- `POST /api/work` - Create new work item
- `PUT /api/work/[id]` - Update work item
- `DELETE /api/work/[id]` - Delete work item

### Jobs
- `GET /api/jobs?pmId=[id]` - Get jobs for a PM
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

## Design Philosophy

The PM Tracker features a bold, modern aesthetic that breaks away from typical dashboard designs:

- **Gradient Background**: A rich purple-to-pink gradient creates visual interest and depth
- **Typography**: Combines Syne (display) with Space Mono (monospace) for a distinctive look
- **Color Palette**: Purple as primary, teal for work items, pink for jobs
- **Animations**: Smooth fade-in and slide animations for enhanced UX
- **Glass Morphism**: Semi-transparent cards with backdrop blur for a modern feel

## Development

To build for production:
```bash
npm run build
npm start
```

## Customization

### Changing Colors
Edit the CSS variables in `app/globals.css`:
```css
:root {
  --primary: 262 83% 58%;        /* Purple */
  --accent: 162 73% 46%;         /* Teal */
  /* Add more custom colors */
}
```

### Modifying Fonts
Update the Google Fonts import in `app/globals.css` and apply new font families in components.

## Contributing

Feel free to fork this project and customize it for your needs!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

If you encounter any issues:
1. Ensure MongoDB is running
2. Check that your `.env` file has the correct connection string
3. Verify all dependencies are installed with `npm install`
4. Check the browser console for any errors

## Future Enhancements

Potential features to add:
- User authentication
- Due date reminders
- File attachments
- Time tracking
- Export to CSV/PDF
- Analytics dashboard
- Team collaboration features

---

Built with ❤️ using Next.js and MongoDB
# pm-tracker
