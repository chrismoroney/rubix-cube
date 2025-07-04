# 3D Interactive Rubik's Cube

This is a web-based, interactive 3D Rubik's Cube application built with Next.js, React Three Fiber, and Tailwind CSS. You can view the cube from all angles, select any slice (including middle layers), and rotate them to solve the puzzle.

## Live Demo

[Link to your deployed application]

## Features

*   **3D Cube Rendering:** A fully interactive 3D model of a Rubik's Cube.
*   **Orbit Controls:** Drag the mouse to rotate the entire cube and view it from any angle.
*   **Slice Selection:** Click on any cube face to select the corresponding slice for rotation.
*   **Intuitive Controls:**
    *   Click a cube face to select a slice. The selected slice will be highlighted.
    *   Click the same cube again to cycle through the three possible rotation axes (X, Y, and Z).
    *   Use the **Left and Right Arrow keys** to rotate the selected slice.
    *   Press **Escape** or click the background to deselect the current slice.
*   **Smooth Animations:** All rotations are smoothly animated for a fluid user experience.
*   **Responsive Design:** The cube dynamically adjusts to fit the window size.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18.x or later)
*   npm or yarn

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/your_repository.git
    ```
2.  Navigate to the project directory
    ```sh
    cd your_repository
    ```
3.  Install NPM packages
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **3D Rendering:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
*   **3D Helpers:** [Drei](https://github.com/pmndrs/drei)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
