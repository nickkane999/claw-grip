const { User, AuthUser } = require("./models/User");
const { Chart } = require("./models/Chart");
const generateToken = require("../token").generateToken;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  Query: {
    async user(_, { id }) {
      return await User.findById(id);
    },
    async userByName(_, { username }) {
      return await User.findOne({ username });
    },
    async getUsers(_, { amount }) {
      return await User.find().sort({ createdDate: -1 }).limit(amount);
    },
    async getCharts(_, { amount }) {
      return await Chart.find().sort({ createdDate: -1 }).limit(amount);
    },
    async getChartsByUser(_, { userId }) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return await Chart.find({ user }).sort({ createdDate: -1 });
    },
    async login(_, { loginInput: { username, password } }) {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new Error("Invalid credentials");
      }

      return {
        user,
        token: generateToken(user),
      };
    },
  },
  Mutation: {
    async createUser(_, { createUserInput: { username, password, confirmPassword, email } }) {
      // see if a user exists with the same username
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exists");
      }
      if (password === confirmPassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDate = new Date().toISOString();
        const newUser = new User({
          username,
          password: hashedPassword,
          createdDate: newDate,
          updatedDate: newDate,
        });
        const user = await newUser.save();
        return user;
      } else {
        throw new Error("Passwords don't match");
      }
    },
    async editUser(_, { id, editUserInput: { username, password, email } }) {
      const wasEdited = (await Recipe.updateOne({ _id }, { username, password, email })).modifiedCount;
      return wasEdited;
    },
    async deleteUser(_, { id }) {
      const wasDeleted = (await User.deleteOne({ _id: id })).deletedCount;
      return wasDeleted;
    },
    async createChart(_, { createChartInput: { name, type, json, plugins, userId } }) {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const newDate = new Date().toISOString();
      const chart = await new Chart({
        name,
        type,
        createdDate: newDate,
        updatedDate: newDate,
        json,
        plugins,
        user,
      }).save();
      return chart;
    },
    async updateChart(_, { id, updateChartInput: { name, type, json, plugins } }) {
      const chart = await Chart.findById(id);
      if (!chart) {
        throw new Error("Chart not found");
      }
      const newDate = new Date().toISOString();
      const updatedChart = await Chart.updateOne(
        { _id: id },
        {
          name,
          type,
          json,
          plugins,
          updatedDate: newDate,
        }
      );
      //return updatedChart; // This gave me a error; I think it's because the updateOne() method returns the wrong object format, but need to check with chatGPT
      return await Chart.findById(id);
    },
    async deleteChart(_, { id }) {
      const wasDeleted = (await Chart.deleteOne({ _id: id })).deletedCount;
      return wasDeleted;
    },
  },
};
