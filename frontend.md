# MongoForest Frontend Documentation

## Overview

The MongoForest frontend is a modern React single-page application (SPA) that provides an interactive interface for a competitive programming platform focused on MongoDB query challenges. Built with React 19, Vite, and styled-components, it offers a responsive, themeable interface for problem-solving, profile management, and leaderboard tracking.

## Technology Stack

### Core Framework
- **React 19.1.0** - UI library with latest features
- **React Router 7.8.0** - Client-side routing
- **Vite 7.0.4** - Build tool and dev server

### State Management
- **Jotai 2.14.0** - Atomic state management (minimal, flexible)

### Styling
- **styled-components 6.1.19** - CSS-in-JS styling
- **Custom Theme System** - Multi-theme support with JSON schema

### Code Editor
- **CodeMirror 6** - MongoDB query editor
- **@codemirror/lang-javascript** - JavaScript syntax highlighting

### UI Libraries
- **Font Awesome 7.0.0** - Icon library
- **D3.js 7.9.0** - Data visualization (heatmaps, charts)
- **Motion 12.23.12** - Animations and transitions
- **react-range-slider-input** - Difficulty filter slider

### Utilities
- **Axios 1.12.2** - HTTP client
- **date-fns 4.1.0** - Date manipulation
- **Lodash 4.17.21** - Utility functions
- **slugify 1.6.6** - URL slug generation

---

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── main.jsx        # Application entry point
│   ├── App.jsx         # Root component with routing
│   ├── index.css       # Global CSS reset and base styles
│   │
│   ├── Pages/
│   ├── LanderPage.jsx  # Landing page for non-authenticated users
│   ├── Layout.jsx      # Main layout wrapper (navbar, footer, outlet)
│   ├── Practice.jsx    # Practice section layout
│   ├── ProblemView.jsx # Individual problem page
│   ├── ProfilePage.jsx # User profile page
│   ├── ProfileEdit.jsx # Profile editing page
│   ├── NotFound.jsx    # 404 page
│   │
│   ├── components/     # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProblemSet.jsx
│   │   ├── ProblemItem.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Heatmap.jsx
│   │   ├── AuthForm.jsx
│   │   ├── Button.jsx
│   │   ├── Dropdown.jsx
│   │   ├── UserCard.jsx
│   │   └── ...
│   │
│   ├── atoms/          # Jotai state atoms
│   │   └── user.js     # User authentication state
│   │
│   ├── theme/          # Theming system
│   │   ├── schema.json       # Theme definitions
│   │   ├── GlobalStyles.js   # Global styled-components
│   │   └── useTheme.js       # Theme hook
│   │
│   ├── utils/          # Utility functions
│   ├── fetches/        # API request functions
│   ├── contexts/       # React contexts
│   ├── mockdata/       # Mock data for development
│   └── assets/         # Images, fonts, etc.
│
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
└── frontend.md         # This documentation
```

---

## Architecture

### Routing Structure

```
/ (root)
├── / (index)
│   └── Authenticated: Redirect to /practice
│   └── Guest: LanderPage
│
├── /practice
│   └── ProblemSet component
│
├── /practice/:problemSlug
│   └── ProblemView component
│
├── /leaderboard
│   ├── /leaderboard (index) → Redirect to /leaderboard/global
│   └── /leaderboard/:communitySlug
│       └── Leaderboard component
│
└── /profile/:username
    └── ProfilePage component
```

### State Management

**Jotai Atoms** - Lightweight, atomic state management:

```javascript
// atoms/user.js
export const userAtom = atom(null);          // User data
export const getUserAtom = atom((get) => get(userAtom)); // Read-only
export const setUserAtom = atom(...);        // Write with localStorage sync
```

**Local Component State** - React `useState` for UI-specific state

**URL State** - React Router params for problem selection, profiles, etc.

### Theme System

**Multi-Theme Architecture**:
- Themes defined in `theme/schema.json`
- Light/Dark mode support
- Global design tokens (colors, fonts, spacing, shadows)
- Accessed via styled-components `ThemeProvider`

```javascript
// Access theme in components
const StyledDiv = styled.div`
  color: ${props => props.theme.color.a.brand};
  font-size: ${props => props.theme.global.font.md.size}px;
`;
```

---

## Key Components

### Pages

#### **LanderPage.jsx**
Landing page for unauthenticated users.

**Features**:
- Hero section
- Platform introduction
- Sign-up/sign-in CTAs
- Feature showcase

#### **Layout.jsx**
Main layout wrapper for all pages.

**Structure**:
```jsx
<Layout>
  <Navbar />
  <main>
    <Outlet /> {/* Child routes render here */}
  </main>
  <Footer />
