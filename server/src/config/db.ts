import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

const maskUri = (uri: string): string => {
  try {
    return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  } catch {
    return uri;
  }
};

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    const masked = maskUri(uri);
    try {
      console.log(`Attempting connection to provided MongoDB URI: ${masked}...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`Successfully connected to MongoDB: ${masked}`);
      return;
    } catch (error: any) {
      console.error(`Failed to connect to provided MongoDB URI (${masked}):`, error.message);
      console.log('Falling back to In-Memory MongoDB for local development...');
    }
  } else {
    console.log('No MONGODB_URI found in environment (or value is empty).');
    console.log('Initializing in-memory MongoDB for local development...');
  }

  try {
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Connected to In-Memory MongoDB at ${memoryUri}`);
  } catch (err: any) {
    console.error('Fatal: Failed to start in-memory MongoDB:', err.message);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongod) {
      await mongod.stop();
      mongod = null;
    }
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error during MongoDB disconnect:', error);
  }
};
