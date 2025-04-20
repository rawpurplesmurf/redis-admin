"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, RefreshCw, Edit, Trash2, Plus } from "lucide-react"
import { getKeys, getValue, setValue, deleteKey } from "@/lib/redis-actions"
import type { RedisConnectionConfig } from "@/lib/types"

interface KeyValueBrowserProps {
  connectionConfig: RedisConnectionConfig
}

export function KeyValueBrowser({ connectionConfig }: KeyValueBrowserProps) {
  const [keys, setKeys] = useState<string[]>([])
  const [filteredKeys, setFilteredKeys] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState<string>("")
  const [isValueLoading, setIsValueLoading] = useState(false)
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")
  const [error, setError] = useState("")

  const loadKeys = async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await getKeys(connectionConfig)
      if (result.success && result.keys) {
        setKeys(result.keys)
        setFilteredKeys(result.keys)
      } else {
        setError(result.error || "Failed to load keys")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadKeys()
  }, [connectionConfig])

  useEffect(() => {
    if (searchTerm) {
      setFilteredKeys(keys.filter((key) => key.toLowerCase().includes(searchTerm.toLowerCase())))
    } else {
      setFilteredKeys(keys)
    }
  }, [searchTerm, keys])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleKeySelect = async (key: string) => {
    setSelectedKey(key)
    setIsValueLoading(true)
    try {
      const result = await getValue(connectionConfig, key)
      if (result.success && result.value !== undefined) {
        setSelectedValue(result.value)
      } else {
        setError(result.error || "Failed to get value")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsValueLoading(false)
    }
  }

  const handleSaveValue = async () => {
    if (!selectedKey) return

    try {
      const result = await setValue(connectionConfig, selectedKey, selectedValue)
      if (!result.success) {
        setError(result.error || "Failed to save value")
      }
      setSelectedKey(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  const handleDeleteKey = async (key: string) => {
    try {
      const result = await deleteKey(connectionConfig, key)
      if (result.success) {
        await loadKeys()
      } else {
        setError(result.error || "Failed to delete key")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  const handleAddKey = async () => {
    if (!newKey || !newValue) return

    try {
      const result = await setValue(connectionConfig, newKey, newValue)
      if (result.success) {
        setNewKey("")
        setNewValue("")
        await loadKeys()
      } else {
        setError(result.error || "Failed to add key")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search keys..." className="pl-8" value={searchTerm} onChange={handleSearch} />
          </div>
          <Button variant="outline" size="icon" onClick={loadKeys} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Key-Value Pair</DialogTitle>
                <DialogDescription>Enter a key and value to add to your Redis database.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-key">Key</Label>
                  <Input id="new-key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-value">Value</Label>
                  <Textarea id="new-value" value={newValue} onChange={(e) => setNewValue(e.target.value)} rows={5} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddKey}>Add Key</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="border rounded-md">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? "No keys matching your search" : "No keys found in database"}
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeys.map((key) => (
                    <TableRow key={key}>
                      <TableCell className="font-mono">{key}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleKeySelect(key)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Key</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the key "{key}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteKey(key)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>

        <Dialog open={!!selectedKey} onOpenChange={(open) => !open && setSelectedKey(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Value</DialogTitle>
              <DialogDescription>
                Editing value for key: <span className="font-mono">{selectedKey}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {isValueLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <Textarea
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  rows={10}
                  className="font-mono"
                />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedKey(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveValue}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
