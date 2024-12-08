/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response, NextFunction } from 'express';
import { expect } from 'chai';
import sinon,  { SinonStub } from 'sinon';

// Import the function and dependencies
import { DynamoDBTaskRepository } from '../../src/infrastructure/database/DynamoDBTaskRepository.js';
import { TaskController } from '../../src/controllers/TaskController.js';
import { TaskService } from '../../src/services/TaskService.js';
import { FileUploadService } from '../../src/services/FileUploadService';

const taskRepository = new DynamoDBTaskRepository();
const taskService = new TaskService(taskRepository);
const fileUploadService = new FileUploadService();
const taskController = new TaskController(taskService, fileUploadService);

describe('getTasks Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonStub;
  let getTaskServiceStub: SinonStub;
  let taskRepositoryStub: SinonStub;

  beforeEach(() => {
    req = { body: { title: 'Test Task', description: 'Test description' } };  // Initialize request
    
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    next = sinon.stub();
    // Stub the DynamoDBTaskRepository to prevent actual calls to DynamoDB
    taskRepositoryStub = sinon.stub(DynamoDBTaskRepository.prototype, 'findAll');
    // Stub the createTaskService
    getTaskServiceStub = sinon.stub(taskService.getTasksService.prototype, 'findAll'); 
  });

  it('should return array of tasks', async () => {
    await taskController.getTasks(req as Request, res as Response, next);
    const tasks = [{ id: '11733281145316', title: 'Task 1' }, { id: '1733281145320', title: 'Task 2' }];
     // Simulate returning a list of tasks
    taskRepositoryStub.resolves(tasks); 
    // Set up the service stub to resolve with the task
    getTaskServiceStub.resolves(tasks);
    // await taskController.getTasks(req as Request, res as Response, next);

    expect((res.status as SinonStub).calledWith(200)).to.be.true;
    expect((res.json as SinonStub).calledOnceWith(sinon.match.array)).to.be.true;
    expect((res.json as sinon.SinonStub).calledWith(sinon.match.same(tasks))).to.be.true;
  });

  it('get all tasks should handle errors', async () => {
    const error = new Error('Service Error');
    getTaskServiceStub.rejects(new Error('Service error'));

    await taskController.getTasks(req as Request, res as Response, next as NextFunction);

    expect(next.calledOnceWith(error)).to.be.true;
    expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
  });
});
