"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, CheckCircle } from "lucide-react"
import { useTimeEntries } from "@/hooks/use-time-entries"

export function TimeEntriesTable() {
  const { timeEntries, loading, updateTimeEntry, deleteTimeEntry } = useTimeEntries()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Submitted":
        return "bg-blue-100 text-blue-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleApprove = async (id: number) => {
    await updateTimeEntry(id, { status: "Approved" })
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this time entry?")) {
      await deleteTimeEntry(id)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium">{entry.workerName}</div>
                    <div className="text-sm text-gray-500">{entry.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{entry.jobTitle}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(entry.date).toLocaleDateString()}</div>
                    <div className="text-gray-500">
                      {entry.startTime} - {entry.endTime}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{entry.hours}h</span>
                </TableCell>
                <TableCell>
                  <span>${entry.hourlyRate}/hr</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">${entry.totalAmount.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {entry.status !== "Approved" && (
                        <DropdownMenuItem onClick={() => handleApprove(entry.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
