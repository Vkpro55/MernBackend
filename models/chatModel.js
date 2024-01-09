const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },// trim name so that no trialing spacing after or before the name "ABC " , "     ABC  ",
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } /*In Mongoose, when you include { timestamps: true } as an option when defining a schema,
  it automatically adds two fields to your documents: createdAt and updatedAt. These fields are automatically managed by Mongoose,
   and they capture the timestamps when a document is created and when it was last updated.*/
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;