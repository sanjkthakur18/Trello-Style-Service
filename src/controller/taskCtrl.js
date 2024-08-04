const Task = require('../models/taskModel');

const createTask = async (req, res) => {
    const { title, description, status, priority, deadline } = req.body;
    const { id } = req.user;

    if (!title || !status) {
        return res.status(400).json({ error: { fldErr: 'Title and status are required' } });
    }

    try {
        const newTask = new Task({
            title,
            description,
            status,
            priority,
            deadline,
            user: id
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error from server', error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

const getTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        res.status(200).json(task)
    } catch (error) {
        console.error('Error from server:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

const getAllTask = async (req, res) => {
    try {
        const getTasks = await Task.find();
        res.status(200).json(getTasks);
    } catch (error) {
        console.error('Error from server:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const task = await Task.findOneAndUpdate({
            _id: id,
            user: req.user.id,
        }, updates, { new: true });
        if (!task) {
            return res.status(404).json({ error: { notFnd: 'Task not found' } });
        }
        res.status(201).json(task)
    } catch (error) {
        console.error('Error from server:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ error: { notFnd: 'Task not found' } });
        }
        res.status(201).json({ message: 'Task Deleted' });
    } catch (error) {
        console.error('Error from server:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: { fldErr: 'Status is required' } });
    }
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id,
            },
            { status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: { notFnd: 'Task not found' } });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error from server:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = { createTask, getAllTask, updateTask, deleteTask, getTask, updateTaskStatus };