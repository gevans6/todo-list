//variables for lists and logout button
var todoList = document.getElementById("todoList");
var doneList = document.getElementById("doneList");
var logoutButton = document.getElementById("logout");
var ClearAllButton = document.getElementById("clearAllButton");

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

        
        // Adding a child node to the todo list
        todo.on("child_added", function(data) {
            var id = data.key;
            var item = data.val();
            
            if(user.uid === item.uid){

            
            //create to-do list item
            var title = document.createElement("h3");
            title.id = (id + "title");
            title.innerText = item.title;

            var descriptionString = document.createElement("p");
            descriptionString.id = "descriptionString";
            descriptionString.innerText = "Description: ";

            var description = document.createElement("p");
            description.id = (id + "description");
            description.innerText = item.description;

            var dateString = document.createElement("p");
            dateString.id = "dateString";
            dateString.innerText = "Due Date: ";

            var date = document.createElement("p");
            date.id = (id + "date");
            date.innerText = item.date;

            var timeString = document.createElement("p");
            timeString.id = "timeString";
            timeString.innerText = "Time: ";

            var time = document.createElement("p");
            time.id = (id + "time");
            time.innerText = item.time;

            priorityString = document.createElement("p");
            priorityString.id = "priorityString";
            priorityString.innerHTML = "Priority Level: ";

            var priority = document.createElement("p");
            priority.id = (id + "priority");
            priority.innerText = item.priority;

            // Edit task button
            var editButton = document.createElement("button");
            editButton.id = "editModal";
            editButton.className = "btn btn-link";
            editButton.innerText = "Edit";
            editButton.type = "click";
            
            // Submit edit button
            var editSubmitButton = document.createElement("button");
            editSubmitButton.id = (id + "editSubmit");
            editSubmitButton.type = "click"
            editSubmitButton.className = "btn btn-primary";
            editSubmitButton.innerText = "Update Text";
            
            // Edit modal footer, local to keep contained within each item
            var editModalFooter = document.getElementById("edit-modal-footer");
            

            //editModalFooter.appendChild(editSubmitButton);

            var removeButton = document.createElement("button");
            removeButton.id = "remove-button";
            removeButton.className = "btn btn-danger";
            removeButton.innerText = "Delete";           

            var editTaskModal = document.createElement("modal");

             // Completed button
            var doneButton = document.createElement("button");
            doneButton.id = "done-button";
            doneButton.className = "btn btn-success";
            doneButton.innerText = "Mark as Complete";
            doneButton.type = "click";

            // move to firebase completed and delete from todo firebase
            doneButton.addEventListener("click", function(e) {
                var user = firebase.auth().currentUser;
                node = database.ref("channels/todo/" + id);

                done.push({
                    uid: user.uid,
                    displayName: user.displayName,
                    description: item.description,
                    date: item.date,
                    title: item.title,
                    time: item.time,
                    priority: item.priority
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
            //;
            todoLi.appendChild(descriptionString);
            todoLi.appendChild(description)
            todoLi.appendChild(dateString);
            todoLi.appendChild(date);
            todoLi.appendChild(timeString);
            todoLi.appendChild(time);
            todoLi.appendChild(priorityString);
            todoLi.appendChild(priority);
            todoLi.appendChild(editButton);
            todoLi.appendChild(doneButton);
            todoLi.appendChild(removeButton);
            

            // Toggle edit area with edit button
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

                // Append the submit button the corresponds to the specific task
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
            }         
        });

        

        // Adding a child node to the completed list
        done.on("child_added", function(data) {
            var id = data.key;
            var item = data.val();
            
            //create done list item
            if(user.uid === item.uid){
     
            var title = document.createElement("h4");
            title.id = (id + "title");
            title.innerText = item.title;

            var description = document.createElement("p");
            description.id = (id + "description");
            description.innerText = item.description;

            // create clear and add back to todo buttons

            var clearButton = document.createElement("button");
            clearButton.id = "clearButton";
            clearButton.type = "click";
            clearButton.className = "btn btn-primary";
            clearButton.innerText = "Clear";

            var addBack = document.createElement("button");
            addBack.id = "addBack";
            addBack.type = "click";
            addBack.className = "btn btn-warning";
            addBack.innerText = "Add Back To Todo";

            // create listeners for those buttons

            clearButton.addEventListener("click", function(e) {
                console.log("delete" + id);
                node = database.ref("channels/completed/" + id);
                node.remove(); 
            });

            addBack.addEventListener("click", function(e) {
                console.log("adding back");
                node = database.ref("channels/completed/" + id);

                todo.push({
                    uid: user.uid,
                    displayName: user.displayName,
                    description: item.description,
                    date: item.date,
                    title: item.title,
                    time: item.time,
                    priority: item.priority
                });

                node.remove();

            
            });

            var doneLi = document.createElement("li");

            doneLi.className = ("list-group-item");
            doneLi.id = id;
            doneLi.appendChild(title);
            doneLi.appendChild(description);
            doneLi.appendChild(clearButton);
            doneLi.appendChild(addBack);

            doneList.appendChild(doneLi);

            }
        });

        // Change the DOM when firebase is removed(done)
        done.on("child_removed", function(data) {
            var id = data.key;

            var removeNode = document.getElementById(id);
            removeNode.parentNode.removeChild(removeNode);
        })

        // Change the DOM when firebase is changed(todo)
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

        // Change the DOM when firebase is removed(todo)
        todo.on("child_removed", function(data) {
            var id = data.key;

            var removeNode = document.getElementById(id);
            removeNode.parentNode.removeChild(removeNode);
        });

    } else {
        window.location.href = "index.html";
    }

})

// Add task button
addTaskButton.addEventListener("click", function(e) {
    console.log("submit button hit");
    var database = firebase.database();
    var todo = database.ref("channels/todo");
    var user = firebase.auth().currentUser;

    todo.push({ // Push data to firebase
        uid: user.uid,
        displayName: user.displayName,
        description: taskDescriptionInput.value,
        date: taskDateInput.value,
        title: taskTitleInput.value,
        time: taskTimeInput.value,
        priority: taskPriorityInput.value
    })
    .then(function() { // Reset the Modal
        document.getElementById("title-input").value = "";
        document.getElementById("description-input").value = "";
        document.getElementById("date-input").value = "";
        document.getElementById("time-input").value = "";
        document.getElementById("priority").value = "";
         $('#addTaskModal').modal('hide');
    })
    .catch(function(error) { // Error
        textError.innerText = "Error creating your task";
        textError.classList.add("active");
    });
});

clearAllButton.addEventListener("click", function(e) {
    var database = firebase.database();
    var done = database.ref("channels/completed");

    done.remove();
})
