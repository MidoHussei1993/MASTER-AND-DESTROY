const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});
//get all project
projectSchema.statics.getProjects = async function () {
  const projects = await this.find();
  return projects;
};

projectSchema.statics.getProject = async function (id) {
  const project = await this.findById(id);
  return project;
};

const Project = mongoose.model("Project", projectSchema);
Project.findById;

function validateProject(project) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
  });

  return schema.validate(project);
}

exports.validate = validateProject;
exports.Project = Project;
