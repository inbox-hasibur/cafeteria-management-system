import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters']
    },
    cartData: {
        type: Object,
        default: {}
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    }
}, {
    timestamps: true,
    versionKey: false
});


const User = mongoose.models.user || mongoose.model('user', userSchema);
export default User;