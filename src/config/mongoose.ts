import mongoose from 'mongoose';

const connect = () => {
  mongoose.connect(
    'mongodb+srv://admin:mFfCabDZOqD1SgUO@magicmirror.62zlo.mongodb.net/MagicMirror?retryWrites=true&w=majority',
    {},
  );
};

export default connect;
