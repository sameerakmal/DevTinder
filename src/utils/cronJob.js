const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sgMail = require("@sendgrid/mail");

cron.schedule("06 17 * * *", async() => {
    try{
        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequestModel.find({
            status : "interested",
            createdAt : {
                $gte : yesterdayStart,
                $lt : yesterdayEnd
            },
        }).populate("fromUserId toUserId");

        const listOfEmails = [
            ...new Set(pendingRequests.map((req) => req.toUserId.emailId))
        ];

        console.log(listOfEmails);

        for(const email of listOfEmails){

            const msg = {
                to: email,
                from: "akazakoyuki2gether@gmail.com",
                subject: "You Have Pending Connection Requests",
                text: `Hello,

You have new connection requests waiting for your response on DevTinder. Please take a moment to review them so you don’t miss potential connections.

Log in to your account to check and respond to these requests.

Best regards,
DevTinder Team`,
            };
            
            await sgMail.send(msg);
        }
        
        

    }catch(err){
        console.error(err);
    }
})