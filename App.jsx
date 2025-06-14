import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Copy, Download, Plus, Trash2, BookOpen } from 'lucide-react'
import { formatCitation } from './lib/citationFormatter.js'
import './App.css'

function App() {
  const [references, setReferences] = useState([{
    id: 1,
    type: '',
    authors: [''],
    title: '',
    year: '',
    publisher: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    url: '',
    doi: '',
    accessDate: ''
  }])
  
  const [selectedFormat, setSelectedFormat] = useState('')
  const [formattedOutput, setFormattedOutput] = useState('')

  const referenceTypes = [
    { value: 'book', label: 'Book' },
    { value: 'journal', label: 'Journal Article' },
    { value: 'website', label: 'Website' },
    { value: 'conference', label: 'Conference Paper' },
    { value: 'thesis', label: 'Thesis/Dissertation' },
    { value: 'report', label: 'Technical Report' }
  ]

  const citationFormats = [
    { value: 'ieee', label: 'IEEE' },
    { value: 'apa', label: 'APA 7th Edition' },
    { value: 'mla', label: 'MLA 9th Edition' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'harvard', label: 'Harvard' }
  ]

  const addReference = () => {
    const newRef = {
      id: Date.now(),
      type: '',
      authors: [''],
      title: '',
      year: '',
      publisher: '',
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      url: '',
      doi: '',
      accessDate: ''
    }
    setReferences([...references, newRef])
  }

  const removeReference = (id) => {
    if (references.length > 1) {
      setReferences(references.filter(ref => ref.id !== id))
    }
  }

  const updateReference = (id, field, value) => {
    setReferences(references.map(ref => 
      ref.id === id ? { ...ref, [field]: value } : ref
    ))
  }

  const addAuthor = (refId) => {
    setReferences(references.map(ref => 
      ref.id === refId ? { ...ref, authors: [...ref.authors, ''] } : ref
    ))
  }

  const updateAuthor = (refId, authorIndex, value) => {
    setReferences(references.map(ref => 
      ref.id === refId ? {
        ...ref,
        authors: ref.authors.map((author, index) => 
          index === authorIndex ? value : author
        )
      } : ref
    ))
  }

  const removeAuthor = (refId, authorIndex) => {
    setReferences(references.map(ref => 
      ref.id === refId ? {
        ...ref,
        authors: ref.authors.filter((_, index) => index !== authorIndex)
      } : ref
    ))
  }

  const formatReferences = () => {
    if (!selectedFormat) return

    let formatted = ''
    
    references.forEach((ref, index) => {
      if (!ref.type || !ref.title) return
      
      const citation = formatCitation(ref, selectedFormat)
      
      if (citation) {
        if (selectedFormat === 'ieee') {
          formatted += `[${index + 1}] ${citation}\n\n`
        } else {
          formatted += `${citation}\n\n`
        }
      }
    })
    
    setFormattedOutput(formatted)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedOutput)
  }

  const downloadAsText = () => {
    const element = document.createElement('a')
    const file = new Blob([formattedOutput], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `references_${selectedFormat}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Reference Formatter</h1>
          </div>
          <p className="text-lg text-gray-600">Convert your references to any citation format</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add References</CardTitle>
                <CardDescription>Enter your reference information below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {references.map((ref, refIndex) => (
                  <div key={ref.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Reference {refIndex + 1}</h3>
                      {references.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeReference(ref.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`type-${ref.id}`}>Reference Type</Label>
                        <Select onValueChange={(value) => updateReference(ref.id, 'type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {referenceTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`year-${ref.id}`}>Year</Label>
                        <Input
                          id={`year-${ref.id}`}
                          type="number"
                          placeholder="2024"
                          value={ref.year}
                          onChange={(e) => updateReference(ref.id, 'year', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Authors</Label>
                      {ref.authors.map((author, authorIndex) => (
                        <div key={authorIndex} className="flex gap-2 mt-2">
                          <Input
                            placeholder="Author name"
                            value={author}
                            onChange={(e) => updateAuthor(ref.id, authorIndex, e.target.value)}
                          />
                          {ref.authors.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAuthor(ref.id, authorIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => addAuthor(ref.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Author
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor={`title-${ref.id}`}>Title</Label>
                      <Input
                        id={`title-${ref.id}`}
                        placeholder="Enter title"
                        value={ref.title}
                        onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                      />
                    </div>

                    {(ref.type === 'journal' || ref.type === 'conference') && (
                      <div>
                        <Label htmlFor={`journal-${ref.id}`}>Journal/Conference Name</Label>
                        <Input
                          id={`journal-${ref.id}`}
                          placeholder="Enter journal or conference name"
                          value={ref.journal}
                          onChange={(e) => updateReference(ref.id, 'journal', e.target.value)}
                        />
                      </div>
                    )}

                    {(ref.type === 'book' || ref.type === 'report') && (
                      <div>
                        <Label htmlFor={`publisher-${ref.id}`}>Publisher</Label>
                        <Input
                          id={`publisher-${ref.id}`}
                          placeholder="Enter publisher"
                          value={ref.publisher}
                          onChange={(e) => updateReference(ref.id, 'publisher', e.target.value)}
                        />
                      </div>
                    )}

                    {ref.type === 'website' && (
                      <div>
                        <Label htmlFor={`url-${ref.id}`}>URL</Label>
                        <Input
                          id={`url-${ref.id}`}
                          placeholder="https://example.com"
                          value={ref.url}
                          onChange={(e) => updateReference(ref.id, 'url', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <Button onClick={addReference} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Reference
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Citation Format</CardTitle>
                <CardDescription>Choose your preferred citation style</CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select citation format" />
                  </SelectTrigger>
                  <SelectContent>
                    {citationFormats.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={formatReferences} 
                  className="w-full mt-4"
                  disabled={!selectedFormat}
                >
                  Generate Citations
                </Button>
              </CardContent>
            </Card>

            {formattedOutput && (
              <Card>
                <CardHeader>
                  <CardTitle>Formatted References</CardTitle>
                  <CardDescription>Your references in {citationFormats.find(f => f.value === selectedFormat)?.label} format</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formattedOutput}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                  
                  <div className="flex gap-2 mt-4">
                    <Button onClick={copyToClipboard} variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadAsText} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          <Separator className="mb-6" />
          <p>Reference Formatter - Convert your citations to any academic format</p>
          <p className="text-sm mt-2">Supports IEEE, APA, MLA, Chicago, and Harvard citation styles</p>
        </footer>
      </div>
    </div>
  )
}

export default App

