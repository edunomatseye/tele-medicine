# Telemedicine React Application

This project is a telemedicine application built with React, Vite, shadcn/ui, and Supabase.

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your Supabase project and obtain your project URL and anon key
4. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Run the development server:
   ```
   npm run dev
   ```

## Environment Variables

This project uses the following environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase project's anon key

Make sure to set these in your `.env` file before running the application.

## Supabase Setup

Set up the following tables in your Supabase project:

1. `appointments` table:
   - `id` (int8)
   - `patient_name` (text)
   - `date` (date)
   - `time` (time)

2. `patients` table:
   - `id` (int8)
   - `name` (text)
   - `email` (text)
   - `phone` (text)

## Features

- User authentication
- Appointment management
- Patient list
- Video consultation (placeholder)

## Next Steps

- Implement real-time updates for appointments and patient lists
- Add more detailed patient information and medical records
- Integrate a real video call solution
- Implement user roles and access controls
- Add features like prescription management, secure messaging, and file uploads