import { User } from "../domain/models/externalModel"

export interface ExternalUserRepository {
    findAll(id: string): Promise<User[]>;
    send(user: User): Promise<void>;
}    