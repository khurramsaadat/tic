# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.3.6] - 2024-03-19
### Changed
- Doubled the size of X and O symbols in 2-players mode
- Increased stroke width for better visibility
- Adjusted animation parameters for larger symbols

## [0.3.5] - 2024-03-19
### Changed
- Updated social links to show X (Twitter), Instagram, and Twitter icons
- Replaced LinkedIn icon with Twitter icon
- Maintained consistent icon styling and hover effects

## [0.3.4] - 2024-03-19
### Changed
- Further reduced footer height by adjusting remaining spacings
- Updated copyright section padding to maintain proportions
- Fixed mobile view gaps to match new compact layout

## [0.3.3] - 2024-03-19
### Changed
- Reduced footer height to approximately 1/3rd of original size
- Adjusted padding and spacing in footer sections
- Optimized footer text sizes for compact layout

## [0.3.2] - 2024-03-19
### Changed
- Updated logo text to lowercase "tictactoe"
- Maintained black color for "tic" and "toe", grey for "tac"

## [0.3.1] - 2024-03-19
### Changed
- Replaced SVG logo with direct text styling
- Implemented "TICTACTOE" text with black and grey colors
- Added bold font styling for the logo text
- Removed unused logo.svg file

## [0.3.0] - 2024-03-19
### Changed
- Updated logo to text-based design with "TICTACTOE"
- Used black color for "TIC" and "TOE", grey for "TAC"
- Implemented bold font using Inter font family
- Adjusted logo dimensions in navigation bar

## [0.2.9] - 2024-03-19
### Fixed
- Improved logo rendering by using SVG paths instead of fonts
- Adjusted logo dimensions for better visibility
- Enhanced text clarity in the logo

## [0.2.8] - 2024-03-19
### Changed
- Updated logo to text-based design with "TICTACTOE"
- Used black color for "TIC" and "TOE", grey for "TAC"
- Implemented bold font using Inter font family
- Adjusted logo dimensions in navigation bar

## [0.2.7] - 2024-03-19
### Changed
- Reordered navigation links to make 2 PLAYERS the first link in Navbar
- Ensured consistent navigation order across Navbar and Footer

## [0.2.6] - 2024-03-19
### Changed
- Updated root page to redirect to 2 PLAYERS instead of PLAY WITH SYSTEM
- Modified navigation active state logic to reflect new root page redirect

## [0.2.5] - 2024-03-19
### Changed
- Updated all navigation links to uppercase in Navbar and Footer
- Updated section headings to uppercase in Footer
- Fixed outdated link in Footer (from /two-players to /2-players)

## [0.2.4] - 2024-03-19
### Changed
- Renamed TEST page to 2 PLAYERS
- Updated navigation to reflect the new page name
- Changed route from /test to /2-players

## [0.2.3] - 2024-03-19
### Removed
- Two Players page and related navigation
- Two Players route and components

### Changed
- Updated home page to redirect to Play With System
- Modified navigation to reflect new structure
- Simplified routing and navigation logic

## [0.2.2] - 2024-03-19
### Changed
- Updated Netlify deployment configuration
  - Changed publish directory from `.next` to `out`
  - Removed @netlify/plugin-nextjs plugin
  - Added NETLIFY_NEXT_PLUGIN_SKIP environment variable
  - Simplified build process for static export

## [0.2.1] - 2024-03-19
### Fixed
- Fixed Netlify TOML configuration syntax for proper parsing
- Corrected environment variables format in netlify.toml

## [0.2.0] - 2024-03-19

### Added
- "Play With System" link to the navigation menu
- Overlay effect for mobile menu
- Active link styles to show current page
- Automatic menu closing when changing routes
- Body scroll lock when mobile menu is open
- Improved accessibility with ARIA attributes
- Smooth logo rotation animation
- Link underline animations

### Changed
- Improved mobile menu styling with borders and hover effects
- Adjusted navigation spacing for better layout
- Enhanced burger menu animation
- Made navigation items non-wrapping
- Restored yellow navbar background with black text

### Fixed
- Console errors related to image loading
- Missing logo.svg file
- Mobile menu usability issues
- Navigation accessibility issues

## [0.1.0] - 2024-03-18

