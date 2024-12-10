import { User } from "../domain/models/UserExternalModel"

export interface ExternalUserRepository {
    findAll(id: string): Promise<User[]>;
    send(user: User): Promise<void>;
}    