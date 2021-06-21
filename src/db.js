import mongoose from "mongoose";

const startDB = async () => {
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `Connected to MONGO DB: ${db.connection.name} `.cyan.bold.underline
  );
};

export { startDB };
