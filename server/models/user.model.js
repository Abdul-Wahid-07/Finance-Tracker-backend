import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    income:{
        type: Number,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
});

// securing password using bcrypt
userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(this.password, salt);
        this.password = hash_password;
    } catch (error) {
        next(error);
    }
});

// comparing the password during login
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password)
}

// json web token
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            }
        );
    } catch (error) {
        console.error(error);
    }
}

const User = new mongoose.model("User", userSchema);

export default User;
