# Contributing to HD Notes

Thank you for your interest in contributing to HD Notes! This guide will help you get started with contributing to the project.

## 🚀 Getting Started

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/hd-notes.git
   cd hd-notes
   ```
3. Follow the [Setup Guide](SETUP.md) to get the project running locally
4. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Standards

### Code Style

#### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add type annotations where needed
- Prefer functional programming patterns

#### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript interfaces for props
- Implement proper error boundaries
- Follow React best practices

#### Backend
- Use Express.js conventions
- Implement proper error handling
- Use middleware for common functionality
- Follow RESTful API design principles
- Add proper validation for all endpoints

### File Organization

```
frontend/src/
├── components/       # Reusable UI components
├── pages/           # Page components (routes)
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── schemas/         # Validation schemas (Zod)
└── assets/          # Static assets

backend/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
└── config/          # Configuration files
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: camelCase or kebab-case (`userController.ts`, `api-client.ts`)
- **Variables**: camelCase (`userId`, `sessionToken`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`UserType`, `NoteInterface`)

## 🛠 Development Workflow

### 1. Planning

- Check existing issues for similar features/bugs
- Create a new issue if one doesn't exist
- Discuss the approach in the issue comments
- Get approval before starting major changes

### 2. Implementation

- Write clean, documented code
- Add TypeScript types for new functionality
- Include error handling
- Follow existing patterns and conventions
- Write meaningful commit messages

### 3. Testing

- Test your changes locally
- Verify both frontend and backend work correctly
- Test edge cases and error scenarios
- Ensure no existing functionality is broken

### 4. Documentation

- Update README.md if needed
- Add JSDoc comments for new functions
- Update API documentation for new endpoints
- Include examples in documentation

## 📝 Commit Guidelines

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(auth): add Google OAuth integration
fix(notes): resolve note deletion error
docs(api): update endpoint documentation
style(frontend): format code with prettier
refactor(backend): simplify user controller
```

## 🐛 Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable
- **Console Logs**: Any relevant error messages

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 95, Firefox 93]
- Node.js: [e.g., 18.0.0]

## Additional Context
Any other relevant information
```

## ✨ Feature Requests

When suggesting features:

- **Use Case**: Explain why this feature would be useful
- **Detailed Description**: Describe the feature in detail
- **Examples**: Provide examples or mockups if possible
- **Implementation Ideas**: Suggest how it might be implemented

## 🔍 Code Review Process

### Pull Request Guidelines

1. **Title**: Clear, descriptive title
2. **Description**: Explain what the PR does and why
3. **Testing**: Describe how you tested the changes
4. **Screenshots**: Include screenshots for UI changes
5. **Breaking Changes**: Note any breaking changes

### Pull Request Template

```markdown
## What does this PR do?
Brief description of the changes

## How to test
Steps to test the changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

### Review Criteria

- Code quality and readability
- Follows project conventions
- Proper error handling
- TypeScript types are correct
- No console.log statements (unless necessary)
- Performance considerations

## 🧪 Testing

### Frontend Testing
- Test all new UI components
- Verify responsive design
- Test form validation
- Check authentication flows

### Backend Testing
- Test all API endpoints with Postman or curl
- Verify authentication middleware
- Test error handling
- Check database operations

### Integration Testing
- Test full user flows
- Verify frontend-backend communication
- Test authentication end-to-end
- Check note CRUD operations

## 📚 Resources

### Documentation
- [Setup Guide](SETUP.md)
- [API Documentation](API.md)
- [Deployment Guide](frontend/DEPLOYMENT.md)

### Technologies
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Clerk Documentation](https://docs.clerk.dev/)

### Tools
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)

## 🤝 Community

### Communication
- Use GitHub Issues for bug reports and feature requests
- Be respectful and constructive in discussions
- Help others when possible
- Ask questions if you're unsure about anything

### Recognition
- Contributors will be listed in the README
- Significant contributions will be highlighted in releases
- We appreciate all contributions, big and small!

## 📄 License

By contributing to HD Notes, you agree that your contributions will be licensed under the same license as the project (MIT License).

## ❓ Questions?

If you have questions about contributing:
1. Check the documentation first
2. Search existing issues
3. Create a new issue with the "question" label
4. Reach out to maintainers

Thank you for contributing to HD Notes! 🎉 