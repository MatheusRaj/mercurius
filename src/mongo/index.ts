import mongoose, { Model } from 'mongoose';

export * from 'mongoose';

interface IMongoConnect {
  mongoDatabase: string;
  mongoUrl: string;
}

export const persistMessage = async (payload: any, model: Model<any>): Promise<boolean> => {
  const instance = new model(payload);

  await instance.save();

  return true;
};

export const listMessages = async (payload: any, model: Model<any>): Promise<any> => {
  const messages = await model.find(payload).exec();

  return messages;
};

export const mongoConnect = ({ mongoDatabase, mongoUrl }: IMongoConnect) => {
  return new Promise<void>((resolve, reject) => {
    const options = {
      keepAlive: true,
      autoIndex: true,
      dbName: mongoDatabase,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    mongoose.connect(mongoUrl, options, err => (err ? reject(err) : resolve()));

    mongoose.connection.on('open', () => resolve());
    mongoose.connection.on('error', err => reject(err));
    mongoose.connection.on('disconnected', () => {
      mongoose.connect(mongoUrl, options, err => (err ? reject(err) : resolve()));
    });
  });
};

export default { persistMessage, listMessages, mongoConnect };
