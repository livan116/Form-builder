# FormCraft – React Form Builder

FormCraft is a modern, drag-and-drop form builder built with React, Redux Toolkit, and Vite. It allows users to visually create multi-step forms, preview them in different device modes, collect responses, and export data.

## Features

- ⚡ **Fast**: Built with [Vite](https://vitejs.dev/) for instant hot module reloads.
- 🧩 **Drag & Drop**: Add, remove, and reorder fields and steps visually.
- 📝 **Field Types**: Supports text, textarea, dropdown, checkbox, date, email, phone, URL, and number fields.
- 🗂️ **Multi-Step Forms**: Organize fields into multiple steps.
- 🎨 **Live Preview**: Preview forms in desktop, tablet, and mobile modes.
- 🌙 **Dark Mode**: Toggle between light and dark themes.
- 💾 **Persistence**: Forms and responses are saved in localStorage.
- 📤 **Export**: Export forms as JSON and responses as CSV.
- 🔄 **Undo/Redo**: Basic undo/redo support for form editing.
- 🧪 **Validation**: Field-level validation including required, min/max, and regex patterns.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.


## Project Structure

```
src/
  components/
    builder/        # Form builder UI (canvas, toolbar, step navigation, etc.)
    fields/         # Individual field components (TextField, DropdownField, etc.)
    layout/         # Header, Footer, etc.
    providers/      # ThemeProvider, etc.
    ui/             # Reusable UI components (EmptyState, FormActions, etc.)
  pages/            # App pages (FormBuilderPage, FormFillPage, etc.)
  redux/
    slices/         # Redux slices (form, ui, responses, history)
    store.js        # Redux store setup
  assets/           # Static assets
  App.jsx           # Main app component
  main.jsx          # Entry point
  index.css         # Tailwind and custom styles
```

## Key Files

- [`src/redux/slices/formSlice.js`](src/redux/slices/formSlice.js): Form state, steps, fields, and templates.
- [`src/redux/slices/uiSlice.js`](src/redux/slices/uiSlice.js): UI state (theme, preview mode, sidebar, etc).
- [`src/redux/slices/responsesSlice.js`](src/redux/slices/responsesSlice.js): Form responses and localStorage sync.
- [`src/pages/FormBuilderPage.jsx`](src/pages/FormBuilderPage.jsx): Main builder interface.
- [`src/pages/FormFillPage.jsx`](src/pages/FormFillPage.jsx): Public form filling page.
- [`src/pages/FormResponsesPage.jsx`](src/pages/FormResponsesPage.jsx): View and export form responses.
- [`src/components/builder/FormCanvas.jsx`](src/components/builder/FormCanvas.jsx): Drag-and-drop field canvas.
- [`src/components/builder/StepNavigation.jsx`](src/components/builder/StepNavigation.jsx): Multi-step navigation.

## Customization

- **Themes**: Uses Tailwind CSS with custom color palettes in [`tailwind.config.js`](tailwind.config.js).
- **Field Validation**: Each field can be configured with validation rules in the builder.
- **Templates**: Start with a blank form or use built-in templates (Contact, Survey).

## Credits

- [React](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- [react-icons](https://react-icons.github.io/react-icons/)

---

© {currentYear} FormCraft. All rights reserved.