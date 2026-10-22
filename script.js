const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompletedButton = document.getElementById(
    "clearCompletedButton"
);

const filterButtons = document.querySelectorAll(
    ".task-filters button"
);

let currentFilter = "all";

function updateCounter(){
    const tasks = taskList.querySelectorAll(".task-item");
    let remaining = 0;

    tasks.forEach(function (task){
        const checkbox = task.querySelector('input[type="checkbox"]');

        if (!checkbox.checked){
            remaining++;
        }
    });

    taskCounter.textContent =
        remaining + (remaining === 1 ? " task remaining" : " tasks remaining");
}

function filterTasks(){
    const tasks = taskList.querySelectorAll(".task-item");

    tasks.forEach(function (task) {
        const checkbox = task.querySelector('input[type="checkbox"]');
        const isCompleted = checkbox.checked;

        const shouldShow =
            currentFilter === "all" ||
            (currentFilter === "active" && !isCompleted) ||
            (currentFilter === "completed" && isCompleted);

        task.style.display = shouldShow ? "" : "none";
    });

    const hasVisibleTasks = Array.from(tasks).some(function (task) {
        return task.style.display !== "none";
    });

    emptyMessage.hidden = hasVisibleTasks;
}

function addTask(){
    const taskText = taskInput.value.trim();

    if (taskText===""){
        taskInput.focus();
        return;
    }

    const newTask = document.createElement("li");
    newTask.classList.add("task-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", "Mark task as completed");

    const taskName = document.createElement("span");
    taskName.textContent = taskText;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    checkbox.addEventListener("change", function () {
        newTask.classList.toggle("completed", checkbox.checked);
        updateCounter();
        filterTasks();
    });

    deleteButton.addEventListener("click", function () {
        newTask.remove();
        updateCounter();
        filterTasks();
    });

    newTask.appendChild(checkbox);
    newTask.appendChild(taskName);
    newTask.appendChild(deleteButton);

    taskList.appendChild(newTask);

    taskInput.value = "";

    updateCounter();
    filterTasks();
    taskInput.focus();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event){
    if (event.key === "Enter"){
        addTask();
    }
});

filterButtons.forEach(function (button){
    button.addEventListener("click", function(){
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (filterButton){
            filterButton.setAttribute(
                "aria-pressed",
                filterButton === button ? "true" : "false"
            );
        });

        filterTasks();
    });
});

clearCompletedButton.addEventListener("click", function (){
    const tasks = taskList.querySelectorAll(".task-item");

    tasks.forEach(function (task){
        const checkbox = task.querySelector('input[type="checkbox"]');

        if (checkbox.checked){
            task.remove();
        }
    });

    updateCounter();
    filterTasks();
});

updateCounter();
filterTasks();
