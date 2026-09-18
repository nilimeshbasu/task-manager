# 📌 TaskManager Pro — React Routing & State Management

A single-page Task Management application built with **React**, **React Router v6**, and the **Context API**. This project demonstrates advanced routing concepts including nested routes, dynamic URL parameters, and protected routes.

🚀 **Live Demo:** [https://taskmanager-wheat-nine.vercel.app/](https://taskmanager-wheat-nine.vercel.app/)  
📁 **GitHub Repository:** [https://github.com/nilimeshbasu/task-manager](https://github.com/nilimeshbasu/task-manager)

---

## 🌟 Key Features

* **Advanced Navigation:** Seamless page transitions using `react-router-dom` with active link styling.
* **Dynamic Routing:** View individual task details via dynamic URL parameters (`/tasks/:id`).
* **Protected Routes:** The "Add Task" page is protected by a simulated authentication layer (requires login to access).
* **Nested Routing:** Task lists and task details share a common parent layout.
* **Global State Management:** Tasks and Authentication states are managed globally using the React Context API.
* **Full CRUD Functionality:** 
  * **Create:** Add new tasks with automatic timestamp generation.
  * **Read:** View tasks on a central dashboard with real-time statistics.
  * **Update:** Change task status (Raised, Pending, Closed).
  * **Delete:** Remove tasks entirely.
* **Smart Filtering:** Filter tasks instantly by Priority (High/Medium/Low) and Category (Academic/Personal).

---

## 🗺️ Application Routes

| Route | Type | Description |
| :--- | :--- | :--- |
| `/` | Public | Dashboard displaying summary statistics. |
| `/tasks` | Public | Displays all active/pending tasks with filter controls. |
| `/tasks/:id` | Dynamic | Shows detailed information for a specific task. |
| `/add-task` | **Protected** | Form to create a new task (Requires Authentication). |
| `/completed` | Public | Displays a history of all closed/completed tasks. |
| `/login` | Public | Simulated authentication page to unlock protected routes. |

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Hooks: `useState`, `useContext`)
* **Routing:** React Router v6 (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `useParams`, `useNavigate`)
* **Styling:** CSS3 (Flexbox, CSS Grid)
* **Deployment:** Vercel

---

## 🚀 Local Setup & Installation

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/nilimeshbasu/task-manager.git](https://github.com/nilimeshbasu/task-manager.git)
   cd task-manager