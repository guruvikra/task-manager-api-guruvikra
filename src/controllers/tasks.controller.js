import { readData, writeData } from "../utils/helper.js";

export const getAllTasks = async (req, res) => {
  try {
    let tasks = await readData();
    if (req.query.completed) {
        const isCompleted = req.query.completed === "true";
        tasks = tasks.filter((task) => task.completed === isCompleted);
    }
    if (req.query.sort === 'createdAt') {
        tasks.sort((a, b) => {
            if (!a.createdAt && !b.createdAt) return 0;
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return a.createdAt - b.createdAt;
        })
    }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, description, completed, priority } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const tasks = await readData();
    const validPriority = ['low', 'medium', 'high']
    const isValidPriority = validPriority.includes(priority) ? priority : 'low';
    // Calculate new ID
    const nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

    const newTask = {
      id: nextId,
      title,
      description,
      completed: completed || false,
      priority: isValidPriority,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await writeData(tasks);

    return res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to createTask" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const tasks = await readData();
    const id = parseInt(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to getTaskById" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const tasks = await readData();
    const id = parseInt(req.params.id);
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Basic Validation
    if (req.body.completed !== undefined) {
      if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({ message: "Invalid data" });
      }
    }
    if (req.body.priority) {
          const validPriorities = ['low', 'medium', 'high'];
          if (!validPriorities.includes(req.body.priority)) {
            return res.status(400).json({ message: "Invalid priority. Must be low, medium, or high." });
          }
        }

    const updatedTask = {
      ...tasks[index],
      ...req.body,
      id, // Ensure ID remains the same
    };

    tasks[index] = updatedTask;
    await writeData(tasks);

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to updateTask" });
  }
};

export const deleteTaskById = async (req, res) => {
  try {
    const tasks = await readData();
    const id = parseInt(req.params.id);
    const taskExists = tasks.some((t) => t.id === id);

    if (!taskExists) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newTasks = tasks.filter((t) => t.id !== id);
    await writeData(newTasks);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to deleteTaskById" });
  }
};

export const getTaskByPriority = async(req, res) => {
    try {
        const tasks = await readData();
        const level = req.params.level;

        const filteredTasks = tasks.filter((task) => task.priority === level);
        res.status(200).json(filteredTasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to getTaskByPriority" });
    }
}