</Layout>
```

#### **Practice.jsx**
Practice section container.

**Features**:
- Problem filtering
- Difficulty selection
- Status filtering (solved/attempted/not attempted)
- Random problem picker

#### **ProblemView.jsx**
Individual problem page with code editor and submission.

**Features**:
- Problem statement display
- Schema visualization (MongoDB collections)
- Sample test cases
- CodeMirror editor for query writing
- Run code (test against samples)
- Submit code (official submission)
- Submission history

**Editor Configuration**:
```javascript
new EditorView({
  doc: "",
  parent: editorContainer.current,
  extensions: [
    basicSetup,
    javascript(),
    fixedHeightEditor,
    EditorView.lineWrapping
  ]
})
```

#### **ProfilePage.jsx**
User profile display.

**Sections**:
- User info (avatar, username, email)
- Solved problems stats
- Heatmap of submission activity
- Recent submissions
- Community rankings

#### **ProfileEdit.jsx**
Profile editing interface.

**Editable Fields**:
- First name, last name
- Avatar (upload/URL)
- Privacy settings
- Password change

---

### Components

#### **Navbar.jsx**
Top navigation bar.

**Features**:
- Logo/branding
- Navigation links (Practice, Leaderboard, Profile)
- Theme toggle
- User menu dropdown
- Authentication buttons

#### **ProblemSet.jsx**
List of problems with filtering.

**Features**:
- Search by title
- Filter by difficulty (slider)
- Filter by status (solved/attempted/not attempted)
- Filter by tags
- Sort by ID, title, difficulty, acceptance rate
- Random problem button

**State**:
```javascript
const [problems, setProblems] = useState([]);
const [filters, setFilters] = useState({
  difficulty: [0, 3],
  status: 'all',
  tags: [],
  search: ''
});
```

#### **ProblemItem.jsx**
Single problem row in problem list.

**Display**:
- Status icon (✓ for solved, ○ for attempted)
- Problem ID
- Problem title (link to problem page)
- Acceptance rate
- Difficulty badge

#### **Leaderboard.jsx**
Community leaderboard display.

**Features**:
- Ranked list of users
- Filtering by community
- User stats (problems solved, rank, percentile)
- Pagination

#### **Heatmap.jsx**
Contribution/activity heatmap (similar to GitHub).

**Features**:
- D3.js powered visualization
- Daily submission count
- Color scale based on activity
- Tooltip on hover
- Date range selection

**Implementation**:
```javascript
const colorScale = d3.scaleLinear()
  .range(['#ffffff', '#007700'])
  .domain([0, 20])
  .clamp(true);
```

#### **AuthForm.jsx**
Authentication forms (sign in/sign up).

**Features**:
- Email/username input
- Password input with visibility toggle
- Form validation
- Error display
- Switch between sign in/sign up

#### **Button.jsx**
Reusable button component.

**Variants**:
- Primary, secondary, danger
- Icon buttons
- Loading states
- Disabled states

#### **Dropdown.jsx**
Dropdown menu component.

**Use Cases**:
- User menu
- Filter options
- Sort options

#### **UserCard.jsx**
User profile card.

**Display**:
- Avatar
- Username
- Stats (problems solved, rank)
- Quick actions

---

## State Management Details

### User Authentication

**Atom Definition** (`atoms/user.js`):
```javascript
export const userAtom = atom(getFromLS('user') || null);

export const getUserAtom = atom(
  (get) => get(userAtom)
);

