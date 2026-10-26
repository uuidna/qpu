// The programmatic surface of Payload CMS as its documentation and source state it (payloadcms.com/docs, payloadcms/payload on main), read on 2026-10-26:
// every field type with the JSON Schema and GraphQL type it generates, every operation with its REST path and GraphQL form, every where
// operator, query option, hook, access function, version option, realtime channel, the MCP plugin's tools, and the standards each part
// is described by. A table with URLs, like STANDARDS and CATALOGUE: the textbook step re-reads the sources and measures the drift as leads;
// the theorems (textbook_payload_*) state the combinatorics the kernel checks; the payload tool's schemas door computes from this alone.
export const PAYLOAD_SURFACE = {
 "readOn": "2026-10-26",
 "payloadVersion": "3.x (docs read 2026-10-26; source at payloadcms/payload main)",
 "docs": "https://payloadcms.com/docs",
 "fieldTypes": [
  {
   "type": "text",
   "data": true,
   "hasMany": "optional",
   "nests": false,
   "jsonSchema": {
    "type": [
     "string",
     "null"
    ]
   },
   "jsonSchemaMany": {
    "type": [
     "array",
     "null"
    ],
    "items": {
     "type": "string"
    }
   },
   "graphql": "GraphQLString",
   "url": "https://payloadcms.com/docs/fields/text"
  },
  {
   "type": "textarea",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "type": [
     "string",
     "null"
    ],
    "source": "configToJSONSchema.ts (code/date/email/slug/textarea share the string case)"
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLString",
   "url": "https://payloadcms.com/docs/fields/textarea"
  },
  {
   "type": "number",
   "data": true,
   "hasMany": "optional",
   "nests": false,
   "jsonSchema": {
    "type": [
     "number",
     "null"
    ]
   },
   "jsonSchemaMany": {
    "type": [
     "array",
     "null"
    ],
    "items": {
     "type": "number"
    }
   },
   "graphql": "GraphQLFloat (GraphQLInt when name === \"id\")",
   "url": "https://payloadcms.com/docs/fields/number"
  },
  {
   "type": "email",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "type": [
     "string",
     "null"
    ],
    "note": "no format keyword emitted; validation enforces email at runtime"
   },
   "jsonSchemaMany": null,
   "graphql": "EmailAddressResolver (graphql-scalars)",
   "url": "https://payloadcms.com/docs/fields/email"
  },
  {
   "type": "code",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "type": [
     "string",
     "null"
    ]
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLString",
   "url": "https://payloadcms.com/docs/fields/code"
  },
  {
   "type": "json",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "default": {
     "type": [
      "object",
      "array",
      "string",
      "number",
      "boolean",
      "null"
     ]
    },
    "withJsonSchemaOption": "the field's jsonSchema.schema is used verbatim"
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLJSON",
   "url": "https://payloadcms.com/docs/fields/json"
  },
  {
   "type": "date",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "type": [
     "string",
     "null"
    ],
    "note": "stored as YYYY-MM-DDTHH:mm:ss.SSSZ (ISO 8601, UTC); no format keyword emitted; timezone:true adds a sibling select `<name>_tz` -> $ref #/$defs/supportedTimezones"
   },
   "jsonSchemaMany": null,
   "graphql": "DateTimeResolver (graphql-scalars)",
   "url": "https://payloadcms.com/docs/fields/date"
  },
  {
   "type": "point",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "type": [
     "array",
     "null"
    ],
    "items": [
     {
      "type": "number"
     },
     {
      "type": "number"
     }
    ],
    "minItems": 2,
    "maxItems": 2,
    "note": "[longitude, latitude]; GeoJSON Point in the db; not supported on SQLite"
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLList(GraphQLNonNull(GraphQLFloat))",
   "url": "https://payloadcms.com/docs/fields/point"
  },
  {
   "type": "checkbox",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "type": [
     "boolean",
     "null"
    ]
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLBoolean",
   "url": "https://payloadcms.com/docs/fields/checkbox"
  },
  {
   "type": "select",
   "data": true,
   "hasMany": "optional",
   "nests": false,
   "jsonSchema": {
    "type": [
     "string",
     "null"
    ],
    "enum": "[option values]"
   },
   "jsonSchemaMany": {
    "type": [
     "array",
     "null"
    ],
    "items": {
     "type": "string",
     "enum": "[option values]"
    }
   },
   "graphql": "GraphQLEnumType (named parent+field name; values reformatted for GraphQL)",
   "url": "https://payloadcms.com/docs/fields/select"
  },
  {
   "type": "radio",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "type": [
     "string",
     "null"
    ],
    "enum": "[option values]",
    "interfaceName": "$ref"
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLEnumType (named parent+field name)",
   "url": "https://payloadcms.com/docs/fields/radio"
  },
  {
   "type": "relationship",
   "data": true,
   "hasMany": "optional",
   "nests": false,
   "jsonSchema": {
    "output": {
     "single": {
      "oneOf": [
       "<id type> (nullable)",
       {
        "$ref": "#/$defs/<collection>"
       }
      ]
     },
     "hasMany": {
      "type": "array",
      "items": {
       "oneOf": [
        "<id type>",
        {
         "$ref": "#/$defs/<collection>"
        }
       ]
      }
     },
     "polymorphicSingle": {
      "oneOf": [
       "per collection: { type: object, properties: { relationTo: { const: slug }, value: { oneOf: [id, $ref] } }, required: [value, relationTo] }"
      ]
     },
     "polymorphicHasMany": {
      "type": "array",
      "items": "<polymorphic object oneOf>"
     }
    },
    "input": "id types only, no $ref (collectionsInput when generateInputTypes)",
    "stored": {
     "single": "id",
     "hasMany": "id[]",
     "polymorphicSingle": "{ relationTo, value: id }",
     "polymorphicHasMany": "{ relationTo, value }[]"
    }
   },
   "jsonSchemaMany": null,
   "graphql": "<RelatedCollection> object type",
   "url": "https://payloadcms.com/docs/fields/relationship"
  },
  {
   "type": "upload",
   "data": true,
   "hasMany": "optional",
   "nests": false,
   "jsonSchema": {
    "sameAs": "relationship (output oneOf id | $ref; polymorphic { relationTo, value }; hasMany array)",
    "note": "relationTo must be upload-enabled collections"
   },
   "jsonSchemaMany": null,
   "graphql": "same pattern as relationship (upload collection type, or <name>_Relationship wrapper); hasMany -> GraphQLList(GraphQLNonNull(type)); does not filter GraphQL-disabled collections",
   "url": "https://payloadcms.com/docs/fields/upload"
  },
  {
   "type": "array",
   "data": true,
   "hasMany": false,
   "nests": true,
   "jsonSchema": {
    "type": [
     "array",
     "null"
    ],
    "items": {
     "type": "object",
     "additionalProperties": false,
     "properties": "<sub-fields>",
     "required": "<required sub-fields>"
    },
    "interfaceName": "$ref to hoisted definition",
    "note": "inferred: rows carry an `id` at runtime (regenerated on paste per blocks docs); the generator does not add an id property per the source read"
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLList(GraphQLNonNull(<array object type named from interfaceName or parent+field>))",
   "url": "https://payloadcms.com/docs/fields/array"
  },
  {
   "type": "blocks",
   "data": true,
   "hasMany": false,
   "nests": true,
   "jsonSchema": {
    "type": [
     "array",
     "null"
    ],
    "items": {
     "oneOf": [
      "per block: { type: object, additionalProperties: false, properties: { ...blockFields, blockType: { const: slug } }, required: [blockType, ...] } or $ref to block interface unless forceInlineBlocks"
     ]
    },
    "noBlocks": {
     "items": {}
    },
    "stored": "{ blockType, blockName?, id, ...fields }[]",
    "note": "blockName/id not emitted by the generator per source read; inferred at runtime"
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLList(GraphQLNonNull(GraphQLUnionType of one object type per block))",
   "url": "https://payloadcms.com/docs/fields/blocks"
  },
  {
   "type": "group",
   "data": true,
   "hasMany": false,
   "nests": true,
   "jsonSchema": {
    "named": {
     "type": [
      "object",
      "null"
     ],
     "additionalProperties": false,
     "properties": "<sub-fields>"
    },
    "unnamed": "no schema of its own; sub-fields hoisted into parent",
    "interfaceName": "$ref"
   },
   "jsonSchemaMany": null,
   "graphql": null,
   "url": "https://payloadcms.com/docs/fields/group"
  },
  {
   "type": "row",
   "data": false,
   "hasMany": false,
   "nests": true,
   "jsonSchema": "none (no case in fieldsToJSONSchema; sub-fields hoisted into parent)",
   "jsonSchemaMany": null,
   "graphql": "none (sub-fields added to the parent object)",
   "url": "https://payloadcms.com/docs/fields/row"
  },
  {
   "type": "collapsible",
   "data": false,
   "hasMany": false,
   "nests": true,
   "jsonSchema": "none (sub-fields hoisted into parent)",
   "jsonSchemaMany": null,
   "graphql": "none (sub-fields added to the parent object)",
   "url": "https://payloadcms.com/docs/fields/collapsible"
  },
  {
   "type": "tabs",
   "data": true,
   "hasMany": false,
   "nests": true,
   "jsonSchema": {
    "namedTab": {
     "type": [
      "object",
      "null"
     ],
     "additionalProperties": false,
     "properties": "<tab fields>",
     "interfaceName": "$ref"
    },
    "unnamedTab": "fields hoisted into parent",
    "note": "the generator case is `tab` (TabAsField), not `tabs`"
   },
   "jsonSchemaMany": null,
   "graphql": null,
   "url": "https://payloadcms.com/docs/fields/tabs"
  },
  {
   "type": "richText",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "fromEditor": "the editor adapter's jsonSchema is spread in when provided (Lexical: SerializedEditorState { root: { type: \"root\", children: [...] } })",
    "fallback": {
     "type": [
      "array",
      "null"
     ],
     "items": {
      "type": "object"
     }
    },
    "noEditor": "throws"
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLJSON (with a `depth` Int argument)",
   "url": "https://payloadcms.com/docs/fields/rich-text"
  },
  {
   "type": "ui",
   "data": false,
   "hasMany": false,
   "nests": false,
   "jsonSchema": "none",
   "jsonSchemaMany": null,
   "graphql": "none (not a key in fieldToSchemaMap)",
   "url": "https://payloadcms.com/docs/fields/ui"
  },
  {
   "type": "join",
   "data": false,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "type": "object",
    "required": true,
    "properties": {
     "docs": {
      "type": "array",
      "items": {
       "oneOf": [
        "<id type>",
        {
         "$ref": "#/$defs/<collection>"
        }
       ],
       "polymorphic": "{ relationTo: const, value }"
      }
     },
     "hasNextPage": {
      "type": "boolean"
     },
     "totalDocs": {
      "type": "number"
     }
    },
    "note": "excluded from input/_input types; multi-collection join `required` lists collectionSlug (source quirk)"
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLObjectType { docs: non-null list (GraphQLJSON for multi-collection), hasNextPage: Boolean!, totalDocs: Int } with args sort, limit, where, count",
   "url": "https://payloadcms.com/docs/fields/join"
  },
  {
   "type": "slug",
   "data": true,
   "hasMany": false,
   "nests": false,
   "jsonSchema": {
    "type": [
     "string",
     "null"
    ],
    "note": "inferred: present in main types.ts Field union and in fieldsToJSONSchema string case; /docs/fields/slug returns 404 (undocumented as of read)"
   },
   "jsonSchemaMany": null,
   "graphql": "GraphQLString",
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/fields/config/types.ts"
  }
 ],
 "operations": [
  {
   "name": "find",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/{collection}"
   },
   "graphql": {
    "kind": "query",
    "name": "{PluralLabel}"
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "findByID",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/{collection}/{id}"
   },
   "graphql": {
    "kind": "query",
    "name": "{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "count",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/{collection}/count"
   },
   "graphql": {
    "kind": "query",
    "name": "count{PluralLabel}"
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "findDistinct",
   "scope": "collection",
   "variant": null,
   "rest": null,
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "create",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{collection}"
   },
   "graphql": {
    "kind": "mutation",
    "name": "create{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "update",
   "scope": "collection",
   "variant": "byID",
   "rest": {
    "method": "PATCH",
    "path": "/api/{collection}/{id}"
   },
   "graphql": {
    "kind": "mutation",
    "name": "update{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "update",
   "scope": "collection",
   "variant": "bulkByWhere",
   "rest": {
    "method": "PATCH",
    "path": "/api/{collection}?where[...]"
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "delete",
   "scope": "collection",
   "variant": "byID",
   "rest": {
    "method": "DELETE",
    "path": "/api/{collection}/{id}"
   },
   "graphql": {
    "kind": "mutation",
    "name": "delete{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "delete",
   "scope": "collection",
   "variant": "bulkByWhere",
   "rest": {
    "method": "DELETE",
    "path": "/api/{collection}?where[...]"
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "duplicate",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{collection}/{id}/duplicate"
   },
   "graphql": {
    "kind": "mutation",
    "name": "duplicate{SingularLabel}"
   },
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/collections/endpoints/index.ts"
  },
  {
   "name": "validate",
   "scope": "collection",
   "variant": "bulk",
   "rest": {
    "method": "POST",
    "path": "/api/{collection}/validate"
   },
   "graphql": {
    "kind": "mutation",
    "name": "validate{SingularLabel}"
   },
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/collections/endpoints/index.ts"
  },
  {
   "name": "validate",
   "scope": "collection",
   "variant": "byID",
   "rest": {
    "method": "POST",
    "path": "/api/{collection}/{id}/validate"
   },
   "graphql": {
    "kind": "mutation",
    "name": "validate{SingularLabel}"
   },
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/collections/endpoints/index.ts"
  },
  {
   "name": "renameFile",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{collection}/{id}/rename"
   },
   "graphql": {
    "kind": "mutation",
    "name": "renameFile{SingularLabel}"
   },
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/collections/endpoints/index.ts"
  },
  {
   "name": "findVersions",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/{collection}/versions"
   },
   "graphql": {
    "kind": "query",
    "name": "versions{PluralLabel}"
   },
   "url": "https://payloadcms.com/docs/versions/overview"
  },
  {
   "name": "findVersionByID",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/{collection}/versions/{id}"
   },
   "graphql": {
    "kind": "query",
    "name": "version{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/versions/overview"
  },
  {
   "name": "restoreVersion",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{collection}/versions/{id}"
   },
   "graphql": {
    "kind": "mutation",
    "name": "restoreVersion{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/versions/overview"
  },
  {
   "name": "countVersions",
   "scope": "collection",
   "variant": null,
   "rest": {
    "method": "none",
    "path": null
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/index.ts"
  },
  {
   "name": "docAccess",
   "scope": "access",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{collection}/access/{id?}"
   },
   "graphql": {
    "kind": "query",
    "name": "docAccess{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "findGlobal",
   "scope": "global",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/globals/{global}"
   },
   "graphql": {
    "kind": "query",
    "name": "{GlobalLabel}"
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "updateGlobal",
   "scope": "global",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/globals/{global}"
   },
   "graphql": {
    "kind": "mutation",
    "name": "update{GlobalLabel}"
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "validateGlobal",
   "scope": "global",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/globals/{global}/validate"
   },
   "graphql": {
    "kind": "mutation",
    "name": "validate{GlobalLabel}"
   },
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/globals/endpoints/index.ts"
  },
  {
   "name": "findGlobalVersions",
   "scope": "global",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/globals/{global}/versions"
   },
   "graphql": {
    "kind": "query",
    "name": "versions{GlobalLabel}"
   },
   "url": "https://payloadcms.com/docs/versions/overview"
  },
  {
   "name": "findGlobalVersionByID",
   "scope": "global",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/globals/{global}/versions/{id}"
   },
   "graphql": {
    "kind": "query",
    "name": "version{GlobalLabel}"
   },
   "url": "https://payloadcms.com/docs/versions/overview"
  },
  {
   "name": "restoreGlobalVersion",
   "scope": "global",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/globals/{global}/versions/{id}"
   },
   "graphql": {
    "kind": "mutation",
    "name": "restoreVersion{GlobalLabel}"
   },
   "url": "https://payloadcms.com/docs/versions/overview"
  },
  {
   "name": "countGlobalVersions",
   "scope": "global",
   "variant": null,
   "rest": {
    "method": "none",
    "path": null
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/index.ts"
  },
  {
   "name": "globalDocAccess",
   "scope": "access",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/globals/{global}/access"
   },
   "graphql": {
    "kind": "query",
    "name": "docAccess{GlobalLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "access",
   "scope": "access",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/access"
   },
   "graphql": {
    "kind": "query",
    "name": "Access"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "login",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{users}/login"
   },
   "graphql": {
    "kind": "mutation",
    "name": "login{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "logout",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{users}/logout?allSessions=false"
   },
   "graphql": {
    "kind": "mutation",
    "name": "logout{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "refresh",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{users}/refresh-token"
   },
   "graphql": {
    "kind": "mutation",
    "name": "refreshToken{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "me",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/{users}/me"
   },
   "graphql": {
    "kind": "query",
    "name": "me{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "forgotPassword",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{users}/forgot-password"
   },
   "graphql": {
    "kind": "mutation",
    "name": "forgotPassword{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "resetPassword",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{users}/reset-password"
   },
   "graphql": {
    "kind": "mutation",
    "name": "resetPassword{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "unlock",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{users}/unlock"
   },
   "graphql": {
    "kind": "mutation",
    "name": "unlock{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "verifyEmail",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{users}/verify/{token}"
   },
   "graphql": {
    "kind": "mutation",
    "name": "verifyEmail{SingularLabel}"
   },
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "name": "registerFirstUser",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{users}/first-register"
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/auth/endpoints/index.ts"
  },
  {
   "name": "initialized",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/{users}/init"
   },
   "graphql": {
    "kind": "query",
    "name": "initialized{SingularLabel}"
   },
   "url": "https://github.com/payloadcms/payload/blob/main/packages/payload/src/auth/endpoints/index.ts"
  },
  {
   "name": "revealAPIKey",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/{users}/{id}/api-key/reveal"
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/authentication/api-keys"
  },
  {
   "name": "auth",
   "scope": "auth",
   "variant": null,
   "rest": {
    "method": "none",
    "path": null
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "name": "findPreference",
   "scope": "preferences",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/payload-preferences/{key}"
   },
   "graphql": {
    "kind": "query",
    "name": "Preference"
   },
   "url": "https://payloadcms.com/docs/rest-api/overview"
  },
  {
   "name": "updatePreference",
   "scope": "preferences",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/payload-preferences/{key}"
   },
   "graphql": {
    "kind": "mutation",
    "name": "updatePreference"
   },
   "url": "https://payloadcms.com/docs/rest-api/overview"
  },
  {
   "name": "deletePreference",
   "scope": "preferences",
   "variant": null,
   "rest": {
    "method": "DELETE",
    "path": "/api/payload-preferences/{key}"
   },
   "graphql": {
    "kind": "mutation",
    "name": "deletePreference"
   },
   "url": "https://payloadcms.com/docs/rest-api/overview"
  },
  {
   "name": "jobs.run",
   "scope": "jobs",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/payload-jobs/run?queue=&limit=&allQueues="
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/jobs-queue/queues"
  },
  {
   "name": "jobs.handleSchedules",
   "scope": "jobs",
   "variant": null,
   "rest": {
    "method": "GET",
    "path": "/api/payload-jobs/handle-schedules?queue="
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/jobs-queue/overview"
  },
  {
   "name": "jobs.queue",
   "scope": "jobs",
   "variant": null,
   "rest": {
    "method": "none",
    "path": null
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/jobs-queue/jobs"
  },
  {
   "name": "jobs.runByID",
   "scope": "jobs",
   "variant": null,
   "rest": {
    "method": "none",
    "path": null
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/jobs-queue/queues"
  },
  {
   "name": "jobs.cancel",
   "scope": "jobs",
   "variant": null,
   "rest": {
    "method": "none",
    "path": null
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/jobs-queue/jobs"
  },
  {
   "name": "jobs.cancelByID",
   "scope": "jobs",
   "variant": null,
   "rest": {
    "method": "none",
    "path": null
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/jobs-queue/jobs"
  },
  {
   "name": "customEndpoint",
   "scope": "custom",
   "variant": null,
   "rest": {
    "method": "any",
    "path": "/api{path} | /api/{collection}{path} | /api/globals/{global}{path}"
   },
   "graphql": {
    "kind": "none",
    "name": null
   },
   "url": "https://payloadcms.com/docs/rest-api/overview"
  },
  {
   "name": "graphql",
   "scope": "graphql",
   "variant": null,
   "rest": {
    "method": "POST",
    "path": "/api/graphql"
   },
   "graphql": {
    "kind": "endpoint",
    "name": null
   },
   "url": "https://payloadcms.com/docs/graphql/overview"
  }
 ],
 "whereOperators": [
  {
   "operator": "equals",
   "meaning": "exact equality",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "not_equals",
   "meaning": "inequality",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "like",
   "meaning": "case-insensitive; every word present in any order",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "not_like",
   "meaning": "negation of like (in validOperators; not on the docs page)",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "contains",
   "meaning": "case-insensitive substring",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "in",
   "meaning": "value in comma-delimited list",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "not_in",
   "meaning": "value not in list",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "all",
   "meaning": "contains all listed values",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "exists",
   "meaning": "true/false presence",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "greater_than",
   "meaning": ">",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "greater_than_equal",
   "meaning": ">=",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "less_than",
   "meaning": "<",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "less_than_equal",
   "meaning": "<=",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "near",
   "meaning": "[lng, lat, maxDistanceMeters|null, minDistanceMeters|null]; sorted nearest first",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "within",
   "meaning": "inside a GeoJSON polygon",
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "operator": "intersects",
   "meaning": "intersects a GeoJSON polygon",
   "url": "https://payloadcms.com/docs/queries/overview"
  }
 ],
 "queryOptions": [
  {
   "option": "depth",
   "appliesTo": [
    "find",
    "findByID",
    "count",
    "findVersions",
    "findVersionByID",
    "findGlobal",
    "findGlobalVersions",
    "findGlobalVersionByID",
    "create",
    "update",
    "delete",
    "updateGlobal",
    "restoreVersion",
    "restoreGlobalVersion",
    "duplicate",
    "login"
   ],
   "url": "https://payloadcms.com/docs/queries/depth"
  },
  {
   "option": "where",
   "appliesTo": [
    "find",
    "count",
    "findDistinct",
    "update (bulk)",
    "delete (bulk)",
    "findVersions",
    "findGlobalVersions",
    "jobs.cancel",
    "jobs.run"
   ],
   "url": "https://payloadcms.com/docs/queries/overview"
  },
  {
   "option": "select",
   "appliesTo": [
    "find",
    "findByID",
    "findVersions",
    "findGlobal",
    "findGlobalVersions",
    "findGlobalVersionByID",
    "create",
    "update",
    "updateGlobal",
    "MCP tools"
   ],
   "url": "https://payloadcms.com/docs/queries/select"
  },
  {
   "option": "populate",
   "appliesTo": [
    "find",
    "findByID",
    "findGlobal",
    "create",
    "update",
    "updateGlobal"
   ],
   "url": "https://payloadcms.com/docs/queries/select"
  },
  {
   "option": "sort",
   "appliesTo": [
    "find",
    "findDistinct",
    "findVersions",
    "findGlobalVersions",
    "joins"
   ],
   "url": "https://payloadcms.com/docs/queries/sort"
  },
  {
   "option": "limit",
   "appliesTo": [
    "find",
    "findVersions",
    "findGlobalVersions",
    "joins",
    "jobs.run"
   ],
   "url": "https://payloadcms.com/docs/queries/pagination"
  },
  {
   "option": "page",
   "appliesTo": [
    "find",
    "findVersions",
    "findGlobalVersions",
    "joins"
   ],
   "url": "https://payloadcms.com/docs/queries/pagination"
  },
  {
   "option": "pagination",
   "appliesTo": [
    "find",
    "findVersions",
    "findGlobalVersions"
   ],
   "url": "https://payloadcms.com/docs/queries/pagination"
  },
  {
   "option": "locale",
   "appliesTo": [
    "find",
    "findByID",
    "count",
    "findVersions",
    "findVersionByID",
    "findGlobal",
    "findGlobalVersions",
    "findGlobalVersionByID",
    "create",
    "update",
    "delete",
    "updateGlobal",
    "restoreVersion",
    "restoreGlobalVersion",
    "duplicate",
    "count",
    "findDistinct",
    "login",
    "MCP tools"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "fallbackLocale",
   "appliesTo": [
    "find",
    "findByID",
    "count",
    "findVersions",
    "findVersionByID",
    "findGlobal",
    "findGlobalVersions",
    "findGlobalVersionByID",
    "create",
    "update",
    "delete",
    "updateGlobal",
    "restoreVersion",
    "restoreGlobalVersion",
    "duplicate",
    "login"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "draft",
   "appliesTo": [
    "find",
    "findByID",
    "findGlobal",
    "findVersionByID (gql)",
    "create",
    "update",
    "updateGlobal",
    "restoreVersion",
    "restoreGlobalVersion",
    "validate",
    "renameFile"
   ],
   "url": "https://payloadcms.com/docs/versions/drafts"
  },
  {
   "option": "autosave",
   "appliesTo": [
    "update"
   ],
   "url": "https://payloadcms.com/docs/versions/autosave"
  },
  {
   "option": "trash",
   "appliesTo": [
    "find",
    "findByID",
    "count",
    "update",
    "delete",
    "findVersions",
    "findVersionByID"
   ],
   "url": "https://payloadcms.com/docs/trash/overview"
  },
  {
   "option": "joins",
   "appliesTo": [
    "find",
    "findByID",
    "findGlobal"
   ],
   "url": "https://payloadcms.com/docs/fields/join"
  },
  {
   "option": "overrideAccess",
   "appliesTo": [
    "all Local operations",
    "MCP tool handlers (should pass false)"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "overrideLock",
   "appliesTo": [
    "update",
    "delete",
    "updateGlobal"
   ],
   "url": "https://payloadcms.com/docs/admin/locked-documents"
  },
  {
   "option": "showHiddenFields",
   "appliesTo": [
    "all Local read/write operations",
    "login"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "user",
   "appliesTo": [
    "all Local operations"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "req",
   "appliesTo": [
    "all Local operations"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "context",
   "appliesTo": [
    "all Local operations"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "disableErrors",
   "appliesTo": [
    "find",
    "findByID"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "disableTransaction",
   "appliesTo": [
    "all Local operations"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "data",
   "appliesTo": [
    "create",
    "update",
    "updateGlobal",
    "duplicate",
    "validate",
    "login",
    "forgotPassword",
    "resetPassword",
    "unlock"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "id",
   "appliesTo": [
    "findByID",
    "update",
    "delete",
    "duplicate",
    "findVersionByID",
    "restoreVersion",
    "findGlobalVersionByID",
    "restoreGlobalVersion",
    "validate",
    "renameFile",
    "docAccess"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "file / filePath / overwriteExistingFiles",
   "appliesTo": [
    "create",
    "update"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "duplicateFromID",
   "appliesTo": [
    "create"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "disableVerificationEmail",
   "appliesTo": [
    "create (auth collections)"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "field",
   "appliesTo": [
    "findDistinct"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "headers / canSetHeaders",
   "appliesTo": [
    "auth"
   ],
   "url": "https://payloadcms.com/docs/local-api/overview"
  },
  {
   "option": "allSessions",
   "appliesTo": [
    "logout"
   ],
   "url": "https://payloadcms.com/docs/authentication/operations"
  },
  {
   "option": "token",
   "appliesTo": [
    "verifyEmail",
    "resetPassword"
   ],
   "url": "https://payloadcms.com/docs/authentication/operations"
  }
 ],
 "hooks": {
  "root": [
   {
    "name": "afterError",
    "firesOn": [
     "any error"
    ],
    "url": "https://payloadcms.com/docs/hooks/overview"
   }
  ],
  "collection": [
   {
    "name": "beforeOperation",
    "firesOn": [
     "all operations"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "beforeValidate",
    "firesOn": [
     "create",
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "beforeChange",
    "firesOn": [
     "create",
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterChange",
    "firesOn": [
     "create",
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "beforeRead",
    "firesOn": [
     "find",
     "findByID"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterRead",
    "firesOn": [
     "find",
     "findByID"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "beforeDelete",
    "firesOn": [
     "delete"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterDelete",
    "firesOn": [
     "delete"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterOperation",
    "firesOn": [
     "all operations"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterError",
    "firesOn": [
     "any error"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "beforeLogin",
    "firesOn": [
     "login"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterLogin",
    "firesOn": [
     "login"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterLogout",
    "firesOn": [
     "logout"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterMe",
    "firesOn": [
     "me"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterRefresh",
    "firesOn": [
     "refresh"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "afterForgotPassword",
    "firesOn": [
     "forgotPassword"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "refresh",
    "firesOn": [
     "refresh"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   },
   {
    "name": "me",
    "firesOn": [
     "me"
    ],
    "url": "https://payloadcms.com/docs/hooks/collections"
   }
  ],
  "global": [
   {
    "name": "beforeOperation",
    "firesOn": [
     "countVersions",
     "read",
     "restoreVersion",
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/globals"
   },
   {
    "name": "beforeValidate",
    "firesOn": [
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/globals"
   },
   {
    "name": "beforeChange",
    "firesOn": [
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/globals"
   },
   {
    "name": "afterChange",
    "firesOn": [
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/globals"
   },
   {
    "name": "beforeRead",
    "firesOn": [
     "findOne"
    ],
    "url": "https://payloadcms.com/docs/hooks/globals"
   },
   {
    "name": "afterRead",
    "firesOn": [
     "findOne"
    ],
    "url": "https://payloadcms.com/docs/hooks/globals"
   }
  ],
  "field": [
   {
    "name": "beforeValidate",
    "firesOn": [
     "create",
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/fields"
   },
   {
    "name": "beforeChange",
    "firesOn": [
     "create",
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/fields"
   },
   {
    "name": "afterChange",
    "firesOn": [
     "create",
     "update"
    ],
    "url": "https://payloadcms.com/docs/hooks/fields"
   },
   {
    "name": "afterRead",
    "firesOn": [
     "any read (find, findByID, findGlobal, and after writes)"
    ],
    "url": "https://payloadcms.com/docs/hooks/fields"
   },
   {
    "name": "beforeDuplicate",
    "firesOn": [
     "duplicate (once per locale)"
    ],
    "url": "https://payloadcms.com/docs/hooks/fields"
   }
  ]
 },
 "access": {
  "collection": [
   {
    "name": "create",
    "returns": "boolean",
    "url": "https://payloadcms.com/docs/access-control/collections"
   },
   {
    "name": "read",
    "returns": "boolean | Where",
    "url": "https://payloadcms.com/docs/access-control/collections"
   },
   {
    "name": "update",
    "returns": "boolean | Where",
    "url": "https://payloadcms.com/docs/access-control/collections"
   },
   {
    "name": "delete",
    "returns": "boolean | Where",
    "url": "https://payloadcms.com/docs/access-control/collections"
   },
   {
    "name": "admin",
    "returns": "boolean",
    "url": "https://payloadcms.com/docs/access-control/collections"
   },
   {
    "name": "unlock",
    "returns": "boolean",
    "url": "https://payloadcms.com/docs/access-control/collections"
   },
   {
    "name": "readVersions",
    "returns": "boolean | Where (applied to the versions collection)",
    "url": "https://payloadcms.com/docs/access-control/collections"
   }
  ],
  "global": [
   {
    "name": "read",
    "returns": "boolean | Where",
    "url": "https://payloadcms.com/docs/access-control/globals"
   },
   {
    "name": "update",
    "returns": "boolean | Where",
    "url": "https://payloadcms.com/docs/access-control/globals"
   },
   {
    "name": "readVersions",
    "returns": "boolean | Where (versions collection)",
    "url": "https://payloadcms.com/docs/access-control/globals"
   }
  ],
  "field": [
   {
    "name": "create",
    "returns": "boolean (false discards the value)",
    "url": "https://payloadcms.com/docs/access-control/fields"
   },
   {
    "name": "read",
    "returns": "boolean (false omits the property)",
    "url": "https://payloadcms.com/docs/access-control/fields"
   },
   {
    "name": "update",
    "returns": "boolean (false leaves the field unchanged)",
    "url": "https://payloadcms.com/docs/access-control/fields"
   }
  ],
  "jobs": [
   {
    "name": "queue",
    "returns": "boolean (default: authenticated user)",
    "url": "https://payloadcms.com/docs/jobs-queue/jobs"
   },
   {
    "name": "run",
    "returns": "boolean (default: authenticated user)",
    "url": "https://payloadcms.com/docs/jobs-queue/jobs"
   },
   {
    "name": "cancel",
    "returns": "boolean (default: authenticated user)",
    "url": "https://payloadcms.com/docs/jobs-queue/jobs"
   }
  ]
 },
 "versions": [
  {
   "option": "versions",
   "scope": "collection",
   "url": "https://payloadcms.com/docs/versions/overview"
  },
  {
   "option": "versions.max",
   "scope": "global",
   "url": "https://payloadcms.com/docs/versions/overview"
  },
  {
   "option": "versions.drafts",
   "scope": "collection | global",
   "url": "https://payloadcms.com/docs/versions/drafts"
  },
  {
   "option": "versions.drafts.autosave",
   "scope": null,
   "url": "https://payloadcms.com/docs/versions/autosave"
  },
  {
   "option": "versions.drafts.schedulePublish",
   "scope": null,
   "url": "https://payloadcms.com/docs/versions/drafts"
  },
  {
   "option": "versions.drafts.validate",
   "scope": null,
   "url": "https://payloadcms.com/docs/versions/drafts"
  },
  {
   "option": "versions.drafts.localizeStatus",
   "scope": null,
   "url": "https://payloadcms.com/docs/versions/drafts"
  }
 ],
 "realtime": [
  {
   "name": "livePreview (client)",
   "mechanism": "iframe + window.postMessage from the Admin Panel on every document change; front end subscribes (@payloadcms/live-preview subscribe/unsubscribe/ready/isLivePreviewEvent; useLivePreview({ serverURL, initialData, depth, apiRoute }) in React/Vue)",
   "transport": "postMessage",
   "url": "https://payloadcms.com/docs/live-preview/client"
  },
  {
   "name": "livePreview (server)",
   "mechanism": "Admin Panel posts a document-level message on save/autosave/publish; RefreshRouteOnSave (@payloadcms/live-preview-react) filters with isDocumentEvent and calls router.refresh(); sends ready on mount",
   "transport": "postMessage then server roundtrip",
   "url": "https://payloadcms.com/docs/live-preview/server"
  },
  {
   "name": "autosave",
   "mechanism": "Admin Panel debounced update requests (interval ms, default 800) with autosave: true; one autosave version overwritten",
   "transport": "HTTP (REST update)",
   "url": "https://payloadcms.com/docs/versions/autosave"
  },
  {
   "name": "documentLocking",
   "mechanism": "lock taken when a user opens the edit view, expires after lockDocuments.duration seconds of inactivity (default 300); second user may read-only, take over (notifies the first), or leave; update/delete with overrideLock: false fail while locked; stored in the internal payload-locked-documents collection (not documented on the page; inferred)",
   "transport": "HTTP (admin requests)",
   "url": "https://payloadcms.com/docs/admin/locked-documents"
  },
  {
   "name": "jobsQueue",
   "mechanism": "pull model: jobs are documents in the payload-jobs collection; runners query the queue on a cron (autoRun or bin jobs:run --cron) or when GET /api/payload-jobs/run is called by an external scheduler (Vercel cron with CRON_SECRET); schedules queued by handle-schedules; no push/socket",
   "transport": "database polling on schedule",
   "url": "https://payloadcms.com/docs/jobs-queue/overview"
  },
  {
   "name": "schedulePublish",
   "mechanism": "drafts.schedulePublish creates jobs in the jobs queue to flip _status at a date; needs a runner",
   "transport": "jobs queue",
   "url": "https://payloadcms.com/docs/versions/drafts"
  },
  {
   "name": "mcpPluginStream",
   "mechanism": "Streamable HTTP transport at POST /api/mcp (JSON-RPC 2.0; clients send Accept: application/json, text/event-stream); GET /api/mcp returns 405 Allow: POST — the optional server-to-client SSE stream is not offered",
   "transport": "Streamable HTTP (POST responses may be event-stream); no standalone SSE GET stream",
   "url": "https://payloadcms.com/docs/plugins/mcp"
  },
  {
   "name": "graphqlSubscriptions",
   "mechanism": "none documented",
   "transport": "none",
   "url": "https://payloadcms.com/docs/graphql/overview"
  }
 ],
 "mcp": {
  "package": "@payloadcms/plugin-mcp",
  "path": "/api/mcp",
  "transport": "Streamable HTTP",
  "auth": "Authorization: {users} API-Key <key> (docs mdx on main) | Authorization: Bearer <key> (published docs page)",
  "tools": [
   {
    "name": "getConfigInfo",
    "scope": "root",
    "configKey": null,
    "does": "returns configuration info"
   },
   {
    "name": "getCollectionSchema",
    "scope": "collection",
    "configKey": null,
    "does": "returns the collection schema"
   },
   {
    "name": "findDocuments",
    "scope": "collection",
    "configKey": "find",
    "does": "find (accepts select; locale/fallbackLocale when localized)"
   },
   {
    "name": "countDocuments",
    "scope": "collection",
    "configKey": "count",
    "does": "count"
   },
   {
    "name": "findDistinct",
    "scope": "collection",
    "configKey": "findDistinct",
    "does": "distinct field values"
   },
   {
    "name": "createDocuments",
    "scope": "collection",
    "configKey": "create",
    "does": "create (virtual fields excluded from input schema)"
   },
   {
    "name": "updateDocument",
    "scope": "collection",
    "configKey": "update",
    "does": "update"
   },
   {
    "name": "deleteDocuments",
    "scope": "collection",
    "configKey": "delete",
    "does": "delete"
   },
   {
    "name": "duplicateDocument",
    "scope": "collection",
    "configKey": "duplicate",
    "does": "duplicate (requiresDuplicateEnabled)"
   },
   {
    "name": "findVersions",
    "scope": "collection",
    "configKey": "findVersions",
    "does": "list versions (requiresVersions)"
   },
   {
    "name": "findVersionByID",
    "scope": "collection",
    "configKey": "findVersionByID",
    "does": "one version (requiresVersions)"
   },
   {
    "name": "restoreVersion",
    "scope": "collection",
    "configKey": "restoreVersion",
    "does": "restore (requiresVersions)"
   },
   {
    "name": "countVersions",
    "scope": "collection",
    "configKey": "countVersions",
    "does": "count versions (requiresVersions)"
   },
   {
    "name": "getUploadInstructions",
    "scope": "collection",
    "configKey": "getUploadInstructions",
    "does": "how to upload (requiresUpload)"
   },
   {
    "name": "auth",
    "scope": "auth collection (opt-in)",
    "configKey": null,
    "does": "auth"
   },
   {
    "name": "login",
    "scope": "auth collection (opt-in)",
    "configKey": null,
    "does": "login"
   },
   {
    "name": "forgotPassword",
    "scope": "auth collection (opt-in)",
    "configKey": null,
    "does": "start password reset"
   },
   {
    "name": "resetPassword",
    "scope": "auth collection (opt-in)",
    "configKey": null,
    "does": "reset password"
   },
   {
    "name": "unlock",
    "scope": "auth collection (opt-in)",
    "configKey": null,
    "does": "unlock account"
   },
   {
    "name": "verify",
    "scope": "auth collection (opt-in)",
    "configKey": null,
    "does": "verify account"
   },
   {
    "name": "getGlobalSchema",
    "scope": "global",
    "configKey": null,
    "does": "returns the global schema"
   },
   {
    "name": "findGlobal",
    "scope": "global",
    "configKey": "find",
    "does": "read global"
   },
   {
    "name": "updateGlobal",
    "scope": "global",
    "configKey": "update",
    "does": "update global"
   },
   {
    "name": "findGlobalVersions",
    "scope": "global",
    "configKey": null,
    "does": "list versions (requiresVersions)"
   },
   {
    "name": "findGlobalVersionByID",
    "scope": "global",
    "configKey": null,
    "does": "one version (requiresVersions)"
   },
   {
    "name": "restoreGlobalVersion",
    "scope": "global",
    "configKey": null,
    "does": "restore (requiresVersions)"
   },
   {
    "name": "countGlobalVersions",
    "scope": "global",
    "configKey": null,
    "does": "count versions (requiresVersions)"
   }
  ],
  "url": "https://payloadcms.com/docs/plugins/mcp"
 },
 "standards": [
  {
   "id": "json-schema-2020-12",
   "standard": "JSON Schema 2020-12",
   "canonical": "https://json-schema.org/draft/2020-12/schema",
   "describes": "generate:types output: configToJSONSchema emits $schema draft 2020-12 with $defs per collection/global (<slug>, <slug>_input, <slug>_select, <slug>_widget), supportedTimezones, auth, Config { auth, blocks, collections, collectionsJoins, collectionsSelect, collectionsInput?, db, fallbackLocale, globals, globalsSelect, globalsInput?, locale, user, widgets, jobs, strictDraftTypes? }; field typescriptSchema and json.jsonSchema overrides; MCP tool inputSchema"
  },
  {
   "id": "openapi-3-1",
   "standard": "OpenAPI 3.1",
   "canonical": "https://spec.openapis.org/oas/v3.1.0",
   "describes": "the REST surface (operations[].rest: method+path templates with {collection}/{id}/{global}/{users}/{key} path params, query params depth/where/select/populate/sort/limit/page/pagination/locale/fallback-locale/draft/trash/joins); OpenAPI 3.1 schemas are JSON Schema 2020-12 so the generated $defs slot in directly; Payload ships no OpenAPI document itself"
  },
  {
   "id": "graphql-october-2021-spec",
   "standard": "GraphQL (October 2021 spec)",
   "canonical": "https://spec.graphql.org/October2021/",
   "describes": "/api/graphql: queries {Singular}, {Plural}, count{Plural}, docAccess{Singular}, version{Singular}, versions{Plural}, me{Singular}, initialized{Singular}, {Global}, docAccess{Global}, version{Global}, versions{Global}, Access, Preference; mutations create/update/validate/delete/duplicate/restoreVersion/renameFile/login/logout/refreshToken/unlock/forgotPassword/resetPassword/verifyEmail{Singular}, update/validate/restoreVersion{Global}, updatePreference, deletePreference; scalars from graphql-scalars (DateTime, EmailAddress, JSON)"
  },
  {
   "id": "json-ld-1-1-schema-org",
   "standard": "JSON-LD 1.1 / schema.org",
   "canonical": "https://www.w3.org/TR/json-ld11/",
   "describes": "not used by Payload itself; a mapping layer may express a document as a JSON-LD node (collection -> @type, id -> @id, relationship -> @id reference, date -> xsd:dateTime, point -> GeoCoordinates { longitude, latitude })"
  },
  {
   "id": "mcp-2025-06-18",
   "standard": "MCP 2025-06-18",
   "canonical": "https://modelcontextprotocol.io/specification/2025-06-18",
   "describes": "@payloadcms/plugin-mcp: Streamable HTTP transport at POST /api/mcp, JSON-RPC 2.0 tools/list, tools/call, prompts, resources (uri | ResourceTemplate, mimeType); the plugin exposes no server-initiated GET stream"
  },
  {
   "id": "rfc-9562-uuid",
   "standard": "RFC 9562 UUID",
   "canonical": "https://www.rfc-editor.org/rfc/rfc9562",
   "describes": "Payload ids are db-adapter defaults (Mongo ObjectID string, Postgres serial number) or uuid when the adapter is configured idType: \"uuid\"; the JSON Schema id type is string | number; array/block row ids are generated strings"
  },
  {
   "id": "http-semantics-rfc-9110",
   "standard": "HTTP semantics RFC 9110",
   "canonical": "https://www.rfc-editor.org/rfc/rfc9110",
   "describes": "REST methods GET (find, findByID, count, versions, me, init, access, preference, jobs run), POST (create, globals update, auth ops, duplicate, validate, restore, preference, rename, mcp), PATCH (update by id and bulk), DELETE (delete by id and bulk, preference), OPTIONS/PUT accepted by the catch-all; custom endpoints get|head|post|put|delete|connect|options; X-Payload-HTTP-Method-Override: GET on POST for long queries"
  },
  {
   "id": "rfc-7807-rfc-9457-problem-details",
   "standard": "RFC 7807 / RFC 9457 problem details",
   "canonical": "https://www.rfc-editor.org/rfc/rfc9457",
   "describes": "not used; Payload errors are { errors: [{ message, name?, data? }] } with HTTP status from APIError (afterError may reshape); GraphQL errors follow the GraphQL errors array"
  },
  {
   "id": "w3c-activitystreams-2-0",
   "standard": "W3C ActivityStreams 2.0",
   "canonical": "https://www.w3.org/TR/activitystreams-core/",
   "describes": "not used by Payload; only relevant if a mapping layer renders collection documents as AS2 objects (Create/Update/Delete activities map to the afterChange/afterDelete hooks)"
  },
  {
   "id": "iso-8601-rfc-3339-date-time",
   "standard": "ISO 8601 / RFC 3339 date-time",
   "canonical": "https://www.rfc-editor.org/rfc/rfc3339",
   "describes": "date field stored as YYYY-MM-DDTHH:mm:ss.SSSZ (UTC); createdAt/updatedAt/deletedAt/lockUntil"
  },
  {
   "id": "geojson-rfc-7946",
   "standard": "GeoJSON RFC 7946",
   "canonical": "https://www.rfc-editor.org/rfc/rfc7946",
   "describes": "point field stored as a GeoJSON Point ([longitude, latitude] in the API); within/intersects take GeoJSON polygons"
  },
  {
   "id": "json-web-token-rfc-7519",
   "standard": "JSON Web Token RFC 7519",
   "canonical": "https://www.rfc-editor.org/rfc/rfc7519",
   "describes": "auth tokens from login/refresh/me (tokenExpiration, saveToJWT fields, HTTP-only cookie, useSessions), API keys via Authorization: {slug} API-Key"
  },
  {
   "id": "json-rpc-2-0",
   "standard": "JSON-RPC 2.0",
   "canonical": "https://www.jsonrpc.org/specification",
   "describes": "message envelope of the MCP endpoint"
  }
 ],
 "sources": [
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/payload/src/fields/config/types.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/payload/src/utilities/configToJSONSchema.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/graphql/src/schema/fieldToSchemaMap.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/payload/src/types/constants.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/graphql/src/schema/initCollections.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/payload/src/collections/endpoints/index.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/payload/src/index.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/graphql/src/schema/buildPoliciesType.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/graphql/src/schema/initGlobals.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/payload/src/globals/endpoints/index.ts",
  "https://raw.githubusercontent.com/payloadcms/payload/main/packages/payload/src/auth/endpoints/index.ts"
 ]
} as const
