"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Share, Edit, Trash2, MoreHorizontal, Upload, Folder } from "lucide-react"

export function DocumentsGrid() {
  const documents = []

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText
      case "doc":
        return FileText
      case "folder":
        return Folder
      default:
        return FileText
    }
  }

  const getFileColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "text-red-600"
      case "doc":
        return "text-blue-600"
      case "folder":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          All Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents</h3>
            <p className="text-muted-foreground mb-4">Upload your first document to get started</p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map((document: any) => {
              const Icon = getFileIcon(document.type)
              const iconColor = getFileColor(document.type)
              return (
                <Card key={document.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gray-50`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1 truncate">{document.name}</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{document.size}</span>
                        <span>{document.modifiedAt}</span>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {document.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
