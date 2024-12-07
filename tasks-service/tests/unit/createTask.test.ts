/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response, NextFunction } from 'express';
import { expect } from 'chai';
import sinon,  { SinonStub } from 'sinon';

// Import the function and dependencies
import { createTask } from '../../src/controllers/taskController.js';
import { DynamoDBTaskRepository } from '../../src/infrastructure/database/DynamoDBTaskRepository.js';
import { createTaskService } from '../../src/services/taskService.js';
import { Task } from '../../src/core/domain/models/taskModel.js';

describe('createTask Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonStub;
  let createTaskServiceStub: SinonStub;
  let taskRepositoryStub: SinonStub;

  beforeEach(() => {
    req = { body: { title: 'Test Task', description: 'Test description' } };  // Initialize request
    
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    next = sinon.stub();
    // Stub the DynamoDBTaskRepository to prevent actual calls to DynamoDB
    taskRepositoryStub = sinon.stub(DynamoDBTaskRepository.prototype, 'create');
    // Stub the createTaskService
    createTaskServiceStub = sinon.stub(createTaskService.prototype, 'execute'); 
  });

  it('should return 201 and create a task', async () => {
     // Create a mock task entity
     const task = new Task(new Date().getTime().toString(), 'Test Task', 'Test description');
     // Set up the repository stub to simulate successful put operation
    taskRepositoryStub.resolves(task); 
    // Set up the service stub to resolve with the task
    createTaskServiceStub.resolves(task);
    await createTask(req as Request, res as Response, next);  // `req` is accessible here

    expect((res.status as SinonStub).calledWith(201)).to.be.true;
    expect((res.json as SinonStub).calledOnce).to.be.true;
    expect((res.json as SinonStub).calledWith(sinon.match.has('title', 'Test Task'))).to.be.true;
  });

  it('create a task should handle errors', async () => {
    const error = new Error('Service Error');
    createTaskServiceStub.rejects(new Error('Service error'));

    await createTask(req as Request, res as Response, next as NextFunction);

    expect(next.calledOnceWith(error)).to.be.true;
    expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
  });
});
