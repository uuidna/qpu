// A tool's JSON Schema as the MCP server takes it on a Worker. Given a raw JSON Schema, the MCP plugin wraps it with
// the SDK's default validator, which compiles each schema from a string: a Worker forbids that, and every MCP request
// failed there. Wrapped here with the SDK's Workers validator, which interprets the schema, it is passed through.
import { fromJsonSchema } from '@modelcontextprotocol/server'
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/server/validators/cf-worker'

/** The validator a Worker can run: it reads a schema instead of compiling it. */
export const workerValidator = new CfWorkerJsonSchemaValidator()

/** A raw JSON Schema as a Standard Schema validated by the Workers validator. */
export const workerSchema = (schema: unknown) => fromJsonSchema(schema as Parameters<typeof fromJsonSchema>[0], workerValidator) as never
