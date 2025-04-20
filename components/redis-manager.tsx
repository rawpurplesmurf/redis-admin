"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { testConnection } from "@/lib/redis-actions"
import { KeyValueBrowser } from "@/components/key-value-browser"
import { ConnectionStatus } from "@/components/connection-status"

export default function RedisManager() {
  const [connectionConfig, setConnectionConfig] = useState({
    host: "",
    port: "6379",
    username: "",
    password: "",
    useTLS: true,
  })
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load saved connection from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("redisConnectionConfig")
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        setConnectionConfig(config)
      } catch (e) {
        console.error("Failed to parse saved connection config", e)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setConnectionConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleConnect = async () => {
    setIsLoading(true)
    setConnectionError("")

    try {
      const result = await testConnection(connectionConfig)
      if (result.success) {
        setIsConnected(true)
        // Save connection config to localStorage
        localStorage.setItem("redisConnectionConfig", JSON.stringify(connectionConfig))
      } else {
        setConnectionError(result.error || "Failed to connect to Redis")
        setIsConnected(false)
      }
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : "An unknown error occurred")
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Redis Connection</CardTitle>
          <CardDescription>Configure your Redis connection details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  name="host"
                  placeholder="localhost or redis.example.com"
                  value={connectionConfig.host}
                  onChange={handleInputChange}
                  disabled={isConnected}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  name="port"
                  placeholder="6379"
                  value={connectionConfig.port}
                  onChange={handleInputChange}
                  disabled={isConnected}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username (optional)</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="default"
                  value={connectionConfig.username}
                  onChange={handleInputChange}
                  disabled={isConnected}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password (optional)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={connectionConfig.password}
                  onChange={handleInputChange}
                  disabled={isConnected}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useTLS"
                name="useTLS"
                checked={connectionConfig.useTLS}
                onCheckedChange={(checked) =>
                  setConnectionConfig((prev) => ({
                    ...prev,
                    useTLS: checked === true,
                  }))
                }
                disabled={isConnected}
              />
              <Label htmlFor="useTLS">Use TLS/SSL</Label>
            </div>

            {connectionError && <div className="text-red-500 text-sm mt-2">{connectionError}</div>}

            <div className="flex justify-between items-center mt-4">
              <ConnectionStatus isConnected={isConnected} />

              {!isConnected ? (
                <Button onClick={handleConnect} disabled={isLoading}>
                  {isLoading ? "Connecting..." : "Connect"}
                </Button>
              ) : (
                <Button onClick={handleDisconnect} variant="outline">
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <Tabs defaultValue="browser">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browser">Key-Value Browser</TabsTrigger>
            <TabsTrigger value="console">Redis Console</TabsTrigger>
          </TabsList>
          <TabsContent value="browser">
            <KeyValueBrowser connectionConfig={connectionConfig} />
          </TabsContent>
          <TabsContent value="console">
            <Card>
              <CardHeader>
                <CardTitle>Redis Console</CardTitle>
                <CardDescription>Execute Redis commands directly</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
