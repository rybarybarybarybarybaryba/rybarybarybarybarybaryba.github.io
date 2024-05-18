//this is probably a bad implementation. - D

const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let tasks;

let storage = localStorage.getItem("tasks");

if(storage != null){
    tasks = JSON.parse(storage);
}
else{
    tasks = [];
}

//console.log(tasks);

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function getTodo(){
    let task = "";

    while(task == ""){
        task = prompt("Please input your task.");

        if(task == ""){
            alert("You cannot make your task empty!");
        }
    }
    return task;
}

function createTodo(name,checked,id){
    let base_list_item = document.createElement("li");
    base_list_item.className = "list-group-item";

    let input_tag = document.createElement("input");
    input_tag.setAttribute("type","checkbox");
    input_tag.className = "form-check-input me-2";
    input_tag.id = id;
    if(checked) input_tag.checked = true;

    base_list_item.appendChild(input_tag);

    let label_tag = document.createElement("label");
    label_tag.setAttribute("for",id);

    let span_tag = document.createElement("span");
    if(checked) span_tag.className = "text-success text-decoration-line-through";
    span_tag.textContent = name;

    label_tag.appendChild(span_tag);
    
    base_list_item.appendChild(label_tag);

    let button_tag = document.createElement("button");
    button_tag.className = "btn btn-danger btn-sm float-end";
    button_tag.textContent = "Delete";

    base_list_item.appendChild(button_tag);
    
    return base_list_item;
}

function newTodo() {
    let todo = getTodo();

    if(todo != null){
        tasks.push({"name": todo, "checked": false});

        render();
    }
}

function renderTodo(tasks_list){ //function to actually render the HTML
    list.innerHTML = ""; //reset the list to avoid id conflicts
    //console.log(tasks_list);

    for(let i = 0; i < tasks_list.length; i++){
        let child = createTodo(tasks_list[i]["name"],tasks_list[i]["checked"],i);
        list.appendChild(child);
    }
}

function updateCounters(){
    itemCountSpan.textContent = tasks.length;
    
    let counter = 0;
    for(let i = 0; i < tasks.length; i++){
        if(tasks[i]["checked"] == true) counter ++;
    }
    uncheckedCountSpan.textContent = tasks.length - counter;

    saveTasks();
}

function render(){ //called every time a change is made to the list
    //console.log(tasks);
    renderTodo(tasks);
    updateCounters();
}

function checkListItem(node){ // this is SO bad, but i genuinely saw no better way of dealing with this
    if(node.checked) node.nextSibling.children[0].className = "text-success text-decoration-line-through";
    else node.nextSibling.children[0].className = "";

    tasks[node.id]["checked"] = node.checked;
}

function deleteListItem(task_id){
    tasks.splice(task_id,1);
}


function listEventListener(e){
    //check task
    if(e.type == "change"){
        checkListItem(e.target);
        updateCounters();
    }
    else if(e.target.tagName == "BUTTON"){ //button click
        //console.log("bruh");
        let popup = confirm("Are you sure you want to delete this task?");
        if(popup){
            let task_id = e.target.previousSibling.previousSibling.id; // Bruh
            deleteListItem(task_id);
            render();
        }
    }
} 

list.addEventListener("change",listEventListener);
list.addEventListener("click",listEventListener);

render();