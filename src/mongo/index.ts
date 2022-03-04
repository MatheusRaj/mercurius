import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IConversation } from '../interfaces/ISend';

export * from 'mongoose';

const ConversationSchema = new Schema({ room: String, message: Object });
const Conversation = mongoose.model('Conversation', ConversationSchema);

export const persistMessage = (payload: IConversation) => {
  const conversation = new Conversation(payload);
  conversation.save();
};

export const listMessages = async (payload: IConversation) => {
  const { room } = payload;

  const messages = await Conversation.find({ room }).exec();

  return messages;
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
