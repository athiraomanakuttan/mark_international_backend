import mongoose from "mongoose"

export interface FollowupDto {
  id:mongoose.Types.ObjectId,
  name: string
  phoneNumber: string
  createdDate: string | Date
  status: number
  assignedAgentName: string
  leadId: string

}
