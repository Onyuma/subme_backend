import nodemailer from "nodemailer";

class Email {
  sendMail = async (options: {
    email: string;
    subject: string;
    html: string;
  }) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      // service: "Gmail",
      // auth: { user: "johnonyumaudu@gmail.com", pass: "Onyuma@2019" },
      host: "sandbox.smtp.mailtrap.io",
      port: 25,
      auth: { user: "bc04f924ec4c7a", pass: "b8b5b59ee89705" },
    });

    // Send the email
    await transporter.sendMail({
      from: "Customer Care <noreply@subme.com.ng>",
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
  };
}

const email = new Email();
export default email;

// <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Reset Password</title>
//     <style>
//       /* Modern Dark Mode Targets */
//       @media (prefers-color-scheme: dark) {
//         .email-bg {
//           background-color: #111111 !important;
//         }
//         .card-bg {
//           background-color: #1a1a1a !important;
//         }
//         .text-main {
//           color: #f3f4f6 !important;
//         }
//         .text-muted {
//           color: #9ca3af !important;
//         }
//         .btn-accent {
//           background-color: #6366f1 !important;
//           color: #ffffff !important;
//         }
//       }
//     </style>
//   </head>
//   <body
//     style="
//       margin: 0;
//       padding: 0;
//       font-family:
//         -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto,
//         Helvetica, Arial, sans-serif;
//       -webkit-font-smoothing: antialiased;
//     "
//   >
//     <table
//       border="0"
//       cellpadding="0"
//       cellspacing="0"
//       width="100%"
//       class="email-bg"
//       style="background-color: #fafafa; padding: 60px 0"
//     >
//       <tr>
//         <td align="center">
//           <!-- Sleek Borderless Container Box -->
//           <table
//             border="0"
//             cellpadding="0"
//             cellspacing="0"
//             width="540"
//             class="card-bg"
//             style="
//               background-color: #ffffff;
//               padding: 48px;
//               border-radius: 12px;
//             "
//           >
//             <!-- Minimalist Logo Placeholder -->
//             <tr>
//               <td align="left" style="padding-bottom: 32px">
//                 <div
//                   class="text-main"
//                   style="
//                     font-size: 20px;
//                     font-weight: 700;
//                     letter-spacing: -0.5px;
//                     color: #000000;
//                   "
//                 >
//                   YOUR<span style="color: #4f46e5">BRAND</span>
//                 </div>
//               </td>
//             </tr>

//             <!-- Title -->
//             <tr>
//               <td align="left">
//                 <h1
//                   class="text-main"
//                   style="
//                     margin: 0 0 16px 0;
//                     color: #111827;
//                     font-size: 24px;
//                     font-weight: 700;
//                     letter-spacing: -0.5px;
//                   "
//                 >
//                   Password Reset
//                 </h1>
//               </td>
//             </tr>

//             <!-- Content body -->
//             <tr>
//               <td align="left">
//                 <p
//                   class="text-muted"
//                   style="
//                     margin: 0 0 24px 0;
//                     color: #4b5563;
//                     font-size: 15px;
//                     line-height: 1.6;
//                   "
//                 >
//                   We received a request to change your account password. If this
//                   was you, use the secure confirmation button below to proceed.
//                 </p>
//               </td>
//             </tr>

//             <!-- Action Pill Button -->
//             <tr>
//               <td align="left" style="padding-bottom: 32px">
//                 <table border="0" cellpadding="0" cellspacing="0">
//                   <tr>
//                     <td
//                       align="center"
//                       bgcolor="#4f46e5"
//                       style="border-radius: 8px"
//                       class="btn-accent"
//                     >
//                       <a
//                         href="{{reset_url}}"
//                         target="_blank"
//                         style="
//                           display: inline-block;
//                           padding: 14px 32px;
//                           font-size: 15px;
//                           color: #ffffff;
//                           text-decoration: none;
//                           font-weight: 600;
//                           border-radius: 8px;
//                         "
//                         >Modify Password</a
//                       >
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             <!-- Security Expiry Bar -->
//             <tr>
//               <td
//                 align="left"
//                 style="
//                   border-left: 2px solid #e5e7eb;
//                   padding-left: 16px;
//                   margin-bottom: 32px;
//                 "
//               >
//                 <p
//                   class="text-muted"
//                   style="
//                     margin: 0;
//                     color: #6b7280;
//                     font-size: 13px;
//                     line-height: 1.5;
//                   "
//                 >
//                   <strong>Security note:</strong> This action window expires in
//                   60 minutes. If you did not generate this link, you can delete
//                   this email without any further action.
//                 </p>
//               </td>
//             </tr>

