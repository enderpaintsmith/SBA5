// =========================
// Application State
// =========================

// Load existing posts from localStorage.
// If there are no saved posts, start with an empty array.
let posts = JSON.parse(localStorage.getItem("blogPosts")) || [];

// Keeps track of which post is currently being edited.
// null means we are creating a new post.
let editingPostId = null;


// =========================
// DOM Elements
// =========================
const searchInput = document.getElementById("search-input");
const postForm = document.getElementById("post-form");
const postTitle = document.getElementById("post-title");
const postContent = document.getElementById("post-content");

const titleError = document.getElementById("title-error");
const contentError = document.getElementById("content-error");

const postsContainer = document.getElementById("posts-container");
const emptyMessage = document.getElementById("empty-message");

const formHeading = document.getElementById("form-heading");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");


// =========================
// Save Posts
// =========================

function savePosts() {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
}


// =========================
// Generate Unique ID
// =========================

function generateId() {
    return Date.now().toString();
}


// =========================
// Render Posts
// =========================

function renderPosts() {
    // Clear the current post display.
    postsContainer.innerHTML = "";

    // Show the empty message if there are no posts.
    if (posts.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    // Create the HTML for each post.
   const searchTerm = searchInput.value.toLowerCase().trim();

const filteredPosts = posts.filter(function (post) {
    return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
    );
});

filteredPosts.forEach(function (post) {
        const postElement = document.createElement("article");
        postElement.classList.add("post-card");
        
        const titleElement = document.createElement("h3");
        titleElement.textContent = post.title;

        const contentElement = document.createElement("p");
        contentElement.classList.add("post-content");
        contentElement.textContent = post.content;

        const dateElement = document.createElement("p");
        dateElement.classList.add("post-date");

        const formattedDate = new Date(post.timestamp).toLocaleString();

        dateElement.textContent = `Posted: ${formattedDate}`;

        const actionsContainer = document.createElement("div");
        actionsContainer.classList.add("post-actions");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");

        // Store the post ID on the button.
        editButton.dataset.id = post.id;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        // Store the post ID on the button.
        deleteButton.dataset.id = post.id;

        actionsContainer.appendChild(editButton);
        actionsContainer.appendChild(deleteButton);

        postElement.appendChild(titleElement);
        postElement.appendChild(contentElement);
        postElement.appendChild(dateElement);
        postElement.appendChild(actionsContainer);

        postsContainer.appendChild(postElement);
    });
}


// =========================
// Form Validation
// =========================

function validateForm() {
    let isValid = true;

    // Clear previous error messages.
    titleError.textContent = "";
    contentError.textContent = "";

    const title = postTitle.value.trim();
    const content = postContent.value.trim();

    // Validate title.
if (title === "") {
    titleError.textContent = "Every story needs a name. Give yours a title.";
    isValid = false;
}

if (content === "") {
    contentError.textContent = "Start with a word, a thought, anything at all!";
    isValid = false;
}

    return isValid;
}


// =========================
// Clear Form
// =========================


function clearForm() {
    postTitle.value = "";
    updateWordCount();
    postContent.value = "";

    titleError.textContent = "";
    contentError.textContent = "";

    editingPostId = null;

    formHeading.innerHTML = 'A new entry<span class="accent">.</span>';
    submitButton.innerHTML = 'Put it into words <span>↗</span>';
    cancelButton.classList.add("hidden");

    // Reset the word counter.
    const wordCount = document.getElementById("word-count");

    if (wordCount) {
        wordCount.textContent = "0 words";
    }
}



// =========================
// Create / Update Post
// =========================

postForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Stop if validation fails.
    if (!validateForm()) {
        return;
    }

    const title = postTitle.value.trim();
    const content = postContent.value.trim();

    // =========================
    // Update Existing Post
    // =========================

    if (editingPostId !== null) {
        const postToUpdate = posts.find(function (post) {
            return post.id === editingPostId;
        });

        if (postToUpdate) {
            postToUpdate.title = title;
            postToUpdate.content = content;
        }

        savePosts();
        renderPosts();
        clearForm();

        return;
    }

    // =========================
    // Create New Post
    // =========================

    const newPost = {
        id: generateId(),
        title: title,
        content: content,
        timestamp: new Date().toISOString()
    };

    posts.push(newPost);

    // Save the updated posts array.
    savePosts();

    // Display the updated list.
    renderPosts();

    // Clear the form.
    clearForm();
});


// =========================
// Edit and Delete Buttons
// =========================

// Event delegation allows us to handle clicks on
// dynamically-created Edit and Delete buttons.
postsContainer.addEventListener("click", function (event) {

    // =========================
    // Edit Post
    // =========================

    if (event.target.classList.contains("edit-button")) {
        const postId = event.target.dataset.id;

        const postToEdit = posts.find(function (post) {
            return post.id === postId;
        });

        if (!postToEdit) {
            return; 
        }

        // Populate the form with the existing post.
        postTitle.value = postToEdit.title;
        postContent.value = postToEdit.content;
        updateWordCount();

        // Track which post is being edited.
        editingPostId = postId;

        // Change the form appearance.
        formHeading.textContent = "Edit Entry";
        submitButton.textContent = "Save Changes";
        cancelButton.classList.remove("hidden");

        // Clear any old errors.
        titleError.textContent = "";
        contentError.textContent = "";

        // Scroll to the form.
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // =========================
    // Delete Post
    // =========================

    if (event.target.classList.contains("delete-button")) {
        const postId = event.target.dataset.id;

        // Find the post before deleting it.
        const postToDelete = posts.find(function (post) {
            return post.id === postId;
        });

        if (!postToDelete) {
            return;
        }

        // Ask the user to confirm the deletion.
        const confirmed = confirm(
            `Are you sure you want to delete "${postToDelete.title}"?`
        );

        if (!confirmed) {
            return;
        }

        // Remove the post from the array.
        posts = posts.filter(function (post) {
            return post.id !== postId;
        });

        // Save the updated array.
        savePosts();

        // Update the page.
        renderPosts();

        // If the deleted post was being edited,
        // return the form to create mode.
        if (editingPostId === postId) {
            clearForm();
        }
    }
});


// =========================
// Cancel Editing
// =========================

cancelButton.addEventListener("click", function () {
    clearForm();
});


// =========================
// Clear Validation Errors
// =========================

postTitle.addEventListener("input", function () {
    if (postTitle.value.trim() !== "") {
        titleError.textContent = "";
    }
});

postContent.addEventListener("input", function () {
    if (postContent.value.trim() !== "") {
        contentError.textContent = "";
    }
});

// =========================
// Word Counter
// =========================

const wordCount = document.getElementById("word-count");

function updateWordCount() {
    const content = postContent.value.trim();

    if (content === "") {
        wordCount.textContent = "0 words";
    } else {
        const words = content.split(/\s+/);
        wordCount.textContent = words.length + " words";
    }
}

postContent.addEventListener("input", updateWordCount);

// =========================
// Initial Page Load
// =========================
updateWordCount();
// Render any posts that were saved in localStorage.
searchInput.addEventListener("input", function () {
    renderPosts();
});
renderPosts();