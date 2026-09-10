import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 KERTAS KATA API Server berjalan di Port ${PORT}`);
  console.log(`🌐 Lingkungan: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 URL API: http://localhost:${PORT}/api`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});
