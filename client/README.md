# Baraton Oasis Hotel Management System

A modern hotel booking and management system for Baraton Community & Research Center built with React, TypeScript, Tailwind CSS, and PayStack integration.

## ✨ Features

### Guest Features
- **Room Browsing**: Explore available rooms with detailed descriptions and images
- **Online Booking**: Seamless room reservation process
- **Secure Payments**: Integrated PayStack payment gateway
- **Booking Management**: View and manage existing bookings
- **Responsive Design**: Fully responsive interface for all devices
- **Image Gallery**: High-quality room images with carousel view
- **Real-time Availability**: Live room availability updates
  
## � Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- A PayStack account for payment processing

### Installation

1. Clone the repository:
   
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit: addd you railway backend url
```

4. Configure PayStack:
- Add your PayStack public key to .env:
```bash
VITE_PAYSTACK_PUBLIC_KEY=your_public_key_here
```

5. Start the development server:
```bash
npm run dev
```

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **State Management**: React Query & Context API
- **Payment Integration**: PayStack
- **UI Components**: 
  - Radix UI primitives
  - Custom reusable components
  - Responsive design patterns
- **Build Tool**: Vite
- **Type Safety**: TypeScript
- **Code Quality**: ESLint & Prettier

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   └── ...            # Feature-specific components
├── pages/             # Application pages/routes
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── config/            # Configuration files
└── types/             # TypeScript type definitions
```
## Cotact section Email set up
```
Go to https://formsubmit.co/

Enter your email (contact@baraton.com) and verify it (they send you a confirmation link)

Done — the form will now send messages directly to your inbox
```

## � Security Features

- HTTPS enforced
- Input validation and sanitization
- Secure payment processing
- Rate limiting
- XSS protection
- CSRF protection

## 🌐 Environment Variables

Required environment variables:
```
VITE_RAILWAY_API_URL=your_api_url
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_key
```

## 📱 Responsive Design

The application is optimized for:
- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (320px to 767px)


## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- UI Components from [Shadcn UI](https://ui.shadcn.com)
- Icons from [Lucide Icons](https://lucide.dev)
- Payment processing by [PayStack](https://paystack.com)# baraton_frontend_guest
# baraton_frontend_guest

