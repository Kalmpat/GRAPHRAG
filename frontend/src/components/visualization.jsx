import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function KnowledgeGraphVisualization() {
  return (
    <Card className="h-[calc(100vh-12rem)] w-full gap-0 flex flex-col">
      {/* h-16 fix magasság és py-0 a tökéletes vonaligazításhoz */}
      <CardHeader className="h-16 border-b px-4 py-0 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">
          Knowledge Graph Visualization
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-4 flex items-center justify-center">
        <h1 className="text-xl text-muted-foreground">
          This will be the section of Visualization!
        </h1>
      </CardContent>
    </Card>
  )
}