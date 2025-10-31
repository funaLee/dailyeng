# EnglishFlow - AI-Powered English Learning Platform

A comprehensive, production-grade English learning application built with Next.js 14, TypeScript, Tailwind CSS, and Zustand. Features vocabulary learning, speaking practice, spaced repetition, and AI-powered feedback.

## Features

- **Vocabulary Hub**: Learn words with pronunciation, meanings, collocations, and examples
- **Translate & Speak Lab**: Translation practice, speaking exercises, and writing feedback
- **Listening & Reading**: Audio comprehension and reading passages with glossaries
- **Quiz System**: Multiple question types (MCQ, gap fill, matching) with XP rewards
- **Speaking Room**: Role-play scenarios with AI tutor and real-time scoring
- **Spaced Repetition (SRS)**: SM-2 algorithm for optimal learning intervals
- **Study Plan**: Personalized learning goals and daily task management
- **Profile & Badges**: Track progress, earn achievements, and view skill radar

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Validation**: Zod
- **UI Components**: shadcn/ui
- **Testing**: Vitest
- **API Mocking**: MSW (Mock Service Worker)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd english-learning-app

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

\`\`\`bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm start            # Start production server

# Testing
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report

# Linting
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with navbar & footer
│   ├── page.tsx           # Home page
│   ├── vocab/             # Vocabulary pages
│   ├── speaking/          # Speaking room pages
│   ├── notebook/          # Flashcard review
│   ├── plan/              # Study plan
│   ├── profile/           # User profile
│   ├── help/              # Help & FAQ
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── layout/            # Layout components (navbar, footer, etc.)
│   ├── vocab/             # Vocabulary components
│   ├── speaking/          # Speaking components
│   ├── flashcard/         # Flashcard components
│   ├── profile/           # Profile components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and helpers
│   ├── api.ts            # Type-safe API fetchers
│   ├── store.ts          # Zustand store
│   ├── srs.ts            # SM-2 algorithm
│   ├── auth.ts           # Authentication service
│   └── mock-data.ts      # Mock data
├── types/                # TypeScript types & Zod schemas
├── mocks/                # MSW setup
│   ├── handlers.ts       # API handlers
│   └── server.ts         # MSW server
└── public/               # Static assets
\`\`\`

## API Endpoints

All endpoints are mocked with MSW. To toggle MSW:

### Enable MSW (Development)

MSW is enabled by default. Mock handlers are in `mocks/handlers.ts`.

### Disable MSW (Production)

To use real API endpoints, remove MSW setup from `app/layout.tsx`:

\`\`\`tsx
// Remove or comment out:
// if (typeof window !== "undefined") {
//   import("@/mocks/browser").then(({ worker }) => {
//     worker.start()
//   })
// }
\`\`\`

## Available Endpoints

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get topic by ID
- `POST /api/topics` - Create new topic

### Vocabulary
- `GET /api/vocab?topicId=:id` - Get vocabulary for topic

### Quizzes
- `GET /api/quizzes?topicId=:id` - Get quiz questions
- `POST /api/quizzes/submit` - Submit quiz answers

### Speaking
- `GET /api/speaking/library` - Get speaking scenarios
- `POST /api/ai/create-topic` - Create custom scenario
- `POST /api/speaking/submit-turn` - Submit speaking turn

### Flashcards
- `GET /api/flashcards` - Get all flashcards
- `POST /api/flashcards` - Create flashcard

### SRS
- `GET /api/srs/queue` - Get cards due for review
- `POST /api/srs/review` - Submit review

### AI
- `POST /api/ai/translate` - Translate text
- `POST /api/ai/feedback` - Get speaking/writing feedback

## Authentication

The app uses mock authentication with localStorage persistence. Demo credentials:

- **Email**: demo@example.com
- **Password**: password

To implement real authentication, replace `lib/auth.ts` with your auth provider.

## Spaced Repetition System (SRS)

The app implements the SM-2 algorithm for optimal learning intervals:

- **Quality Ratings**: 0-5 (0-2 = incorrect, 3-5 = correct)
- **Ease Factor**: 1.3 - 2.5 (adjusts based on performance)
- **Interval**: Days until next review (increases with correct answers)

See `lib/srs.ts` for implementation details.

## Testing

Run tests with Vitest:

\`\`\`bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:ui          # UI mode
npm run test:coverage    # Coverage report
\`\`\`

Test files:
- `lib/srs.test.ts` - SRS algorithm tests
- `types/index.test.ts` - Zod schema validation tests

## Type Safety

All data is validated with Zod schemas in `types/index.ts`. Schemas include:

- `TopicSchema` - Learning topics
- `VocabItemSchema` - Vocabulary items
- `FlashcardSchema` - Flashcards
- `QuizItemSchema` - Quiz questions
- `SpeakingScenarioSchema` - Speaking scenarios
- `StudyPlanSchema` - Study plans
- `ProfileStatsSchema` - User statistics

## Styling

The app uses Tailwind CSS v4 with custom design tokens in `app/globals.css`:

\`\`\`css
@theme inline {
  --color-primary: #3b82f6;
  --color-secondary: #f3f4f6;
  /* ... more tokens ... */
}
\`\`\`

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Memoization of expensive computations
- Virtualized lists for large datasets
- LocalStorage caching for user data

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the Help & FAQ page in the app
- Review the documentation

## Roadmap

- [ ] Real API integration
- [ ] User authentication with OAuth
- [ ] Mobile app (React Native)
- [ ] Offline support with Service Workers
- [ ] Advanced analytics dashboard
- [ ] Community features (leaderboards, challenges)
- [ ] AI-powered content generation
- [ ] Multi-language support

---

Built with ❤️ for English learners worldwide
\`\`\`

```json file="" isHidden