### Added
- Initial release
- Two Players game mode
- Instructions page
- Responsive design
- Score tracking
- Game board with animations
- Keyboard navigation support
- Mobile-friendly layout

## [0.1.1] - 2024-02-20
### Changed
- Updated Next.js configuration for Netlify deployment
  - Changed output to 'export' for static deployment
  - Configured image optimization settings
  - Added trailing slash support
- Enhanced Netlify configuration
  - Added security headers
  - Set Node.js version to 18.18.0
  - Disabled telemetry
  - Added proper build settings
- Updated dependencies to latest versions
  - Next.js to ^14.2.28
  - React and React DOM to 18.3.1
  - netlify-cli to ^17.38.1
  - Other minor dependency updates

### Fixed
- Fixed build configuration for Netlify deployment
- Resolved peer dependency issues with React and React DOM
- Removed invalid experimental options from Next.js config

## [0.3.7] - 2024-03-19

### Added
- Active page highlighting in Navbar and Footer
- Visual indicators for current page in navigation
- Smooth transitions for active link states

### Changed
- Enhanced navigation UX with active state styles
- Improved accessibility with aria-current attributes
- Updated hover effects for better visual feedback

## [0.3.8] - 2024-03-19

### Changed
- Enhanced navigation link styling to maintain underline for active pages
- Improved visual feedback by showing underline for both hover and active states
- Separated hover and active state styles for better clarity

## [0.3.9] - 2024-03-19

### Added
- Home icon to the left of TICTACTOE logo
- Interactive hover effects for home icon
- Improved navigation with direct home link

### Changed
- Updated logo section layout to accommodate home icon
- Enhanced visual feedback for home icon interaction
- Optimized spacing between logo elements 

## [0.4.0] - 2024-03-19

### Added
- New "2 Players+" game mode with special rules
  - Each player can only have three marks
  - Placing a fourth mark removes the oldest mark
- Added "2 Players+" link to navigation menu
- Added "2 Players+" button to hero section
- Added "2 Players+" link to footer navigation
- Gradient color effects for X and O symbols
- Red-to-orange gradient for X symbol
- Blue-to-cyan gradient for O symbol

### Changed
- Enhanced SVG animations for smoother transitions
- Updated stroke styles with gradient colors
- Improved visual appeal of game symbols 

## [0.4.1] - 2024-03-19

### Changed
- Enhanced player registration form with matching gradient colors
- Player 1 (X) input styled with red-to-orange gradient
- Player 2 (O) input styled with blue-to-cyan gradient
- Improved input field focus states with colored glows
- Added smooth transitions and hover effects
- Updated responsive design for better mobile experience 

## [0.4.2] - 2024-03-19

### Changed
- Updated scoreboard with player-specific gradient colors
- Player 1 (X) stats now show red-to-orange gradient
- Player 2 (O) stats now show blue-to-cyan gradient
- Enhanced winning player highlights with colored backgrounds
- Improved score update animation with color-specific effects
- Added subtle text shadows for better readability 

## [0.4.3] - 2024-03-19

### Removed
- Next player status message and its grey background card
- Unnecessary status display during active gameplay
- Related turnInfo styles and media queries

### Changed
- Status container now only shows for winner and draw states
- Improved status visibility with backdrop blur effect
- Streamlined game interface for cleaner appearance 

## [0.4.4] - 2024-03-19

### Changed
- Improved game board visual feedback:
  - Added one-time light streak animation for winning lines
  - Streak animation matches the direction of win (horizontal, vertical, diagonal)
  - Streak scales responsively for different screen sizes

### Removed
- Simplified UI elements:
  - Removed card background from winner message
  - Removed (X) and (O) symbols from scoreboard player names
  - Removed symbol indicators from winner announcements

### Enhanced
- Winner message styling:
  - Reduced overall size for more compact display
  - Added player-specific gradient colors (red-orange for Player 1, blue-cyan for Player 2)
  - Improved animations and transitions
  - Better responsive design across all screen sizes 

## [0.4.5] - 2024-03-19

### Added
- Sound effects for game interactions:
  - Click sound when placing X or O
  - Victory sound when winning
  - Draw game sound
  - Error sound for invalid moves