//             <!-- Fineprint Minimal Footer -->
//             <tr>
//               <td
//                 align="left"
//                 style="padding-top: 32px; border-top: 1px solid #f3f4f6"
//               >
//                 <p
//                   class="text-muted"
//                   style="
//                     margin: 0;
//                     color: #9ca3af;
//                     font-size: 12px;
//                     line-height: 1.5;
//                   "
//                 >
//                   Sent automatically by YourBrand. To manage your communication
//                   profiles, visit your platform settings dashboard.
//                 </p>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>

// <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Reset Your Password</title>
//   </head>
//   <body
//     style="
//       margin: 0;
//       padding: 0;
//       background-color: #f4f6f8;
//       font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;
//       -webkit-font-smoothing: antialiased;
//     "
//   >
//     <table
//       border="0"
//       cellpadding="0"
//       cellspacing="0"
//       width="100%"
//       style="background-color: #f4f6f8; padding: 40px 0"
//     >
//       <tr>
//         <td align="center">
//           <!-- Main Container Box -->
//           <table
//             border="0"
//             cellpadding="0"
//             cellspacing="0"
//             width="600"
//             style="
//               background-color: #ffffff;
//               border: 1px solid #e1e4e8;
//               border-radius: 4px;
//               overflow: hidden;
//               box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
//             "
//           >
//             <!-- Header Colored Accent Layer -->
//             <tr>
//               <td
//                 style="
//                   background-color: #2c3e50;
//                   height: 6px;
//                   font-size: 0;
//                   line-height: 0;
//                 "
//               >
//                 &nbsp;
//               </td>
//             </tr>

//             <!-- Content Area -->
//             <tr>
//               <td style="padding: 40px 50px">
//                 <h2
//                   style="
//                     margin: 0 0 20px 0;
//                     color: #333333;
//                     font-size: 24px;
//                     font-weight: 600;
//                     line-height: 1.3;
//                   "
//                 >
//                   Password Reset Request
//                 </h2>

//                 <p
//                   style="
//                     margin: 0 0 20px 0;
//                     color: #555555;
//                     font-size: 16px;
//                     line-height: 1.6;
//                   "
//                 >
//                   Hello,
//                 </p>
//                 <p
//                   style="
//                     margin: 0 0 30px 0;
//                     color: #555555;
//                     font-size: 16px;
//                     line-height: 1.6;
//                   "
//                 >
//                   We received a request to reset the password associated with
//                   your account. Click the secure button below to choose a new
//                   password. This link is valid for the next 60 minutes.
//                 </p>

//                 <!-- Bulletproof Button -->
//                 <table
//                   border="0"
//                   cellpadding="0"
//                   cellspacing="0"
//                   style="margin-bottom: 30px"
//                 >
//                   <tr>
//                     <td
//                       align="center"
//                       bgcolor="#2c3e50"
//                       style="border-radius: 4px"
//                     >
//                       <a
//                         href="{{reset_url}}"
//                         target="_blank"
//                         style="
//                           display: inline-block;
//                           padding: 14px 28px;
//                           font-size: 16px;
//                           color: #ffffff;
//                           text-decoration: none;
//                           font-weight: bold;
//                           border-radius: 4px;
//                         "
//                         >Reset Password</a
//                       >
//                     </td>
//                   </tr>
//                 </table>

//                 <p
//                   style="
//                     margin: 0 0 15px 0;
//                     color: #777777;
//                     font-size: 14px;
//                     line-height: 1.5;
//                   "
//                 >
//                   If the button above does not work, copy and paste the
//                   following URL into your web browser:
//                 </p>

//                 <!-- Plain Text Link Box -->
//                 <table
//                   border="0"
//                   cellpadding="0"
//                   cellspacing="0"
//                   width="100%"
//                   style="
//                     background-color: #f8f9fa;
//                     border: 1px dashed #cbd5e0;
//                     border-radius: 4px;
//                     margin-bottom: 30px;
//                   "
//                 >
//                   <tr>
//                     <td
//                       style="
//                         padding: 12px;
//                         font-family: monospace;
//                         font-size: 13px;
//                         color: #4a5568;
//                         word-break: break-all;
//                       "
//                     >
//                       {{reset_url}}
//                     </td>
//                   </tr>
//                 </table>

//                 <p
//                   style="
//                     margin: 0;
//                     color: #777777;
//                     font-size: 14px;
//                     line-height: 1.5;
//                   "
//                 >
//                   If you did not make this request, you can safely ignore this
//                   email. Your current password will remain secure.
//                 </p>
//               </td>
//             </tr>

//             <!-- Footer Context -->
//             <tr>
//               <td
//                 style="padding: 0 50px 40px 50px; border-top: 1px solid #f0f2f5"
//               >
//                 <p
//                   style="
//                     margin: 20px 0 0 0;
//                     color: #a0aec0;
//                     font-size: 12px;
//                     text-align: center;
//                     line-height: 1.5;
//                   "
//                 >
//                   &copy; 2026 Your Company Inc. All rights reserved.<br />
//                   123 Corporate Way, Suite 100, San Francisco, CA 94107
//                 </p>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>
