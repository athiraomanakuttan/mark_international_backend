import mongoose from "mongoose"

export interface FollowupDto {
  name: string
  phoneNumber: string
  createdDate: string | Date
  status: number
  assignedAgentName: string
  leadId: string

}
