# React Table Mapping Changelog

## Version 1.0.3

Released on April 28th, 2026.

- fix Mapping Component Width.

## Version 1.0.2

Released on April 28th, 2026.

- **Bug fix**: Typing rapidly across multiple `input` or `select` cells no longer causes previously-entered values to be wiped. Values are now preserved correctly during concurrent edits.

## Version 1.0.1

Released on December 9th, 2025.

- react version patch update to 19.0.1

## Version 1.0.0

Released on October 14th, 2025.

## Version 1.0.0-beta.16

- **BREAKING CHANGE**: Removed `TableMappingProvider` - now uses parent-controlled state management

- Added ref-based API for imperative method access
- Moved Radix UI components to peerDependencies for better bundle optimization
- Improved performance with reduced internal state management

## Version 1.0.0-beta.11

- `containerHeight` & `containerMinHeight` props have been deprecated.
- Enhanced line hover state for better user experience.
- `disabled` state support for read-only scenarios.
- Fixed mapping ui in multiple TableMapping Component.

## Version 1.0.0-beta.10

- Maximum re-render problem resolved.
- Container height resize issue fixed for better responsiveness.

## Version 1.0.0-beta.9

- Tailwind dependencies completely removed.
- Transitioned to pure CSS for better performance and smaller bundle size.
