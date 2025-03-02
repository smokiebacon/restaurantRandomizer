import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// USER SCHEMA
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
    },
    image: {
      type: String,
    },
    // Social media accounts
    facebookId: {
      type: String,
      sparse: true,
    },
    instagramId: {
      type: String,
      sparse: true,
    },
    tiktokId: {
      type: String,
      sparse: true,
    },
    youtubeId: {
      type: String,
      sparse: true,
    },
    // Social media access tokens
    facebookToken: {
      type: String,
      private: true,
    },
    instagramToken: {
      type: String,
      private: true,
    },
    tiktokToken: {
      type: String,
      private: true,
    },
    youtubeToken: {
      type: String,
      private: true,
    },
    // TikTok OAuth temporary storage for authentication flow
    tiktokAuth: {
      codeVerifier: {
        type: String,
        private: true,
      },
      csrfState: {
        type: String,
        private: true,
      },
      timestamp: {
        type: Date,
      },
      refreshToken: {
        type: String,
        private: true,
      },
      expiresAt: {
        type: Date,
      },
    },
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value) {
        return value.includes("cus_");
      },
    },
    // Used in the Stripe webhook. should match a plan in config.js file.
    priceId: {
      type: String,
      validate(value) {
        return value.includes("price_");
      },
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema);
