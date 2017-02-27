//variables for list and logout button
var todoList = document.getElementById("todoList");
var logoutButton = document.getElementById("logout");

//variable declaration for initial task creation
var addTaskButton = document.getElementById("myModal");
var taskForm = document.getElementById("task-form");
var taskDescriptionInput = document.getElementById("description-input");
var taskDateInput = document.getElementById("date-input");
var taskTimeInput = document.getElementById("time-input");
var taskTitleInput = document.getElementById("title-input");
var taskPriorityInput = document.getElementById("priority");

//variable declaration for editting task
var editTaskForm = document.getElementById("edit-task-form");
var editTaskDescriptionInput = document.getElementById("edit-description-input");
var editTaskDateInput = document.getElementById("edit-date-input");
var editTaskTitleInput = document.getElementById("edit-title-input");
var editTaskTimeInput = document.getElementById("edit-time-input");
var editTaskPriorityInput = document.getElementById("edit-priority");

//tenetive error
var textError = document.getElementById("post-error");

logoutButton.addEventListener("click", function (e) {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(function(user) {

    if(user) {
        var database = firebase.database();
        var todo = database.ref("channels/todo");

        todo.on("child_added", function(data) {
            var id = data.key;
            var item = data.val();
            

            //create to-do list item

            var title = document.createElement("h4");
            title.id = (id + "title");
            title.innerText = item.title;

            var description = document.createElement("p");
            description.id = (id + "description");
            description.innerText = item.description;

            var date = document.createElement("p");
            date.id = (id + "date");
            date.innerText = item.date;

            var time = document.createElement("p");
            time.id = (id + "time");
            time.innerText = item.time;

            var priority = document.createElement("p");
            priority.id = (id + "priority");
            priority.innerText = item.priority;

            var editButton = document.createElement("button");
            editButton.id = "editModal";
            editButton.className = "btn btn-link";
            editButton.innerText = "Edit";
            editButton.type = "click";
            ;

            var removeButton = document.createElement("button");
            removeButton.id = "remove-button";
            removeButton.className = "btn btn-link";
            removeButton.innerText = "Delete";           

            var editTaskModal = document.createElement("modal");


            //Toggle edit area with edit button
            editButton.addEventListener("click", function(e) {
                $('#editModal').modal('show');
                editTaskTitleInput.value = item.title;
                console.log(item.description);
                editTaskDescriptionInput.value = item.description;
                editTaskDateInput.value = item.date;
                editTaskTimeInput.value = item.time;
                editTaskPriorityInput.value = item.priority;
            });

            editTaskForm.addEventListener("submit", function(e) {
                node = database.red("channels/todo/" + id);

                    var editTitleRaw = editTaskTitleInput.value;
                    var editDescriptionRaw = editTaskDescriptionInput.value;
                    var editDateRaw = editTaskDateInput.value;
                    var editTimeRaw = editTaskTimeInput.value;
                    var editPriorityRaw =editTaskPriorityInput.value;

                node.set({
                    uid: user.uid,
                    displayName: user.displayName,
                    description: editTaskDescriptionInput.value,
                    date: editDateRaw,
                    title: editTitleRaw,
                    time: editTimeRaw,
                    priority: editPriorityRaw

                })
            })

            // Remove button function and confirmation message
            removeButton.addEventListener("click", function(e) {
                if (confirm("Are you sure you want to delete this task?") == true){
                    node = database.ref("channels/general/" + id);
                    node.remove();
                }   
            });

            var todoLi = document.createElement("li");

            todoLi.className = "list-group-item";
            todoLi.appendChild(title);
            todoLi.appendChild(description);
            todoLi.appendChild(date);
            todoLi.appendChild(time);
            todoLi.appendChild(priority);
            todoLi.appendChild(editButton);
            todoLi.appendChild(removeButton);
            

            todoList.appendChild(todoLi);

            
        });

        todo.on("child_changed", function(data) {
            var id = data.key;
            var item = data.val();
            
            document.getElementById(id + "description")
        });
    } else {
        window.location.href = "index.html";
    }

})

taskForm.addEventListener("submit", function(e) {
    console.log("submit button hit");
    var database = firebase.database();
    var todo = database.ref("channels/todo");
    var user = firebase.auth().currentUser;

    var titleRaw = taskTitleInput.value;
    var descriptionRaw = taskDescriptionInput.value;
    var dateRaw = taskDateInput.value;
    var timeRaw = taskTimeInput.value;
    var priorityRaw = taskPriorityInput.value;
    

    todo.push({
        uid: user.uid,
        displayName: user.displayName,
        description: descriptionRaw,
        date: dateRaw,
        title: titleRaw,
        time: timeRaw,
        priority: priorityRaw
    })
    .then(function() {
        document.getElementById("description-input").value = "";
    })
    .catch(function(error) {
        textError.innerText = "Error creating your task";
        textError.classList.add("active");
    })
});

