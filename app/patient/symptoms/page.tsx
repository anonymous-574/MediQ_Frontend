"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/shared/navbar"
import { Button } from "@/components/shared/button"
import { useToast } from "@/components/shared/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { apiService } from "@/lib/api"
import { CheckCircle } from "lucide-react"
import type { SymptomReport } from "@/lib/types"

export default function SymptomsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [symptoms, setSymptoms] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SymptomReport | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!symptoms.trim()) {
      showToast("Please describe your symptoms", "error")
      return
    }

    try {
      setLoading(true)
      const response = await apiService.submitSymptoms(symptoms)
      setResult(response)
      showToast("Symptoms analyzed successfully", "success")
    } catch (error) {
      const errorMsg = apiService.handleError(error as any)
      showToast(errorMsg, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Symptom Analyzer</h1>
              <p className="text-muted-foreground">Describe your symptoms for AI-powered analysis</p>
            </div>

            {!result ? (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Symptoms</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Describe Your Symptoms</label>
                      <Textarea
                        placeholder="Please describe your symptoms in detail. Include when they started, severity, and any other relevant information..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" isLoading={loading} className="flex-1">
                        Analyze Symptoms
                      </Button>
                      <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <CardTitle>Analysis Results</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Urgency Level</h3>
                    <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {result.urgency}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Classification</h3>
                    <p className="text-muted-foreground">{result.classification}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Recommendations</h3>
                    <ul className="space-y-2">
                      {Array.isArray(result.recommendations) && result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border flex gap-3">
                    <Button onClick={() => router.push("/patient/appointments")} className="flex-1">
                      Book Appointment
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setResult(null)
                        setSymptoms("")
                      }}
                      className="flex-1"
                    >
                      Analyze Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
