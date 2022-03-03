import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export * from 'mongoose';

export const persistMessage = (payload: any) => {
  const ConversationSchema = new Schema({ room: String, message: Object });

  const Conversation = mongoose.model('Conversation', ConversationSchema);

  const conversation = new Conversation(payload);
  conversation.save().then((res: any) => console.log(res));
};

export const listMessages = (payload: any, callback: Function) => {
  const { room, message } = payload;

  const ConversationSchema = new Schema({ room: String, message: Object });

  const Conversation = mongoose.model('Conversation', ConversationSchema);

  Conversation.find({ room: { $eq: room }, message: { from: { $ne: message.from } } }, callback);
};

export const mongoConnect = ({ mongoDatabase, mongoUrl }) => {
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
