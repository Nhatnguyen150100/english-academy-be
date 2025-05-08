import { User } from "../models/user";

const downgradeExpiredPremiumUsers = async () => {
  const now = new Date();
  const result = await User.updateMany(
    {
      accountType: "PREMIUM",
      premiumExpiresAt: { $lte: now },
    },
    {
      $set: { accountType: "FREE" },
      $unset: { premiumExpiresAt: "" },
    },
  );

  if (result.modifiedCount > 0) {
    console.log(`⏬ Downgraded ${result.modifiedCount} expired PREMIUM users.`);
  }
};

export default downgradeExpiredPremiumUsers;
