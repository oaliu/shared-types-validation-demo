import { RequestHandler } from "express";

// Helper function to recursively trim string values within nested objects or arrays
const trimNestedValues = (obj: any): any => {
  // If the current value is a string, trim any leading or trailing whitespace
  if (typeof obj === "string") {
    return obj.trim();
  }

  // If the current value is an array, recursively apply the trimming function to each element
  if (Array.isArray(obj)) {
    return obj.map(trimNestedValues);
  }

  // If the current value is an object, recursively apply the trimming function to its properties
  if (typeof obj === "object" && obj !== null) {
    const trimmedObj: { [key: string]: any } = {};
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        trimmedObj[key] = trimNestedValues(obj[key]);
      }
    }
    return trimmedObj;
  }

  // If the value is neither a string, array, nor object, return it as-is
  return obj;
};

// Middleware function to trim string values from the request body
const trimStrings: RequestHandler = (req, res, next) => {
  // If the request body exists, recursively trim all string values
  if (req.body) {
    req.body = trimNestedValues(req.body);
  }

  next();
};

export default trimStrings;
