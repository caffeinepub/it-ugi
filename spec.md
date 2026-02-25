# Specification

## Summary
**Goal:** Fix end-to-end functionality of the UGC Creative Director app so that form submission, creative generation, save/load, navigation, and clipboard features all work correctly.

**Planned changes:**
- Fix the multi-step form submission to correctly invoke `generateCreativePackage` with all inputs and transition the app to the results view displaying the full generated package
- Fix the backend save and history flow so that "Save Package" persists the package to the backend actor and the History view correctly fetches and lists all saved packages
- Fix navigation in `App.tsx` so that "New Creative", "History", and back/cancel actions all route correctly without broken or blank screens
- Fix "Copy to Clipboard" and "Copy All" buttons in `CreativeResults` to copy the correct content and show a visible confirmation
- Fix the Motoko backend actor to compile without errors and correctly expose `savePackage`, `getPackage`, and `listPackages` functions with proper type definitions

**User-visible outcome:** Users can fill out the multi-step form, generate a creative package, view all results, save packages to history, browse previously saved packages, and copy content to clipboard — all without errors or broken flows.
