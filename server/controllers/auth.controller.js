import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";
import sendEmail from "../services/emailservice.js"

const home = async (req, res) => {
    try {
        res.status(200).send("Welcome To Personal finance tracker using router");
    } catch (error) {
        console.log(error);
    }
};

//registration logic
const register = async (req, res) => {
    try {
        // console.log(req.body);

        const { username, email, income, password } = req.body;
        const UserExist = await User.findOne({ email })

        if(UserExist){
            return res.status(400).json({message: "User already exist"});
        }

        await sendEmail(
            email,
            "Welcome to Finance Tracker 🎉",
            "Thanks for signing up!",
            // `<h1>Welcome! ${username}</h1><p>Thanks for joining us 🚀</p>`
            `<body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                <tr>
                    <td style="padding: 20px; text-align: center; background: #4CAF50; color: white; border-radius: 8px 8px 0 0;">
                    <h1>Welcome!</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Hi <b>${username}</b>,</p>
                    <p style="font-size: 15px; color: #555;">
                        Thank you for signing up with <b>Personal Finance Tracker</b>! 🎉  
                        Your account has been successfully created.  
                    </p>
                    <p style="font-size: 15px; color: #555;">
                        You can now log in and start managing your income, expenses, and savings easily.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://finance-tracker-green-tau.vercel.app/login" 
                        style="background: #4CAF50; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
                        Login to Your Account
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #777;">
                        If you didn’t sign up for this account, please ignore this email.  
                    </p>
                    </td>
                </tr>
                <tr>
                    <td style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777; border-radius: 0 0 8px 8px;">
                    © 2025 Personal Finance Tracker. All rights reserved.
                    </td>
                </tr>
                </table>
            </body>`
        );

        // to save to database we can .save() or .create() method;
        const newUser = await User.create({ username, 
            email,
            income,
            password });

        res.status(201).json(
            {
                message: "Signup successful",
                token: await newUser.generateToken(),
                userId: newUser._id.toString(),
            }
        );
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
        // next(error);
    }
};

//login logic
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const UserExist = await User.findOne({email});
        console.log(UserExist);

        if(!UserExist){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const check_password = await UserExist.comparePassword(password);

        if(!check_password){
            res.status(401).json({ message: "Invalid email or password "});
        }
        else{
            res.status(200).json(
                {
                    message: "Login Successful",
                    token: await UserExist.generateToken(),
                    userId: UserExist._id.toString(),
                }
            );
        }

    } catch (error) {
        // res.status(500).json({ msg: "internal server error" });
        next(error);
    }
};

// contact logic
const contact = async (req, res, next) => {
    try {
        const response = req.body;

        // check if request is from logged-in user
        const isLoggedIn = req.user ? true : false;

        // conditional message and button
        const userSection = isLoggedIn
            ? `<p style="font-size: 14px; color: #555;">
                    Meanwhile, you can continue exploring your dashboard and managing your finances with ease.
               </p>
               <div style="text-align: center; margin: 20px 0;">
                   <a href="https://finance-tracker-green-tau.vercel.app/dashboard" 
                   style="background: #2196F3; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
                   Go to Dashboard
                   </a>
               </div>`
            : `<p style="font-size: 14px; color: #555;">
                    Meanwhile, feel free to explore our website and learn how Personal Finance Tracker can help you manage your finances.
               </p>
               <div style="text-align: center; margin: 20px 0;">
                   <a href="https://finance-tracker-green-tau.vercel.app/" 
                   style="background: #2196F3; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
                   Explore Website
                   </a>
               </div>`;

        await sendEmail(
            response.email,
            "Contact Form Confirmation",
            "We have successfully got your message.",
            `<body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <tr>
                <td style="padding: 20px; text-align: center; background: #2196F3; color: white; border-radius: 8px 8px 0 0;">
                <h2>We Got Your Message!</h2>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Hi <b>${response.username}</b>,</p>
                <p style="font-size: 15px; color: #555;">
                    Thank you for reaching out to <b>Personal Finance Tracker</b>.  
                    We’ve successfully received your message and if there is an issue our team will get back to you shortly.
                </p>
                <div style="background: #f7f7f7; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
                    <p style="font-size: 14px; margin: 0;"><b>Your Message:</b></p>
                    <p style="font-size: 14px; color: #555; margin: 5px 0;">${response.message}</p>
                </div>
                ${userSection}
                <p style="font-size: 13px; color: #777;">
                    If you didn’t submit this request, you can safely ignore this email.  
                </p>
                </td>
            </tr>
            <tr>
                <td style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777; border-radius: 0 0 8px 8px;">
                © 2025 Personal Finance Tracker. All rights reserved.
                </td>
            </tr>
            </table>
        </body>`
        );

        await Contact.create(response);
        return res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        next(error);
    }
}


const user = async (req, res) => {
    try {
        const userData = req.userData;
        // console.log(userData);
        return res.status(200).json({ userData })        
    } catch (error) {
        console.log(`Error from user route ${error}`);
    }
}

export default { home, register, login, contact, user };

