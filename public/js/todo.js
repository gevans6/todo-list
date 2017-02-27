//variables for lists and logout button
var todoList = document.getElementById("todoList");
var doneList = document.getElementById("doneList");
var logoutButton = document.getElementById("logout");

//variable declaration for initial task creation
var addTaskButton = document.getElementById("addTask");
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
var editTaskSubmitButton = document.getElementById("editSubmit");

//tenetive error
var textError = document.getElementById("post-error");

logoutButton.addEventListener("click", function (e) {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(function(user) {

    if(user) {
        var database = firebase.database();
        var todo = database.ref("channels/todo");
        var done = database.ref("channels/completed")

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
            
            //reassign the id of the submit button from the modal to be specific to each node


            var editSubmitButton = document.createElement("button");
            editSubmitButton.id = (id + "editSubmit");
            editSubmitButton.type = "click"
            editSubmitButton.className = "btn btn-primary";
            editSubmitButton.innerText = "Update Text";
            //id and functionality
 
            var editModalFooter = document.getElementById("edit-modal-footer");
            

            //editModalFooter.appendChild(editSubmitButton);

            var removeButton = document.createElement("button");
            removeButton.id = "remove-button";
            removeButton.className = "btn btn-link";
            removeButton.innerText = "Delete";           

            var editTaskModal = document.createElement("modal");

             // Completed button
            var doneButton = document.createElement("button");
            doneButton.id = "done-button";
            doneButton.className = "btn btn-primary";
            doneButton.innerText = "Mark as Complete";
            doneButton.type = "click";

            // move to firebase completed and delete from todo firebase
            doneButton.addEventListener("click", function(e) {
                var user = firebase.auth().currentUser;
                node = database.ref("channels/todo/" + id);

                done.push({
                    uid: user.uid,
                    displayName: user.displayName,
                    description: document.getElementById(id + "description").innerHTML,
                    date: document.getElementById(id + "date").innerHTML,
                    title: document.getElementById(id + "title").innerHTML,
                    time: document.getElementById(id + "time").innerHTML,
                    priority: document.getElementById(id + "priority")
                })
                .then(function() {
                    node.remove();
                })
                .catch(function(error) {
                    textError.innerText = "Error completing your task";
                    textError.classList.add("active");
                })
            });
                
                var todoLi = document.createElement("li");

                // Append to the to-do list item
                todoLi.id =  id;
                todoLi.className = "list-group-item";
                todoLi.appendChild(title);
                todoLi.appendChild(description);
                todoLi.appendChild(date);
                todoLi.appendChild(time);
                todoLi.appendChild(priority);
                todoLi.appendChild(editButton);
                todoLi.appendChild(removeButton);
                todoLi.appendChild(doneButton);

            

            //Toggle edit area with edit button
            editButton.addEventListener("click", function(e) {
                $('#editModal').modal('show');
                editTaskTitleInput.value = document.getElementById(id + "title").innerHTML;
                editTaskDescriptionInput.value = document.getElementById(id + "description").innerHTML;
                editTaskDateInput.value = document.getElementById(id + "date").innerHTML;
                editTaskTimeInput.value = document.getElementById(id + "time").innerHTML;
                editTaskPriorityInput.value = document.getElementById(id + "priority").innerHTML;
                


                var editSubmitButtonId = editSubmitButton.id.substring(0, editSubmitButton.id.length - 10);

                console.log(id) 
                console.log(editSubmitButtonId);

                if(id === editSubmitButtonId) {
                    while(editModalFooter.hasChildNodes()) {
                        editModalFooter.removeChild(editModalFooter.lastChild)
                    }
                    editModalFooter.appendChild(editSubmitButton);
                }
                
            });


            //change the node within Firebase
            editSubmitButton.addEventListener("click", function(e) {
                node = database.ref("channels/todo/" + id);
                node.set({
                    uid: user.uid,
                    displayName: user.displayName,
                    description: editTaskDescriptionInput.value,
                    date: editTaskDateInput.value,
                    title: editTaskTitleInput.value,
                    time: editTaskTimeInput.value,
                    priority: editTaskPriorityInput.value
                });

                console.log("changes submitted to firebase");

                $('#editModal').modal('hide');             
            });

            // Remove button and confirmation message. Removes from firebase
            removeButton.addEventListener("click", function(e) {
                if (confirm("Are you sure you want to delete this task?") == true){
                    console.log("delete" + id);
                    node = database.ref("channels/todo/" + id);
                    node.remove();
                }   
            });

            // Append to the HTML
            todoList.appendChild(todoLi);  

            console.log(id + "child added");          
        });

        done.on("child_added", function(data) {
            var id = data.key;
            var item = data.val();
            
            //create done list item

            var title = document.createElement("h4");
            title.id = (id + "title");
            title.innerText = item.title;

            var description = document.createElement("p");
            description.id = (id + "description");
            description.innerText = item.description;

            var doneLi = document.createElement("li");

            doneLi.className = ("list-group-item");
            doneLi.appendChild(title);
            doneLi.appendChild(description);

            doneList.appendChild(doneLi);
        });

        // Change the DOM when firebase is changed
        todo.on("child_changed", function(data) {

            var id = data.key;
            var item = data.val();
            
            document.getElementById(id + "title").innerHTML = item.title;
            document.getElementById(id + "description").innerHTML = item.description;
            document.getElementById(id + "date").innerHTML = item.date;
            document.getElementById(id + "time").innerHTML = item.time;
            document.getElementById(id + "priority").innerHTML = item.priority;

            console.log(id);
            console.log("DOM changes when todo firebase is changed");
        });

        // Change the DOM when firebase is removed
        todo.on("child_removed", function(data) {
            var id = data.key;

            var removeNode = document.getElementById(id);
            removeNode.parentNode.removeChild(removeNode);
        });

    } else {
        window.location.href = "index.html";
    }

})

addTaskButton.addEventListener("click", function(e) {
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
        document.getElementById("title-input").value = "";
        document.getElementById("description-input").value = "";
        document.getElementById("date-input").value = "";
        document.getElementById("time-input").value = "";
        document.getElementById("priority").value = "";
         $('#addTaskModal').modal('hide');
    })
    .catch(function(error) {
        textError.innerText = "Error creating your task";
        textError.classList.add("active");
    });

    //$('#myModal').modal('show');
});

