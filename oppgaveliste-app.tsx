"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit3, Save, X, Plus } from "lucide-react"

interface Oppgave {
  id: number
  tekst: string
  fullført: boolean
}

export default function Component() {
  const [oppgaver, setOppgaver] = useState<Oppgave[]>([
    { id: 1, tekst: "Handle mat", fullført: false },
    { id: 2, tekst: "Rydde huset", fullført: true },
    { id: 3, tekst: "Møte med teamet", fullført: false },
  ])
  const [nyOppgave, setNyOppgave] = useState("")
  const [redigererId, setRedigererId] = useState<number | null>(null)
  const [redigerTekst, setRedigerTekst] = useState("")

  const leggTilOppgave = () => {
    if (nyOppgave.trim() !== "") {
      const nyId = Math.max(...oppgaver.map((o) => o.id), 0) + 1
      setOppgaver([...oppgaver, { id: nyId, tekst: nyOppgave, fullført: false }])
      setNyOppgave("")
    }
  }

  const slettOppgave = (id: number) => {
    setOppgaver(oppgaver.filter((oppgave) => oppgave.id !== id))
  }

  const startRediger = (oppgave: Oppgave) => {
    setRedigererId(oppgave.id)
    setRedigerTekst(oppgave.tekst)
  }

  const lagreEndring = () => {
    if (redigerTekst.trim() !== "") {
      setOppgaver(
        oppgaver.map((oppgave) => (oppgave.id === redigererId ? { ...oppgave, tekst: redigerTekst } : oppgave)),
      )
    }
    setRedigererId(null)
    setRedigerTekst("")
  }

  const avbrytRediger = () => {
    setRedigererId(null)
    setRedigerTekst("")
  }

  const toggleFullført = (id: number) => {
    setOppgaver(oppgaver.map((oppgave) => (oppgave.id === id ? { ...oppgave, fullført: !oppgave.fullført } : oppgave)))
  }

  const antallFullført = oppgaver.filter((o) => o.fullført).length
  const totaltAntall = oppgaver.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">📝 Min Oppgaveliste</h1>
          <p className="text-gray-600 text-center mt-2">Organiser og hold styr på dine daglige oppgaver</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Oppgaver</span>
              <Badge variant="secondary">
                {antallFullført} av {totaltAntall} fullført
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Legg til ny oppgave */}
            <div className="flex gap-2">
              <Input
                placeholder="Skriv inn en ny oppgave..."
                value={nyOppgave}
                onChange={(e) => setNyOppgave(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    leggTilOppgave()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={leggTilOppgave} className="px-4">
                <Plus className="w-4 h-4 mr-2" />
                Legg til
              </Button>
            </div>

            {/* Liste over oppgaver */}
            <div className="space-y-3">
              {oppgaver.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">Ingen oppgaver ennå!</p>
                  <p className="text-sm">Legg til din første oppgave ovenfor.</p>
                </div>
              ) : (
                oppgaver.map((oppgave) => (
                  <div
                    key={oppgave.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      oppgave.fullført
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={oppgave.fullført}
                      onChange={() => toggleFullført(oppgave.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />

                    {redigererId === oppgave.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={redigerTekst}
                          onChange={(e) => setRedigerTekst(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              lagreEndring()
                            } else if (e.key === "Escape") {
                              avbrytRediger()
                            }
                          }}
                          className="flex-1"
                          autoFocus
                        />
                        <Button size="sm" onClick={lagreEndring} variant="outline">
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={avbrytRediger} variant="outline">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className={`flex-1 ${oppgave.fullført ? "line-through text-gray-500" : "text-gray-900"}`}>
                          {oppgave.tekst}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startRediger(oppgave)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => slettOppgave(oppgave.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">Oppgaveliste-app bygget med React og shadcn/ui</p>
            <p className="text-xs mt-1">
              Tips: Trykk Enter for å legge til oppgaver raskt, eller Escape for å avbryte redigering
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
