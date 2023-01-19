// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {

    uint256 public tasksCounter=0;

    constructor() {
        createTask("my first task", "my first description");
    }

    struct Task {
        uint id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );
    
    event TaskToggledDone(uint256 id, bool done);

    mapping (uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description) public {
        tasksCounter++;
        tasks[tasksCounter]=Task(tasksCounter, _title, _description, false, block.timestamp);
            emit TaskCreated(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
    }

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggledDone(_id, _task.done);
    }
}