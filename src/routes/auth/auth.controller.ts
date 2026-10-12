import { randomBytes, createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import User from "../../models/user.model";
import asyncWrapper from "../../utils/asyncwrapper";
import { ApiError, BadRequestError, ZodError } from "../../utils/ApiError";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import configs from "../../utils/configs";
import { StatusCodes } from "http-status-codes";
import connection from "../../utils/database";
import { LoginUserScheme } from "../../types";
import bcrypt from "bcryptjs";
import Profile from "../../models/profile.model";
// import sendMail from "../../utils/mails.service";

class AuthContoller {
  postSignup = asyncWrapper(async (req: Request, resp: Response) => {
    const result = await connection.transaction(async (t) => {
      const { name, email, password, phone } = req.body ? req.body : {};

      if (!name || !email || !password || !phone) {
        throw new BadRequestError("All fields are required");
      }

      const [firstName, ...lastName] = name.trim().split(" ");
      const registeredUser = await User.findOne({
        where: {
          email,
        },
      });
      if (registeredUser) {
        throw new BadRequestError("User with this email already exists");
      }
      const user = await User.create(
        {
          email,
          password,
        },
        { transaction: t }
      );

      if (!user) {
        throw new BadRequestError("User registration failed");
      }
      const profile = await (
        user as typeof user & { createProfile: Function }
      ).createProfile(
        {
          first_name: firstName,
          last_name: lastName.join(" "),
          phone_number: phone,
        },
        { transaction: t }
      );
      if (!profile) {
        throw new BadRequestError("User profile creation failed");
      }
      const wallet = await (
        user as typeof user & { createWallet: Function }
      ).createWallet({}, { transaction: t });

      if (!wallet) {
        throw new BadRequestError("User wallet creation failed");
      }
      const webtoken = jsonwebtoken.sign(
        { uid: user.uid },
        configs.JWT_SECRET_KEY as string,
        {
          expiresIn: "30s",
        }
      );

      return {
        token: webtoken,
        name,
        phone,
        user,
      };
    });

    resp.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: {
        token: result.token,
        user: {
          uid: result.user.uid,
          name: result.name,
          email: result.user.email,
          phone: result.phone,
        },
      },
    });
  });

  postLogin = asyncWrapper(async (req: Request, resp: Response) => {
    const parsed = LoginUserScheme.safeParse(req.body);
    if (parsed.error) {
      throw new ZodError(parsed.error.issues);
    }

    const user = await User.findOne({
      where: {
        email: parsed.data.email,
      },
    });

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const checkPassword = await bcrypt.compare(
      parsed.data.password,
      user.password
    );

    if (!checkPassword) {
      throw new BadRequestError(
        "Invalid credientials, check your entries and try again"
      );
    }
    const webtoken = jsonwebtoken.sign(
      { uid: user.uid },
      configs.JWT_SECRET_KEY as string,
      {
        expiresIn: "30s",
      }
    );

    resp.status(StatusCodes.OK).json({
      success: true,
      message: "User logged in successfully",
      token: webtoken,
    });
  });

  postForgotPassword = asyncWrapper(async (req: Request, resp: Response) => {
    // Get user based on email
    let email;
    if (req.body) {
      email = req.body.email;
    } else {
      throw new BadRequestError("Email field is required.");
    }
    const user = await User.findOne({
      attributes: ["uid", "email", "changedAt", "token", "expiresIn"],
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestError("User not found");
    }

    // Generate the random reset token
    const token = randomBytes(32).toString("hex");

    const hashedToken = createHash("sha256").update(token).digest("hex");

    user.set({
      token: hashedToken,
      expiresIn: Date.now() + 10 * 60 * 1000,
    });
    const result = await user.save();

    // Send token to user's email
    // try {
    //   await sendMail.sendMail({
    //     email: user.email,
    //     subject: "Forgot Password",
    //     html: `<!doctype html>
    //     <html lang="en">
    //       <head>
    //         <meta charset="UTF-8" />
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    //         <title>Reset Password</title>
    //         <style>
    //           @media (prefers-color-scheme: dark) {
    //             .email-bg {
    //               background-color: #111111 !important;
    //             }
    //             .card-bg {
    //               background-color: #1a1a1a !important;
    //             }
    //             .text-main {
    //               color: #f3f4f6 !important;
    //             }
    //             .text-muted {
    //               color: #9ca3af !important;
    //             }
    //             .btn-accent {
    //               background-color: #6366f1 !important;
    //               color: #ffffff !important;
    //             }
    //           }
    //         </style>
    //       </head>
    //       <body
    //         style="
    //           margin: 0;
    //           padding: 0;
    //           font-family:
    //             -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto,
    //             Helvetica, Arial, sans-serif;
    //           -webkit-font-smoothing: antialiased;
    //         "
    //       >
    //         <table
    //           border="0"
    //           cellpadding="0"
    //           cellspacing="0"
    //           width="100%"
    //           class="email-bg"
    //           style="background-color: #fafafa; padding: 60px 0"
    //         >
    //           <tr>
    //             <td align="center">
    //               <table
    //                 border="0"
    //                 cellpadding="0"
    //                 cellspacing="0"
    //                 width="540"
    //                 class="card-bg"
    //                 style="
    //                   background-color: #ffffff;
    //                   padding: 48px;
    //                   border-radius: 12px;
    //                 "
    //               >
    //                 <tr>
    //                   <td align="left" style="padding-bottom: 32px">
    //                     <div
    //                       class="text-main"
    //                       style="
    //                         font-size: 20px;
    //                         font-weight: 700;
    //                         letter-spacing: -0.5px;
    //                         color: #000000;
    //                       "
    //                     >
    //                      SUBME<span style="color: #4f46e5">VTU</span>
    //                     </div>
    //                   </td>
    //                 </tr>
    //                 <tr>
    //                   <td align="left">
    //                     <h1
    //                       class="text-main"
    //                       style="
    //                         margin: 0 0 16px 0;
    //                         color: #111827;
    //                         font-size: 24px;
    //                         font-weight: 700;
    //                         letter-spacing: -0.5px;
    //                       "
    //                     >
    //                       Password Reset
    //                     </h1>
    //                   </td>
    //                 </tr>
    //                 <tr>
    //                   <td align="left">
    //                     <p
    //                       class="text-muted"
    //                       style="
    //                         margin: 0 0 24px 0;
    //                         color: #4b5563;
    //                         font-size: 15px;
    //                         line-height: 1.6;
    //                       "
    //                     >
    //                       We received a request to change your account password. If this
    //                       was you, use the secure confirmation button below to proceed.
    //                     </p>
    //                   </td>
    //                 </tr>
    //                 <tr>
    //                   <td align="left" style="padding-bottom: 32px">
    //                     <table border="0" cellpadding="0" cellspacing="0">
    //                       <tr>
    //                         <td
    //                           align="center"
    //                           bgcolor="#4f46e5"
    //                           style="border-radius: 8px"
    //                           class="btn-accent"
    //                         >
    //                           <a
    //                             href=''
    //                             target="_blank"
    //                             style="
    //                               display: inline-block;
    //                               padding: 14px 32px;
    //                               font-size: 15px;
    //                               color: #ffffff;
    //                               text-decoration: none;
    //                               font-weight: 600;
    //                               border-radius: 8px;
    //                             "
    //                             >Modify Password</a
    //                           >
    //                         </td>
    //                       </tr>
    //                     </table>
    //                   </td>
    //                 </tr>
    //                 <tr>
    //                   <td
    //                     align="left"
    //                     style="
    //                       border-left: 2px solid #e5e7eb;
    //                       padding-left: 16px;
    //                       margin-bottom: 32px;
    //                     "
    //                   >
    //                     <p
    //                       class="text-muted"
    //                       style="
    //                         margin: 0;
    //                         color: #6b7280;
    //                         font-size: 13px;
    //                         line-height: 1.5;
    //                       "
    //                     >
    //                       <strong>Security note:</strong> This action window expires in
    //                       10 minutes. If you did not generate this link, you can delete
    //                       this email without any further action.
    //                     </p>
    //                   </td>
    //                 </tr>
    //                 <tr>
    //                   <td
    //                     align="left"
    //                     style="padding-top: 32px; border-top: 1px solid #f3f4f6"
    //                   >
    //                     <p
    //                       class="text-muted"
    //                       style="
    //                         margin: 0;
    //                         color: #9ca3af;
    //                         font-size: 12px;
    //                         line-height: 1.5;
    //                       "
    //                     >
    //                       Sent automatically by SUBME VTU. To manage your communication
    //                       profiles, visit your platform settings dashboard.
    //                     </p>
    //                   </td>
    //                 </tr>
    //               </table>
    //             </td>
    //           </tr>
    //         </table>
    //       </body>
    //     </html>
    //     `,
    //   });
    // } catch (error: any) {
    //   user.set({
    //     token: undefined,
    //     expiresIn: undefined,
    //   });
    //   await user.save();

    //   throw new BadRequestError(`Error sending email ${error.message}`);
    // }
    resp.json({ success: true, message: "Email sent successfully" });
  });
  patchResetPassword = asyncWrapper(async (req: Request, resp: Response) => {});

  restrictTo =
    (changedAt: string | null) =>
    async (req: any, resp: Response, next: NextFunction) => {
      if (req.user.changedAt === changedAt) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "Reset your password to access this resource."
        );
      }
      next();
    };

  protector = async (req: any, resp: Response, next: NextFunction) => {
    let token;
    // Get token and check if it's there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Please login to access resource.."
      );
    }
    // Verification of token
    const verifyJWTAsync = (token: string, secretKey: string) => {
      return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, secretKey, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
    };

    const decodedToken = (await verifyJWTAsync(
      token,
      configs.JWT_SECRET_KEY as string
    )) as JwtPayload;

    // Check if user still exists
    const user = await User.findOne({
      attributes: ["uid", "email", "changedAt", "token", "expiresIn"],
      include: [Profile],
      where: {
        uid: decodedToken.uid,
      },
    });

    if (!user) {
      throw new BadRequestError("User does not exist");
    }
    // Check if user changed password after token was issued
    if (passwordChangedAfterToken(decodedToken.iat as number, user.changedAt)) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "User recently changed password, please login again."
      );
    }
    req.user = user;
    next();
  };
}

const passwordChangedAfterToken = (
  jwtTimeStamp: number,
  passwordChangedAt: string | null
) => {
  if (passwordChangedAt) {
    const changedAt = new Date(passwordChangedAt).getTime();
    const jwtIssuedAt = jwtTimeStamp * 1000;

    return jwtIssuedAt < changedAt;
  }
  return false;
};

const authController = new AuthContoller();
export default authController;
