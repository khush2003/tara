import { validator } from "@hono/hono/validator";
import type mongoose from "mongoose";

export const schemaValidatorFromMongoose = (schema: mongoose.Schema, propertyName?: string) => 
    validator("json", (value, c) => {
    let errorMSG = "Error: ";
    const validationErrors = [];
    if (propertyName && typeof value === 'object' && propertyName in value) {
            value = value[propertyName];
    } else if (propertyName && typeof value === 'object' && !(propertyName in value)) {
        validationErrors.push(`Property ${propertyName} is missing`);
    }
    if (schema.obj && value) {
        for (const key in schema.obj) {
            if (Object.prototype.hasOwnProperty.call(schema.obj, key)) {
                if (schema.obj[key] && typeof schema.obj[key] === 'object' && 'required' in schema.obj[key] && schema.obj[key].required && !Object.prototype.hasOwnProperty.call(value, key)) {
                    validationErrors.push(`Missing required field: ${key}`);
                } else if (typeof schema.obj[key] === 'object' && 'type' in schema.obj[key] && schema.obj[key].type?.name && (key in value) && typeof value[key] !== schema.obj[key].type.name.toLowerCase()) {
                    validationErrors.push(`Invalid type for field: ${key}`);
                }
                 else if (typeof schema.obj[key] === 'object' && 'enum' in schema.obj[key] && Array.isArray(schema.obj[key].enum) && (key in value) && !schema.obj[key].enum.includes(value[key])) {
                    validationErrors.push(`Invalid enum value for field: ${key}`);
                }
            }
        }
    }
    if (validationErrors.length > 0) {
        errorMSG +=  validationErrors.join(", ");
        return c.text(errorMSG, 400);
    }
    
    return value;
});
