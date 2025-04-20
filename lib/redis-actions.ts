"use server"

import { createClient } from "redis"
import type { RedisConnectionConfig } from "./types"

export async function testConnection(config: RedisConnectionConfig) {
  try {
    const client = createRedisClient(config)
    await client.connect()
    await client.ping()
    await client.disconnect()
    return { success: true }
  } catch (error) {
    console.error("Redis connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to Redis",
    }
  }
}

export async function getKeys(config: RedisConnectionConfig) {
  try {
    const client = createRedisClient(config)
    await client.connect()
    const keys = await client.keys("*")
    await client.disconnect()
    return { success: true, keys }
  } catch (error) {
    console.error("Failed to get Redis keys:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get Redis keys",
    }
  }
}

export async function getValue(config: RedisConnectionConfig, key: string) {
  try {
    const client = createRedisClient(config)
    await client.connect()
    const value = await client.get(key)
    await client.disconnect()
    return { success: true, value: value || "" }
  } catch (error) {
    console.error(`Failed to get value for key ${key}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to get value for key ${key}`,
    }
  }
}

export async function setValue(config: RedisConnectionConfig, key: string, value: string) {
  try {
    const client = createRedisClient(config)
    await client.connect()
    await client.set(key, value)
    await client.disconnect()
    return { success: true }
  } catch (error) {
    console.error(`Failed to set value for key ${key}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to set value for key ${key}`,
    }
  }
}

export async function deleteKey(config: RedisConnectionConfig, key: string) {
  try {
    const client = createRedisClient(config)
    await client.connect()
    await client.del(key)
    await client.disconnect()
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete key ${key}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to delete key ${key}`,
    }
  }
}

function createRedisClient(config: RedisConnectionConfig) {
  const url = config.useTLS
    ? `rediss://${config.username ? `${config.username}:${config.password}@` : ""}${config.host}:${config.port}`
    : `redis://${config.username ? `${config.username}:${config.password}@` : ""}${config.host}:${config.port}`

  return createClient({
    url,
    socket: {
      tls: config.useTLS,
    },
  })
}
