import joi from "joi";

export const questionSchema = joi.object({
  question: joi.string().trim().min(3).required(),
  options: joi
    .array()
    .min(2)
    .max(5)
    .message("a question must have atleast 2 options and max 5")
    .unique((a, b) => a.text.toString().trim() == b.text.toString().trim())
    .message("options must not have duplicates"),
});
