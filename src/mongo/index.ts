import mongoose, { Model } from 'mongoose';
import { Schema } from 'mongoose';

export * from 'mongoose';

interface IMongoConnect {
  mongoDatabase: string;
  mongoUrl: string;
}

const GenericSchema = new Schema();

export const getModel = (name: string) => {
  const GenericModel = mongoose.model(name, GenericSchema);

  console.log(GenericModel);

  return GenericModel;
};

export const persistMessage = (payload: any, model: Model<any>) => {
  console.log(model);

  const instance = new model(payload);

  console.log('Instance created: ', instance);

  instance.save();
};

export const listMessages = async (payload: any, model: Model<any>) => {
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

export default { persistMessage, listMessages, mongoConnect, getModel };
