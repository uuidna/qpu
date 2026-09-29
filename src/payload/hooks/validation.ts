/**
 * Payload Hooks - Validation and Processing
 * Uses field references for type-safe validation across collections
 */

import {
  fieldReferences,
  fieldEnums,
  fieldPaths,
  getFieldReference,
  validateFieldEnum,
  getFieldPath,
} from './field-references.js'

// Before validation hook
export const beforeValidateHook = async (args: any) => {
  const { data, collection } = args
  const ref = fieldReferences[collection as keyof typeof fieldReferences]

  if (!ref) return data

  // Validate required fields
  Object.entries(ref).forEach(([fieldName, fieldConfig]: [string, any]) => {
    if (fieldConfig.required && !data[fieldName]) {
      throw new Error(`Field "${fieldName}" is required in ${collection}`)
    }
  })

  // Validate enum fields
  const result = { ...data }
  Object.entries(ref).forEach(([fieldName, fieldConfig]: [string, any]) => {
    if (fieldConfig.type === 'select' && data[fieldName]) {
      const enumKey = `${fieldName}` as keyof typeof fieldEnums
      if (!validateFieldEnum(enumKey, data[fieldName])) {
        throw new Error(
          `Invalid value "${data[fieldName]}" for field "${fieldName}" in ${collection}`,
        )
      }
    }
  })

  return result
}

// Before change hook - audit changes
export const beforeChangeHook = async (args: any) => {
  const { data, collection, req } = args

  // Log changes
  console.log(`📝 Change hook triggered for ${collection}`, {
    user: req?.user?.id,
    timestamp: new Date().toISOString(),
    fields: Object.keys(data).length,
  })

  return data
}

// After read hook - format output
export const afterReadHook = async (args: any) => {
  const { doc, collection } = args
  const paths = fieldPaths[collection as keyof typeof fieldPaths]

  if (!paths) return doc

  // Add field paths for client-side reference
  return {
    ...doc,
    _fieldPaths: paths,
  }
}

// Scoped field access hook
export const scopedFieldAccessHook = async (args: any) => {
  const { data, collection, req } = args
  const ref = fieldReferences[collection as keyof typeof fieldReferences]

  if (!ref) return data

  // Check user role and scope fields
  const userRole = req?.user?.role || 'user'
  const scopedData = { ...data }

  // Example: restrict sensitive fields based on role
  const restrictedFields: Record<string, string[]> = {
    users: ['password'], // never expose in reads
    auditLogs: ['ipAddress'], // restrict to admins only
    supportTickets: ['resolvedAt', 'slaMet'], // restrict to admins/support
  }

  const restricted = restrictedFields[collection as keyof typeof restrictedFields] || []
  restricted.forEach((field) => {
    if (userRole !== 'admin') {
      delete scopedData[field]
    }
  })

  return scopedData
}

// Data normalization hook
export const normalizeDataHook = async (args: any) => {
  const { data, collection } = args
  const ref = fieldReferences[collection as keyof typeof fieldReferences]

  if (!ref) return data

  const normalized = { ...data }

  // Normalize based on field type
  Object.entries(ref).forEach(([fieldName, fieldConfig]: [string, any]) => {
    const value = normalized[fieldName]

    if (value === undefined || value === null) return

    // Normalize text fields - trim whitespace
    if (fieldConfig.type === 'text' || fieldConfig.type === 'textarea') {
      normalized[fieldName] = value.trim()
    }

    // Normalize numbers
    if (fieldConfig.type === 'number') {
      normalized[fieldName] = Number(value)
    }

    // Normalize dates
    if (fieldConfig.type === 'date') {
      normalized[fieldName] = new Date(value).toISOString()
    }

    // Normalize selects - ensure valid enum
    if (fieldConfig.type === 'select') {
      normalized[fieldName] = String(value).toLowerCase()
    }

    // Normalize booleans
    if (fieldConfig.type === 'checkbox') {
      normalized[fieldName] = Boolean(value)
    }
  })

  return normalized
}

// Generate audit trail on change
export const auditTrailHook = async (args: any) => {
  const { data, collection, originalDoc, req } = args

  if (!originalDoc) return data // skip on create

  // Find changed fields
  const changes: Record<string, any> = {}
  Object.keys(data).forEach((key) => {
    if (JSON.stringify(data[key]) !== JSON.stringify(originalDoc[key])) {
      changes[key] = {
        before: originalDoc[key],
        after: data[key],
      }
    }
  })

  if (Object.keys(changes).length > 0) {
    console.log(`🔄 Audit trail for ${collection}:`, {
      id: data.id || originalDoc.id,
      user: req?.user?.id || 'system',
      timestamp: new Date().toISOString(),
      changes,
    })
  }

  return data
}

// Composite hook that runs all validations
export const compositeHook = async (args: any) => {
  let data = args.data

  // Run in sequence
  data = await beforeValidateHook({ ...args, data })
  data = await normalizeDataHook({ ...args, data })
  data = await scopedFieldAccessHook({ ...args, data })

  return data
}
