import TaskPriorities from '../collections/TaskPriorities';
import TaskStatuses from '../collections/TaskStatuses';

if (TaskStatuses && TaskStatuses.find().count() === 0) {
    var statuses = [
        { description: 'Waiting' },
        { description: 'Closed' },
        { description: 'Archived' },
        { description: 'Open' },
        { description: 'Time Entry' }
    ];
    statuses.map(function(status, i) {
        TaskStatuses.insert(status);
    });
}

if (TaskPriorities && TaskPriorities.find().count() === 0) {
    var priorities = [
        { description: 'Urgent' },
        { description: 'Medium' },
        { description: 'Low' }
    ];
    priorities.map(function(priority, i) {
        TaskPriorities.insert(priority);
    });
}
