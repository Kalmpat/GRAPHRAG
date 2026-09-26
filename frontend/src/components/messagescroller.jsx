"use client"

import React, { useState } from "react"
import {
  ArrowUpIcon,
  MessageCircleDashedIcon,
  RotateCwIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function MessageScrollerDemo() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMsg = { id: Date.now(), role: "user", text: input }
    setMessages((prev) => [...prev, newMsg])
    setInput("")

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: "Ez egy minta válasz a UI-hoz! Valami nagyon durva hosszú szöveggel hogy nézzük mit tudunk produkálni igazából" },
      ])
    }, 500)
  }

  return (
    <MessageScrollerProvider>
      <div className="relative flex flex-col gap-4">
        <Card className="h-[calc(100vh-12rem)] w-full gap-0 flex flex-col">
          {/* h-16 fix magasság és py-0 a jobb oldallal való szinkronizációhoz */}
          <CardHeader className="h-16 border-b px-4 py-0 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Chat & Context
            </CardTitle>
            <CardAction>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Reset conversation"
                    onClick={() => setMessages([])}
                  >
                    <RotateCwIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0">
            {messages.length === 0 ? (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageCircleDashedIcon />
                  </EmptyMedia>
                  <EmptyTitle>Morning, shadcn!</EmptyTitle>
                  <EmptyDescription>
                    What are we working on today? Press send to start a new
                    conversation
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent className="p-4 flex flex-col gap-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-xl text-sm max-w-[80%] ${message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto rounded-tr-none"
                            : "bg-muted text-foreground rounded-tl-none"
                          }`}
                      >
                        {message.text}
                      </div>
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-2 p-3 border-t">
            <form onSubmit={handleSend} className="w-full">
              <InputGroup>
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-transparent outline-none"
                />
                <InputGroupAddon align="block-end" className="pt-1">
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    className="ml-auto"
                    disabled={!input.trim()}
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </CardFooter>
        </Card>
      </div>
    </MessageScrollerProvider>
  )
}