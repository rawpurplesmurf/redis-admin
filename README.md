# Redis Database Manager

A modern web-based Redis database management interface built with Next.js, TypeScript, and Tailwind CSS. This application provides a user-friendly way to connect to and manage Redis databases through a clean and intuitive interface.

## Features

- 🔐 Secure Redis connection configuration
- 💾 Persistent connection settings (saved in localStorage)
- 🔒 TLS/SSL support
- 👀 Key-Value browser interface
- 🎨 Modern UI with dark/light mode support
- 🎯 Real-time connection status monitoring
- 🚀 Built with modern web technologies

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Redis
- **Form Handling**: React Hook Form
- **Validation**: Zod

## Prerequisites

- Node.js (Latest LTS version recommended)
- Redis server (local or remote)
- pnpm/npm/yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd redis-manager
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. Start the development server:
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Connect to Redis**:
   - Enter your Redis connection details:
     - Host (e.g., localhost or redis.example.com)
     - Port (default: 6379)
     - Username (optional)
     - Password (optional)
     - TLS/SSL toggle

2. **Browse Data**:
   - Once connected, use the Key-Value Browser to:
     - View all keys in your Redis database
     - Inspect and modify values
     - Delete keys
     - Add new key-value pairs

3. **Redis Console** (Coming Soon):
   - Execute Redis commands directly
   - View command history
   - Get real-time results

## Building for Production

To create a production build:

```bash
pnpm build
# or
npm run build
# or
yarn build
```

Then start the production server:

```bash
pnpm start
# or
npm start
# or
yarn start
```

## Environment Variables

No environment variables are required to run the application locally. All Redis connection details are configured through the UI.

## Security Considerations

- Redis connection credentials are stored in the browser's localStorage
- TLS/SSL support is available for secure connections
- Password fields are properly masked in the UI
- Connection details are never logged to the console

## Contributing

I built this because I needed it, if you need to modify it, feel free to fork it and do so.

## License

This project is open-source and available under the do whatever you want license.
