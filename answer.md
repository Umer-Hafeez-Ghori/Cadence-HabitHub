Project Refinement & Implementation Report


How to Run

Follow these steps to run the project on a fresh machine:

Prerequisites: No installations are needed (no npm, no Node modules, no external libraries).

Local Execution:



Clone or extract the project folder.

Open the index.html file directly in any modern browser (Chrome, Safari, Edge, Firefox).

Alternative: Open the project in VS Code, right-click index.html, and choose “Open with Live Server”.

Deployed URL: If you deployed it using GitHub Pages, paste the link here. Otherwise, you can write: Local execution only via static file loading.

Stack & Design Choices

Why Vanilla HTML/CSS/JS?

I chose vanilla JavaScript because this is a simple single-page habit tracker. Frameworks like React or Vue would add unnecessary complexity and setup. Vanilla JS keeps the project fast, lightweight, and easy to understand.

Design Decision 1 (Sidebar Layout):

I used a fixed 280px sidebar on the left for inputs and quotes. This keeps controls separate from the main habit grid, which takes the remaining space. Even with many habits, the layout stays clean and organized.

Design Decision 2 (Grid over List for Days Row):

Each habit card uses a 7-column grid for days. This ensures equal spacing, consistent alignment, and better readability compared to flexbox.

Responsive & Accessibility

Responsive Behavior (360px vs 1440px):

On large screens, the app uses a two-column layout with a sidebar and flexible grid. On mobile, everything stacks vertically and adjusts smoothly for smaller screens.

Accessibility:

The app uses strong color contrast for readability and clear focus states for inputs to help keyboard navigation.

Known Limitation (Intentional for now):

ARIA attributes like aria-label and aria-checked are not fully implemented yet. Native HTML elements are used, which already provide basic accessibility support.

AI Usage

Tool Used: Gemini AI

What I used it for:

I used AI to help restructure layout, fix empty-state issues, and build streak logic without external libraries.

What I changed manually:

The original fixed grid layout caused overflow issues. I updated it to:

grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

This made the layout fully responsive.

Honest Gap

What’s not fully polished yet?

The streak system works well in normal cases, but if the user jumps across months or years quickly, the calculation may reset or behave inconsistently.

How I would fix it:

I would separate UI from tracking logic and store activity in a rolling 30-day structure in local storage instead of relying only on the current date.