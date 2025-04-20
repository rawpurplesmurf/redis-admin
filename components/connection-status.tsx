interface ConnectionStatusProps {
  isConnected: boolean
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
      <span className="text-sm">{isConnected ? "Connected to Redis" : "Not connected"}</span>
    </div>
  )
}
