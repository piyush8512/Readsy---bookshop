// api_key.model.js
import mongoose, { Schema } from 'mongoose';

const apiKeySchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: { // e.g., "Mobile App API Key", "Web Frontend API Key"
            type: String,
            required: true,
            trim: true,
        },
        user: { // Optional: if API key is tied to a specific user/admin
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: false, // Could be true if all keys must belong to a user
        },
        permissions: { // e.g., ['read:books', 'write:orders', 'admin']
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastUsedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const ApiKey = mongoose.model('ApiKey', apiKeySchema);