// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { fetchUsers } from '../services/externalApiService';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("==getUsers");
    const users = await fetchUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};










// import { Request, Response, NextFunction } from 'express';
// import axios from "axios";

// import { getUserService, createUserService } from '../../services/externalApiService';
// import { DynamoDBExternalRepository } from '../../infrastructure/database/DynamoDBExternalRepository';
// import { User } from '../../core/domain/entities/externalModel';

// const userRepository = new DynamoDBExternalRepository();
// const getUserUseCase = new getUserService(userRepository);

// const createUserUseCase = new createUserService(userRepository);


// export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
//     try {
//         console.log("========called=============== ");
//         const TTL_DURATION = 5 * 60; // 5 minutes in seconds
//         const cacheKey = "users";
//         const currentTime = Math.floor(Date.now() / 1000);

//         // const users = await getUserService();
//         // res.status(200).json(users);
//         const cachedUsers = await getUserUseCase.execute(cacheKey);
//         if (cachedUsers) {
//             console.log("Returning cached data");
//             return res.status(200).json(cachedUsers);
//         }

//         // Fetch users from external API
//         const users = await getUserUseCase.fetchUsersFromAPI();
//         // Cache the response with a TTL
//         await createUserUseCase.execute(users, cacheKey, TTL_DURATION);

//         res.status(200).json(users);


//         res.status(200).json([]);
//     } catch (error) {
//         next(error);
//     }
// };
