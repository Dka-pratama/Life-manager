# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```
Life-manager
├─ AGENTS.md
├─ app.json
├─ assets
│  ├─ expo.icon
│  │  ├─ Assets
│  │  │  ├─ expo-symbol 2.svg
│  │  │  └─ grid.png
│  │  └─ icon.json
│  ├─ fonts
│  │  ├─ Manrope-Bold.ttf
│  │  ├─ Manrope-ExtraBold.ttf
│  │  ├─ Manrope-Medium.ttf
│  │  ├─ Manrope-Regular.ttf
│  │  └─ Manrope-SemiBold.ttf
│  ├─ icons
│  └─ images
│     ├─ expo-badge-white.png
│     ├─ expo-badge.png
│     ├─ expo-logo.png
│     ├─ favicon.png
│     ├─ icon.png
│     ├─ logo-glow.png
│     ├─ react-logo.png
│     ├─ react-logo@2x.png
│     ├─ react-logo@3x.png
│     ├─ splash-icon.png
│     ├─ tabIcons
│     │  ├─ explore.png
│     │  ├─ explore@2x.png
│     │  ├─ explore@3x.png
│     │  ├─ home.png
│     │  ├─ home@2x.png
│     │  └─ home@3x.png
│     └─ tutorial-web.png
├─ CLAUDE.md
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (tabs)
│  │  │  ├─ dashboard.tsx
│  │  │  ├─ finance.tsx
│  │  │  ├─ habits.tsx
│  │  │  ├─ profile.tsx
│  │  │  ├─ task.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ habit
│  │  │  └─ create.tsx
│  │  ├─ index.tsx
│  │  ├─ note
│  │  │  └─ create.tsx
│  │  ├─ task
│  │  │  ├─ create.tsx
│  │  │  └─ edit.tsx
│  │  └─ _layout.tsx
│  ├─ components
│  │  ├─ feedback
│  │  │  ├─ EmptyState.tsx
│  │  │  ├─ ErrorState.tsx
│  │  │  └─ LoadingState.tsx
│  │  ├─ layout
│  │  │  ├─ Header.tsx
│  │  │  ├─ PageContainer.tsx
│  │  │  ├─ Screen.tsx
│  │  │  └─ SectionTitle.tsx
│  │  ├─ navigation
│  │  │  ├─ BottomTab.tsx
│  │  │  └─ ProtectedRoute.tsx
│  │  └─ ui
│  │     ├─ Button.tsx
│  │     ├─ Card.tsx
│  │     ├─ Input.tsx
│  │     └─ Text.tsx
│  ├─ constants
│  │  ├─ colors.ts
│  │  ├─ Spacing.ts
│  │  └─ Typography.ts
│  ├─ contexts
│  │  └─ ThemeContext.tsx
│  ├─ database
│  │  ├─ database.ts
│  │  ├─ DatabaseProvider.tsx
│  │  └─ migrations.ts
│  ├─ repositories
│  │  ├─ FinanceCategorie.ts
│  │  ├─ FinanceTransaction.ts
│  │  ├─ HabitLogRepository.ts
│  │  ├─ HabitRepository.ts
│  │  ├─ NoteRepository.ts
│  │  ├─ SettingsRepository.ts
│  │  └─ TaskRepository.ts
│  ├─ services
│  ├─ stores
│  ├─ types
│  │  ├─ financeCategorie.ts
│  │  ├─ financeTransaction.ts
│  │  ├─ habit.ts
│  │  ├─ habitLog.ts
│  │  ├─ note.ts
│  │  ├─ task.ts
│  │  └─ taskNote.ts
│  └─ utils
└─ tsconfig.json

```
```
Life-manager
├─ AGENTS.md
├─ app.json
├─ assets
│  ├─ expo.icon
│  │  ├─ Assets
│  │  │  ├─ expo-symbol 2.svg
│  │  │  └─ grid.png
│  │  └─ icon.json
│  ├─ fonts
│  │  ├─ Manrope-Bold.ttf
│  │  ├─ Manrope-ExtraBold.ttf
│  │  ├─ Manrope-Medium.ttf
│  │  ├─ Manrope-Regular.ttf
│  │  └─ Manrope-SemiBold.ttf
│  ├─ icons
│  └─ images
│     ├─ expo-badge-white.png
│     ├─ expo-badge.png
│     ├─ expo-logo.png
│     ├─ favicon.png
│     ├─ icon.png
│     ├─ logo-glow.png
│     ├─ react-logo.png
│     ├─ react-logo@2x.png
│     ├─ react-logo@3x.png
│     ├─ splash-icon.png
│     ├─ tabIcons
│     │  ├─ explore.png
│     │  ├─ explore@2x.png
│     │  ├─ explore@3x.png
│     │  ├─ home.png
│     │  ├─ home@2x.png
│     │  └─ home@3x.png
│     └─ tutorial-web.png
├─ CLAUDE.md
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (tabs)
│  │  │  ├─ dashboard.tsx
│  │  │  ├─ finance.tsx
│  │  │  ├─ habits.tsx
│  │  │  ├─ profile.tsx
│  │  │  ├─ task.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ habit
│  │  │  └─ create.tsx
│  │  ├─ index.tsx
│  │  ├─ note
│  │  │  └─ create.tsx
│  │  ├─ task
│  │  │  ├─ create.tsx
│  │  │  └─ edit.tsx
│  │  └─ _layout.tsx
│  ├─ components
│  │  ├─ feedback
│  │  │  ├─ EmptyState.tsx
│  │  │  ├─ ErrorState.tsx
│  │  │  └─ LoadingState.tsx
│  │  ├─ layout
│  │  │  ├─ Header.tsx
│  │  │  ├─ PageContainer.tsx
│  │  │  ├─ Screen.tsx
│  │  │  └─ SectionTitle.tsx
│  │  ├─ navigation
│  │  │  ├─ BottomTab.tsx
│  │  │  └─ ProtectedRoute.tsx
│  │  └─ ui
│  │     ├─ Button.tsx
│  │     ├─ Card.tsx
│  │     ├─ Input.tsx
│  │     └─ Text.tsx
│  ├─ constants
│  │  ├─ colors.ts
│  │  ├─ Spacing.ts
│  │  └─ Typography.ts
│  ├─ contexts
│  │  └─ ThemeContext.tsx
│  ├─ database
│  │  ├─ database.ts
│  │  ├─ DatabaseProvider.tsx
│  │  └─ migrations.ts
│  ├─ repositories
│  │  ├─ FinanceCategoryRepository.ts
│  │  ├─ FinanceTransactionRepository.ts
│  │  ├─ HabitLogRepository.ts
│  │  ├─ HabitRepository.ts
│  │  ├─ NoteRepository.ts
│  │  ├─ SettingsRepository.ts
│  │  └─ TaskRepository.ts
│  ├─ services
│  ├─ stores
│  ├─ types
│  │  ├─ financeCategorie.ts
│  │  ├─ financeTransaction.ts
│  │  ├─ habit.ts
│  │  ├─ habitLog.ts
│  │  ├─ note.ts
│  │  ├─ task.ts
│  │  └─ taskNote.ts
│  └─ utils
└─ tsconfig.json

```