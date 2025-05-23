const { Schema, model } = require("mongoose");
const { hash, compare } = require("bcryptjs");
const logger = require("../config/winston");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
      required: true,
    },
    premiumExpiresAt: {
      type: Date,
    },
    accountType: {
      type: String,
      enum: ["FREE", "PREMIUM"],
      default: "FREE",
    },
    isRequestChangeToPremium: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await compare(password, this.password);
};

userSchema.methods.isPremiumActive = function () {
  return this.accountType === "PREMIUM" && this.premiumExpiresAt > new Date();
};

const deleteMany = async () => {
  try {
    const result = await User.deleteMany({});
    logger.info(`Delete ${result.deletedCount} item successfully`);
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (users) => {
  try {
    const result = await User.insertMany(users);
    logger.info(`Insert ${result.length} item successfully`);
    return result;
  } catch (error) {
    logger.error("Insert failed:", error);
    throw error;
  }
};

const User = model("User", userSchema);

module.exports = { User, deleteMany, insertMany };
