import { Schema, model, Types } from "mongoose";

/*
title (string, required)
description (string)
date (date, required)
createdBy (user ID of the event organizer)

*/
const EventSchema = Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    createdBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Event = model("Event", EventSchema);

export default Event;
