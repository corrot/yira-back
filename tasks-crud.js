const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require('fs');
const tasks = JSON.parse(fs.readFileSync('tasks.json'));

const tasksDb = 'tasks.json';

// const taskModel = {
//     id, ttile, dueDate, createDate, isResolved, description
// }

const updateDb = (db, mutateFn, req, res) => {
    fs.readFile(db, 'utf8', function readFileCallback(err, data){
        if (err){
            throw new Error (err);
        } else {
        obj = JSON.parse(data);
        const updatedDb = () => mutateFn(obj, req);
        json = JSON.stringify(updatedDb());
        console.log('updatedDb', updatedDb(), 'json', json);
        
        if(json) fs.writeFile(db, json, 'utf8', () => { 
          res.status(200).end();
        });
      }
    })
}

const getTasks = () => {
    return tasks;
}

const createFn = (data, task) => [...data, task];
const updateFn = (data, task) => {
    const filtered = data.filter(o => o.id !== task.id);
    if (filtered.length === data.length) return data;
    return [...filtered, task]
};
const deleteFn = (data, task) => data.filter(o => o.id !== task.id);


const createTask = (task, res) => {
    console.log('create task', task.id);
    updateDb(tasksDb, createFn, task, res);
}

const updateTask = (task, res) => {
    console.log('update task', task.id);
    updateDb(tasksDb, updateFn, task, res);
}

const deleteTask = (task, res) => {
    console.log('delete task', task.id);
    updateDb(tasksDb, deleteFn, task, res);
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
}