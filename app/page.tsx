import RedisManager from "@/components/redis-manager"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Redis Database Manager</h1>
      <RedisManager />
    </main>
  )
}