export const setUserAtom = atom(
  null,
  (get, set, newUser) => {
    set(userAtom, newUser);
    setToLS('user', newUser);  // Persist to localStorage
  }
);
```

**Usage in Components**:
```javascript
import { useAtomValue, useSetAtom } from 'jotai';
import { getUserAtom, setUserAtom } from './atoms/user';

function MyComponent() {
  const user = useAtomValue(getUserAtom);
  const setUser = useSetAtom(setUserAtom);
  
  // Use user data
  if (!user) return <Login />;
  
  // Update user
  const handleLogin = (userData) => {
    setUser(userData);
  };
}
```

**User Object Structure**:
```javascript
{
  id: number,
  username: string,
  email: string,
  email_verified: boolean,
  firstname: string | null,
  lastname: string | null,
  avatar: string,  // URL
  is_admin: boolean,
  is_premium: boolean,
  is_private: boolean,
  is_test: boolean
}
```

### Local Storage

**Utilities** (`utils/storage.js`):
```javascript
export const getFromLS = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

export const setToLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
```

**Persisted Data**:
- User authentication state
- Theme preference
- Recent problems viewed

---

## API Integration

### Base Configuration

Backend API: `http://localhost:3000`

### Fetch Functions

**Authentication** (`fetches/auth.js`):
```javascript
export const signIn = async (username, password) => {
  const response = await axios.post('/auth/signin', {
    username, password
  }, { withCredentials: true });
  return response.data;
};

export const signOut = async () => {
  await axios.post('/auth/signout', {}, { withCredentials: true });
};

export const checkAuth = async () => {
  const response = await axios.get('/auth/check', { withCredentials: true });
  return response.data;
};
```

**Problems** (`fetches/problems.js`):
```javascript
export const fetchProblems = async () => {
  const response = await axios.get('/problem/all', { withCredentials: true });
  return response.data;
};

export const fetchProblem = async (slug) => {
  const response = await axios.get(`/problem/${slug}`, { withCredentials: true });
  return response.data;
};

export const submitCode = async (slug, code) => {
  const response = await axios.post(`/problem/${slug}/submit`, {
    submittedCode: code
  }, { withCredentials: true });
  return response.data;
};
```

**User** (`fetches/user.js`):
```javascript
export const fetchUserProfile = async (username) => {
  const response = await axios.get(`/user/public/${username}/info`, {
    withCredentials: true
  });
  return response.data;
};

export const fetchUserSolved = async (userId) => {
  const response = await axios.get(`/user/public/${userId}/info/solved-problems`, {
    withCredentials: true
  });
  return response.data;
};
```

---

## Styling System

### Theme Structure

**Global Design Tokens** (`theme/schema.json`):

```json
{
  "global": {
    "font": {
      "xs": { "size": 12, "lineHeight": 1.6 },
      "md": { "size": 16, "lineHeight": 1.5 },
      "xl": { "size": 24, "lineHeight": 1.33 }
    },
    "dimension": {
      "xs": 8,
      "sm": 16,
      "md": 24,
      "lg": 32
    },
    "shadow": {
      "raised": { "x": 0, "y": 1, "blur": 2, "spread": 0, "color": "..." }
    }
  },
  "data": {
    "light": { "color": {...} },
    "dark": { "color": {...} }
  }
}
```

**Color Palette** (per theme):
```json
{
  "a": {
    "brand": "#1e8a36",
    "text-strong": "#00330A",
    "text-weak": "#146625",
    "stroke-strong": "#3f7f4c",
    "stroke-weak": "#72e58b",
    "fill": "#d3f9db"
  }
}
```

### Global Styles

