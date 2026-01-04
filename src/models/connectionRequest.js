const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        toUserId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        status : {
            type : String,
            required : true,
            enum : {
                values : ["interested", "ignored", "accepted", "rejected"],
                message : `{VALUE} is incorrect status type!!`
            }
        }
    },
    {
        Timestamp : true
    }
);

connectionRequestSchema.index({fromUserId : 1, toUserId : 1});

connectionRequestSchema.pre("save", function() {
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!!");
    }
})

const ConnectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;