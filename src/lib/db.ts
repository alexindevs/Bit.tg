import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const requestSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const URLModel = mongoose.model('URL', urlSchema);
const RequestModel = mongoose.model('Request', requestSchema);
const prodUrl =  process.env.PROD_DB || 'mongodb://localhost:27017/bit_tg_db';

async function connectDatabase() {
  try {
    await mongoose.connect(prodUrl);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

export { URLModel, RequestModel, connectDatabase };
