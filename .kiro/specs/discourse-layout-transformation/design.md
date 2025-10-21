# Design Document

## Overview

This design transforms the current LensForum layout into a Discourse-style Society Protocol Forum. The transformation focuses on creating a compact, efficient navigation experience by implementing a streamlined header, removing the hero section, and adding category-based navigation with breadcrumb trails. The design maintains the existing Next.js architecture while restructuring the UI components to match Discourse patterns.

## Architecture

### Component Structure Changes

The transformation involves modifying the existing layout components and creating new ones:

```
components/
├── layout/
│   ├── discourse-header.tsx          # New compact header component
│   ├── breadcrumb-navigation.tsx     # New breadcrumb component
│   ├── categories-dropdown.tsx       # New categories navigation
│   ├── search-bar.tsx               # New integrated search component
│   └── container.tsx                # Modified to use new header
├── home/
│   └── hero-section.tsx             # To be removed/replaced
└── ui/
    └── breadcrumb.tsx               # Enhanced breadcrumb UI component
```

### Layout Hierarchy

```
RootLayout
└── Container
    ├── DiscourseHeader
    │   ├── Logo (Society Protocol)
    │   ├── CategoriesDropdown
    │   ├── SearchBar
    │   └── UserMenu
    ├── BreadcrumbNavigation
    └── PageContent (children)
```

## Components and Interfaces

### 1. DiscourseHeader Component

**Purpose**: Replace the current navbar with a compact Discourse-style header

**Props Interface**:

```typescript
interface DiscourseHeaderProps {
  className?: string;
}
```

**Key Features**:

- Fixed positioning at top of viewport
- Maximum height of 60px
- Horizontal layout with logo, categories, search, and user menu
- Responsive design with mobile adaptations
- Sticky behavior during scrolling

### 2. CategoriesDropdown Component

**Purpose**: Provide category navigation in the header

**Props Interface**:

```typescript
interface CategoriesDropdownProps {
  categories: Category[];
  currentCategory?: string;
  onCategorySelect: (category: Category) => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  threadCount?: number;
}
```

**Key Features**:

- Dropdown trigger button in header
- Dynamic category loading
- Active category highlighting
- Keyboard navigation support

### 3. SearchBar Component

**Purpose**: Integrated search functionality in the header

**Props Interface**:

```typescript
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  className?: string;
}

interface SearchSuggestion {
  id: string;
  title: string;
  type: "thread" | "category" | "user";
  url: string;
}
```

**Key Features**:

- Real-time search suggestions
- Expandable on mobile devices
- Search history integration
- Keyboard shortcuts (Ctrl+K)

### 4. BreadcrumbNavigation Component

**Purpose**: Show hierarchical navigation path

**Props Interface**:

```typescript
interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}
```

**Key Features**:

- Dynamic breadcrumb generation based on current route
- Truncation for long titles
- Click navigation to parent levels
- Hidden on homepage

### 5. UserMenu Component

**Purpose**: Enhanced user menu in header

**Props Interface**:

```typescript
interface UserMenuProps {
  user?: User;
  notificationCount?: number;
  onLogout: () => void;
}
```

**Key Features**:

- Avatar with notification badge
- Dropdown with profile options
- Login/register buttons for unauthenticated users
- Account switching functionality

## Data Models

### Category Model

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  threadCount: number;
  lastActivity?: Date;
  color?: string;
  icon?: string;
}
```

### Navigation Context

```typescript
interface NavigationContext {
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  activeCategory?: Category;
}
```

### Search Context

```typescript
interface SearchContext {
  query: string;
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  isLoading: boolean;
}
```

## Error Handling

### Component Error Boundaries

- Wrap header components in error boundaries
- Graceful degradation for failed category loading
- Fallback UI for search functionality failures

### Network Error Handling

- Retry mechanisms for category data loading
- Offline state indicators
- Search timeout handling

### User Experience Errors

- Invalid route handling in breadcrumbs
- Search query validation
- Category access permission errors

## Testing Strategy

### Unit Tests

- Component rendering with various props
- User interaction handlers (clicks, keyboard events)
- Search functionality and suggestions
- Breadcrumb generation logic

### Integration Tests

- Header navigation flow
- Category selection and routing
- Search integration with backend
- User authentication state changes

### Visual Regression Tests

- Header layout consistency across breakpoints
- Category dropdown appearance
- Breadcrumb truncation behavior
- Search bar expansion on mobile

### Accessibility Tests

- Keyboard navigation through header elements
- Screen reader compatibility
- Focus management in dropdowns
- ARIA labels and descriptions

## Implementation Details

### Responsive Design Breakpoints

```css
/* Mobile: < 768px */
- Collapsed search (icon only)
- Hamburger menu for categories
- Simplified user menu

/* Tablet: 768px - 1024px */
- Condensed search bar
- Full categories dropdown
- Standard user menu

/* Desktop: > 1024px */
- Full search bar with suggestions
- Complete categories dropdown
- Extended user menu options
```

### Animation and Transitions

- Smooth dropdown animations (200ms ease-in-out)
- Search bar expansion on mobile (300ms ease)
- Breadcrumb fade transitions
- Hover states for interactive elements

### Performance Considerations

- Lazy loading of category data
- Debounced search input (300ms)
- Memoized breadcrumb calculations
- Optimized re-renders with React.memo

### SEO and Metadata

- Dynamic page titles based on breadcrumbs
- Meta descriptions for category pages
- Structured data for navigation elements
- Canonical URLs for category routes

## Migration Strategy

### Phase 1: Header Replacement

1. Create new DiscourseHeader component
2. Implement basic layout without functionality
3. Replace existing navbar in Container component
4. Test responsive behavior

### Phase 2: Navigation Features

1. Implement CategoriesDropdown with static data
2. Add SearchBar with basic functionality
3. Create BreadcrumbNavigation component
4. Integrate with existing routing

### Phase 3: Dynamic Data Integration

1. Connect categories to backend data
2. Implement search suggestions
3. Add user menu enhancements
4. Test complete navigation flow

### Phase 4: Hero Section Removal

1. Remove HeroSection from homepage
2. Adjust homepage layout
3. Update content positioning
4. Test visual consistency

### Backward Compatibility

- Maintain existing route structure
- Preserve user authentication flow
- Keep existing API contracts
- Gradual component replacement
