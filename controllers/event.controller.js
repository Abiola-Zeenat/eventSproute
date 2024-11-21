
import Event from "../model/event.model.js";
import nodemailer from "nodemailer";
import User from "../model/user.model.js";

/**
 * @desc Create an event
 * @Route POST /api/events
 * @Access private, organizer only
 */

const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const eventExists = await Event.findOne({ title });
    if (eventExists)
      return res.status(400).json({ message: "Event already created" });

    const createdEvent = await Event.create({
      title,
      description,
      date,
      createdBy: req.user._id,
    });
    res.status(200).json({
      success: true,
      message: "Event created successfully",
      data: createdEvent,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error creating an event : ${error.message}`,
    });
  }
};

/**
 * @desc Get all events
 * @Route GET /api/events
 * @Access public
 */
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json({
      success: true,
      message: "All Events fetched successfully",
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching all events : ${error.message}`,
    });
  }
};

/**
 * @desc Get an event by Id
 * @Route GET /api/events/:id
 * @Access public
 */
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event)
      return res
        .status(404)
        .json({ message: `The event with the ID ${id} was not found` });

    res.status(200).json({
      success: true,
      message: " Event fetched successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching event : ${error.message}`,
    });
  }
};

/**
 * @desc Update an event by Id
 * @Route PUT /api/events/:id
 * @Access private, organizer only
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event)
      return res
        .status(404)
        .json({ message: `The event with the ID ${id} was not found` });

    if (req.user._id.toString() === event.createdBy.toString()) {
      const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: " Event updated successfully",
        data: updatedEvent,
      });
    } else
      res.status(403).json({
        message: "Only the organizer is allowed to update the event.",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error updating event : ${error.message}`,
    });
  }
};

/**
 * @desc Delete an event by Id
 * @Route DELETE /api/events/:id
 * @Access private, organizer or admin
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event)
      return res
        .status(404)
        .json({ message: `The event with the ID ${id} was not found` });

    if (
      req.user.role === "admin" ||
      req.user._id.toString() === event.createdBy.toString()
    ) {
      const deletedEvent = await Event.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        data: deletedEvent,
        message: " Event deleted successfully",
      });
    } else
      res.status(403).json({ message: "not authorized to delete the event." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error updating event : ${error.message}`,
    });
  }
};

/**
 * @desc  Sends an email to all registered users about the event
 * @Route POST /api/events/:id/notify
 * @Access public
 */
const sendEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id, "title date");
    console.log(event);
    if (!event)
      return res
        .status(404)
        .json({ message: `The event with the ID ${id} was not found` });

    const users = await User.find({}, "email"); // Fetch only the 'email' field
    const emailList = users.map((user) => user.email).join(",");

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.NODE_MAILER_USER, // sender address
      to: emailList, // list of receivers
      subject: "Event Notification", // Subject line
      text: `This is to notify you of the event, ${event.title} that will be coming up on ${event.date}`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      success: true,
      message: " Email sent successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error sending mail : ${error.message}`,
    });
  }
};

export {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  sendEmail,
};
