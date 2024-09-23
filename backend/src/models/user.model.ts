import mongoose, { Document, Schema, model, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface for the User model
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>; // Method for comparing passwords
}

// User schema definition
const userSchema = new Schema<IUser>({
  username: { type: String, required: [true, 'Username is required'], trim: true },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true,
    validate: {
      validator: function (email: string) {
        // Simple regex for basic email validation
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  password: { type: String, required: [true, 'Password is required'], minlength: 6 },
}, { timestamps: true });

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Only hash the password if it has been modified or is new
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    user.password = await bcrypt.hash(user.password, salt); // Hash the password
    next();
  } catch (error) {
    // Handle error safely
    next(error as CallbackError);  // Cast the error to the expected type
  }
});

// Method to compare the password during login
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = model<IUser>('User', userSchema);

export default User;
