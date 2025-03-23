# Transaction Logger

A web application for viewing transactions with real-time updates, filtering & pagination capabilities, and a clean user interface.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase project

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd transaction-logger
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup:
   - Create `.env` files in both frontend and backend directories
   - Backend `.env`:
     ```
     PORT=3000
     DATABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_anon_key
     ```
   - Frontend `.env`:
     ```
     VITE_SERVER_URL=http://localhost:3000
     ```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
transaction-logger/
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper functions
│   └── package.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API integration
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Helper functions
│   └── package.json
```

### Architecture Decisions
- **Monorepo Structure**: Keeps frontend and backend code in a single repository for easier development and deployment
- **Component-Based Architecture**: Modular components for better maintainability and reusability
- **Service Layer Pattern**: Separates business logic from API routes for better organization

## Tech Stack

### Frontend
- **React**: UI library for building component-based interfaces
- **TypeScript**: Static typing for better development experience
- **Vite**: Modern build tool for faster development
- **TailwindCSS**: Utility-first CSS framework for styling
- **React DatePicker**: Date input handling
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Type safety and better developer experience
- **Supabase**: PostgreSQL database with real-time capabilities
- **cors**: Cross-origin resource sharing middleware
- **dotenv**: Environment variable management

## Features

- **Real-time Updates**: Transactions appear instantly using Supabase real-time subscriptions
- **Filtering System**: Filter transactions by:
  - Type (credit/debit)
  - Date range
  - Amount range
- **Pagination**: Pagination
- **Optimistic Updates**: UI updates immediately for better user experience
- **Responsive Design**: Works on both desktop and mobile devices

## Implementation Details & Challenges

### Challenges & Solutions

1. **Real-time Updates**
   - Challenge: Implementing real-time updates without overwhelming the server
   - Solution: Used Supabase's real-time subscriptions with client-side caching

2. **Filter State Management**
   - Challenge: Managing complex filter state without unnecessary rerenders
   - Solution: Implemented local filter state with apply/reset functionality

3. **Type Safety**
   - Challenge: Ensuring type safety across the full stack
   - Solution: Used TypeScript with shared interfaces between frontend and backend

4. **Optimistic Updates**
   - Challenge: Providing instant feedback while maintaining data consistency
   - Solution: Implemented optimistic updates with error rollback using React Query

### Performance Optimizations

- Used pagination for large datasets