**GlobalStyles.js**:
```javascript
export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: ${props => props.theme.fontFamily};
    background: ${props => props.theme.color.b.anti-brand};
    color: ${props => props.theme.color.a.text-strong};
  }
`;
```

### Component Styling

**Example styled component**:
```javascript
const ProblemCard = styled.div`
  padding: ${props => props.theme.global.dimension.md}px;
  background: ${props => props.theme.color.a.fill};
  border: 1px solid ${props => props.theme.color.a.stroke-weak};
  border-radius: 8px;
  
  &:hover {
    background: ${props => props.theme.color.a.anti-brand};
  }
`;
```

### CSS Files

Component-specific CSS files (e.g., `Navbar.css`, `ProblemSet.css`) for non-dynamic styles.

---

## Font Loading

**Web Font Loader** (from `App.jsx`):
```javascript
useEffect(() => {
  WebFont.load({
    google: {
      families: [
        'Work Sans',
        'Poppins',
        'Space Grotesk',
        'Caveat'
      ]
    },
    active: () => setFontsLoaded(true),
    inactive: () => setFontsLoaded(true)
  });
}, []);
```

Fonts loaded asynchronously to prevent blocking initial render.

---

## Development

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```
   Runs on `http://localhost:5173` (Vite default)

3. **Build for production**:
   ```bash
   npm run build
   ```
   Output: `dist/` directory

4. **Preview production build**:
   ```bash
   npm run preview
   ```

### Environment

**Backend API**: Ensure backend is running on `http://localhost:3000`

**CORS**: Backend must allow credentials from frontend origin

### Vite Configuration

**vite.config.js**:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'  // Optional proxy
    }
  }
});
```

---

## Key Features Implementation

### Problem Filtering

**ProblemSet.jsx**:
```javascript
const filteredProblems = useMemo(() => {
  return problems.filter(p => {
    // Difficulty filter
    if (p.difficulty < filters.difficulty[0] || 
        p.difficulty > filters.difficulty[1]) return false;
    
    // Status filter
    if (filters.status !== 'all' && p.status !== filters.status) return false;
    
    // Search filter
    if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase())) 
      return false;
    
    return true;
  });
}, [problems, filters]);
```

### Code Submission

**ProblemView.jsx**:
```javascript
const handleSubmit = async () => {
  setSubmitting(true);
  try {
    const code = editor.state.doc.toString();
    const result = await submitCode(problemSlug, code);
    
    // Show verdict
    setVerdict(result.verdict);  // AC, WA, RTE, TLE
  } catch (error) {
    console.error('Submission failed:', error);
  } finally {
    setSubmitting(false);
  }
};
```

### Heatmap Visualization

**Heatmap.jsx** (simplified):
```javascript
const Heatmap = ({ data }) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const colorScale = d3.scaleLinear()
      .range(['#ebedf0', '#216e39'])
      .domain([0, d3.max(data, d => d.count)]);
    
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => (i % 53) * 12)
      .attr('y', d => d.day * 12)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', d => colorScale(d.count));
  }, [data]);
  
  return <svg ref={svgRef} />;
};
```

### Random Problem Selection

**ProblemSet.jsx**:
```javascript
const navigate = useNavigate();

function pickRandomProblem() {
  const idx = Math.floor(Math.random() * filteredProblems.length);
  navigate(`/practice/problem/${filteredProblems[idx].slug}`);
}
```

---

## Navigation

### React Router Links

**Use `Link` or `NavLink` instead of `<a>` tags**:

```javascript
import { Link, NavLink } from 'react-router';

// Basic navigation
<Link to="/practice">Practice</Link>

// Active link styling
<NavLink 
  to="/practice" 
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Practice
</NavLink>
```

### Programmatic Navigation

```javascript
import { useNavigate } from 'react-router';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/practice/problem/two-sum');
  };
}
```

---

## Component Communication

### Props
Parent → Child data flow

```javascript
<ProblemItem 
  problem={problemData}
  onSelect={handleSelect}
/>
```

### Context
Cross-component shared state (if needed)

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Routes />
    </ThemeContext.Provider>
  );
}
```

### Jotai Atoms
Global state accessible anywhere

```javascript
const user = useAtomValue(getUserAtom);
const setUser = useSetAtom(setUserAtom);
```

---

## Testing

### Manual Testing

1. **Authentication Flow**:
   - Sign up new user
   - Sign in existing user
   - Check auth persistence (refresh page)
   - Sign out

2. **Problem Solving**:
   - Browse problems
   - Filter/search problems
   - Open problem
   - Write query in editor
   - Run code (sample tests)
   - Submit code
   - View verdict

3. **Profile**:
   - View own profile
   - View other user profiles
   - Edit profile
   - Check privacy settings

