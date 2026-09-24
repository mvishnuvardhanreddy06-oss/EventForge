const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://localhost:27017/eventforge';
  const localFallbackUri = 'mongodb://localhost:27017/eventforge';

  // If using mongodb+srv, configure DNS servers to Google DNS to avoid common local ISP SRV resolution failures
  if (primaryUri.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    } catch (e) {
      // Ignore if setServers is not permitted
    }
  }

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Primary Connection Error (${primaryUri}): ${error.message}`);

    // If primary was remote and failed (e.g. IP whitelist / DNS issue), fall back to local MongoDB
    if (primaryUri !== localFallbackUri) {
      console.log(`Falling back to local MongoDB (${localFallbackUri})...`);
      try {
        const fallbackConn = await mongoose.connect(localFallbackUri, {
          serverSelectionTimeoutMS: 5000
        });
        console.log(`Fallback Local MongoDB Connected: ${fallbackConn.connection.host} (${fallbackConn.connection.name})`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`Fallback Local MongoDB Error: ${fallbackError.message}`);
      }
    }
  }
};

module.exports = connectDB;
