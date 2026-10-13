# Interactive Personal Blog Platform

## Project Overview

This project is a personal blog where users can create, view, edit, and delete posts. I built it using HTML, CSS, and JavaScript to practice working with the DOM, handling events, validating forms, and saving data with localStorage.

## Features

Users can create blog posts by entering a title and content into the form. Each post appears on the page with its title, content, timestamp, and Edit and Delete buttons. If there are no posts, the page displays the message “No posts yet. Create your first post!”

To edit a post, users click its Edit button. The post's existing title and content are loaded into the form, where they can make changes and submit the updated post. The form switches back to create mode when the edit is canceled. To delete a post, users click its Delete button and confirm the action before the post is removed. Changes are saved to localStorage, so posts remain available after refreshing the page.

The form also checks that the title and content are not empty and displays error messages when required information is missing. The layout is designed to work on different screen sizes.

## Technologies Used

This project uses HTML for the page structure, CSS for styling and layout, and JavaScript for the functionality. It also uses DOM manipulation, event handling, form validation, and localStorage.

## Project Structure

```text
SBA5/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## How to Run the Project

To run the project, open the project folder and open `index.html` in a web browser. You can then create posts, edit existing posts, cancel an edit, and delete posts using the form and buttons on the page. No additional installation is needed.

## What I Learned

This project gave me more practice using JavaScript to make a webpage interactive. I worked with the DOM, used event listeners to handle user actions, and added form validation to make sure posts have a title and content. I also learned how to manage the editing state of a form and use localStorage to save posts so they remain after refreshing the page.

## Known Limitations

Posts are saved only in the browser where they were created. The project does not use a database or have user accounts, so posts cannot be synced between different devices. Clearing the browser's localStorage can also remove saved posts.
