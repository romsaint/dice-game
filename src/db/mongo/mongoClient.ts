import { MongoClient } from "mongodb";
import { IUser } from "../../interfaces/user.interface";



const password = process.env.MONGO_PASSWORD
if(!password) {
    throw new Error('PASSWROD')
}

const uri = `mongodb+srv://snm20061977:${password}@cluster52.qbvbgdt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster52`

export const mongoClient = new MongoClient(uri, {
    appName: 'Cluster52'
});
export const usersCollection = mongoClient.db('dice').collection<IUser>('users')