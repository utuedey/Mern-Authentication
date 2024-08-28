const { mailtrapClient, sender} = require('./mailtrap.config');
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require('./emailTemplates');

exports.sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Email sent successfully", response)

    } catch (error) {
        console.log("Error sending verification", error);
        throw new Error(`Error sending verification email: ${error}`)

    }
}

exports.sendWelcomeEmail = async (email, username) => {
    const recipient = [{ email }];

    try {  
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "48fd1f8f-92d4-44be-9488-e89ba32fe370",
            template_variables: {
              "company_info_name": "ExtraordinaryJoble",
              "name": username
            }
          })

        console.log("Welcome email sent successfully", response)

    } catch (error) {
        console.log("Error sending welcome email", error);
        throw new Error(`Error sending welcome email: ${error}`)

    }
}

exports.sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {  
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })            

        console.log("Password Reset email sent successfully", response)

    } catch (error) {
        console.log("Error sending password reset email", error);
        throw new Error(`Error sending password reset email: ${error}`)

    }
}

exports.sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {  
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        })            

        console.log("Password Reset email sent successfully", response)

    } catch (error) {
        console.log("Error sending password reset success email", error);
        throw new Error(`Error sending password reset success email: ${error}`)

    }
}