4. **Theming**:
   - Toggle light/dark mode
   - Check theme persistence

### Browser Testing

- Chrome/Chromium
- Firefox
- Safari
- Mobile browsers

---

## Performance Optimization

### Code Splitting

React Router automatically code-splits routes:
```javascript
const ProfilePage = lazy(() => import('./ProfilePage'));

<Route path="/profile/:username" element={
  <Suspense fallback={<Loading />}>
    <ProfilePage />
  </Suspense>
} />
```

### Memoization

```javascript
const filteredProblems = useMemo(() => {
  return problems.filter(filterFunction);
}, [problems, filters]);

const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* expensive render */}</div>;
});
```

### Debouncing

```javascript
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((term) => setSearch(term), 300),
  []
);
```

---

## Best Practices

### Component Structure

```javascript
// 1. Imports
import { useState, useEffect } from 'react';
import styled from 'styled-components';

// 2. Styled components
const Container = styled.div`...`;

// 3. Component
function MyComponent({ prop1, prop2 }) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // 6. Handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 7. Render
  return (
    <Container>
      {/* JSX */}
    </Container>
  );
}

// 8. Export
export default MyComponent;
```

### State Management

- **Local state**: Use `useState` for UI-only state
- **Global state**: Use Jotai atoms for shared state
- **URL state**: Use router params for navigation state
- **Server state**: Consider react-query for API data caching

### Error Handling

```javascript
try {
  const result = await fetchData();
  setData(result);
} catch (error) {
  console.error('Fetch failed:', error);
  setError(error.message);
}
```

### Accessibility

- Use semantic HTML (`<nav>`, `<main>`, `<button>`)
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

---

## Troubleshooting

### Common Issues

**1. Routes not working**
- Check `BrowserRouter` is wrapping `Routes`
- Verify route paths match navigation links
- Check for missing `/` in paths

**2. Styles not applying**
- Ensure `ThemeProvider` wraps components
- Check theme path in styled components
- Verify CSS file is imported

**3. State not persisting**
- Check localStorage functions
- Verify Jotai atom setup
- Check browser localStorage quota

**4. API requests failing**
- Check backend is running
- Verify CORS settings
- Check `withCredentials: true` for cookies
- Inspect network tab in DevTools

**5. Fonts not loading**
- Check WebFont.load configuration
- Verify font names match Google Fonts
- Check network tab for font requests

---

## Future Enhancements

### Planned Features

- **Announcements System**: Display platform announcements
- **Notifications**: Real-time notifications for submissions, comments
- **Community Features**: Create/join communities, community-specific problems
- **Problem Comments**: Discuss problems with other users
- **Solution Discussions**: Share and view solutions
- **Badges/Achievements**: Gamification elements
- **Advanced Analytics**: Detailed performance metrics
- **Mobile App**: React Native mobile client

### Technical Improvements

- **Server-side rendering (SSR)**: Improve SEO and initial load
- **Progressive Web App (PWA)**: Offline support, installable
- **WebSocket integration**: Real-time updates
- **E2E testing**: Playwright or Cypress tests
- **Accessibility audit**: WCAG compliance
- **Performance monitoring**: Track Core Web Vitals

---

## Related Documentation

- **Backend API**: `/backend-new/routes/` documentation
- **Database Schema**: `/database/initdb.sql`
- **Docker Judge**: `/docker-image-src/doc.md`
- **Routing Documentation**: `/backend-new/routes/doc.md`

---

## Contributing

### Code Style

- Use functional components with hooks
- Follow ESLint configuration
- Use Prettier for formatting (recommended)
- Write descriptive commit messages

### Pull Request Process

1. Create feature branch from `main`
2. Implement feature/fix
3. Test thoroughly
4. Submit PR with description
5. Address review comments

### Component Naming

- PascalCase for component files: `ProblemSet.jsx`
- camelCase for utilities: `fetchProblems.js`
- kebab-case for CSS files: `problem-set.css`

---

## License

Part of the MongoForest competitive programming platform.

**Dependencies**: See `package.json` for full list of open-source libraries used.