- Mute button in the top-right corner with:
  - Smooth animations
  - Persistent mute state
  - Responsive design
  - Accessibility support

### Changed
- Enhanced game feedback with audio cues
- Added sound management system with volume control
- Improved user experience with audio feedback 

## [0.3.10] - 2024-03-19

### Changed
- Updated navigation text from "Play with System" to "Play with AI" in Navbar and Footer
- Updated button text in Hero component to match new naming
- Maintained all existing functionality while improving naming consistency 

## [0.3.11] - 2024-03-19

### Changed
- Simplified the development modal by removing the upcoming features section
- Adjusted modal styling for a more concise presentation
- Added a helpful message about clicking anywhere to continue
- Reduced modal width for better focus on the main message 

## [0.3.12] - 2024-03-19

### Changed
- Completely redesigned the instructions page with detailed information about all game modes
- Added visual guides and animations for better understanding
- Included game-specific tips and strategies
- Enhanced mobile responsiveness and visual appeal
- Created dedicated sections for 2 PLAYERS, 2 PLAYERS+, and PLAY WITH AI modes 

## [0.3.13] - 2024-03-19

### Added
- Created BoardDemonstration component for generating game board visualizations
- Added image generation page for creating board demonstration PNGs
- Implemented three board visualizations:
  - Classic mode with X and O marks
  - Advanced mode with moving marks indication
  - AI mode with thinking animation
- Added gradient effects and animations to board demonstrations 

## [2024-03-18]

### Added
- Created PNG version of hero background for better social media sharing
- Added scripts/convert-svg.js for SVG to PNG conversion
- Added OpenGraph metadata for improved social media sharing

