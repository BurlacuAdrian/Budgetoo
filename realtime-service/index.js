require('dotenv').config({ path: '../.env' })
const nodemailer = require('nodemailer');
const { promisify } = require('util');
const express = require('express');
const app = express();
const { Models } = require('../db/db.js');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const { server } = require('./socketio.js');

const INVITE_SECRET_KEY = process.env.INVITE_SECRET_KEY

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const getInvitationMailOptions = async (sender, receiver) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ sender, receiver }, INVITE_SECRET_KEY, { expiresIn: '2d' }, (err, token) => {
            if (err) {
                console.error('Error signing JWT token:', err);
                reject(false);
            } else {
                const invitationUrl = `${process.env.API_URL}/v1/accept-invite/${token}`;

                resolve({
                    from: `"Budgetoo" <${process.env.EMAIL_ADDRESS}>`,
                    to: receiver,
                    subject: `Budget together invitation!`,
                    html: `
                    <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <h2>You're Invited!</h2>
                        <p style="font-size: 16px;">Hi there,</p>
                        <p style="font-size: 16px;">${sender} has invited you to join their budget planning. Click the button below to accept the invitation.</p>
                        <a href="${invitationUrl}" 
                           style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: bold; color: #fff; background-color: #000; border-radius: 5px; text-decoration: none; text-align: center;">
                           Accept Invitation
                        </a>
                        <p style="font-size: 14px; color: #666; margin-top: 20px;">
                            This invitation will expire in 48 hours. If you are having trouble viewing the button, click the link below:
                        </p>
                        <p style="font-size: 14px; color: #666; word-wrap: break-word;">
                            <a href="${invitationUrl}" style="color: #0066cc;">${invitationUrl}</a>
                        </p>
                    </body>
                    </html>
                `
                });
            }
        });
    });
};


app.use(express.json());

const sendMailAsync = promisify(transporter.sendMail.bind(transporter));

const sendInvitationMail = async (sender, receiver) => {
    try {
        console.log(`Sending mail from ${sender} to ${receiver}`)
        const text = await getInvitationMailOptions(sender, receiver)

        //TODO removed while testing
        const info = await sendMailAsync(text);
        // console.log(text)
        console.log('Email sent:', info.response);
        return true;
    } catch (error) {
        console.log('Error sending email:', error);
        return false;
    }
}


app.post('/v1/invite', async (req, res, next) => {
    try {
        const verified = JSON.parse(req.header('Verified'));
        const { _id, email: senderEmail } = verified;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: `Member's email is required` });
        }

        const receiver = await Models.User.findOne({ email })
        if (!receiver) {
            return res.status(404).json({ error: 'User with this email was not found.' });
        }
        const sender = await Models.User.findById(_id)
        if (sender.id == receiver.id) {
            return res.status(400).json({ error: `Cannot invite yourself.` });
        }

        const success = await sendInvitationMail(senderEmail, email);

        if (success) {
            return res.status(200).json({ message: 'Invitation email sent successfully.' });
        } else {
            return res.status(500).json({ error: 'Failed to send invitation email.' });
        }
    } catch (error) {
        console.error('Error in /v1/invite route:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/v1/accept-invite/:token', async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.redirect(`/invite-result?status=failed&reason=missing_token`);
        }

        jwt.verify(token, INVITE_SECRET_KEY, {}, async (err, decoded) => {
            if (err || !(decoded && decoded.sender && decoded.receiver)) {
                return res.redirect(`/invite-result?status=failed&reason=invalid_token`);
            }

            const sender = await Models.User.findOne({ email: decoded.sender });
            const receiver = await Models.User.findOne({ email: decoded.receiver });

            if (!sender || !receiver) {
                return res.redirect(`/invite-result?status=failed&reason=user_not_found`);
            }

            const existingFamily = await Models.Family.findOne({ users: receiver._id });
            if (existingFamily) {
                return res.redirect(`/invite-result?status=failed&reason=already_in_family`);
            }

            let family = await Models.Family.findOne({ users: sender._id });

            if (family) {
                if (!family.users.includes(receiver._id)) {
                    family.users.push(receiver._id);
                    await family.save();
                }
                return res.redirect(`/invite-result?status=success`);
            }

            family = await Models.Family.create({
                users: [sender._id, receiver._id],
                budgets: {}
            });

            console.log(family);
            return res.redirect(`/invite-result?status=success`);
        });

    } catch (error) {
        console.error('Error in /v1/accept-invite route:', error);
        return res.redirect(`/invite-result?status=failed&reason=internal_error`);
    }
});


app.post('/v1/leave', async (req, res, next) => {
    try {
        const verified = JSON.parse(req.header('Verified'));
        const { _id } = verified

        const family = await Models.Family.findOne({ users: _id });

        if (!family) {
            return res.status(404).json({ message: 'Not part of a family.' });
        }

        const userIdToRemove = new mongoose.Types.ObjectId(_id);

        if (family.users.some(user => user.equals(userIdToRemove))) {
            family.users = family.users.filter(user => !user.equals(userIdToRemove));

            if (family.users.length >= 2) {
                await family.save();
            } else {
                await family.deleteOne();
            }
        }


        return res.status(200).json({ message: 'Successfully left.' });

    } catch (error) {
        console.error('Error in /v1/leave route:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.RT_MS_PORT || 8024;
app.listen(PORT, () => {
    console.log(`Realtime-service running on port ${process.env.RT_MS_PORT}`);
});


const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT || 8025
server.listen(SOCKET_IO_PORT, () => {
    console.log(`Socket io server listening on port ${SOCKET_IO_PORT}`)
})
