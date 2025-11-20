# Requirements Document

## Introduction

This specification defines the conversion of the multi-community Lens Forum application into a single-community forum instance. The goal is to simplify the application by removing multi-community features while preserving the core functionality: Lens Protocol authentication, decentralized content ownership, and community discussion features. Users will interact with a single, predefined Lens Group instead of browsing and creating multiple communities.

## Glossary

- **LensForum**: The existing multi-community forum application built on Lens Protocol
- **SingleForum**: The target single-community forum application
- **Lens Group**: A Lens Protocol primitive that represents a community or group of users
- **Lens Account**: A user's identity on the Lens Protocol network
- **Thread**: A discussion topic created by a user within the community
- **Reply**: A comment or response to a thread
- **Admin Wallet**: The wallet with administrative privileges for creating accounts and managing the group
- **Supabase**: The local database used for indexing and metadata storage
- **Testnet**: The Lens Protocol test network used for development

## Requirements

### Requirement 1: Single Community Configuration

**User Story:** As a forum administrator, I want to configure a single Lens Group as the primary community, so that all forum activity is contained within one group.

#### Acceptance Criteria

1. THE SingleForum SHALL use a single, configurable Lens Group address as the primary community
2. THE SingleForum SHALL store the primary group address in environment configuration
3. WHEN the application initializes, THE SingleForum SHALL validate that the configured group exists on the Lens Protocol network
4. THE SingleForum SHALL display an error message IF the configured group address is invalid or not found
5. THE SingleForum SHALL prevent users from creating new communities

### Requirement 2: Simplified Navigation

**User Story:** As a forum user, I want a streamlined navigation experience without community selection, so that I can focus on discussions without navigating between communities.

#### Acceptance Criteria

1. THE SingleForum SHALL remove the "Communities" navigation link from the main navigation bar
2. THE SingleForum SHALL remove the communities listing page
3. THE SingleForum SHALL display threads from the primary community on the homepage
4. THE SingleForum SHALL use simplified URLs that do not include community identifiers (e.g., `/thread/[id]` instead of `/communities/[address]/thread/[id]`)
5. THE SingleForum SHALL redirect legacy community URLs to the new simplified URL structure

### Requirement 3: Thread Management

**User Story:** As a forum user, I want to create and view threads within the single community, so that I can participate in discussions.

#### Acceptance Criteria

1. WHEN a user creates a thread, THE SingleForum SHALL automatically associate the thread with the primary community
2. THE SingleForum SHALL remove community selection from the thread creation interface
3. THE SingleForum SHALL display all threads from the primary community on the main threads page
4. THE SingleForum SHALL maintain thread sorting options (latest, featured, popular)
5. THE SingleForum SHALL preserve thread metadata including author, timestamp, and reply count

### Requirement 4: Authentication Preservation

**User Story:** As a forum user, I want to authenticate using my Lens Account, so that I own my content and identity.

#### Acceptance Criteria

1. THE SingleForum SHALL maintain the existing Lens Protocol authentication flow
2. THE SingleForum SHALL allow users to connect their Web3 wallet
3. THE SingleForum SHALL allow users to select from available Lens Accounts
4. THE SingleForum SHALL allow users to create new Lens Accounts via the application
5. THE SingleForum SHALL maintain user session management without modification

### Requirement 5: Homepage Redesign

**User Story:** As a forum visitor, I want to see relevant content immediately on the homepage, so that I can quickly engage with the community.

#### Acceptance Criteria

1. THE SingleForum SHALL display the hero section with customizable branding for the single community
2. THE SingleForum SHALL remove the "Featured Communities" section from the homepage
3. THE SingleForum SHALL display featured threads from the primary community
4. THE SingleForum SHALL display latest threads from the primary community
5. THE SingleForum SHALL display community statistics (total threads, members, replies)

### Requirement 6: Content Ownership

**User Story:** As a forum user, I want to maintain ownership of my threads and replies, so that my content remains decentralized and portable.

#### Acceptance Criteria

1. THE SingleForum SHALL store all threads and replies on the Lens Protocol network
2. THE SingleForum SHALL associate each thread with the author's Lens Account
3. THE SingleForum SHALL associate each reply with the author's Lens Account
4. THE SingleForum SHALL maintain IPFS storage for thread and reply content
5. THE SingleForum SHALL preserve all existing content ownership mechanisms

### Requirement 7: Group Integration

**User Story:** As a forum administrator, I want to use an existing Lens Group or create a new one, so that I can leverage the Lens Protocol group primitive.

#### Acceptance Criteria

1. THE SingleForum SHALL support configuration with an existing Lens Group address
2. THE SingleForum SHALL provide documentation for creating a new Lens Group
3. THE SingleForum SHALL validate group membership when users post threads
4. THE SingleForum SHALL display group metadata (name, description, member count)
5. THE SingleForum SHALL synchronize group data from the Lens Protocol network

### Requirement 8: Database Schema Simplification

**User Story:** As a developer, I want a simplified database schema that reflects the single-community model, so that queries are efficient and maintainable.

#### Acceptance Criteria

1. THE SingleForum SHALL maintain the existing Supabase schema for threads and replies
2. THE SingleForum SHALL add a configuration table for storing the primary group address
3. THE SingleForum SHALL remove community-specific filtering from thread queries WHERE the community is hardcoded
4. THE SingleForum SHALL maintain indexes for efficient thread and reply retrieval
5. THE SingleForum SHALL preserve data migration compatibility with existing data

### Requirement 9: UI Customization

**User Story:** As a forum administrator, I want to customize the branding and appearance, so that the forum reflects my community's identity.

#### Acceptance Criteria

1. THE SingleForum SHALL support customizable community name in the navigation bar
2. THE SingleForum SHALL support customizable hero section text and imagery
3. THE SingleForum SHALL support customizable color theme via Tailwind configuration
4. THE SingleForum SHALL support customizable logo and favicon
5. THE SingleForum SHALL maintain responsive design across all device sizes

### Requirement 10: Backward Compatibility

**User Story:** As a developer, I want to preserve existing thread and reply data, so that no content is lost during the conversion.

#### Acceptance Criteria

1. THE SingleForum SHALL maintain compatibility with existing thread data structures
2. THE SingleForum SHALL maintain compatibility with existing reply data structures
3. THE SingleForum SHALL provide migration scripts for updating existing data
4. THE SingleForum SHALL handle legacy URLs with appropriate redirects
5. THE SingleForum SHALL preserve all Lens Protocol content references
