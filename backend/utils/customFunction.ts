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
                } else if (typeof schema.obj[key] === 'object' && 'type' in schema.obj[key] && schema.obj[key].type?.name && (key in value)) {
                    if (schema.obj[key].type.name.toLowerCase() === 'SchemaObjectId'.toLowerCase()  && typeof value[key] == 'string') {
                        // do nothing
                    } else if ((key in value) && typeof value[key] !== schema.obj[key].type.name.toLowerCase()) {
                        validationErrors.push(`Invalid type for field: ${key}`);
                    }
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
    console.log(value);
    if  (propertyName) {return { [propertyName]: value }} else return value;
});

export const customValidateJsonMiddleware = (requiredFields: { [key: string]: StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor }) => 
    validator("json", (value, c) => {
    let errorMSG = "Error: ";
    const validationErrors: string[] = [];

    if (typeof value !== 'object' || value === null) {
        validationErrors.push("Invalid JSON");
    } else {
        for (const field in requiredFields) {
            if (Object.prototype.hasOwnProperty.call(requiredFields, field)) {
                const fieldType = requiredFields[field];
                if (!(field in value)) {
                    validationErrors.push(`Missing required field: ${field}`);
                } else {
                    const actualType = typeof value[field];
                    const expectedType = fieldType.name.toLowerCase(); 
            
                    if (actualType !== expectedType) {
                      validationErrors.push(`Invalid type for field '${field}'. Expected ${expectedType}, but got ${actualType}.`);
                    }
                  }
            }
        }
    }

    if (validationErrors.length > 0) {
        errorMSG += validationErrors.join(", ");
        return c.text(errorMSG, 400);
    }

    return value;
});

import { z } from 'zod';

export const validateJsonMiddleware = (schema: z.ZodSchema) => 
  validator("json", (value, c) => {
    // Validate the incoming JSON using the zod schema
    const result = schema.safeParse(value);

    // If validation fails, return the error message
    if (!result.success) {
      return c.text(`Error: ${result.error.message}`, 400);
    }

    // If validation passes, return the parsed data
    return result.data;
  });

export async function catchError<T>(promise: Promise<T>): Promise<[T | undefined, Error | undefined]> {
    try {
      const data = await promise;
      return [data, undefined] as [T, undefined];
    } catch (err) {
      return [undefined, err] as [undefined, Error];
    }
}
