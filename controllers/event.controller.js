import Event from "../model/event.model.js";
import nodemailer from "nodemailer";
import User from "../model/user.model.js";
import {
  validateCreateEvent,
  validateUpdateEvent,
} from "../validation/validateEvent.js";

/**
 * @desc upload an event banner
 * @Route POST /api/events/upload
 * @Access private, organizer only
 */
const uploadBanner = async (req, res) => {
  try {
    // Handle the uploaded file
    const imgURL = req.file.path; // Path to the uploaded file
    res.status(200).json({
      success: true,
      message: "banner uploaded successfully!",
      file: imgURL,
    });
  } catch (error) {
    throw {
      message: `Error uploading an event banner: ${error.message}`,
    };
  }
};

/**
 * @desc Create an event
 * @Route POST /api/events
 * @Access private, organizer only
 */
const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const { error } = validateCreateEvent(req.body);
    if (error)
      throw {
        status: 400,
        message: error.details[0].message,
      };
    const eventExists = await Event.findOne({ title });
    if (eventExists) throw { status: 400, message: "Event already created" };

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
    throw {
      message: `Error creating an event : ${error.message}`,
    };
  }
};

/**
 * @desc Get all events
 * @Route GET /api/events
 * @Access public
 */
const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;

    const events = await Event.find()
      .skip(startIndex) // Skip the previous pages
      .limit(parseInt(limit)) // Limit the number of results per page
      .exec();

    const total = await Event.countDocuments(); // Total number of events

    res.status(200).json({
      success: true,
      message: "All Events fetched successfully",
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    throw {
      message: `Error fetching all events : ${error.message}`,
    };
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
      throw {
        status: 404,
        message: `The event with the ID ${id} was not found`,
      };

    res.status(200).json({
      success: true,
      message: " Event fetched successfully",
      data: event,
    });
  } catch (error) {
    throw { message: `Error fetching event : ${error.message}` };
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
    const { error } = validateUpdateEvent(req.body);
    if (error)
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });

    const event = await Event.findById(id);
    if (!event)
      throw {
        status: 404,
        message: `The event with the ID ${id} was not found`,
      };

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
      throw {
        staus: 403,
        message: "Only the organizer is allowed to update the event.",
      };
  } catch (error) {
    throw {
      message: `Error updating event : ${error.message}`,
    };
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
     throw {status: 404, message: `The event with the ID ${id} was not found` };

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
      throw{status:403, message: "not authorized to delete the event." };
  } catch (error) {
    throw{
      message: `Error updating event : ${error.message}`,
    };
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
      throw {status: 404, message: `The event with the ID ${id} was not found` };

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
   
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      success: true,
      message: " Email sent successfully",
      data: event,
    });
  } catch (error) {
    throw{
      message: `Error sending mail : ${error.message}`,
    };
  }
};

export {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  sendEmail,
  uploadBanner,
};
