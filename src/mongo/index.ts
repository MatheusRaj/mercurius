import mongoose from 'mongoose';
import { Document, Model, model, Schema } from 'mongoose';

export const defineSchema = (schemaType: any): Schema => {
  return new Schema(schemaType);
};

export const createSchema = (schema: Schema, schemaName: string, T: any) => {
  const NewSchema: Model<ReturnType<typeof T>> = model<ReturnType<typeof T>>(schemaName, schema);

  return NewSchema;
};

export const mongoConnect = ({ mongoDatabase, mongoUrl }) => {
  return new Promise<void>((resolve, reject) => {
    const options = {
      keepAlive: true,
      autoIndex: true,
      dbName: mongoDatabase,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 3
    };

    mongoose.connect(mongoUrl, options, err => (err ? reject(err) : resolve()));

    mongoose.connection.on('open', () => resolve());
    mongoose.connection.on('error', err => reject(err));
    mongoose.connection.on('disconnected', () => {
      mongoose.connect(mongoUrl, options, err => (err ? reject(err) : resolve()));
    });
  });
};

export default { defineSchema, mongoConnect, Document };
