import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

import { TaskService } from '../services/TaskService';
import { FileUploadService } from '../services/FileUploadService';
import { Task } from '../core/domain/models/taskModel';



export class TaskController {
  private taskService: TaskService;
  private fileUploadService: FileUploadService

  constructor(taskService: TaskService, fileUploadService: FileUploadService) {
    this.taskService = taskService;
    this.fileUploadService = fileUploadService;
  }

  public createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Multer storage setup (using memory storage)
const storage = multer.memoryStorage();
// Initialize multer
const upload = multer({ storage }).single('file');
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
      }
      try {
        const { title, description } = req.body;
  
        
        const task = new Task(new Date().getTime().toString(), title, description);
        //s3 file upload
        if (req.file) {
          const fileBuffer = req.file.buffer;       // Extract file buffer
          const fileName = req.file.originalname;   // Extract original file name
          const mimeType = req.file.mimetype;       // Extract MIME type
  
          // Upload file to S3
          const fileUrl = await this.fileUploadService.uploadFile(fileBuffer, fileName, mimeType);
          task.fileUrl = fileUrl;  // Store the file URL in the task
        }
        await this.taskService.createTaskService(task);
        res.status(201).json(task);
      } catch (error) {
        next(error);
      }
    });
    // upload(req, res, async () => {
    //   try {
    //     const { title, description } = req.body;
    //     const task = new Task(new Date().getTime().toString(), title, description);
  
    //     if (req.file) {
    //       const file = req.file.buffer;
    //       const fileName = req.file.originalname;
    //       const mimeType = req.file.mimetype;

    //       // const fileData = {
    //       //   file: req.file.buffer,
    //       //   fileName: req.file.originalname,
    //       //   mimeType: req.file.mimetype,
    //       // };
    //       const fileUrl = await this.fileUploadService.uploadFile(file, fileName, mimeType);
    //       task.fileUrl = fileUrl;
    //     }
    //     await this.taskService.createTaskService(task);
    //     res.status(201).json(task);
    //   } catch (error) {
    //     next(error);
    //   }
    // });
      
  }

  public getTasks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.getTasksService
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.id; 
      const task = await this.taskService.getTaskByIdService(uuid);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  //   export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const uuid = req.params.id;// Extract the task ID from URL parameters
//       const { title, description, status } = req.body; // Extract task data from request body
//       const task = await getTaskByIdUseCase.execute(uuid); // Get the task by ID using the use case

//       // If the task does not exist, return a 404 Not Found
//       if (!task) {
//         res.status(404).json({message: "Task not found"});
//         return;
//       }
//       const updatedTask: Task = {
//         ...task,
//         title: title || task.title,
//         description: description || task.description,
//         status: status || task.status,
//         updatedAt: new Date().toISOString() 
//       }

//       // Update the task using the update use case
//       await updateTaskUseCase.execute(updatedTask);
//       res.status(200).json(updatedTask);
      
//     } catch (error) {
//       next(error);
//     }
//   };


//   export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const uuid = req.params.id;
//       const task = await getTaskByIdUseCase.execute(uuid);
//       await deleteTaskUseCase.execute(uuid);
      
//       if (task?.fileUrl) {
//         const key = new URL(task.fileUrl).pathname.substring(1);
//         await deleteFromS3(key);
//       }
//       res.status(200).json({message:"Task Deleted successfully"});
//     } catch (error) {
//       next(error);
//     }


}

// import { Request, Response, NextFunction } from 'express';
// import multer from 'multer';

// import { createTaskService, getTaskService, getTaskByIdService, updateTaskService, deleteTaskService } from '../services/taskService';
// import { DynamoDBTaskRepository } from '../infrastructure/database/DynamoDBTaskRepository';
// // import { Task } from '../core/domain/models/taskModel';
// import { uploadFile, deleteFromS3 } from '../infrastructure/s3/S3FileUploader';

// const taskRepository = new DynamoDBTaskRepository();
// const createTaskUseCase = new createTaskService(taskRepository);

// const getTaskUseCase = new getTaskService(taskRepository);

// const getTaskByIdUseCase = new getTaskByIdService(taskRepository);

// const updateTaskUseCase = new updateTaskService(taskRepository);

// const deleteTaskUseCase = new deleteTaskService(taskRepository);



// export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  // // Multer storage setup (using memory storage)
  // const storage = multer.memoryStorage();
  // // Initialize multer
  // const upload = multer({ storage }).single('file');
  
  // upload(req, res, async (err) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(400).json({ error: err.message });
  //   }
  //   try {
  //     const { title, description } = req.body;

      
  //     const task = new Task(new Date().getTime().toString(), title, description);
  //     //s3 file upload
  //     if (req.file) {
  //       const fileBuffer = req.file.buffer;       // Extract file buffer
  //       const fileName = req.file.originalname;   // Extract original file name
  //       const mimeType = req.file.mimetype;       // Extract MIME type

  //       // Upload file to S3
//         const fileUrl = await uploadFile(fileBuffer, fileName, mimeType);
//         task.fileUrl = fileUrl;  // Store the file URL in the task
//       }
//       await createTaskUseCase.execute(task);
//       res.status(201).json(task);
//     } catch (error) {
//       next(error);
//     }
//   });
// };

// export const getTasks = async (_req: Request, res: Response, next: NextFunction) => {
//   try {
//     const tasks = await getTaskUseCase.execute();
//     res.status(200).json(tasks);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const uuid = req.params.id; 
//       const task = await getTaskByIdUseCase.execute(uuid);
//       res.status(200).json(task);
//     } catch (error) {
//       next(error);
//     }
//   };

//   export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const uuid = req.params.id;// Extract the task ID from URL parameters
//       const { title, description, status } = req.body; // Extract task data from request body
//       const task = await getTaskByIdUseCase.execute(uuid); // Get the task by ID using the use case

//       // If the task does not exist, return a 404 Not Found
//       if (!task) {
//         res.status(404).json({message: "Task not found"});
//         return;
//       }
//       const updatedTask: Task = {
//         ...task,
//         title: title || task.title,
//         description: description || task.description,
//         status: status || task.status,
//         updatedAt: new Date().toISOString() 
//       }

//       // Update the task using the update use case
//       await updateTaskUseCase.execute(updatedTask);
//       res.status(200).json(updatedTask);
      
//     } catch (error) {
//       next(error);
//     }
//   };


//   export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const uuid = req.params.id;
//       const task = await getTaskByIdUseCase.execute(uuid);
//       await deleteTaskUseCase.execute(uuid);
      
//       if (task?.fileUrl) {
//         const key = new URL(task.fileUrl).pathname.substring(1);
//         await deleteFromS3(key);
//       }
//       res.status(200).json({message:"Task Deleted successfully"});
//     } catch (error) {
//       next(error);
//     }
//   };