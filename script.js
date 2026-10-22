const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const clearCompletedButton = document.getElementById(
    "clearCompletedButton"
);

const filterButtons = document.querySelectorAll(
    ".task-filters button"
);

let currentFilter = "all";

// 1. Filter tasks
function filterTasks() {
    const tasks = taskList.querySelectorAll(".task-item");

    tasks.forEach(function (task) {
        const checkbox = task.querySelector(
            'input[type="checkbox"]'
        );

        const isCompleted = checkbox.checked;

        const shouldShow =
            currentFilter === "all" ||
            (currentFilter === "active" && !isCompleted) ||
            (currentFilter === "completed" && isCompleted);

        task.style.display = shouldShow ? "" : "none";
    });
}

// 2. Update the remaining task counter
function updateCounter() {
    const tasks = taskList.querySelectorAll(".task-item");
    let remaining = 0;

    tasks.forEach(function (task) {
        const checkbox = task.querySelector(
            'input[type="checkbox"]'
        );

        if (!checkbox.checked) {
            remaining++;
        }
    });

    if (remaining === 1) {
        taskCounter.textContent = "1 task remaining";
    } else {
        taskCounter.textContent = remaining + " tasks remaining";
    }
}

// 3. Add completed styling
function updateTaskStyle(task) {
    const checkbox = task.querySelector(
        'input[type="checkbox"]'
    );

    task.classList.toggle("completed", checkbox.checked);
}

// 4. Connect every task's checkbox and Delete button
function setupTask(task) {
    const checkbox = task.querySelector(
        'input[type="checkbox"]'
    );

    const deleteButton = task.querySelector("button");

    // Set the correct completed style when the page loads
    updateTaskStyle(task);

    // Handle completing or uncompleting a task
    checkbox.addEventListener("change", function () {
        updateTaskStyle(task);
        updateCounter();
        filterTasks();
    });

    // Handle deleting a task
    deleteButton.addEventListener("click", function () {
        task.remove();
        updateCounter();
        filterTasks();
    });
}

// 5. Add a new task
function addTask() {
    const taskText = taskInput.value.trim();

    // Do not add an empty task
    if (taskText === "") {
        taskInput.focus();
        return;
    }

    // Create the list item
    const newTask = document.createElement("li");
    newTask.classList.add("task-item");

    // Create the checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", "Mark task as completed");

    // Create the task text
    const taskName = document.createElement("span");
    taskName.textContent = taskText;

    // Create the Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    // Put the elements inside the list item
    newTask.appendChild(checkbox);
    newTask.appendChild(taskName);
    newTask.appendChild(deleteButton);

    // Add the task to the page
    taskList.appendChild(newTask);

    // Connect the checkbox and Delete button
    setupTask(newTask);

    // Clear the input
    taskInput.value = "";
    taskInput.focus();

    // Refresh the counter and filters
    updateCounter();
    filterTasks();
}

// 6. Handle the Add button
addButton.addEventListener("click", addTask);

// 7. Allow Enter to add a task
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// 8. Handle All, Active, and Completed filters
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        // Highlight the selected filter
        filterButtons.forEach(function (filterButton) {
            filterButton.setAttribute(
                "aria-pressed",
                filterButton === button ? "true" : "false"
            );
        });

        filterTasks();
    });
});

// 9. Clear all completed tasks
clearCompletedButton.addEventListener("click", function () {
    const tasks = taskList.querySelectorAll(".task-item");

    tasks.forEach(function (task) {
        const checkbox = task.querySelector(
            'input[type="checkbox"]'
        );

        if (checkbox.checked) {
            task.remove();
        }
    });

    updateCounter();
    filterTasks();
});

// 10. Set up the sample tasks already in the HTML
const existingTasks = taskList.querySelectorAll(".task-item");

existingTasks.forEach(function (task) {
    setupTask(task);
});

// 11. Initialize the app when the page loads
updateCounter();
filterTasks();

// Set the default filter as selected
filterButtons.forEach(function (button) {
    button.setAttribute(
        "aria-pressed",
        button.dataset.filter === currentFilter ? "true" : "false"
    );
});