### Changed
- Updated app/layout.tsx with proper metadata configuration
- Reduced hero background opacity from 0.2 to 0.15 for better visual balance
- Updated metadataBase URL to use the production domain (https://khurram-tictactoe.netlify.app)

### Technical
- Installed new dependencies:
  - puppeteer (dev dependency)
  - sharp (dev dependency)

### Files Modified
- app/layout.tsx
- app/page.module.css
- scripts/convert-svg.js (new)
- public/hero-background.png (new)

### Fixed
- Fixed "Play with AI" card link in home page to correctly point to "/play-with-system"
- Verified and confirmed all navigation links are working correctly
- Ensured consistency between navbar, footer, and home page links

### Technical
- Confirmed all page components are properly connected:
  - 2 Players (TestGameBoard)
  - 2 Players+ (AdvancedGameBoard)
  - Play with AI (AIGameBoard)
  - Instructions page

### Files Modified
- app/page.tsx 

## [0.4.6] - 2024-03-19
### Added
- Hover animation for logo text that adds spacing between "tic", "tac", and "toe"
- Smooth transition effect for the logo spacing animation 

## [0.4.8] - 2024-03-19
### Changed
- Further reduced mobile menu height from 90vh to 60vh for better usability and more compact appearance 

## [0.4.9] - 2024-03-19
### Added
- Subtle separators between mobile menu links for better visual organization
- Improved mobile menu styling:
  - Added light border separators between navigation items
  - Removed border from last item
  - Adjusted padding for better touch targets
  - Enhanced transition effects 

## [0.5.0] - 2024-03-19
### Changed
- Enhanced mobile menu visual appearance:
  - Added semi-transparent background (90% opacity)
  - Implemented backdrop blur effect for modern glass-like appearance
  - Added subtle box shadow for depth
  - Improved hover states with adjusted opacity
  - Enhanced overlay backdrop filter
  - Optimized for better readability with transparent elements 

## [0.5.1] - 2024-03-19
### Changed
- Increased mobile menu transparency to 80% (reduced background opacity from 0.9 to 0.2)
- Enhanced glass-like effect with higher transparency while maintaining readability 

## [0.5.2] - 2024-03-19
### Changed
- Improved mobile menu item styling:
  - Removed background colors from menu items
  - Added subtle slide animation on hover
  - Added red indicator bar for active page
  - Enhanced visual hierarchy with transparent elements
  - Improved touch feedback and interactions

## [0.5.3] - 2024-03-19
### Changed
- Improved mobile menu positioning:
  - Pushed menu down below navbar (80px from top)
  - Centered menu items vertically within the container
  - Maintained right alignment and slide-in animation
  - Adjusted padding for better vertical spacing
  - Optimized layout for better accessibility

## [0.5.4] - 2024-03-19
### Changed
- Updated mobile menu colors to white:
  - Changed text color to white
  - Updated icons to white
  - Added subtle white glow effects on hover
  - Changed separators to white with low opacity
  - Updated active indicator to white with glow effect
  - Enhanced visual contrast for better readability

## [0.5.5] - 2024-03-19
### Changed
- Enhanced mobile menu text and icon visibility:
  - Added subtle text shadow to menu items
  - Added drop shadow to icons
  - Enhanced shadow effects on hover states
  - Improved readability against transparent background
  - Maintained existing glow effects while adding depth

## [0.5.6] - 2024-03-19
### Changed
- Increased mobile menu shadow intensity:
  - Changed to solid black shadows for stronger contrast
  - Adjusted text shadow values for better readability
  - Enhanced icon shadow depth
  - Strengthened hover state shadows
  - Maintained white glow effects for interactivity

## [0.5.7] - 2024-03-19
### Changed
- Added rounded corners to mobile menu:
  - Applied 20px border radius to left corners
  - Enhanced modern appearance with curved edges
  - Maintained glass-like effect with rounded corners
  - Improved visual consistency with other UI elements

## [0.5.8] - 2024-03-19
### Changed
- Added white border to mobile menu:
  - Replaced dark left border with full white border
  - Set border width to 1px
  - Used solid white color for clean appearance
  - Enhanced glass-like effect with subtle border outline

## [0.5.9] - 2024-03-19
### Changed
- Improved mobile menu spacing:
  - Increased gap between menu links to 1.5rem
  - Adjusted link padding for better balance
  - Enhanced visual separation between items
  - Optimized vertical rhythm of menu items
  - Maintained clean layout with improved spacing

## [0.6.0] - 2024-03-19
### Fixed
- Instructions page mobile layout:
  - Adjusted container height to properly account for navbar and footer
  - Reduced top padding to prevent content overlap with navbar
  - Ensured menu icon visibility on mobile view
  - Optimized spacing for better mobile experience

## [0.6.1] - 2024-03-19
### Fixed
- Mobile menu button visibility:
  - Added proper z-index to Instructions page container
  - Ensured menu button remains visible on hover
  - Fixed menu button disappearing issue
  - Maintained consistent menu accessibility

## [0.6.2] - 2024-03-19
### Fixed
- Mobile menu button positioning:
  - Fixed menu button position to stay consistently on the right
  - Added absolute positioning to prevent layout shifts
  - Ensured proper vertical centering
  - Maintained consistent spacing across all pages

## [0.6.3] - 2024-03-19
### Changed
- Reordered navigation links in Navbar and Footer:
  - Moved "PLAY WITH AI" to first position
  - Updated order in both main navigation and footer
  - Maintained consistent order across all navigation areas
  - Improved navigation hierarchy and user flow

## [0.6.4] - 2024-03-19
### Changed
- Reordered game modes on home page:
  - Moved "PLAY WITH AI" card to first position
  - Updated order to match navigation menu
  - Maintained consistent order across all sections
  - Enhanced focus on AI gameplay option

## [0.6.5] - 2024-03-19
### Removed
- Cleaned up unused files and directories:
  - Removed /app/about unused page
  - Removed empty directories (play-with-players, play-with-friends, play-with-ai)
  - Removed unused SVG assets (vercel.svg, next.svg, file.svg, globe.svg, window.svg)
  - Cleaned up redundant route directories
  - Optimized project structure

## [0.6.6] - 2024-03-19
### Added
- Enhanced social media preview support:
  - Created dedicated social preview image generator script
  - Added optimized social preview image (1200x630)
  - Implemented proper OpenGraph metadata
  - Added Twitter card support
  - Improved WhatsApp link preview

### Changed
- Updated metadata configuration in layout.tsx:
  - Removed duplicate meta tags
  - Optimized title and description
  - Added proper image dimensions
  - Enhanced SEO metadata

### Technical
- Added new development dependencies:
  - puppeteer for social preview generation
  - sharp for image optimization
- Added new npm script: generate-social