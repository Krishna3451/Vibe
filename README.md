# Vibe - AI-Powered Website Builder

**Vibe** is an intelligent website builder that leverages AI agents to create, modify, and deploy websites through natural language conversations. Built with modern web technologies, Vibe provides a seamless experience for both technical and non-technical users to bring their web ideas to life.

![Vibe Preview](https://img.shields.io/badge/Status-Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.11.1-2D3748)

## 🚀 Features

### Core Functionality
- **🤖 AI-Powered Code Generation**: Advanced GPT-4 integration for intelligent website creation
- **💬 Natural Language Interface**: Describe what you want, and Vibe builds it
- **🔴 Real-time Preview**: Live website preview as the AI works
- **📁 File Management**: Built-in file explorer with syntax highlighting
- **🏗️ Project Management**: Create and manage multiple website projects
- **⚡ Hot Reload**: Instant updates during development

### Technical Features
- **🔒 Isolated Execution**: E2B sandboxes for secure code execution
- **📊 Message Threading**: Persistent conversation history per project
- **🎨 Modern UI**: Built with shadcn/ui and Tailwind CSS
- **🔄 Type Safety**: End-to-end TypeScript with tRPC
- **⚙️ Background Processing**: Inngest for reliable AI agent execution

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15.3.4](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Lucide Icons](https://lucide.dev/)** - Modern icon library

### Backend & API
- **[tRPC](https://trpc.io/)** - Type-safe API layer
- **[Prisma](https://prisma.io/)** - Database ORM and migrations
- **[PostgreSQL](https://postgresql.org/)** - Primary database
- **[Inngest](https://inngest.com/)** - Background job processing

### AI & Code Execution
- **[OpenAI GPT-4](https://openai.com/)** - AI language model
- **[Inngest Agent Kit](https://github.com/inngest/agent-kit)** - AI agent orchestration
- **[E2B Sandboxes](https://e2b.dev/)** - Secure code execution environment

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Zod](https://zod.dev/)** - Schema validation
- **[React Hook Form](https://react-hook-form.com/)** - Form management

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL database
- E2B API key
- OpenAI API key
- Inngest account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vibe.git
   cd vibe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/vibe"
   
   # AI Services
   OPENAI_API_KEY="sk-..."
   E2B_API_KEY="your-e2b-api-key"
   
   # Inngest
   INNGEST_EVENT_KEY="your-inngest-event-key"
   INNGEST_SIGNING_KEY="your-inngest-signing-key"
   
   # Next.js
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

### Project Structure
```
vibe/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   ├── inngest/          # Background job definitions
│   ├── lib/              # Utility functions
│   ├── modules/          # Feature-based modules
│   │   ├── messages/     # Message handling
│   │   └── projects/     # Project management
│   └── trpc/             # API layer configuration
├── sandbox-templates/     # E2B sandbox templates
└── implementation.md      # Detailed development roadmap
```

### Data Flow

1. **User Input**: User sends a message through the chat interface
2. **API Processing**: tRPC procedures handle the request
3. **AI Agent**: Inngest triggers AI agent with user requirements
4. **Code Generation**: AI agent creates/modifies files in E2B sandbox
5. **Real-time Updates**: Results streamed back to the UI
6. **Preview**: Generated website displayed in iframe preview

### Database Schema

```prisma
model Project {
  id        String   @id @default(uuid())
  name      String
  messages  Message[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Message {
  id        String      @id @default(uuid())
  content   String
  role      MessageRole // USER | ASSISTANT
  type      MessageType // RESULT | ERROR
  projectId String
  project   Project     @relation(fields: [projectId], references: [id])
  fragment  Fragment?
  createdAt DateTime    @default(now())
}

model Fragment {
  id               String  @id @default(uuid())
  messageId        String  @unique
  sandboxUrl       String
  sandboxId        String?
  title            String
  files            Json    // Generated website files
  sandboxCreatedAt DateTime?
  sandboxExpiresAt DateTime?
}
```

## 🚦 Usage

### Creating Your First Website

1. **Start a New Project**
   - Navigate to the home page
   - Click "Create New Project" or use an existing project

2. **Describe Your Website**
   ```
   "Create a modern landing page for a SaaS product with a hero section, 
   features grid, and contact form"
   ```

3. **Watch the AI Work**
   - The AI agent will analyze your request
   - Files will be generated in real-time
   - Preview updates automatically

4. **Iterate and Refine**
   ```
   "Add a dark mode toggle and make the design more minimalist"
   "Change the color scheme to blue and add animations"
   ```

### Advanced Usage

- **File Exploration**: Use the built-in file explorer to examine generated code
- **Direct Modifications**: Ask for specific file changes or additions
- **Framework Flexibility**: Works with React, Vue, vanilla HTML/CSS, and more
- **Responsive Design**: AI automatically considers mobile-first design principles

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma database browser
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
```

### Code Style

- **ESLint**: Enforced code standards with Next.js recommended rules
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (configure in your editor)
- **Component Organization**: Feature-based module structure

### Adding New Features

1. **API Changes**: Add tRPC procedures in `src/modules/`
2. **UI Components**: Create in `src/components/` with TypeScript interfaces  
3. **Database Changes**: Update `prisma/schema.prisma` and run migrations
4. **Background Jobs**: Add Inngest functions in `src/inngest/`

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Test the production build locally  
npm run start
```

### Environment Variables (Production)

Ensure all environment variables are set in your production environment:

- `DATABASE_URL`: Production PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key with sufficient credits
- `E2B_API_KEY`: E2B production API key
- `INNGEST_EVENT_KEY` & `INNGEST_SIGNING_KEY`: Production Inngest keys
- `NEXTAUTH_SECRET`: Cryptographically secure random string
- `NEXTAUTH_URL`: Your production domain

## 🔐 Security Considerations

- **Sandbox Isolation**: All code execution happens in isolated E2B environments
- **Input Validation**: Zod schemas validate all user inputs
- **API Rate Limiting**: Implement rate limiting for production use
- **Environment Secrets**: Never commit API keys or secrets to version control
- **CORS Configuration**: Properly configure CORS for your domain

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Provide detailed reproduction steps
- Include environment information (Node.js version, OS, etc.)

## 📚 Documentation

- **[Implementation Roadmap](implementation.md)**: Detailed development plan and feature roadmap
- **[API Documentation](docs/api.md)**: tRPC API reference (coming soon)
- **[Deployment Guide](docs/deployment.md)**: Production deployment best practices (coming soon)

## 🔗 Related Projects

- **[E2B](https://github.com/e2b-dev/e2b)**: Cloud-based development sandboxes
- **[Inngest](https://github.com/inngest/inngest)**: Durable workflow engine
- **[shadcn/ui](https://github.com/shadcn-ui/ui)**: Beautiful component library

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing AI capabilities
- E2B team for secure sandbox infrastructure  
- Inngest for reliable background job processing
- shadcn for the beautiful UI component library
- Vercel team for Next.js and deployment platform
