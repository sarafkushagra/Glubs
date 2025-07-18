const Host = require("../schema/host");
const Event = require("../schema/Event");
const User = require("../schema/User");

exports.getHostProfile = async (req, res) => {
  const host = await Host.findById(req.host.id);
  res.json({ host });
};

exports.updateHost = async (req, res) => {
  const updated = await Host.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ updated });
};

exports.deleteHost = async (req, res) => {
  await Host.findByIdAndDelete(req.params.id);
  res.json({ message: "Host deleted" });
};

exports.getMyEvents = async (req, res) => {
  const events = await Event.find({ host: req.host.id }).populate("participants");
  res.json({ events });
};

exports.createEvent = async (req, res) => {
  const event = await Event.create({ ...req.body, host: req.host.id });
  const host = await Host.findById(req.host.id);
  host.hostedEvents.push(event._id);
  await host.save();
  res.status(201).json({ event });
};

exports.getParticipantsForEvent = async (req, res) => {
  const event = await Event.findById(req.params.eventId).populate("participants");
  if (!event || event.host.toString() !== req.host.id) {
    return res.status(403).json({ message: "Not allowed" });
  }
  res.json({ participants: event.participants });
};
