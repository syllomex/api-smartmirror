import mongoose from 'mongoose';

const connect = () => {
  mongoose.connect(process.env.MONGO_URI as string, {});
};

export default connect;
