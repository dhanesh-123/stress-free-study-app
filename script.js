// Ask for Notification Permission when the page loads
window.onload = () => {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  renderTasks();
};

function validatePhoneNumber(mobile) {
  const pattern = /^\+\d{10,15}$/;
  return pattern.test(mobile);
}

function notify(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/3565/3565418.png", // Optional icon
    });
  }
}

function addTask() {
  const task = document.getElementById("task").value.trim();
  const date = document.getElementById("date").value;
  const mobile = document.getElementById("mobile").value.trim();

  if (!task || !date || !mobile) {
    Swal.fire("Missing Fields", "Please fill all the fields.", "warning");
    return;
  }

  if (!validatePhoneNumber(mobile)) {
    Swal.fire("Invalid Number", "Enter a valid phone number with country code.", "error");
    return;
  }

  const newTask = { task, date, mobile };
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(newTask);
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();

  notify("Task Added ✅", `${task} scheduled for ${date}`);

  document.getElementById("task").value = "";
  document.getElementById("date").value = "";
  document.getElementById("mobile").value = "";
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  document.getElementById("taskCount").textContent = tasks.length;

  const today = new Date().toISOString().split('T')[0];

  tasks.forEach((taskObj, index) => {
    const listItem = document.createElement("li");
    const isOverdue = taskObj.date < today;
    listItem.className = isOverdue ? "overdue" : "";

    listItem.innerHTML = `
      ${taskObj.task} - Due: ${taskObj.date} - 📞 ${taskObj.mobile}
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    if (taskObj.date === today) {
      Swal.fire("Reminder", `'${taskObj.task}' is due today!`, "info");
      notify("📅 Task Due Today!", `${taskObj.task} is scheduled for today`);
    }

    taskList.appendChild(listItem);
  });
}

function deleteTask(index) {
  Swal.fire({
    title: 'Are you sure?',
    text: "This task will be deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  });
}

function clearAllTasks() {
  Swal.fire({
    title: 'Clear All Tasks?',
    text: "This will remove all tasks permanently!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Clear All',
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("tasks");
      renderTasks();
    }
  });
}
